import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const PROMPT_VERSION = 'v1.0'

export function buildRepurposePrompt(
  transcript: string,
  tone: string,
  audience: string,
  ctaStyle: string,
  platforms: string[]
): string {
  return `You are a world-class social media content strategist. Your job is to repurpose the given transcript into high-performing platform-specific content.

TRANSCRIPT:
"""
${transcript}
"""

BRAND SETTINGS:
- Tone: ${tone} (educational = informative & clear, bold = punchy & direct, calm = measured & thoughtful, funny = witty & playful)
- Target Audience: ${audience}
- CTA Style: ${ctaStyle}
- Platforms to generate: ${platforms.join(', ')}

INSTRUCTIONS:
Generate content ONLY for the platforms listed above. Return a single valid JSON object with keys matching the requested platforms.

JSON SCHEMA (only include requested platforms):

{
  "reels": {
    "scripts": [
      {
        "hook": "Opening 3-second attention-grabbing line",
        "beats": ["Beat 1 - what to say", "Beat 2", "Beat 3", "Beat 4"],
        "broll": ["Visual suggestion 1", "Visual suggestion 2", "Visual suggestion 3"],
        "on_screen_text": ["Text overlay 1", "Text overlay 2", "Text overlay 3"],
        "caption": "Full Instagram/TikTok caption with personality",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
      }
    ]
    // Generate exactly 3 reel scripts
  },

  "tweets": {
    "tweets": [
      "Tweet 1 (max 280 chars)",
      "Tweet 2",
      "Tweet 3 (reply starts with .@)",
      "Tweet 4",
      "Tweet 5",
      "Tweet 6",
      "Tweet 7",
      "Tweet 8",
      "Tweet 9",
      "Tweet 10"
    ]
    // Generate exactly 10 tweets as a thread (numbered 1/ 2/ etc in tweet text)
  },

  "linkedin": {
    "posts": [
      {
        "hook": "First line that stops the scroll (no clickbait)",
        "body": "Main post body with line breaks for readability. Use storytelling. 150-300 words.",
        "cta": "Call to action line"
      },
      {
        "hook": "Different angle hook",
        "body": "Shorter version. 80-150 words. More punchy.",
        "cta": "Different CTA"
      }
    ]
    // Generate exactly 2 posts (1 long, 1 short)
  },

  "carousel": {
    "slides": [
      {
        "title": "Slide title (short, impactful)",
        "body": "2-3 lines of slide body text",
        "visual_hint": "What to show visually on this slide"
      }
    ],
    // Generate exactly 8 slides: slide 1 = hook/cover, slides 2-7 = content, slide 8 = CTA
    "caption": "Instagram carousel caption",
    "cta": "Save this for later / Share with someone who needs it"
  }
}

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown. No explanation before or after.
2. Make content punchy, specific, and platform-native — not generic.
3. Use insights from the transcript, not general knowledge.
4. The hook must be ultra-specific, not vague.
5. Numbers, specific claims, and surprising facts perform best.
6. CTA should be: ${ctaStyle}
`
}
