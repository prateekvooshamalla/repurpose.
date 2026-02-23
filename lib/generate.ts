import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenerateOptions {
  transcript: string;
  tone: string;
  audience: string;
  cta_style: string;
  platforms: string[];
}

export async function generateContent(options: GenerateOptions) {
  const { transcript, tone, audience, cta_style, platforms } = options;

  const platformInstructions: Record<string, string> = {
    reels: `"reels": {
  "scripts": [
    {
      "hook": "attention-grabbing opening line (under 10 words, starts with action/emotion)",
      "beats": ["beat 1", "beat 2", "beat 3", "beat 4", "beat 5"],
      "broll": ["b-roll suggestion 1", "b-roll suggestion 2"],
      "on_screen_text": ["text overlay 1", "text overlay 2", "text overlay 3"],
      "caption": "instagram/reels caption (150-200 chars)",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
    // 3 total scripts
  ]
}`,
    tweets: `"tweets": {
  "tweets": ["tweet 1 (start with number or strong claim)", "tweet 2", "...", "tweet 10 (end with CTA)"]
}`,
    linkedin: `"linkedin": {
  "posts": [
    {
      "hook": "first line that stops the scroll",
      "body": "short post body (3-5 paragraphs, conversational)",
      "cta": "${cta_style}"
    },
    {
      "hook": "different angle hook",
      "body": "longer post body (6-8 paragraphs with line breaks, story-driven)",
      "cta": "${cta_style}"
    }
  ]
}`,
    carousel: `"carousel": {
  "slides": [
    {"title": "slide title", "body": "slide body (1-2 sentences)", "visual_hint": "what to show visually"},
    // 8 total slides: slide 1 = hook, slide 8 = CTA
  ],
  "caption": "carousel caption for post",
  "cta": "${cta_style}"
}`,
  };

  const selectedPlatforms = platforms
    .filter(p => platformInstructions[p])
    .map(p => platformInstructions[p])
    .join(',\n');

  const systemPrompt = `You are a world-class social media content strategist specializing in repurposing long-form content for multiple platforms. You write in a ${tone} tone for an audience of ${audience}. Your outputs are always platform-native, engaging, and drive action. Always return STRICT valid JSON only — no markdown, no backticks, no explanations.`;

  const userPrompt = `Repurpose the following transcript into platform-ready content.

TRANSCRIPT:
"""
${transcript.slice(0, 8000)}
"""

TONE: ${tone}
AUDIENCE: ${audience}  
CTA: ${cta_style}

Return ONLY this exact JSON structure with no additional text:
{
${selectedPlatforms}
}

Rules:
- Every hook must be under 15 words and immediately grab attention
- Content must feel native to each platform (not copy-pasted)
- Include specific insights/stats/tips from the transcript
- Reels beats should be 5-10 seconds each
- Tweet thread: 8-12 tweets, each under 280 characters
- LinkedIn posts: conversational, include line breaks, 1 emoji per post max
- Carousel: slide 1 = bold hook, slide 8 = clear CTA with ${cta_style}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content returned from OpenAI');

  const parsed = JSON.parse(content);
  return parsed;
}
