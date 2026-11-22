// The backdrop, in a flat graphic style: leaves floating down, and in the
// bottom corners a squirrel and a pumpkin. No
// outlines: form comes from flat planes of a lighter and a darker tone.
// Where things sit, and which corner gets what, is picked anew each load.

// Muted autumn tones, each as [light side, shaded side].
const LEAF_COLOURS = [
  ['#c4693d', '#a4532e'], // terracotta
  ['#d3a24c', '#b5853a'], // ochre
  ['#9c4b2e', '#7f3a23'], // rust
  ['#c98a3e', '#a96f2f'], // amber
  ['#8b8748', '#706d38'], // olive
  ['#b65a36', '#94472a'], // burnt sienna
  ['#7c4a38', '#633a2c'], // umber
  ['#d9b46a', '#bc9752'], // straw
  ['#a8643a', '#8a502e'], // cinnamon
] as const

// Three leaf shapes, each drawn round 0,0 in a box about 30 across, stem down.
const LEAF_SHAPES = [
  // maple
  'M0 -15 L3.5 -7.5 L9.5 -10 L7.5 -3 L14 -1.5 L8.5 3 L10.5 8 L3 6.5 L0.8 11 L0 11.5 L-0.8 11 L-3 6.5 L-10.5 8 L-8.5 3 L-14 -1.5 L-7.5 -3 L-9.5 -10 L-3.5 -7.5 Z',
  // beech: a pointed oval
  'M0 -15 C8.5 -9 10 2 0 12 C-10 2 -8.5 -9 0 -15 Z',
  // oak: soft lobes
  'M0 -15 C4.5 -14 3 -10 6.5 -9 C10.5 -8 6.5 -4 9.5 -2 C12.5 0 7.5 3 8.5 6 C9 9.5 3.5 9 1.5 12 L0 12 L-1.5 12 C-3.5 9 -9 9.5 -8.5 6 C-7.5 3 -12.5 0 -9.5 -2 C-6.5 -4 -10.5 -8 -6.5 -9 C-3 -10 -4.5 -14 0 -15 Z',
] as const

const STEM = 'M0 10 C0.5 13 0.2 15 -0.8 17.5'

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const round = (n: number) => Math.round(n * 10) / 10

type Leaf = { x: number; y: number; size: number; shape: string; light: string; shade: string; fall: number; delay: number; sway: number; flutter: number; isFar: boolean }

function makeLeaves(count: number): Leaf[] {
  const leaves: Leaf[] = []
  for (let i = 0; i < count; i++) {
    // Most leaves at the sides; a few faint ones cross the middle.
    const isFar = i % 5 === 4
    const x = isFar ? rand(36, 64) : Math.random() < 0.5 ? rand(2, 30) : rand(70, 97)
    const colour = LEAF_COLOURS[Math.floor(Math.random() * LEAF_COLOURS.length)] ?? LEAF_COLOURS[0]
    const fall = rand(70, 150) // seconds from top to bottom: slow
    leaves.push({
      x: round(x),
      y: round(rand(0, 95)),
      size: round(isFar ? rand(0.7, 1.1) : rand(1, 2.6)),
      shape: LEAF_SHAPES[i % LEAF_SHAPES.length] ?? LEAF_SHAPES[0],
      light: colour[0],
      shade: colour[1],
      fall: round(fall),
      delay: round(-rand(0, fall)),
      sway: round(rand(7, 13)),
      flutter: round(rand(5, 9)),
      isFar,
    })
  }
  return leaves
}

