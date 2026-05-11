'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // we'll do it manually
      })
    }
  }, [])

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      posthog.capture('$pageview', { $current_url: window.location.href })
    }
  }, [pathname])

  return <>{children}</>
}