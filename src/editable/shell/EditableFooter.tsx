'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto border-t border-[rgba(15,14,14,0.1)] bg-[#f4eee8] text-[#0f0e0e]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden">
                <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
              </span>
              <div>
                <p className="editable-display text-[2rem] font-semibold leading-none tracking-[-0.04em]">{SITE_CONFIG.name}</p>
                <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#635b58]">
                  {globalContent.footer.tagline}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#635b58]">
              {globalContent.footer.description}
            </p>
            <div className="mt-6 inline-flex rounded-full border border-[rgba(15,14,14,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#468a9a]">
              {globalContent.footer.bottomNote}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {globalContent.footer.columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#2563eb]">{column.title}</h3>
                <div className="mt-4 grid gap-3">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">
                      <ChevronRight className="h-4 w-4" /> {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#2563eb]">Account</h3>
              <div className="mt-4 grid gap-3">
                {session ? (
                  <>
                    <Link href="/create" className="text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">Create a post</Link>
                    <Link href="/comments" className="text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">Community</Link>
                    <button type="button" onClick={logout} className="text-left text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">Login</Link>
                    <Link href="/signup" className="text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">Register</Link>
                    <Link href="/contact" className="text-sm font-medium text-[#3f3936] transition hover:text-[#468a9a]">Support</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(15,14,14,0.08)] bg-[#efe7df]">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-3 px-4 py-5 text-xs font-medium tracking-[0.08em] text-[#635b58] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>Public discovery for listings, editorials, and connected resources.</p>
        </div>
      </div>
    </footer>
  )
}
