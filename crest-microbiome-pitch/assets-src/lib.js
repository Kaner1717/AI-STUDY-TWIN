// Shared drawing helpers for the Crest MicroBiome concept art.
const C = {
  navy: '#13294B', navyDeep: '#0B1A33', navyMid: '#1D3A66', navyTop: '#2B4C7E',
  ivory: '#F7F3EA', ivoryLight: '#FCFAF4', ivoryDark: '#E7E0D2',
  teal: '#1E7C7A', tealLight: '#8FD0C8', tealPale: '#CFE6E2',
  sage: '#9DB39A', sageLight: '#DDE6D7', sageDark: '#5F7A5C',
  text: '#3E4C63', muted: '#6B7689',
};
let __uid = 0;
const uid = (p) => p + (__uid++);

// Phyllotaxis cluster: "helpful bacteria in balance" motif.
function dots(cx, cy, R, n, colors, maxDot, opacity = 1) {
  let s = '';
  maxDot = maxDot || R * 0.12;
  for (let i = 1; i <= n; i++) {
    const r = R * Math.sqrt(i / n);
    const a = i * 2.39996323;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    const size = maxDot * (1 - 0.45 * (i / n));
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="${colors[i % colors.length]}" opacity="${opacity}"/>`;
  }
  return s;
}

function shadeGrad(id, strength = 1) {
  const k = (v) => (v * strength).toFixed(3);
  return `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity="${k(0.26)}"/>
    <stop offset="0.10" stop-color="#000" stop-opacity="${k(0.07)}"/>
    <stop offset="0.24" stop-color="#fff" stop-opacity="${k(0.38)}"/>
    <stop offset="0.36" stop-color="#fff" stop-opacity="0"/>
    <stop offset="0.78" stop-color="#000" stop-opacity="${k(0.05)}"/>
    <stop offset="1" stop-color="#000" stop-opacity="${k(0.30)}"/>
  </linearGradient>`;
}

const TUBE_BODY = 'M28,56 L372,56 C371,320 357,580 340,705 C334,750 314,772 284,780 L116,780 C86,772 66,750 60,705 C43,580 29,320 28,56 Z';

// Standing tube (on its cap) in a 400 x 900 box.
function tube({ x = 0, y = 0, s = 1, rot = 0 } = {}) {
  const id = uid('tb');
  let ridges = '';
  for (let rx = 34; rx <= 366; rx += 8) ridges += `<line x1="${rx}" y1="12" x2="${rx}" y2="54" stroke="#000" stroke-opacity="0.08" stroke-width="2"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${rot} 200 450)">
  <defs>
    ${shadeGrad(id + 's')}
    <clipPath id="${id}k"><path d="${TUBE_BODY}"/></clipPath>
    <clipPath id="${id}cap"><path d="M110,788 L290,788 L286,880 Q285,894 270,894 L130,894 Q115,894 114,880 Z"/></clipPath>
  </defs>
  <rect x="124" y="770" width="152" height="22" fill="#CFC8BA"/>
  <path d="M110,788 L290,788 L286,880 Q285,894 270,894 L130,894 Q115,894 114,880 Z" fill="${C.navy}"/>
  <g clip-path="url(#${id}cap)"><rect x="100" y="780" width="200" height="120" fill="url(#${id}s)"/>
    <line x1="100" y1="814" x2="300" y2="814" stroke="#fff" stroke-opacity="0.18" stroke-width="2"/></g>
  <path d="${TUBE_BODY}" fill="${C.ivoryLight}"/>
  <g clip-path="url(#${id}k)">
    <rect x="0" y="470" width="400" height="330" fill="${C.navy}"/>
    <rect x="0" y="460" width="400" height="10" fill="${C.teal}"/>
    <text x="200" y="150" text-anchor="middle" font-family="DM Sans" font-weight="800" font-size="66" letter-spacing="-1.5" fill="${C.navy}">Crest</text>
    <rect x="172" y="172" width="56" height="3" fill="${C.teal}"/>
    <text x="200" y="252" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="600" font-size="72" fill="${C.navy}">MicroBiome</text>
    ${dots(200, 345, 60, 30, [C.teal, C.sage, C.tealLight, C.navyMid, C.sageDark], 8.5)}
    <text x="200" y="440" text-anchor="middle" font-family="DM Sans" font-weight="600" font-size="17" letter-spacing="4" fill="${C.teal}">ORALBIO COMPLEX</text>
    <text x="200" y="530" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="27" fill="${C.ivory}">Cavity protection.</text>
    <text x="200" y="564" text-anchor="middle" font-family="DM Sans" font-weight="600" font-size="20" fill="${C.tealLight}">Care for helpful bacteria.</text>
    <text x="200" y="652" text-anchor="middle" font-family="DM Sans" font-weight="500" font-size="15" letter-spacing="3" fill="${C.ivory}" fill-opacity="0.75">FLUORIDE TOOTHPASTE</text>
    <text x="200" y="690" text-anchor="middle" font-family="DM Sans" font-weight="500" font-size="17" fill="${C.ivory}" fill-opacity="0.7">90 mL</text>
    <rect x="0" y="0" width="400" height="800" fill="url(#${id}s)"/>
  </g>
  <path d="M26,6 L374,6 L374,62 L26,62 Z" fill="#E4DED1"/>
  ${ridges}
  <path d="M26,6 L374,6 L374,62 L26,62 Z" fill="url(#${id}s)"/>
</g>`;
}

// Carton in a 420 x 920 box (front 320 wide, side depth 80).
function carton({ x = 0, y = 0, s = 1 } = {}) {
  const id = uid('cn');
  return `<g transform="translate(${x},${y}) scale(${s})">
  <defs>
    <linearGradient id="${id}f" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.10"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.02"/><stop offset="1" stop-color="#000" stop-opacity="0.10"/></linearGradient>
  </defs>
  <polygon points="0,50 320,50 400,14 80,14" fill="${C.navyTop}"/>
  <polygon points="320,50 400,14 400,884 320,920" fill="#0C1C38"/>
  <polygon points="320,780 400,744 400,884 320,920" fill="#CFC7B7"/>
  <rect x="0" y="50" width="320" height="870" fill="${C.navy}"/>
  <rect x="0" y="780" width="320" height="140" fill="${C.ivory}"/>
  <rect x="0" y="772" width="320" height="8" fill="${C.teal}"/>
  <text x="160" y="140" text-anchor="middle" font-family="DM Sans" font-weight="800" font-size="60" letter-spacing="-1.5" fill="${C.ivory}">Crest</text>
  <rect x="135" y="160" width="50" height="3" fill="${C.tealLight}"/>
  <text x="160" y="232" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="600" font-size="64" fill="${C.ivory}">MicroBiome</text>
  ${dots(160, 385, 100, 40, [C.tealLight, C.sage, C.teal, C.ivory, C.sageLight], 13)}
  <text x="160" y="540" text-anchor="middle" font-family="DM Sans" font-weight="600" font-size="16" letter-spacing="4" fill="${C.tealLight}">ORALBIO COMPLEX</text>
  <text x="160" y="606" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="25" fill="${C.ivory}">Cavity protection.</text>
  <text x="160" y="640" text-anchor="middle" font-family="DM Sans" font-weight="600" font-size="19" fill="${C.tealLight}">Care for helpful bacteria.</text>
  <text x="160" y="838" text-anchor="middle" font-family="DM Sans" font-weight="600" font-size="15" letter-spacing="3" fill="${C.navy}">FLUORIDE TOOTHPASTE</text>
  <text x="160" y="872" text-anchor="middle" font-family="DM Sans" font-weight="500" font-size="16" fill="${C.navy}" fill-opacity="0.7">90 mL</text>
  <text transform="translate(366,420) rotate(-90)" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="600" font-size="40" fill="${C.ivory}" fill-opacity="0.55">Crest MicroBiome</text>
  <rect x="0" y="50" width="320" height="870" fill="url(#${id}f)"/>
</g>`;
}

// Decorative pseudo-QR (concept placeholder, encodes nothing).
function qr(x, y, size, fg = C.navy, bg = '#FFFFFF', seed = 7) {
  const n = 25, m = size / n;
  let r = seed;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  let s = `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${bg}"/>`;
  const finder = (fx, fy) => `<rect x="${x + fx * m}" y="${y + fy * m}" width="${7 * m}" height="${7 * m}" fill="${fg}"/>
    <rect x="${x + (fx + 1) * m}" y="${y + (fy + 1) * m}" width="${5 * m}" height="${5 * m}" fill="${bg}"/>
    <rect x="${x + (fx + 2) * m}" y="${y + (fy + 2) * m}" width="${3 * m}" height="${3 * m}" fill="${fg}"/>`;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const inF = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
    if (!inF && rnd() > 0.52) s += `<rect x="${(x + i * m).toFixed(2)}" y="${(y + j * m).toFixed(2)}" width="${m.toFixed(2)}" height="${m.toFixed(2)}" fill="${fg}"/>`;
  }
  return s + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7);
}

