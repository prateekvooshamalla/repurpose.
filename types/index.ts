export interface Project {
  id: string
  user_id: string
  title: string
  source_type: 'transcript' | 'video'
  created_at: string
  assets?: Asset[]
  generations?: Generation[]
}

export interface Asset {
  id: string
  project_id: string
  video_url?: string
  transcript_text?: string
  transcript_file_url?: string
}

export interface Generation {
  id: string
  project_id: string
  user_id: string
  status: 'queued' | 'done' | 'failed'
  prompt_version: string
  created_at: string
  outputs?: Output[]
}

export interface Output {
  id: string
  generation_id: string
  type: 'reels' | 'tweets' | 'linkedin' | 'carousel'
  content_json: ReelsOutput | TweetsOutput | LinkedInOutput | CarouselOutput
  created_at: string
}

export interface ReelScript {
  hook: string
  beats: string[]
  broll: string[]
  on_screen_text: string[]
  caption: string
  hashtags: string[]
}

export interface ReelsOutput {
  scripts: ReelScript[]
}

export interface TweetsOutput {
  tweets: string[]
}

export interface LinkedInPost {
  hook: string
  body: string
  cta: string
}

export interface LinkedInOutput {
  posts: LinkedInPost[]
}

export interface CarouselSlide {
  title: string
  body: string
  visual_hint: string
}

export interface CarouselOutput {
  slides: CarouselSlide[]
  caption: string
  cta: string
}

export interface GenerateRequest {
  project_id: string
  tone: 'educational' | 'bold' | 'calm' | 'funny'
  audience: 'creators' | 'coaches' | 'founders'
  cta_style: string
  platforms: ('reels' | 'tweets' | 'linkedin' | 'carousel')[]
}

export interface UsageRecord {
  user_id: string
  month: string
  credits_used: number
  credits_limit: number
}

export interface Subscription {
  id: string
  user_id: string
  status: 'active' | 'canceled' | 'pending'
  plan: string
  current_period_end: string
  razorpay_subscription_id?: string
  razorpay_payment_id?: string
}
