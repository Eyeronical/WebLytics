const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'WebLytics',
  },
});

const MODEL = 'openai/gpt-4o-mini';

async function enhanceDescription(rawDescription, brandName) {
  if (!process.env.OPENROUTER_API_KEY || rawDescription.length < 10) {
    return generateFallbackDescription(rawDescription, brandName);
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert marketing copywriter and brand strategist. Your task is to transform basic website descriptions into compelling, detailed marketing copy that captures the essence of the brand and engages potential customers.

Guidelines:
- Write 3-4 detailed sentences (150-200 words)
- Include the brand's unique value proposition
- Use persuasive, professional marketing language
- Highlight key benefits and features
- Create emotional connection with users
- Maintain credibility and professionalism
- Avoid hyperbole or unrealistic claims
- Focus on what makes this brand/service special`,
        },
        {
          role: 'user',
          content: `Brand: ${brandName}
Original Description: "${rawDescription}"

Transform this into rich, engaging marketing copy that would appeal to potential customers. Make it detailed and compelling while staying authentic to the brand.`,
        },
      ],
      max_tokens: 250,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const enhanced = completion?.choices?.[0]?.message?.content?.trim();
    
    if (enhanced && enhanced.length > rawDescription.length + 50) {
      return enhanced;
    } else {
      return generateFallbackDescription(rawDescription, brandName);
    }
    
  } catch (err) {
    console.error('AI Enhancement Error:', err.message);
    return generateFallbackDescription(rawDescription, brandName);
  }
}

function generateFallbackDescription(rawDescription, brandName) {
  const templates = [
    `Discover ${brandName}, your premier destination for ${rawDescription.toLowerCase()}. Experience cutting-edge innovation and exceptional service designed to exceed your expectations. With a commitment to quality and user satisfaction, ${brandName} stands at the forefront of digital excellence, offering solutions that transform how you interact with technology. Join thousands of satisfied users who have made ${brandName} their trusted choice for reliable, feature-rich experiences.`,
    
    `${brandName} revolutionizes your digital experience with ${rawDescription.toLowerCase()}. Our platform combines advanced technology with intuitive design to deliver unparalleled value to our users. Whether you're seeking efficiency, creativity, or connectivity, ${brandName} provides the tools and resources you need to achieve your goals. Experience the difference that thoughtful innovation and user-centric design can make in your daily digital interactions.`,
    
    `Welcome to ${brandName}, where innovation meets excellence in ${rawDescription.toLowerCase()}. Our comprehensive platform is designed to empower users with sophisticated yet accessible tools that streamline workflows and enhance productivity. With a focus on reliability, security, and user experience, ${brandName} has earned the trust of professionals and enthusiasts alike. Explore our feature-rich environment and discover why ${brandName} is the smart choice for discerning users.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

module.exports = { enhanceDescription };
