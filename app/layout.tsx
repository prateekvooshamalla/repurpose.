import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepurposeAI — Turn Your Content Into Everything',
  description: 'Transform any transcript or video into Reels scripts, Tweet threads, LinkedIn posts, and Carousels in seconds. Built for creators, coaches, and founders.',
  keywords: 'content repurposing, AI content, social media automation, reels script, tweet thread',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
