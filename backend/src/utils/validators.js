function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required and must be a string' };
  }

  let cleanUrl = url.trim();
  
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = 'https://' + cleanUrl;
  }

  try {
    const urlObj = new URL(cleanUrl);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return { isValid: false, error: 'Invalid hostname' };
    }

    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(urlObj.hostname)) {
      return { isValid: false, error: 'Local URLs are not allowed' };
    }

    return { isValid: true, url: cleanUrl };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

function validateId(id) {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
}

function validateUpdateData(data) {
  const allowedFields = ['brand_name', 'description', 'ai_description', 'status'];
  const cleanData = {};

  for (const [key, value] of Object.entries(data)) {
    if (allowedFields.includes(key)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        cleanData[key] = value.trim();
      }
    }
  }

  if (Object.keys(cleanData).length === 0) {
    return { isValid: false, error: 'No valid fields to update' };
  }

  return { isValid: true, data: cleanData };
}

module.exports = { validateUrl, validateId, validateUpdateData };
