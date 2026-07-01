'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, Menu, Search, ShoppingBag, User2, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const taskLinks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !['listing', 'classified'].includes(task.key)).map((task) => ({ label: task.label, href: task.route })),
    []
  )
  const marketLinks = globalContent.nav.marketLinks

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(15,14,14,0.08)] bg-[rgba(247,243,238,0.96)] text-[var(--slot4-page-text)] backdrop-blur-xl">
      <div className="border-b border-[rgba(15,14,14,0.08)] bg-[#f1ebe4]">
        <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between gap-4 px-4 py-2 text-[11px] font-semibold tracking-[0.04em] text-[#635b58] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {globalContent.nav.utilityLinks.map((item, index) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#541212]">
                {index === 0 && !session ? 'Hi! Sign in' : item.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <Link href="/comments" className="transition hover:text-[#541212]">Community</Link>
            <Link href="/comments" className="transition hover:text-[#541212]">Watchlist</Link>
            <Link href="/create" className="transition hover:text-[#541212]">Sell</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <nav className="flex min-h-[96px] items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
            </span>
            <div className="hidden md:block">
              <span className="editable-display block text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[#0f0e0e]">
                {SITE_CONFIG.name}
              </span>
              <span className="block pt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#635b58]">
                {globalContent.nav.tagline}
              </span>
            </div>
          </Link>

          <div className="hidden shrink-0 items-center gap-2 border-l border-[rgba(15,14,14,0.08)] pl-5 lg:flex">
            <span className="text-sm font-medium text-[#635b58]">Shop by</span>
            <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0f0e0e]">
              category <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <form action="/search" className="mx-auto hidden min-w-0 flex-1 items-center gap-3 md:flex">
            <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-full border-2 border-[#0f0e0e] bg-[#fffdfa] shadow-[0_12px_36px_rgba(15,14,14,0.06)]">
              <div className="flex flex-1 items-center gap-3 px-5">
                <Search className="h-5 w-5 shrink-0 text-[#635b58]" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search for listings, stories, or anything else"
                  className="h-12 w-full min-w-0 bg-transparent text-sm text-[#0f0e0e] outline-none placeholder:text-[#8d837d]"
                />
              </div>
              <div className="hidden h-12 items-center border-l border-[rgba(15,14,14,0.12)] px-4 lg:flex">
                <select name="task" defaultValue="" className="bg-transparent text-sm text-[#635b58] outline-none">
                  <option value="">All categories</option>
                  {taskLinks.map((item) => <option key={item.href} value={item.label.toLowerCase()}>{item.label}</option>)}
                </select>
              </div>
            </div>
            <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#468a9a] px-8 text-sm font-extrabold text-[#eeeeee] shadow-[0_14px_36px_rgba(70,138,154,0.28)] transition hover:translate-y-[-1px] hover:brightness-95">
              Search
            </button>
          </form>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Link href="/login" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,14,14,0.12)] bg-[#fffdfa] text-[#0f0e0e] transition hover:border-[#541212] hover:text-[#541212]">
              <User2 className="h-5 w-5" />
            </Link>
            <Link href="/comments" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,14,14,0.12)] bg-[#fffdfa] text-[#0f0e0e] transition hover:border-[#541212] hover:text-[#541212]">
              <Bell className="h-5 w-5" />
            </Link>
            <Link href="/create" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,14,14,0.12)] bg-[#fffdfa] text-[#0f0e0e] transition hover:border-[#541212] hover:text-[#541212]">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,14,14,0.12)] bg-[#fffdfa] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <div className="border-t border-[rgba(15,14,14,0.08)] bg-[#fffdfa]">
        <div className="mx-auto hidden max-w-[var(--editable-container)] items-center gap-8 overflow-x-auto px-4 py-3 text-sm font-semibold text-[#3f3936] md:flex sm:px-6 lg:px-8">
          {marketLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap transition ${isActive(pathname, item.href) ? 'text-[#541212]' : 'hover:text-[#468a9a]'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {open ? (
        <div className="border-t border-[rgba(15,14,14,0.08)] bg-[#fffdfa] px-4 py-5 md:hidden">
          <form action="/search" className="flex items-center gap-3 rounded-[1.25rem] border border-[rgba(15,14,14,0.12)] bg-white px-4 py-3">
            <Search className="h-4 w-4 text-[#635b58]" />
            <input name="q" type="search" placeholder="Search the site" className="w-full bg-transparent text-sm outline-none placeholder:text-[#8d837d]" />
          </form>
          <div className="mt-4 grid gap-2">
            {[...marketLinks, ...taskLinks].map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[1rem] px-4 py-3 text-sm font-semibold ${isActive(pathname, item.href) ? 'bg-[#541212] text-[#eeeeee]' : 'bg-[#f3ece6] text-[#0f0e0e]'}`}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="rounded-[1rem] bg-[#f3ece6] px-4 py-3 text-left text-sm font-semibold text-[#0f0e0e]">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