function leafMarkup(leaf: Leaf, i: number): string {
  // Placed by percent of the window and sized in points, so leaves keep their
  // shape and spread on a wide desktop and a tall phone alike. Each rests at
  // its own height (a still scene looks finished) and falls from above the top
  // to below the bottom around that point. Two tones split at the midrib.
  return `<svg x="${leaf.x}%" y="${leaf.y}%" overflow="visible"><g class="fall" style="animation:f${i} ${leaf.fall}s linear ${leaf.delay}s infinite"><g class="sway" style="animation-duration:${leaf.sway}s;animation-delay:${round(-leaf.sway * Math.random())}s"><g transform="scale(${leaf.size})"><g class="flutter${leaf.isFar ? ' far' : ''}" style="animation-duration:${leaf.flutter}s"><path d="${STEM}" stroke="${leaf.shade}" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="${leaf.shape}" fill="${leaf.light}"/><path d="${leaf.shape}" fill="${leaf.shade}" clip-path="url(#half)"/></g></g></g></g></svg>`
}

function leafKeyframes(leaf: Leaf, i: number): string {
  return `@keyframes f${i} { from { transform: translateY(${round(-leaf.y - 12)}%); } to { transform: translateY(${round(112 - leaf.y)}%); } }`
}

// --- corner pieces, drawn facing right in a 500 x 500 box, set in the bottom
// half of a 1000 x 1000 corner layer; the ground line is y 490 ---------------

const SQUIRREL = `
<g class="squirrel">
  <ellipse cx="128" cy="490" rx="70" ry="6" fill="#5a3a26" opacity="0.14"/>
  <g class="tail">
    <path d="M112 486 C52 486 22 440 26 386 C30 334 70 300 116 304 C154 308 168 344 146 364 C130 378 106 368 110 350 C88 358 78 388 86 418 C94 448 116 466 140 476 Z" fill="#a9552e"/>
    <path d="M110 350 C88 358 78 388 86 418 C94 448 116 466 140 476 L112 486 C70 470 58 430 64 396 C70 366 90 352 110 350 Z" fill="#8f4626"/>
    <path d="M58 338 C78 316 108 312 128 326" fill="none" stroke="#c97b4c" stroke-width="7" stroke-linecap="round" opacity="0.8"/>
  </g>
  <path d="M126 488 C98 488 94 446 104 414 C112 388 132 374 154 376 C178 378 188 404 186 436 C184 468 170 488 146 488 Z" fill="#b7623a"/>
  <path d="M168 404 C182 424 182 462 162 488 L148 488 C162 462 164 430 156 408 Z" fill="#e3c39c"/>
  <path d="M112 486 C104 456 116 434 140 436 C156 438 162 460 156 488 L118 488 Z" fill="#9d4f2c"/>
  <path d="M146 488 C150 480 166 478 176 488 Z" fill="#9d4f2c"/>
  <path d="M140 382 C133 352 150 330 177 330 C199 330 215 345 219 359 C214 371 198 377 181 379 C164 381 150 386 140 382 Z" fill="#b7623a"/>
  <path d="M150 380 C162 378 176 376 190 376 C182 384 166 386 150 384 Z" fill="#e3c39c"/>
  <circle cx="218" cy="358" r="3.5" fill="#5a3324"/>
  <path d="M152 344 L152 310 L172 336 Z" fill="#9d4f2c"/>
  <circle cx="186" cy="350" r="4.5" fill="#2e2018"/>
  <path d="M174 420 C182 414 192 416 194 424 C190 430 180 430 174 426 Z" fill="#9d4f2c"/>
</g>`

const PUMPKIN = `
<g class="pumpkin">
  <ellipse cx="0" cy="60" rx="78" ry="7" fill="#5a3a26" opacity="0.14"/>
  <ellipse cx="-34" cy="20" rx="38" ry="40" fill="#c6652f"/>
  <ellipse cx="34" cy="20" rx="38" ry="40" fill="#b0562a"/>
  <ellipse cx="-12" cy="20" rx="26" ry="44" fill="#d9773a"/>
  <ellipse cx="14" cy="20" rx="26" ry="44" fill="#c6652f"/>
  <path d="M-30 -10 C-40 4 -40 34 -30 48" stroke="#e8955a" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M-4 -22 C-6 -34 -1 -44 9 -48 L13 -41 C7 -38 5 -31 7 -22 Z" fill="#5f5a34"/>
  <path d="M-12 -26 C-30 -46 -56 -36 -48 -22 C-40 -12 -24 -18 -12 -26 Z" fill="#7d7c45"/>
  <path d="M-12 -26 C-24 -30 -36 -30 -48 -22 C-40 -12 -24 -18 -12 -26 Z" fill="#686838"/>
</g>`

