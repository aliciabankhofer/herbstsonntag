// The backdrop: autumn leaves floating down, plus a comic-style squirrel,
// pumpkin and mug of hot chocolate in the bottom corners. Where things sit,
// and which corner gets what, is picked anew each time the mod loads.
const INK = '#3b2416'; // comic outline colour
const LEAF_COLOURS = [
    ['#c8642c', '#8a3c17'],
    ['#d99a2b', '#97651a'],
    ['#9e3d22', '#5e2312'],
    ['#e0b04a', '#9c7525'],
    ['#b5562a', '#6e3215'],
    ['#d4782f', '#8f4b1a'],
    ['#8c5a2b', '#55361a'],
    ['#a8703a', '#664321'],
    ['#c94a2c', '#7d2a17'],
];
// Three leaf shapes, each drawn round 0,0 in a box about 30 across.
const LEAF_SHAPES = [
    // maple
    'M0 -15 L3 -7 L9 -10 L7 -3 L14 -2 L8 3 L11 8 L3 6 L1 11 L0 15 L-1 11 L-3 6 L-11 8 L-8 3 L-14 -2 L-7 -3 L-9 -10 L-3 -7 Z',
    // beech, an oval with a point
    'M0 -15 C9 -10 11 2 0 15 C-11 2 -9 -10 0 -15 Z',
    // oak, wavy edges
    'M0 -15 C4 -14 3 -10 6 -9 C10 -8 6 -4 9 -2 C12 0 7 3 8 6 C9 10 3 9 2 13 L0 15 L-2 13 C-3 9 -9 10 -8 6 C-7 3 -12 0 -9 -2 C-6 -4 -10 -8 -6 -9 C-3 -10 -4 -14 0 -15 Z',
];
const VEIN = 'M0 -11 L0 13';
const rand = (min, max) => min + Math.random() * (max - min);
const round = (n) => Math.round(n * 10) / 10;
function makeLeaves(count) {
    const leaves = [];
    for (let i = 0; i < count; i++) {
        // Most leaves at the sides; a few faint ones cross the middle.
        const isFar = i % 5 === 4;
        const x = isFar ? rand(36, 64) : Math.random() < 0.5 ? rand(2, 30) : rand(70, 97);
        const colour = LEAF_COLOURS[Math.floor(Math.random() * LEAF_COLOURS.length)] ?? LEAF_COLOURS[0];
        const fall = rand(70, 150); // seconds from top to bottom: slow
        leaves.push({
            x: round(x),
            y: round(rand(0, 95)),
            size: round(isFar ? rand(0.7, 1.1) : rand(1, 2.6)),
            shape: LEAF_SHAPES[i % LEAF_SHAPES.length] ?? LEAF_SHAPES[0],
            fill: colour[0],
            edge: colour[1],
            fall: round(fall),
            delay: round(-rand(0, fall)),
            sway: round(rand(7, 13)),
            flutter: round(rand(5, 9)),
            isFar,
        });
    }
    return leaves;
}
function leafMarkup(leaf, i) {
    // Placed by percent of the window and sized in points, so leaves keep their
    // shape and spread on a wide desktop and a tall phone alike. Each rests at
    // its own height (a still scene looks finished) and falls from above the top
    // to below the bottom around that point.
    return `<svg x="${leaf.x}%" y="${leaf.y}%" overflow="visible"><g class="fall" style="animation:f${i} ${leaf.fall}s linear ${leaf.delay}s infinite"><g class="sway" style="animation-duration:${leaf.sway}s;animation-delay:${round(-leaf.sway * Math.random())}s"><g transform="scale(${leaf.size})"><g class="flutter${leaf.isFar ? ' far' : ''}" style="animation-duration:${leaf.flutter}s"><path d="${leaf.shape}" fill="${leaf.fill}" stroke="${leaf.edge}" stroke-width="1.6" stroke-linejoin="round"/><path d="${VEIN}" stroke="${leaf.edge}" stroke-width="1.2" fill="none" stroke-linecap="round"/></g></g></g></g></svg>`;
}
function leafKeyframes(leaf, i) {
    return `@keyframes f${i} { from { transform: translateY(${round(-leaf.y - 12)}%); } to { transform: translateY(${round(112 - leaf.y)}%); } }`;
}
// --- comic pieces, drawn facing right in a 500 x 500 box, set in the bottom half of a 1000 x 1000 corner layer -------------
const SQUIRREL = `
<g class="squirrel">
  <g class="tail">
    <path d="M70 470 C10 460 -5 380 30 330 C55 295 105 300 110 340 C113 365 85 372 78 355 C70 335 50 350 55 380 C62 420 95 440 110 460 Z" fill="#b8642b" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M45 350 C40 380 55 410 80 430" fill="none" stroke="#e39a5a" stroke-width="7" stroke-linecap="round"/>
  </g>
  <ellipse cx="125" cy="445" rx="45" ry="55" fill="#c9743a" stroke="${INK}" stroke-width="6"/>
  <ellipse cx="135" cy="455" rx="24" ry="34" fill="#f2d3a8" stroke="${INK}" stroke-width="4"/>
  <path d="M120 360 L112 330 L135 350 Z" fill="#c9743a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M150 358 L156 328 L168 356 Z" fill="#c9743a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="145" cy="385" r="34" fill="#c9743a" stroke="${INK}" stroke-width="6"/>
  <ellipse cx="170" cy="396" rx="15" ry="11" fill="#f2d3a8" stroke="${INK}" stroke-width="4"/>
  <circle cx="183" cy="392" r="5" fill="${INK}"/>
  <g class="blink">
    <ellipse cx="155" cy="376" rx="10" ry="12" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <circle cx="158" cy="378" r="5" fill="${INK}"/>
    <circle cx="160" cy="375" r="1.8" fill="#fff"/>
  </g>
  <ellipse cx="138" cy="398" rx="7" ry="4" fill="#e88a7a" opacity="0.7"/>
  <g transform="translate(168 432) rotate(15)">
    <ellipse cx="0" cy="8" rx="12" ry="15" fill="#b07a3a" stroke="${INK}" stroke-width="4"/>
    <path d="M-15 -2 C-15 -14 15 -14 15 -2 Z" fill="#6e4520" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M0 -10 L2 -18" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M-5 4 C-6 10 -4 15 -1 18" stroke="#e0b07a" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <ellipse cx="155" cy="438" rx="10" ry="8" fill="#c9743a" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="180" cy="440" rx="10" ry="8" fill="#c9743a" stroke="${INK}" stroke-width="4"/>
  <path d="M112 300 L104 286 M128 296 L128 280 M144 300 L152 286" class="pop" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
</g>`;
const PUMPKIN = `
<g class="pumpkin">
  <ellipse cx="0" cy="62" rx="70" ry="9" fill="${INK}" opacity="0.18"/>
  <ellipse cx="-30" cy="20" rx="34" ry="42" fill="#d9661e" stroke="${INK}" stroke-width="6"/>
  <ellipse cx="30" cy="20" rx="34" ry="42" fill="#d9661e" stroke="${INK}" stroke-width="6"/>
  <ellipse cx="0" cy="20" rx="30" ry="46" fill="#ec7f2a" stroke="${INK}" stroke-width="6"/>
  <path d="M-42 -2 C-48 10 -48 28 -42 40" stroke="#fbb36a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-8 -6 C-12 8 -12 30 -8 46" stroke="#fbb36a" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
  <path d="M-4 -24 C-6 -36 0 -46 10 -50 L14 -42 C8 -40 6 -32 8 -24 Z" fill="#6b8a3a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M8 -36 C24 -48 40 -40 34 -28 C30 -20 20 -26 26 -32" fill="none" stroke="#6b8a3a" stroke-width="4" stroke-linecap="round"/>
  <path d="M-14 -30 C-34 -50 -58 -36 -48 -24 C-40 -16 -24 -22 -14 -30 Z" fill="#8aa84a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
</g>`;
const COCOA = `
<g class="cocoa">
  <g class="steam">
    <path class="s1" d="M60 330 C45 310 75 295 60 270 C48 252 70 240 62 222" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <path class="s2" d="M92 325 C80 302 106 290 94 262 C86 245 102 232 96 215" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <path class="s3" d="M122 332 C110 312 134 298 124 274" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  </g>
  <ellipse cx="95" cy="488" rx="80" ry="10" fill="${INK}" opacity="0.18"/>
  <path d="M160 385 C205 380 210 450 158 452" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
  <path d="M160 385 C205 380 210 450 158 452" fill="none" stroke="#b8322a" stroke-width="10" stroke-linecap="round"/>
  <path d="M25 352 L35 470 C37 484 50 490 95 490 C140 490 153 484 155 470 L165 352 Z" fill="#c23b30" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="60" cy="400" r="7" fill="#f6e3c4"/><circle cx="100" cy="425" r="7" fill="#f6e3c4"/><circle cx="135" cy="395" r="7" fill="#f6e3c4"/>
  <circle cx="72" cy="455" r="7" fill="#f6e3c4"/><circle cx="125" cy="460" r="7" fill="#f6e3c4"/>
  <path d="M42 372 L50 462" stroke="#ec6b5d" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="95" cy="352" rx="70" ry="16" fill="#6b3a1f" stroke="${INK}" stroke-width="6"/>
  <path d="M40 350 C50 320 70 318 80 334 C86 306 118 304 122 330 C134 316 156 326 150 350 C120 362 70 362 40 350 Z" fill="#fffaf0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="58" y="326" width="18" height="16" rx="4" fill="#f7c6cf" stroke="${INK}" stroke-width="4" transform="rotate(-12 67 334)"/>
  <rect x="112" y="322" width="17" height="15" rx="4" fill="#fff" stroke="${INK}" stroke-width="4" transform="rotate(10 120 330)"/>
  <path d="M86 326 C90 320 98 320 100 326" fill="none" stroke="#8a4a26" stroke-width="5" stroke-linecap="round"/>
</g>`;
export function makeScene() {
    const leaves = makeLeaves(22);
    const squirrelLeft = Math.random() < 0.5;
    const pumpkinWithSquirrel = Math.random() < 0.5;
    const pumpkinX = round(rand(250, 320));
    const pumpkinScale = round(rand(0.8, 1.05));
    const squirrelDelay = round(-rand(0, 55));
    // A corner layer: pinned to the bottom-left or bottom-right of any window,
    // its art drawn facing right and mirrored on the right-hand side.
    const corner = (isLeft, art) => `<svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="${isLeft ? 'xMinYMax' : 'xMaxYMax'} meet" overflow="hidden"><g class="comic" transform="${isLeft ? 'translate(0 500)' : 'translate(1000 500) scale(-1 1)'}">${art}</g></svg>`;
    const pumpkin = `<g transform="translate(${pumpkinX} 430) scale(${pumpkinScale})">${PUMPKIN}</g>`;
    const squirrelSide = `<g style="animation-delay:${squirrelDelay}s" class="peek">${SQUIRREL}</g>${pumpkinWithSquirrel ? pumpkin : ''}`;
    const cocoaSide = `<g transform="translate(10 0)">${COCOA}</g>${pumpkinWithSquirrel ? '' : pumpkin}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<style>
.sky { fill: #efe3cf; }
.hill { fill: #e2cfb2; }
.hill2 { fill: #d8c09d; }
.far { opacity: 0.45; }
.comic { opacity: 1; }
.fall { transform-box: view-box; }
.sway { animation: sway 10s ease-in-out infinite; }
.flutter { animation: flutter 7s ease-in-out infinite alternate; }
@keyframes sway { 0%, 100% { transform: translateX(-24px); } 50% { transform: translateX(24px); } }
@keyframes flutter { from { transform: rotate(-30deg); } to { transform: rotate(40deg); } }
${leaves.map(leafKeyframes).join('\n')}
.peek { animation: peek 60s ease-in-out infinite; }
@keyframes peek { 0%, 62% { transform: translateY(260px); } 68%, 90% { transform: translateY(0); } 96%, 100% { transform: translateY(260px); } }
.tail { animation: tail 3s ease-in-out infinite alternate; transform-origin: 80px 460px; }
@keyframes tail { from { transform: rotate(-4deg); } to { transform: rotate(5deg); } }
.blink { animation: blink 7s infinite; transform-origin: 155px 376px; }
@keyframes blink { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.1); } }
.pop { opacity: 0; animation: pop 60s infinite; animation-delay: inherit; }
@keyframes pop { 0%, 67% { opacity: 0; } 69%, 72% { opacity: 1; } 75%, 100% { opacity: 0; } }
.steam path { opacity: 0.6; animation: steam 7s ease-in-out infinite; }
.steam .s2 { animation-delay: -2.3s; }
.steam .s3 { animation-delay: -4.6s; }
@keyframes steam { 0% { opacity: 0; transform: translateY(20px); } 40% { opacity: 0.75; } 100% { opacity: 0; transform: translateY(-30px); } }
@media (prefers-color-scheme: dark) {
  .sky { fill: #1e1611; }
  .hill { fill: #2a1f17; }
  .hill2 { fill: #33261c; }
  .far { opacity: 0.25; }
  .comic { opacity: 0.85; }
  .steam path { stroke: #e8dccb; }
}
</style>
<rect class="sky" width="100%" height="100%"/>
${leaves.map(leafMarkup).join('\n')}
<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
<path class="hill2" d="M0 90 Q20 84 45 89 T100 87 V100 H0 Z"/>
<path class="hill" d="M0 94 Q30 89 55 93 T100 92 V100 H0 Z"/>
</svg>
${corner(squirrelLeft, squirrelSide)}
${corner(!squirrelLeft, cocoaSide)}
</svg>`;
}