function toothbrush(x, y, s = 1, rot = 0, color = C.teal) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
    <rect x="-9" y="0" width="18" height="300" rx="9" fill="${color}"/>
    <rect x="-6" y="40" width="12" height="70" rx="6" fill="#fff" fill-opacity="0.35"/>
    <rect x="-11" y="-70" width="22" height="78" rx="6" fill="${C.ivoryLight}" stroke="#D9D2C3" stroke-width="2"/>
    ${[...Array(6)].map((_, i) => `<rect x="-14" y="${-66 + i * 12}" width="10" height="8" rx="3" fill="${C.tealPale}"/>`).join('')}
  </g>`;
}

function cup(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M0,0 L120,0 L108,170 Q106,186 90,186 L30,186 Q14,186 12,170 Z" fill="${C.sageLight}" stroke="#C3CFBC" stroke-width="3"/>
    <path d="M14,20 L106,20" stroke="#fff" stroke-opacity="0.6" stroke-width="3"/>
  </g>`;
}

function plant(x, y, s = 1) {
  const leaf = (rx, ry, rot, col) => `<ellipse cx="0" cy="${-ry}" rx="${rx}" ry="${ry}" fill="${col}" transform="rotate(${rot})"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <g transform="translate(60,0)">
      ${leaf(18, 70, -38, C.sageDark)}${leaf(16, 80, -12, C.sage)}${leaf(17, 76, 14, C.sageDark)}${leaf(15, 62, 40, C.sage)}${leaf(12, 50, -62, C.sage)}
    </g>
    <path d="M10,0 L110,0 L100,110 Q98,120 88,120 L32,120 Q22,120 20,110 Z" fill="#E9DFCF"/>
    <rect x="4" y="-6" width="112" height="16" rx="4" fill="#DCCFBA"/>
  </g>`;
}

