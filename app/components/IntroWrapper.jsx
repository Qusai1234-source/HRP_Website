'use client'

import dynamic from 'next/dynamic'

// Dynamically imported so it never runs during SSR —
// the intro is purely a client-side first-paint experience
const PageIntro = dynamic(() => import('@/app/components/PageIntro'), {
    ssr: false,
})

export default function IntroWrapper() {
    return <PageIntro />
}