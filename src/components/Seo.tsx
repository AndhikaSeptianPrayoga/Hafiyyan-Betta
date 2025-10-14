import { useEffect } from 'react'

interface SeoProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

export default function Seo({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SeoProps) {
  useEffect(() => {
    if (title) document.title = title

    const setMeta = (name: string, content?: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return
      let el = document.head.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel: string, href?: string) => {
      if (!href) return
      let linkEl = document.head.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null
      if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.setAttribute('rel', rel)
        document.head.appendChild(linkEl)
      }
      linkEl.setAttribute('href', href)
    }

    // Base SEO
    setMeta('description', description)

    // Open Graph
    setMeta('og:title', ogTitle ?? title, 'property')
    setMeta('og:description', ogDescription ?? description, 'property')
    setMeta('og:image', ogImage, 'property')

    // Canonical URL
    setLink('canonical', canonicalUrl)

    // Twitter Cards
    const twTitle = twitterTitle ?? ogTitle ?? title
    const twDesc = twitterDescription ?? ogDescription ?? description
    const twImg = twitterImage ?? ogImage
    setMeta('twitter:card', twitterCard ?? (twImg ? 'summary_large_image' : 'summary'))
    setMeta('twitter:title', twTitle)
    setMeta('twitter:description', twDesc)
    setMeta('twitter:image', twImg)
  }, [
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ])

  return null
}