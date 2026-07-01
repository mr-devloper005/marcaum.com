import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif"
const BODY_FONT = "'Manrope', 'Segoe UI', sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f7f3ee',
  surface: '#fffdfa',
  raised: '#f0e7df',
  text: '#0f0e0e',
  muted: '#635b58',
  line: 'rgba(15,14,14,0.12)',
  accent: '#541212',
  accentSoft: 'rgba(84,18,18,0.08)',
  onAccent: '#f7f3ee',
  glow: 'rgba(70,138,154,0.12)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Long-form reads arranged with a polished editorial rhythm.' },
  listing: { ...base, kicker: 'Directory', note: 'Business listings presented with clarity, trust cues, and quick action paths.' },
  classified: { ...base, kicker: 'Market', note: 'Offers and notices framed like premium marketplace notices.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual posts displayed with richer contrast and spacious image-led composition.' },
  sbm: { ...base, kicker: 'Resources', note: 'Useful links curated in a refined discovery layout.' },
  pdf: { ...base, kicker: 'Library', note: 'Downloadable documents surfaced as elegant reference materials.' },
  profile: { ...base, kicker: 'People', note: 'Profiles shown with a polished identity-first presentation.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': '#468a9a',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
