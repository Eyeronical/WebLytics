const cheerio = require('cheerio');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { enhanceDescription } = require('./aiService');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TABLE = 'Nurdd';

async function analyzeAndStore(url) {
  try {
    const response = await axios.get(url, { 
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    });

    const $ = cheerio.load(response.data);

    const brand = extractBrandName($, url);
    const rawDesc = extractDescription($);
    const favicon = extractFavicon($, url);
    const keywords = extractKeywords($);
    const language = extractLanguage($);

    let aiDesc = await enhanceDescription(rawDesc, brand);

    if (aiDesc === rawDesc || !aiDesc || aiDesc.trim().length <= rawDesc.trim().length + 10) {
      aiDesc = `Experience ${brand} - your premier destination for ${rawDesc.toLowerCase()}. Discover innovative solutions and exceptional service tailored for modern users.`;
    }

    const { data, error } = await supabase
      .from(TABLE)
      .insert([{ 
        url, 
        brand_name: brand, 
        description: rawDesc,
        ai_description: aiDesc,
        favicon_url: favicon,
        keywords: keywords,
        language: language,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - website took too long to respond');
    }
    if (error.response?.status === 403) {
      throw new Error('Access forbidden - website blocked the request');
    }
    if (error.response?.status === 404) {
      throw new Error('Website not found');
    }
    if (error.response?.status >= 500) {
      throw new Error('Website server error');
    }
    throw error;
  }
}

function extractBrandName($, url) {
  try {
    const ogSiteName = $('meta[property="og:site_name"]').attr('content');
    if (ogSiteName && typeof ogSiteName === 'string' && ogSiteName.trim().length > 0) {
      return ogSiteName.trim();
    }

    const appName = $('meta[name="application-name"]').attr('content');
    if (appName && typeof appName === 'string' && appName.trim().length > 0) {
      return appName.trim();
    }

    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (ogTitle && typeof ogTitle === 'string' && ogTitle.trim().length > 0) {
      let cleanTitle = ogTitle.trim();
      const separators = [' - ', ' | ', ' :: ', ' • ', ' — ', ' – '];
      for (const sep of separators) {
        if (cleanTitle.includes(sep)) {
          cleanTitle = cleanTitle.split(sep)[0].trim();
          break;
        }
      }
      return cleanTitle.substring(0, 50);
    }

    const titleText = $('title').text() || '';
    if (titleText.trim().length > 0) {
      let cleanTitle = titleText.trim();
      
      if (url.includes('youtube.com')) {
        cleanTitle = cleanTitle.replace(' - YouTube', '').trim();
        if (cleanTitle.length > 0) {
          return cleanTitle.substring(0, 50);
        }
      }
      
      const separators = [' - ', ' | ', ' :: ', ' • ', ' — ', ' – ', ' on ', ' at '];
      for (const sep of separators) {
        if (cleanTitle.includes(sep)) {
          const parts = cleanTitle.split(sep);
          if (parts[0] && parts.trim().length > 0) {
            cleanTitle = parts[0].trim();
            break;
          }
        }
      }
      
      return cleanTitle.substring(0, 50);
    }

    const h1Text = $('h1').first().text() || '';
    if (h1Text.trim().length > 0) {
      return h1Text.trim().substring(0, 50);
    }

    try {
      const hostname = new URL(url).hostname.replace(/^www\./, '');
      const domainParts = hostname.split('.');
      let siteName = domainParts[0];
      
      siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
      
      const specialCases = {
        'youtube': 'YouTube',
        'facebook': 'Facebook', 
        'twitter': 'Twitter',
        'instagram': 'Instagram',
        'linkedin': 'LinkedIn',
        'reddit': 'Reddit',
        'github': 'GitHub'
      };
      
      return specialCases[siteName.toLowerCase()] || siteName;
    } catch {
      return 'Website';
    }
  } catch (error) {
    console.error('Error extracting brand name:', error);
    return 'Website';
  }
}

function extractDescription($) {
  try {
    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc && typeof metaDesc === 'string' && metaDesc.trim().length > 0) {
      return metaDesc.trim();
    }

    const ogDesc = $('meta[property="og:description"]').attr('content');
    if (ogDesc && typeof ogDesc === 'string' && ogDesc.trim().length > 0) {
      return ogDesc.trim();
    }

    const twitterDesc = $('meta[name="twitter:description"]').attr('content');
    if (twitterDesc && typeof twitterDesc === 'string' && twitterDesc.trim().length > 0) {
      return twitterDesc.trim();
    }

    const firstP = $('p').first().text();
    if (firstP && typeof firstP === 'string' && firstP.trim().length > 0) {
      return firstP.trim().substring(0, 200);
    }

    return 'No description available';
  } catch (error) {
    console.error('Error extracting description:', error);
    return 'No description available';
  }
}

function extractFavicon($, url) {
  try {
    const favicon = $('link[rel="icon"]').attr('href') ||
                    $('link[rel="shortcut icon"]').attr('href') ||
                    $('link[rel="apple-touch-icon"]').attr('href') ||
                    '/favicon.ico';
    
    return new URL(favicon, url).href;
  } catch {
    return null;
  }
}

function extractKeywords($) {
  try {
    const keywords = $('meta[name="keywords"]').attr('content');
    if (keywords) {
      return keywords.split(',').map(k => k.trim()).slice(0, 10).filter(k => k.length > 0);
    }
    return [];
  } catch {
    return [];
  }
}

function extractLanguage($) {
  try {
    return $('html').attr('lang') || 
           $('meta[http-equiv="content-language"]').attr('content') || 
           'en';
  } catch {
    return 'en';
  }
}

async function getAll(page = 1, limit = 10, search = '') {
  let query = supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search) {
    query = query.or(`brand_name.ilike.%${search}%,description.ilike.%${search}%,url.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
}

async function getById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select()
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data;
}

async function update(id, values) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}

async function remove(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

async function getStats() {
  try {
    const { count: totalWebsites } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact', head: true });

    const { data: allSites } = await supabase
      .from(TABLE)
      .select('url, brand_name, created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    let mostRecent = null;
    let lastAdded = null;

    if (allSites && allSites.length > 0) {
      const latest = allSites;
      mostRecent = latest.brand_name || new URL(latest.url).hostname.replace(/^www\./, '');
      lastAdded = latest.created_at;
    }

    return {
      totalWebsites: totalWebsites || 0,
      mostRecent: mostRecent,
      lastAdded: lastAdded
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalWebsites: 0,
      mostRecent: null,
      lastAdded: null
    };
  }
}

module.exports = { analyzeAndStore, getAll, getById, update, remove, getStats };
