const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'Website Analyzer',
  },
});

const MODEL = 'openai/gpt-oss-20b:free';

async function enhanceDescription(rawDescription, brandName) {
  if (!process.env.OPENROUTER_API_KEY || rawDescription.length < 10) {
    return rawDescription;
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a creative marketing copywriter. Rewrite any website description you receive to be more engaging, creative, and compelling in clear, professional English. Highlight the brand’s strengths and uniqueness. Add at least one sentence that goes beyond the original.',
        },
        {
          role: 'user',
          content: `Brand: ${brandName}\nOriginal: "${rawDescription}"\nRewrite and improve this description as compelling marketing copy.`,
        },
      ],
      max_tokens: 160,
      temperature: 0.85,
    });

    const enhanced = completion?.choices?.[0]?.message?.content?.trim();
    return enhanced || rawDescription;
    
  } catch (err) {
    return rawDescription;
  }
}

module.exports = { enhanceDescription };
