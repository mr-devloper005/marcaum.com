import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as palette } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} min-h-[calc(100vh-12rem)] grid items-center gap-12 py-16 lg:grid-cols-[0.9fr_1fr]`}>
          <div className={`rounded-xl border ${palette.border} ${palette.surfaceBg} ${palette.shadow} p-7 sm:p-9`}>
            <h1 className="text-2xl font-semibold tracking-[-0.01em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className={`mt-6 text-sm ${palette.mutedText}`}>Already have an account? <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div>
            <p className={dc.type.eyebrow}>{pagesContent.auth.signup.badge}</p>
            <h2 className={`mt-4 max-w-xl ${dc.type.heroTitle}`}>{pagesContent.auth.signup.title}</h2>
            <p className={`mt-5 max-w-lg text-base leading-7 ${palette.mutedText}`}>{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
