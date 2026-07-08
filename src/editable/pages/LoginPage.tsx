import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as palette } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} min-h-[calc(100vh-12rem)] grid items-center gap-12 py-16 lg:grid-cols-[1fr_0.9fr]`}>
          <div>
            <p className={dc.type.eyebrow}>{pagesContent.auth.login.badge}</p>
            <h1 className={`mt-4 max-w-xl ${dc.type.heroTitle}`}>{pagesContent.auth.login.title}</h1>
            <p className={`mt-5 max-w-lg text-base leading-7 ${palette.mutedText}`}>{pagesContent.auth.login.description}</p>
          </div>
          <div className={`rounded-xl border ${palette.border} ${palette.surfaceBg} ${palette.shadow} p-7 sm:p-9`}>
            <h2 className="text-2xl font-semibold tracking-[-0.01em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className={`mt-6 text-sm ${palette.mutedText}`}>New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