function phoneFaceDown(x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
    <rect x="4" y="10" width="200" height="400" rx="34" fill="#000" fill-opacity="0.12"/>
    <rect x="0" y="0" width="200" height="400" rx="34" fill="#1A2236"/>
    <rect x="18" y="18" width="84" height="96" rx="22" fill="#283149"/>
    <circle cx="44" cy="46" r="15" fill="#11182A"/><circle cx="76" cy="46" r="15" fill="#11182A"/><circle cx="44" cy="86" r="15" fill="#11182A"/>
    <circle cx="44" cy="46" r="6" fill="#33405E"/><circle cx="76" cy="46" r="6" fill="#33405E"/><circle cx="44" cy="86" r="6" fill="#33405E"/>
    <rect x="0" y="0" width="200" height="400" rx="34" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="3"/>
  </g>`;
}

function mug(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M30,-30 q-12,-24 4,-46 q14,-20 2,-44" stroke="#C9C1B1" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M70,-30 q-12,-24 4,-46 q14,-20 2,-44" stroke="#C9C1B1" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M118,30 q46,0 46,40 q0,40 -46,40" stroke="${C.ivoryDark}" stroke-width="14" fill="none"/>
    <path d="M0,0 L130,0 L122,140 Q120,160 100,160 L30,160 Q10,160 8,140 Z" fill="${C.ivoryLight}" stroke="${C.ivoryDark}" stroke-width="3"/>
    <rect x="8" y="50" width="118" height="12" fill="${C.teal}" opacity="0.85"/>
  </g>`;
}

// Bathroom-counter backdrop sized w x h with morning light.
function counterScene(w, h, counterY) {
  const id = uid('sc');
  return `<defs>
    <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF6EC"/><stop offset="1" stop-color="#EFE7D8"/></linearGradient>
    <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stop-color="#FFF6DD" stop-opacity="0.9"/><stop offset="1" stop-color="#FFF6DD" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9E1D3"/><stop offset="1" stop-color="#C6D1BF"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id}w)"/>
  ${[...Array(Math.ceil(w / 90))].map((_, i) => `<line x1="${i * 90}" y1="0" x2="${i * 90}" y2="${counterY}" stroke="#E4DBCB" stroke-width="2"/>`).join('')}
  ${[...Array(Math.ceil(counterY / 90))].map((_, i) => `<line x1="0" y1="${i * 90}" x2="${w}" y2="${i * 90}" stroke="#E4DBCB" stroke-width="2"/>`).join('')}
  <polygon points="0,0 ${w * 0.55},0 ${w * 0.95},${counterY} ${w * 0.35},${counterY}" fill="url(#${id}l)"/>
  <rect y="${counterY}" width="${w}" height="${h - counterY}" fill="url(#${id}c)"/>
  <rect y="${counterY}" width="${w}" height="6" fill="#EEF2EA"/>`;
}

function page(w, h, inner, bg = 'transparent') {
  document.body.innerHTML = `<div id="art" style="width:${w}px;height:${h}px;background:${bg};position:relative;overflow:hidden">${inner}</div>`;
}
