import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A refined marketplace for business discovery',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Luxury editorial listings',
    primaryLinks: [
      { label: 'Featured', href: '/' },
      { label: 'Editorial', href: '/article' },
      { label: 'Community', href: '/comments' },
      { label: 'Visuals', href: '/image' },
      { label: 'Resources', href: '/pdf' },
    ],
    utilityLinks: [
      { label: 'Sign in', href: '/login' },
      { label: 'Register', href: '/signup' },
      { label: 'Editorial Picks', href: '/article' },
      { label: 'Resources', href: '/pdf' },
      { label: 'Help & Contact', href: '/contact' },
    ],
    marketLinks: [
      { label: 'Featured', href: '/' },
      { label: 'Editorial', href: '/article' },
      { label: 'Community', href: '/comments' },
      { label: 'Visuals', href: '/image' },
      { label: 'Resources', href: '/pdf' },
    ],
  },
  footer: {
    tagline: 'Curated listings, polished stories, and practical discovery tools',
    description: 'Explore business listings, market notices, editorial features, and useful resources through one elevated public-facing destination.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Editorial', href: '/article' },
          { label: 'Community', href: '/comments' },
        ],
      },
      {
        title: 'Discover',
        links: [
          { label: 'Visuals', href: '/image' },
          { label: 'Resources', href: '/pdf' },
          { label: 'Saved links', href: '/sbm' },
          { label: 'Community', href: '/comments' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Create a post', href: '/create' },
          { label: 'Comments', href: '/comments' },
        ],
      },
    ],
    bottomNote: 'Designed for public discovery, clear browsing, and polished presentation.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
