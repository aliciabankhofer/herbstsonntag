import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Oat-and-pumpkin by day, chestnut and lamplight by night.
const { theme, problems } = makeColors({
  label: 'Herbstsonntag',
  roles: { accent: '#b5562a', danger: '#a8322b', success: '#5d7a35', warning: '#c08a1e', pro: '#7a4a6e' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#efe3cf',
        'surface-1': '#f4eadb',
        'surface-2': '#f9f2e6',
        'text-primary': '#2e2118',
        'text-secondary': '#553f30',
        'text-muted': '#6b5443',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1e1611',
        'surface-1': '#271d16',
        'surface-2': '#30241b',
        'surface-3': '#382a20',
        'text-primary': '#f3e6d6',
        'text-secondary': '#d6c2ab',
        'text-muted': '#b29c85',
      },
    },
  },
})

// A few leaves drifting down the edges, slowly; the middle stays clear for words.
const LEAF = 'M0 -14 C8 -10 10 -2 0 14 C-10 -2 -8 -10 0 -14 Z'
const leaves = [
  { x: 6, c: '#c8642c', d: 38, delay: 0, s: 1.1 },
  { x: 14, c: '#d99a2b', d: 46, delay: -12, s: 0.8 },
  { x: 22, c: '#9e3d22', d: 52, delay: -30, s: 1.0 },
  { x: 78, c: '#d4782f', d: 42, delay: -6, s: 0.9 },
  { x: 86, c: '#b5562a', d: 50, delay: -22, s: 1.2 },
  { x: 94, c: '#e0b04a', d: 44, delay: -35, s: 0.75 },
]
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
<style>
.sky { fill: #efe3cf; }
.hill { fill: #e2cfb2; }
.leaf { opacity: 0.55; }
@keyframes fall { from { transform: translateY(-10px) rotate(0deg); } to { transform: translateY(110px) rotate(320deg); } }
@keyframes sway { 0%, 100% { transform: translateX(-2px); } 50% { transform: translateX(2px); } }
.drift { animation: sway 9s ease-in-out infinite; }
.spin { animation: fall linear infinite; transform-box: fill-box; transform-origin: center; }
@media (prefers-color-scheme: dark) {
  .sky { fill: #1e1611; }
  .hill { fill: #2a1f17; }
  .leaf { opacity: 0.35; }
}
</style>
<rect class="sky" width="100" height="100"/>
<path class="hill" d="M0 88 Q25 80 50 86 T100 84 V100 H0 Z"/>
${leaves
  .map(
    (l, i) =>
      `<g class="drift" style="animation-delay:${-i * 1.5}s"><g transform="translate(${l.x} ${10 + i * 13})"><g class="spin" style="animation-duration:${l.d}s;animation-delay:${l.delay}s"><path class="leaf" fill="${l.c}" transform="scale(${l.s * 0.25})" d="${LEAF}"/></g></g></g>`,
  )
  .join('\n')}
</svg>`

const BASE: ThemeSetArgs = { colors: theme, backdrop: { scene: 'leaves' } }

// Fireside: low brown-noise room tone, soft crackle, a far-off wind swell.
const SOUND: ThemeSetArgs['sound'] = {
  ambience: {
    layers: [
      { wave: 'brown', drone: true, gain: 0.18, filter: { type: 'lowpass', hz: 400 } },
      { wave: 'crackle', scatter: 1.2, gain: 0.12, release: 0.08, filter: { type: 'highpass', hz: 1200 } },
      { wave: 'pink', drone: true, gain: 0.06, filter: { type: 'bandpass', hz: 500, to: 900 }, tremolo: { hz: 0.07, depth: 0.6 } },
    ],
  },
  cues: {
    done: { layers: [{ wave: 'bell', notes: ['G4', 'D5'], step: 0.18, gain: 0.25, release: 1.2 }], reverb: 0.3 },
    send: { layers: [{ wave: 'pink', gain: 0.08, attack: 0.01, release: 0.12, filter: { type: 'lowpass', hz: 900 } }] },
  },
}

const STYLE: ThemeSetArgs['style'] = {
  Text: { fontFamily: ['serif'], fontSize: 16, lineHeight: 25 },
  UserMessage: [
    { backgroundColor: 'bg-user-message', radius: 14, padding: 12, rotate: -0.6 },
    { backgroundColor: 'bg-user-message', radius: 14, padding: 12, rotate: 0.5 },
  ],
  ToolUse: { backgroundColor: 'surface-1', radius: 8, paddingX: 8 },
}

const MOODS = [
  'Sonntag · lowkey',
  'Tee ist fertig ☕',
  'one small thing at a time',
  'Blätter fallen, kein Stress',
  'slow is still progress',
  'Kerze an, Laptop halb zu',
]
const TEA_MINUTES = 50

// /herbst: a tiny Sunday plan, one thing from each list.
const PLAN = {
  de: {
    title: '🍂 Dein Herbstsonntag',
    work: [
      'Fünf Texte korrigieren – nicht mehr.',
      'Die Stunde für Montag grob skizzieren, drei Stichpunkte reichen.',
      'Eine Folie aufräumen, die dich schon lange stört.',
      'Zehn Minuten Mails – dann Laptop zu.',
      'Eine Idee für den nächsten Workshop notieren.',
      'Ein Arbeitsblatt fertig machen, das schon fast fertig ist.',
    ],
    pause: [
      'Tee aufgießen und am Fenster trinken.',
      'Eine Runde um den Block, Blätter rascheln lassen.',
      'Kurz strecken, Schultern locker.',
      'Zwei Seiten in einem Buch lesen, das nichts mit Arbeit zu tun hat.',
    ],
    treat: [
      'Kürbissuppe oder Maroni.',
      'Eine Kerze anzünden.',
      'Lieblingsplaylist, leise.',
      'Decke, Sofa, keine Ausreden.',
      'Ein Stück Apfelstrudel.',
    ],
    labels: ['Ein kleines Ding', 'Pause', 'Belohnung'],
    footer: 'Mehr muss heute nicht. /herbst für einen neuen Plan · /herbst en for English',
  },
  en: {
    title: '🍂 Your autumn Sunday',
    work: [
      'Mark five essays – no more.',
      "Sketch Monday's lesson: three bullet points are enough.",
      "Tidy one slide that's been bugging you.",
      'Ten minutes of email, then close the laptop.',
      'Jot down one idea for your next workshop.',
      "Finish one worksheet that's almost done.",
    ],
    pause: [
      'Make tea and drink it by the window.',
      'Walk round the block and kick some leaves.',
      'Stretch, drop your shoulders.',
      'Read two pages of a book that has nothing to do with work.',
    ],
    treat: [
      'Pumpkin soup or roasted chestnuts.',
      'Light a candle.',
      'Favourite playlist, quietly.',
      'Blanket, sofa, no excuses.',
      'A slice of apple strudel.',
    ],
    labels: ['One small thing', 'Break', 'Treat'],
    footer: "That's enough for today. /herbst for a new plan · /herbst de auf Deutsch",
  },
}
const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.log(unpainted)
    }

    let set
    try {
      set = await $.theme.set({ ...BASE, sound: SOUND, style: STYLE })
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(BASE)
    }

    await $.command.register({
      name: 'herbst',
      description: 'A tiny lowkey autumn Sunday plan (add "en" for English)',
    })

    let i = 0
    const mood = () => `🍂 ${MOODS[i++ % MOODS.length]}`
    $.ui.status(set.isDrawn ? mood() : `🍂 Sonntag · lowkey (${set.reason})`)
    $.clock.every(15 * 60_000, () => $.ui.status(mood()))
    $.clock.every(TEA_MINUTES * 60_000, () =>
      $.ui.toast(`🍵 ${TEA_MINUTES} Minuten geschafft – kurz aufstehen, Tee nachgießen, aus dem Fenster schauen.`, { timeoutMs: 10_000 }),
    )

    return next(e)
  })

  on('command.run', { command: 'herbst' }, ($, e) => {
    const p = PLAN[/^\s*en/i.test(e.args) ? 'en' : 'de']
    const [work, pause, treat] = p.labels
    const text = [
      p.title,
      '',
      `• ${work}: ${pick(p.work)}`,
      `• ${pause}: ${pick(p.pause)}`,
      `• ${treat}: ${pick(p.treat)}`,
      '',
      p.footer,
    ].join('\n')

    return { text, isTextDisplayOnly: true as const }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A few autumn leaves drifting down past a soft hill" />
  })
}