export function makeScene(): string {
  const leaves = makeLeaves(22)
  const squirrelLeft = Math.random() < 0.5
  const pumpkinWithSquirrel = Math.random() < 0.5
  const pumpkinX = round(pumpkinWithSquirrel ? rand(260, 330) : rand(90, 160))
  const pumpkinScale = round(rand(0.8, 1.05))
  const squirrelDelay = round(-rand(0, 55))

  // A corner layer: pinned to the bottom-left or bottom-right of any window,
  // its art drawn facing right and mirrored on the right-hand side.
  const corner = (isLeft: boolean, art: string) =>
    `<svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="${isLeft ? 'xMinYMax' : 'xMaxYMax'} meet" overflow="hidden"><g class="art" transform="${isLeft ? 'translate(0 500)' : 'translate(1000 500) scale(-1 1)'}">${art}</g></svg>`

  const pumpkin = `<g transform="translate(${pumpkinX} 430) scale(${pumpkinScale})">${PUMPKIN}</g>`
  const squirrelSide = `<g style="animation-delay:${squirrelDelay}s" class="peek">${SQUIRREL}</g>${pumpkinWithSquirrel ? pumpkin : ''}`
  const otherSide = pumpkinWithSquirrel ? '' : pumpkin

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs><clipPath id="half" clipPathUnits="objectBoundingBox"><rect x="0.5" y="0" width="0.5" height="1"/></clipPath></defs>
<style>
.sky { fill: #efe3cf; }
.hill { fill: #e0ccad; }
.hill2 { fill: #d6bf9c; }
.hill3 { fill: #cdb48f; }
.far { opacity: 0.4; }
.art { opacity: 1; }
.fall { transform-box: view-box; }
.sway { animation: sway 10s ease-in-out infinite; }
.flutter { animation: flutter 7s ease-in-out infinite alternate; }
@keyframes sway { 0%, 100% { transform: translateX(-24px); } 50% { transform: translateX(24px); } }
@keyframes flutter { from { transform: rotate(-30deg); } to { transform: rotate(40deg); } }
${leaves.map(leafKeyframes).join('\n')}
.peek { animation: peek 60s ease-in-out infinite; }
@keyframes peek { 0%, 60% { transform: translateY(260px); } 70%, 90% { transform: translateY(0); } 98%, 100% { transform: translateY(260px); } }
.tail { animation: tail 4s ease-in-out infinite alternate; transform-origin: 112px 486px; }
@keyframes tail { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }
@media (prefers-color-scheme: dark) {
  .sky { fill: #1e1611; }
  .hill { fill: #2a1f17; }
  .hill2 { fill: #32251b; }
  .hill3 { fill: #3a2b20; }
  .far { opacity: 0.25; }
  .art { opacity: 0.82; }
}
</style>
<rect class="sky" width="100%" height="100%"/>
${leaves.map(leafMarkup).join('\n')}
<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
<path class="hill3" d="M0 87 Q18 82 40 86 T80 84 T100 85 V100 H0 Z"/>
<path class="hill2" d="M0 90 Q22 86 48 90 T100 88 V100 H0 Z"/>
<path class="hill" d="M0 94 Q30 90 56 93 T100 92 V100 H0 Z"/>
</svg>
${corner(squirrelLeft, squirrelSide)}
${otherSide ? corner(!squirrelLeft, otherSide) : ''}
</svg>`
}
