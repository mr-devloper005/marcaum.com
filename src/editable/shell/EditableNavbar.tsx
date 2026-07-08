'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { editableDesignContract as dc, editablePalette as palette } from '@/editable/layouts/design-contract'

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const linkClass = (href: string) =>
    `text-sm font-semibold transition ${isActive(pathname, href) ? palette.accentText : `${palette.pageText} hover:text-[var(--slot4-accent)]`}`

  return (
    <header className={`sticky top-0 z-50 border-b ${palette.border} ${palette.surfaceBg} text-[var(--slot4-page-text)]`}>
      <div className={`${dc.shell.section} flex h-20 items-center gap-6`}>
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <div>
            <span className="block text-xl font-semibold leading-none tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            <span className={`hidden pt-1 text-[10px] font-semibold uppercase tracking-[0.24em] sm:block ${palette.mutedText}`}>{globalContent.nav.tagline}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>{item.label}</Link>
          ))}
        </nav>

        <form action="/search" className="mx-auto hidden min-w-0 max-w-md flex-1 items-center md:flex">
          <div className={`flex w-full items-center gap-2 rounded-lg border ${palette.border} ${palette.panelBg} px-4 py-2.5`}>
            <Search className={`h-4 w-4 shrink-0 ${palette.mutedText}`} />
            <input
              name="q"
              type="search"
              placeholder="Search"
              className={`h-5 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]`}
            />
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {session ? (
            <button type="button" onClick={logout} className={dc.button.secondary}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <>
              <Link href="/login" className={dc.button.secondary}>Login</Link>
              <Link href="/signup" className={dc.button.secondary}>Sign up</Link>
            </>
          )}
          <Link href="/create" className={dc.button.primary}>Create</Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border ${palette.border} ${palette.surfaceBg} md:hidden`}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className={`border-t ${palette.border} ${palette.surfaceBg} px-4 py-5 md:hidden`}>
          <form action="/search" className={`flex items-center gap-2 rounded-lg border ${palette.border} ${palette.panelBg} px-4 py-3`}>
            <Search className={`h-4 w-4 ${palette.mutedText}`} />
            <input name="q" type="search" placeholder="Search" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </form>
          <div className="mt-4 grid gap-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-semibold ${isActive(pathname, item.href) ? `${palette.accentSoftBg} ${palette.accentText}` : `${palette.panelBg} ${palette.pageText}`}`}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className={`rounded-lg ${palette.panelBg} px-4 py-3 text-left text-sm font-semibold ${palette.pageText}`}>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className={`rounded-lg ${palette.panelBg} px-4 py-3 text-sm font-semibold ${palette.pageText}`}>Login</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className={`rounded-lg ${palette.panelBg} px-4 py-3 text-sm font-semibold ${palette.pageText}`}>Sign up</Link>
              </>
            )}
            <Link href="/create" onClick={() => setOpen(false)} className={`rounded-lg ${palette.accentBg} px-4 py-3 text-center text-sm font-bold ${palette.onAccentText}`}>Create</Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
