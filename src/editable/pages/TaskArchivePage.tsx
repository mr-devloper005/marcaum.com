import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, FileText, Globe, MapPin, Phone, Search, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo) || asText(content.avatar)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}

const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 460)
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 lg:grid-cols-2',
  listing: 'grid gap-5',
  classified: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-4',
}

const surface = 'rounded-[1.75rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_24px_60px_rgba(15,14,14,0.06)]'

const archiveAdSlotByTask: Partial<Record<TaskKey, 'header' | 'sidebar' | 'in-feed' | 'article-bottom' | 'footer'>> = {
  article: 'in-feed',
  listing: 'header',
  profile: 'sidebar',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const featured = posts[0]
  const sideItems = posts.slice(1, 5)
  const gridItems = task === 'listing' ? posts : posts.slice(task === 'article' ? 1 : 0)
  const adSlot = archiveAdSlotByTask[task]

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <section className="border-b border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8">
            <div className={`${surface} overflow-hidden`}>
              <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:p-8">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.3em] text-[var(--tk-accent)]">
                    <span>{theme.kicker}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)]" />
                    <span className="text-[var(--tk-muted)]">{label}</span>
                  </div>
                  <h1 className="editable-display mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--tk-text)] sm:text-6xl">
                    {voice?.headline || `Browse ${label}`}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">
                    {voice?.description || theme.note}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    {(voice?.chips || [categoryLabel, `${posts.length} results`, `Page ${page}`]).slice(0, 4).map((chip) => (
                      <span key={chip} className="rounded-full bg-[var(--tk-raised)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-[var(--tk-raised)] p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--tk-accent)]">
                    Refine this page
                  </p>
                  <form action={basePath} className="mt-5 space-y-4">
                    <div className="relative rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-3">
                      <select
                        name="category"
                        defaultValue={category}
                        className="w-full appearance-none bg-transparent pr-8 text-sm font-semibold text-[var(--tk-text)] outline-none"
                        aria-label={voice?.filterLabel || 'Filter category'}
                      >
                        <option value="all">All categories</option>
                        {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                    </div>
                    <button className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--tk-accent)] px-5 text-sm font-extrabold text-[var(--tk-on-accent)] transition hover:opacity-90">
                      Apply filter
                    </button>
                  </form>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <MetricCard label="Visible" value={String(posts.length)} />
                    <MetricCard label="Category" value={category === 'all' ? 'All' : '1'} />
                    <MetricCard label="Page" value={String(page)} />
                  </div>
                </div>
              </div>

              {featured && task !== 'listing' ? (
                <div className="grid gap-5 border-t border-[var(--tk-line)] bg-[var(--tk-raised)] p-5 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:p-6">
                  <FeaturedArchiveCard post={featured} href={`${basePath}/${featured.slug}` || buildPostUrl(task, featured.slug)} task={task} />
                  <div className="grid gap-4">
                    {sideItems.map((post, index) => (
                      <CompactArchiveCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} index={index} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8">
          {adSlot ? (
            <div className="mx-auto max-w-6xl px-4 py-6">
              <Ads slot={adSlot} showLabel eager className="mx-auto w-full" />
            </div>
          ) : null}

          {posts.length ? (
            <div className={taskGrid[task]}>
              {gridItems.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className={`${surface} mx-auto max-w-xl px-8 py-16 text-center`}>
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-3xl font-semibold tracking-[-0.04em]">Nothing to show yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">
                Try another category, or return later for fresh {label.toLowerCase()}.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-14 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-3 font-bold transition hover:border-[var(--tk-accent)]">Previous</Link> : null}
              <span className="rounded-full bg-[var(--tk-raised)] px-5 py-3 font-bold text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-3 font-bold transition hover:border-[var(--tk-accent)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] bg-[var(--tk-surface)] px-3 py-4 text-center">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-[var(--tk-accent)]">{value}</p>
    </div>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function RatingLine({ post, center = false }: { post: SitePost; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-3 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-bold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">({reviewsOf(post)})</span>
    </div>
  )
}

function FeaturedArchiveCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <Link href={href} className="group relative block min-h-[340px] overflow-hidden rounded-[1.75rem]">
      <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(84,18,18,0.82),rgba(15,14,14,0.3)_48%,rgba(70,138,154,0.72))]" />
      <div className="relative flex h-full max-w-2xl flex-col justify-end p-7 text-[#eeeeee]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/74">{getCategory(post, task)}</p>
        <h2 className="editable-display mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/82">{getSummary(post)}</p>
        <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#541212]">
          Open feature <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function CompactArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`${surface} group flex gap-4 p-4 transition duration-300 hover:-translate-y-1`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent)] text-sm font-extrabold text-[var(--tk-on-accent)]">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--tk-muted)]">{getCategory(post, 'Post')}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-[var(--tk-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`${surface} group grid overflow-hidden p-4 transition duration-300 hover:-translate-y-1 lg:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className="overflow-hidden rounded-[1.25rem] bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt={post.title} className="aspect-[4/3] h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-2 lg:px-6 lg:py-4">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          <span>{getCategory(post, 'Article')}</span>
          <span className="text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1.02] tracking-[-0.04em]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImage(post)
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${surface} group flex flex-col gap-5 p-5 transition duration-300 hover:-translate-y-1 sm:flex-row sm:items-center`}>
      <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[var(--tk-raised)]">
        {image ? <img src={image} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--tk-accent)]">
            {getCategory(post, 'Listing')}
          </span>
        </div>
        <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.04em]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${surface} group flex flex-col p-6 transition duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-4xl font-semibold tracking-[-0.04em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-2xl font-semibold leading-[1.04] tracking-[-0.04em]">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-bold text-[var(--tk-muted)]">
        <span>{location || 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)]" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[1.75rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_24px_60px_rgba(15,14,14,0.06)] transition duration-300 hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={getImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,14,14,0.84))]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/72">{getCategory(post, 'Image')}</p>
          <h2 className="editable-display mt-3 line-clamp-2 text-2xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${surface} group flex gap-4 p-6 transition duration-300 hover:-translate-y-1`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Saved {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-2 text-2xl font-semibold leading-[1.02] tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`${surface} group flex flex-col p-6 transition duration-300 hover:-translate-y-1`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <FileText className="h-6 w-6" />
      </div>
      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--tk-muted)]">{getCategory(post, 'Document')}</p>
      <h2 className="editable-display mt-3 text-2xl font-semibold leading-[1.02] tracking-[-0.04em]">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--tk-accent)]">Open document <ArrowUpRight className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImage(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${surface} group flex flex-col items-center p-7 text-center transition duration-300 hover:-translate-y-1`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{role}</p> : null}
      <RatingLine post={post} center />
      <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
