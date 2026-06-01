/**
 * services/ai.js
 * Supports both OpenAI and OpenRouter (OpenAI-compatible API)
 *
 * Configuration is loaded from runtime settings (POST /api/settings)
 * with fallback to .env values.
 */
const OpenAI = require('openai');

// Runtime settings — can be updated via POST /api/settings
const settings = {
  provider: process.env.AI_PROVIDER || 'openai',   // 'openai' | 'openrouter'
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
};

// OpenRouter available models (for UI dropdown)
const OPENROUTER_MODELS = [
  { id: 'openai/gpt-4o-mini',               label: 'GPT-4o Mini (OpenAI)' },
  { id: 'openai/gpt-4o',                    label: 'GPT-4o (OpenAI)' },
  { id: 'anthropic/claude-3-haiku',         label: 'Claude 3 Haiku (Anthropic)' },
  { id: 'anthropic/claude-3.5-sonnet',      label: 'Claude 3.5 Sonnet (Anthropic)' },
  { id: 'google/gemini-flash-1.5',          label: 'Gemini Flash 1.5 (Google)' },
  { id: 'google/gemini-pro-1.5',            label: 'Gemini Pro 1.5 (Google)' },
  { id: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B (Meta)' },
  { id: 'meta-llama/llama-3.1-70b-instruct',label: 'Llama 3.1 70B (Meta)' },
  { id: 'mistralai/mistral-7b-instruct',    label: 'Mistral 7B (Mistral AI)' },
  { id: 'deepseek/deepseek-chat',           label: 'DeepSeek Chat (DeepSeek)' },
];

const OPENAI_MODELS = [
  { id: 'gpt-4o-mini',  label: 'GPT-4o Mini (fastest)' },
  { id: 'gpt-4o',       label: 'GPT-4o' },
  { id: 'gpt-4-turbo',  label: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo',label: 'GPT-3.5 Turbo (cheapest)' },
];

function getModelsForProvider(provider) {
  return provider === 'openrouter' ? OPENROUTER_MODELS : OPENAI_MODELS;
}

function getSettings() { return { ...settings }; }

function updateSettings(patch) {
  if (patch.provider) settings.provider = patch.provider;
  if (patch.apiKey)   settings.apiKey   = patch.apiKey;
  if (patch.model)    settings.model    = patch.model;
}

// Build OpenAI client based on current settings
function buildClient() {
  if (!settings.apiKey) throw new Error('AI API key not configured');
  const config = { apiKey: settings.apiKey };
  if (settings.provider === 'openrouter') {
    config.baseURL = 'https://openrouter.ai/api/v1';
    config.defaultHeaders = {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'NEXUS Event Platform',
    };
  }
  return new OpenAI(config);
}

async function chat(messages, maxTokens = 800) {
  const client = buildClient();
  const response = await client.chat.completions.create({
    model: settings.model,
    messages,
    temperature: 0.2,
    max_tokens: maxTokens,
  });
  return response.choices[0].message.content.trim();
}

/**
 * Analyze sentiment of a single comment.
 * Returns { sentiment: 'positive'|'neutral'|'negative', confidence: number }
 */
async function analyzeSentiment(text) {
  const raw = await chat([
    {
      role: 'system',
      content:
        'You are a sentiment classifier. Respond with ONLY valid JSON: {"sentiment":"positive"|"neutral"|"negative","confidence":0.0-1.0}. No other text.',
    },
    { role: 'user', content: text },
  ], 60);

  try { return JSON.parse(raw); }
  catch { return { sentiment: 'neutral', confidence: 0 }; }
}

/**
 * Generate a bilingual (Thai + English) event summary.
 */
async function generateSummary(comments) {
  const joined = comments.slice(0, 200).join('\n- ');
  const raw = await chat([
    {
      role: 'system',
      content: `You are an expert event analyst. Given participant comments produce ONLY valid JSON (no markdown, no code block):
{
  "summary": "<ภาษาไทย 2-3 ประโยค / English 2-3 sentences — bilingual overview>",
  "summaryTh": "<สรุปภาษาไทย 2-3 ประโยค>",
  "summaryEn": "<English summary 2-3 sentences>",
  "keyThemes": ["<ประเด็นหลัก (Thai/English)>", ...],
  "keyThemesTh": ["<ภาษาไทย>", ...],
  "keyThemesEn": ["<English>", ...],
  "sentimentBreakdown": {"positive":<n>,"neutral":<n>,"negative":<n>},
  "highlights": ["<ข้อความน่าสนใจ>", ...],
  "recommendations": ["<ข้อเสนอแนะเป็นภาษาไทย>", ...]
}
Always use both Thai and English in your output.`,
    },
    { role: 'user', content: `Comments (${comments.length} total):\n- ${joined}` },
  ], 1400);

  try { return JSON.parse(raw); }
  catch { return { summary: raw, summaryTh: raw, summaryEn: raw, keyThemes: [], keyThemesTh: [], keyThemesEn: [], sentimentBreakdown: {}, highlights: [], recommendations: [] }; }
}

module.exports = {
  analyzeSentiment,
  generateSummary,
  getSettings,
  updateSettings,
  getModelsForProvider,
};
