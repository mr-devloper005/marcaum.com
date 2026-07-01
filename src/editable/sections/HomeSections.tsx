import Link from 'next/link'
import { ArrowRight, ChevronRight, Search, Sparkles, Star, Store, TrendingUp } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function categoryOf(post?: SitePost | null, fallback = 'Featured') {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function statLabel(posts: SitePost[], seed: number) {
  return `${posts.length * 7 + seed}+`
}

function featurePool(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function FeaturedHeroCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block min-h-[360px] overflow-hidden rounded-[2rem] bg-[#5a2de2] p-8 text-[#eeeeee] shadow-[0_40px_90px_rgba(84,18,18,0.18)] sm:min-h-[420px] lg:min-h-[460px]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(90,45,226,0.96),rgba(70,138,154,0.85))]" />
      <div className="absolute inset-y-0 right-0 hidden w-[44%] lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-3 lg:p-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={`overflow-hidden rounded-[1.5rem] bg-white/18 ${index === 0 ? 'translate-y-5' : ''} ${index === 1 ? '-translate-y-3' : ''}`}>
            <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex h-full max-w-[32rem] flex-col justify-center">
        <span className="inline-flex w-fit rounded-full bg-white/18 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.28em] text-white/90">
          {pagesContent.home.hero.badge}
        </span>
        <h1 className="editable-display mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
          {pagesContent.home.hero.title.join(' ')}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/88 sm:text-lg">
          {pagesContent.home.hero.description}
        </p>
        <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#eeeeee] px-5 py-3 text-sm font-extrabold text-[#5a2de2]">
          Explore now <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function MosaicCard({ post, href, tall = false }: { post: SitePost; href: string; tall?: boolean }) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[1.5rem] bg-[#eee7e0] ${tall ? 'min-h-[220px]' : 'min-h-[180px]'}`}>
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(15,14,14,0.8)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#541212]">
          {categoryOf(post)}
        </span>
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-white">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = featurePool(posts, timeSections)
  const featured = pool[0]
  const mosaic = pool.slice(1, 7)
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled && !['listing', 'classified'].includes(task.key)).slice(0, 8)

  if (!featured) return null

  return (
    <section className="pt-6">
      <div className={container}>
        <div className="rounded-[2.25rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] shadow-[0_24px_70px_rgba(15,14,14,0.06)]">
          <div className="border-b border-[rgba(15,14,14,0.08)] px-5 py-3 text-xs font-semibold text-[#635b58] sm:px-8">
            Featured marketplace
          </div>
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:p-8">
            <FeaturedHeroCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} />

            <div className="space-y-5">
              <form action="/search" className="rounded-[1.75rem] border border-[rgba(15,14,14,0.08)] bg-[#f6f1eb] p-5">
                <div className="flex items-center gap-3 rounded-full border border-[rgba(15,14,14,0.14)] bg-white px-4 py-3 shadow-[0_10px_26px_rgba(15,14,14,0.04)]">
                  <Search className="h-5 w-5 shrink-0 text-[#635b58]" />
                  <input
                    name="q"
                    placeholder={pagesContent.home.hero.searchPlaceholder}
                    className="w-full min-w-0 bg-transparent text-sm text-[#0f0e0e] outline-none placeholder:text-[#8d837d]"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((task) => (
                    <Link key={task.key} href={task.route} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#541212] transition hover:bg-[#541212] hover:text-[#eeeeee]">
                      {task.label}
                    </Link>
                  ))}
                </div>
              </form>

              <div className="grid grid-cols-2 gap-4">
                {mosaic.slice(0, 4).map((post, index) => (
                  <MosaicCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                    tall={index === 1 || index === 2}
                  />
                ))}
              </div>

              <div className="rounded-[1.75rem] bg-[#f2efec] px-6 py-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0f0e0e]">Shopping made easy</h2>
                    <p className="mt-2 text-sm leading-6 text-[#635b58]">Explore reliable listings, polished profiles, and practical resources in one place.</p>
                  </div>
                  <Link href={primaryRoute} className="inline-flex rounded-full bg-[#0f0e0e] px-5 py-3 text-sm font-extrabold text-[#eeeeee] transition hover:bg-[#541212]">
                    Start now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block min-w-[250px] max-w-[250px]">
      <div className="relative aspect-[4/6] overflow-hidden rounded-[1.5rem] bg-[#ede4dd]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-[#4be269] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0f0e0e]">
          Live · {80 - index}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-[#0f0e0e]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#635b58]">{getEditableExcerpt(post, 88)}</p>
    </Link>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = featurePool(posts, timeSections).slice(0, 8)
  if (!pool.length) return null

  return (
    <section className="py-14">
      <div className={container}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[#0f0e0e]">Featured live picks</h2>
            <p className="mt-2 text-lg text-[#635b58]">A fast-moving rail of standout posts, listings, and fresh highlights.</p>
          </div>
          <Link href={primaryRoute} className="text-sm font-extrabold text-[#541212] transition hover:text-[#468a9a]">
            See all
          </Link>
        </div>
        <div className="mt-7 flex gap-4 overflow-x-auto pb-2">
          {pool.map((post, index) => (
            <LiveCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryBlock({ label, href, image, accent }: { label: string; href: string; image: string; accent: string }) {
  return (
    <Link href={href} className="group block">
      <div className="rounded-[1.5rem] bg-[#ece7e2] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,14,14,0.08)]">
        <div className="aspect-square overflow-hidden rounded-[1.25rem] bg-white">
          <img src={image} alt={label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      </div>
      <p className="mt-3 text-base font-semibold text-[#0f0e0e]" style={{ color: accent }}>{label}</p>
    </Link>
  )
}

function PromoFeature({ post, href }: { post: SitePost; href: string }) {
  return (
    <div className="grid gap-6 overflow-hidden rounded-[2rem] bg-[#191919] p-8 text-[#eeeeee] lg:grid-cols-[1fr_0.95fr]">
      <div className="flex flex-col justify-center">
        <h2 className="editable-display max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em]">
          Endless opportunities. Elevated presentation.
        </h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-white/76">
          Browse standout listings, strong profiles, and high-visibility posts arranged for confident discovery.
        </p>
        <Link href={href} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#eeeeee] px-5 py-3 text-sm font-extrabold text-[#0f0e0e] transition hover:bg-[#468a9a] hover:text-[#eeeeee]">
          Browse now <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className={`overflow-hidden rounded-[1.5rem] bg-white ${index === 0 ? 'rotate-[-10deg]' : index === 1 ? 'translate-y-6 rotate-[-4deg]' : 'rotate-[6deg]'}`}>
            <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/5] w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = featurePool(posts, timeSections)
  const categories = pool.slice(0, 7)
  const promo = pool[2] || pool[0]
  if (!promo) return null

  return (
    <section className="pb-14">
      <div className={container}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[#0f0e0e]">Seasonal category picks</h2>
            <p className="mt-2 text-lg text-[#635b58]">Browse polished category tiles before jumping into the full archive.</p>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          {categories.map((post, index) => (
            <CategoryBlock
              key={post.id || post.slug}
              label={categoryOf(post, `Category ${index + 1}`)}
              href={postHref(primaryTask, post, primaryRoute)}
              image={getEditablePostImage(post)}
              accent={index % 3 === 0 ? '#541212' : index % 3 === 1 ? '#0f0e0e' : '#468a9a'}
            />
          ))}
        </div>
        <div className="mt-12">
          <PromoFeature post={promo} href={postHref(primaryTask, promo, primaryRoute)} />
        </div>
      </div>
    </section>
  )
}

function DealCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-[#ebe6e1] p-3">
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#541212] shadow-sm">
          <Star className="h-4 w-4" />
        </div>
        <div className="overflow-hidden rounded-[1.25rem] bg-[#f6f1eb]">
          <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-[#0f0e0e]">{post.title}</h3>
      <p className="mt-1 text-xl font-extrabold text-[#541212]">${(index + 2) * 24}.00 <span className="ml-2 text-sm font-medium text-[#8d837d] line-through">${(index + 3) * 31}.00</span></p>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 rounded-[1.5rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,14,14,0.06)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#541212] text-sm font-extrabold text-[#eeeeee]">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#468a9a]">{categoryOf(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug text-[#0f0e0e]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#635b58]">{getEditableExcerpt(post, 96)}</p>
      </div>
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length
    ? timeSections
    : [
        { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
        { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
        { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
      ]

  const featured = sections[0]?.posts || []
  const editorial = sections[1]?.posts || []

  return (
    <section className="pb-16">
      <div className={container}>
        <div className="grid gap-10 xl:grid-cols-[1.35fr_0.65fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[#0f0e0e]">Today&apos;s curated selections</h2>
                <p className="mt-2 text-lg text-[#635b58]">A more commerce-shaped grid for featured cards and practical browsing.</p>
              </div>
              <Link href={primaryRoute} className="text-sm font-extrabold text-[#541212] transition hover:text-[#468a9a]">
                See all
              </Link>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featured.slice(0, 8).map((post, index) => (
                <DealCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>

          <aside className="space-y-5 rounded-[2rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-6 shadow-[0_24px_50px_rgba(15,14,14,0.05)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#541212] text-[#eeeeee]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#468a9a]">Editors&apos; notebook</p>
                <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[#0f0e0e]">Quick picks and fresh angles</h3>
              </div>
            </div>
            {editorial.slice(0, 4).map((post, index) => (
              <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
            <div className="rounded-[1.5rem] bg-[#f3ece6] p-5">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-[#541212]" />
                <p className="text-sm font-bold text-[#0f0e0e]">Business-ready browsing</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[1rem] bg-white px-4 py-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#635b58]">Active sections</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#541212]">{SITE_CONFIG.tasks.filter((task) => task.enabled).length}</p>
                </div>
                <div className="rounded-[1rem] bg-white px-4 py-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#635b58]">Fresh discoveries</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#541212]">{statLabel(featured, 12)}</p>
                </div>
                <div className="rounded-[1rem] bg-white px-4 py-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#635b58]">Growing interest</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold text-[#541212]"><TrendingUp className="h-5 w-5" /> {statLabel(editorial, 25)}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="pb-20">
      <div className={container}>
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(15,14,14,0.08)] bg-[linear-gradient(135deg,#541212_0%,#0f0e0e_55%,#468a9a_100%)] px-6 py-12 text-[#eeeeee] shadow-[0_30px_80px_rgba(15,14,14,0.18)] sm:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-white/72">{pagesContent.home.cta.badge}</p>
            <h2 className="editable-display mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.05em]">
              {pagesContent.home.cta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
              {pagesContent.home.cta.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[#eeeeee] px-6 py-3 text-sm font-extrabold text-[#541212] transition hover:bg-white">
                {pagesContent.home.cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-extrabold text-[#eeeeee] transition hover:bg-white/10">
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
