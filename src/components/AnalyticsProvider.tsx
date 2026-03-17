import React from 'react'
import { Analytics } from '@vercel/analytics/react'

/**
 * Vercel Analytics Provider Component
 * 
 * This component adds Vercel Web Analytics tracking to your Framer site.
 * Simply add this component to any page in your Framer project to enable analytics.
 * 
 * Usage in Framer:
 * 1. Add this as a Code Component to your page
 * 2. Place it anywhere on the page (it renders nothing visible)
 * 3. Analytics will automatically start tracking page views and interactions
 */
export function AnalyticsProvider() {
  return <Analytics />
}

export default AnalyticsProvider
