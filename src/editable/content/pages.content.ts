import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated listings, editorial stories, and public discovery',
      description: 'Browse business listings, featured stories, market notices, and useful resources in a polished marketplace-style experience.',
      openGraphTitle: 'Curated listings, editorial stories, and public discovery',
      openGraphDescription: 'Discover listings, stories, visuals, and resources through a polished marketplace-style homepage.',
      keywords: ['business listings', 'classifieds', 'editorial marketplace', 'public discovery'],
    },
    hero: {
      badge: 'Featured collection',
      title: ['Where business discovery', 'meets editorial presentation.'],
      description: 'Search listings, compare highlights, and move through curated sections built for polished public discovery.',
      primaryCta: { label: 'Browse editorials', href: '/article' },
      secondaryCta: { label: 'View editorials', href: '/article' },
      searchPlaceholder: 'Search listings, stories, profiles, and resources',
      focusLabel: 'Featured now',
      featureCardBadge: 'spotlight placement',
      featureCardTitle: 'Fresh listings and polished stories stay at the front of the experience.',
      featureCardDescription: 'The homepage blends promotional energy with a cleaner editorial rhythm so discovery feels intentional.',
    },
    intro: {
      badge: 'About the platform',
      title: 'A polished destination for listings, notices, and editorial discovery.',
      paragraphs: [
        'This site combines structured listings, timely market notices, visual highlights, and written features in one connected interface.',
        'Visitors can search quickly, browse by category, and move between directory-style content and editorial storytelling without losing context.',
        'The result is a more refined public experience for browsing businesses, offers, and supporting content.',
      ],
      sideBadge: 'Highlights',
      sidePoints: [
        'Search-first landing experience with stronger category navigation.',
        'Mixed card system for featured, compact, editorial, and image-led posts.',
        'Directory and detail layouts built for business discovery.',
        'Responsive spacing and polish across home, archive, and detail routes.',
      ],
      primaryLink: { label: 'Browse editorials', href: '/article' },
      secondaryLink: { label: 'View resources', href: '/pdf' },
    },
    cta: {
      badge: 'Start listing',
      title: 'Present your next listing or feature in a more polished setting.',
      description: 'Create a post, submit a business, or share a story through the site’s connected publishing surface.',
      primaryCta: { label: 'Create a post', href: '/create' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A refined public-facing marketplace with editorial discipline.',
    description: `${slot4BrandConfig.siteName} brings together business listings, market-style notices, and discoverable stories in one polished experience.`,
    paragraphs: [
      'The site is designed to help visitors scan quickly, compare clearly, and keep exploring across different content types.',
      'Every page is built to feel more intentional, from featured homepage merchandising to practical listing detail layouts.',
    ],
    values: [
      {
        title: 'Clear discovery',
        description: 'Search, category browsing, and visual hierarchy work together to make exploration feel fast and understandable.',
      },
      {
        title: 'Polished presentation',
        description: 'Listings and editorial content share a cohesive luxury-inspired visual language without losing usability.',
      },
      {
        title: 'Connected content',
        description: 'Stories, resources, profiles, and business posts remain easy to navigate as part of one unified destination.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Use this page to ask about listings, submissions, partnerships, or support.',
    description: 'Send a message and we will route it to the right lane, whether you need help with discovery, submissions, or general questions.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search listings, stories, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the collection',
      title: 'Find listings, stories, visuals, and useful resources faster.',
      description: 'Use keywords, categories, and content types to move across the site’s full public collection.',
      placeholder: 'Search by title, keyword, category, or business name',
    },
    resultsTitle: 'Search results',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to publish new content.',
      description: 'Use your account to open the submission workspace and add a new listing, story, or resource.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Prepare a polished post for any active section.',
      description: 'Choose the content type, add core details, and create a clean public-facing entry with summary, media, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Return to your publishing workspace.',
      description: 'Login to manage submissions, publish new content, and continue browsing from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Create access',
      title: 'Open your account and start publishing.',
      description: 'Create an account to access the submission workspace, store details, and publish new entries.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
