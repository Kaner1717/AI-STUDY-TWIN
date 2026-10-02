// Builds Crest_MicroBiome_Pitch.pptx. Layout coordinates are in 1920x1080 px (1 px = 1/144 in, 0.5 pt).
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Lu = require('react-icons/lu');
const sharp = require('sharp');
const { applyTheme } = require(process.env.SKILL + '/scripts/apply_theme.js');

const A = (f) => __dirname + '/../' + f; // concept art in scratchpad root
const I = (v) => v / 144;
const THEME = {
  name: 'Crest MicroBiome', headFontFace: 'Georgia', bodyFontFace: 'Arial',
  colors: { dk1: '13294B', lt1: 'F7F3EA', dk2: '3E4C63', lt2: 'FCFAF4', accent1: '19706E', accent2: '9DB39A', accent3: '4F6B4C', accent4: 'D6EBE7', accent5: 'E3DDD0', accent6: '8FD0C8', hlink: '19706E', folHlink: '4F6B4C' },
};
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Crest MicroBiome Pitch';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const S = pres.SchemeColor;
const NAVY = S.text1, BODY = S.text2, IVORY = S.background1, CARD = S.background2, TEAL = S.accent1, SAGE = S.accent2, SAGED = S.accent3, PALE = S.accent4, HAIR = S.accent5, TLIGHT = S.accent6;
const MUTED = '5F6B7E', NAVY2 = '1D3A66', SAGEPALE = 'E3EADD', CHIPLINE = 'CFC8BA';
const HEAD = '+mj-lt';

// ---------- layouts ----------
const num = () => ({ x: I(1640), y: I(1006), w: I(152), h: I(30), fontSize: 10, color: MUTED, align: 'right' });
const titlePh = (w, color) => ({ placeholder: { options: { name: 'title', type: 'title', x: I(128), y: I(128), w: I(w), h: I(96), fontSize: 40, color, valign: 'middle', margin: 0 }, text: '' } });
pres.defineSlideMaster({ title: 'Light statement', background: { path: A('pptx/bg-light.png') } });
pres.defineSlideMaster({ title: 'Light title', background: { path: A('pptx/bg-light.png') }, objects: [titlePh(1664, NAVY)], slideNumber: num() });
pres.defineSlideMaster({ title: 'Light section', background: { path: A('pptx/bg-light.png') }, objects: [titlePh(470, NAVY)], slideNumber: num() });
pres.defineSlideMaster({ title: 'Teal statement', background: { path: A('pptx/bg-teal.png') } });
pres.defineSlideMaster({ title: 'Navy divider', background: { color: '13294B' } });
pres.defineSlideMaster({ title: 'Ivory appendix', background: { color: 'F7F3EA' }, objects: [titlePh(1664, NAVY)], slideNumber: num() });

// ---------- helpers ----------
let objN = 0;
function T(s, text, x, y, w, h, o = {}) {
  const { px = 28, ...rest } = o;
  s.addText(text, { x: I(x), y: I(y), w: I(w), h: I(h), fontSize: px / 2, color: BODY, margin: 0, valign: 'top', isTextBox: true, lineSpacingMultiple: 1.15, objectName: 'text-' + (++objN), ...rest });
}
function BOX(s, x, y, w, h, o = {}) {
  const { r = 24, fill = CARD, line, dash, lw = 0.75 } = o;
  s.addShape(r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
    x: I(x), y: I(y), w: I(w), h: I(h), fill: fill ? { color: fill } : { type: 'none' },
    line: line ? { color: line, width: lw, dashType: dash ? 'dash' : 'solid' } : { type: 'none' },
    ...(r ? { rectRadius: I(Math.min(r, w / 2, h / 2)) } : {}), objectName: 'shape-' + (++objN),
  });
}
function CARDBOX(s, x, y, w, h) { BOX(s, x, y, w, h, { fill: CARD, line: HAIR }); }
function PILL(s, text, x, y, w, h, o = {}) {
  const { px = 28, fill, line, dash, color = NAVY, bold = true, lw = 1.5, ...rest } = o;
  s.addText(text, {
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: I(h / 2), x: I(x), y: I(y), w: I(w), h: I(h), fontSize: px / 2, bold, color,
    fill: fill ? { color: fill } : { type: 'none' }, line: line ? { color: line, width: lw, dashType: dash ? 'dash' : 'solid' } : { type: 'none' },
    align: 'center', valign: 'middle', margin: 0, objectName: 'pill-' + (++objN), ...rest,
  });
}
function EB(s, text, x, y, w, color = TEAL, align = 'left') { T(s, text.toUpperCase(), x, y, w, 36, { px: 24, bold: true, color, charSpacing: 1.5, align }); }
const TAGS = {
  fact: { color: NAVY, line: NAVY }, research: { color: SAGED, fill: SAGEPALE }, proposed: { color: TEAL, fill: PALE },
  assume: { color: NAVY, line: NAVY, dash: true },
  factD: { color: IVORY, line: IVORY }, researchD: { color: NAVY, fill: SAGEPALE }, proposedD: { color: NAVY, fill: PALE }, assumeD: { color: IVORY, line: IVORY, dash: true },
};
function tagW(text) { return Math.round(text.length * 18.5 + 48); }
function TAG(s, kind, text, x, y, alignRight = false) {
  const w = tagW(text); const xx = alignRight ? x - w : x;
  PILL(s, text.toUpperCase(), xx, y, w, 46, { px: 24, charSpacing: 1, ...TAGS[kind] });
  return w;
}
const ASPECT = { 'hero.png': 1500 / 1180, 'tube.png': 440 / 940, 'creator.png': 0.5, 'story1.png': 4 / 3, 'story2.png': 4 / 3, 'story3.png': 4 / 3, 'story4.png': 4 / 3, 'kit.png': 1.4, 'card.png': 2200 / 900, 'booth.png': 1800 / 1100, 'shelf.png': 1800 / 1120, 'venn.png': 1200 / 760 };
function IMG(s, f, x, y, w, h, alt, o = {}) {
  const a = ASPECT[f]; let iw = w, ih = w / a;
  if (ih > h) { ih = h; iw = h * a; }
  s.addImage({ path: A(f), x: I(x + (w - iw) / 2), y: I(y + (h - ih) / 2), w: I(iw), h: I(ih), altText: alt, objectName: 'image-' + (++objN), ...o });
}
const iconCache = {};
async function iconData(name, hex) {
  const k = name + hex;
  if (!iconCache[k]) {
    const svg = renderToStaticMarkup(React.createElement(Lu[name], { color: '#' + hex, size: 256 }));
    const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
    iconCache[k] = 'image/png;base64,' + buf.toString('base64');
  }
  return iconCache[k];
}
// Icon in a filled circle. dark: navy circle + ivory glyph; light: pale-teal circle + teal glyph.
async function ICON(s, name, x, y, d, dark = true) {
  s.addShape(pres.shapes.OVAL, { x: I(x), y: I(y), w: I(d), h: I(d), fill: { color: dark ? NAVY : PALE }, line: { type: 'none' }, objectName: 'icon-bg-' + (++objN) });
  const g = Math.round(d * 0.55);
  s.addImage({ data: await iconData(name, dark ? 'F7F3EA' : '19706E'), x: I(x + (d - g) / 2), y: I(y + (d - g) / 2), w: I(g), h: I(g), altText: '', objectName: 'icon-' + objN });
}
function mix(fg, a, bg = 'F7F3EA') {
  const p = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return [0, 2, 4].map((i) => Math.round(p(fg, i) * a + p(bg, i) * (1 - a)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const LETTERS = ['C', 'R', 'E', 'S', 'T'];
function HDR(s, word, tagline, idx) {
  s.addText(word, { placeholder: 'title' });
  BOX(s, 620, 138, 1172, 68, { fill: PALE, r: 34 });
  T(s, tagline, 656, 138, 760, 68, { px: 28, bold: true, color: TEAL, valign: 'middle' });
  T(s, LETTERS.map((l, i) => ({ text: l + (i < 4 ? '  ' : ''), options: { color: i === idx ? NAVY : TEAL, bold: i === idx } })), 1430, 138, 326, 68, { px: 28, align: 'right', valign: 'middle', charSpacing: 2 });
}
function BULLETS(s, items, x, y, w, h, px = 28) {
  T(s, items.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: i < items.length - 1 } })), x, y, w, h, { px, paraSpaceAfter: 6 });
}
function TABLE(s, rows, x, y, w, colPct, o = {}) {
  const { px = 26, rowH = 54, alignRight = [] } = o;
  const data = rows.map((r, ri) => r.map((c, ci) => {
    const cell = typeof c === 'object' ? c : { text: String(c) };
    const isHead = ri === 0, isTotal = o.total && ri === rows.length - 1;
    return {
      text: cell.text, options: {
        bold: isHead || isTotal || cell.bold, color: isHead ? IVORY : (cell.color || (isTotal ? NAVY : BODY)),
        fill: { color: isHead ? NAVY : isTotal ? PALE : ri % 2 ? CARD : IVORY }, align: alignRight.includes(ci) ? 'right' : 'left',
        ...(cell.hyperlink ? { hyperlink: cell.hyperlink } : {}),
      },
    };
  }));
  s.addTable(data, { x: I(x), y: I(y), w: I(w), colW: colPct.map((p) => I(w * p / 100)), rowH: I(rowH), fontSize: px / 2, valign: 'middle', margin: [0, 8, 0, 8], border: { type: 'solid', pt: 0.75, color: 'E3DDD0' }, objectName: 'table-' + (++objN) });
}
function slide(master, section) { return pres.addSlide({ masterName: master, sectionTitle: section }); }

(async () => {
  // ================= OPENING =================
  pres.addSection({ title: 'Opening' });
  let s = slide('Light statement', 'Opening');
  T(s, 'CREST MICROBIOME', 128, 112, 1664, 100, { px: 80, fontFace: HEAD, color: NAVY, align: 'center', charSpacing: 6, valign: 'middle' });
  T(s, 'Make brushing your first act of self-care', 128, 220, 1664, 50, { px: 30, align: 'center' });
  IMG(s, 'hero.png', 460, 285, 1000, 640, 'Crest MicroBiome carton and tube, packaging concept');
  T(s, 'Canadian launch\nSummer 2027\nCase competition', 128, 880, 420, 110, { px: 24, color: MUTED, lineSpacingMultiple: 1.3 });
  T(s, 'Team [Name]\n[Member 1] · [Member 2]\n[Member 3] · [Member 4]', 1372, 880, 420, 110, { px: 24, color: MUTED, align: 'right', lineSpacingMultiple: 1.3 });

  s = slide('Light statement', 'Opening');
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: I(128 + c * 56.5), y: I(260 + r * 56.5), w: I(51), h: I(51), rectRadius: I(12), fill: { color: i < 89 ? NAVY : 'DCE3D6' }, line: { type: 'none' }, objectName: 'waffle-' + i });
  }
  TAG(s, 'fact', 'Case fact', 808, 317);
  T(s, '89%', 808, 380, 984, 230, { px: 200, bold: true, color: NAVY, charSpacing: -3, lineSpacingMultiple: 1 });
  T(s, 'of Canadians brush daily.', 808, 618, 984, 60, { px: 40, color: NAVY });
  T(s, 'Brushing is an established habit. Awareness of oral microbiome health is low.', 808, 696, 984, 90, { px: 28 });

  s = slide('Light statement', 'Opening');
  const words = [['Whitening', 90, 70, 96, '13294B', 0.18], ['Fresh breath', 700, 60, 60, '19706E', 0.26], ['Enamel care', 1230, 90, 80, '13294B', 0.16], ['Sensitivity relief', 110, 250, 44, '4F6B4C', 0.35], ['Deep clean', 640, 220, 56, '13294B', 0.2], ['Cool mint', 1100, 250, 40, '19706E', 0.3], ['Tartar control', 1420, 270, 52, '4F6B4C', 0.28], ['Gum care', 60, 420, 64, '13294B', 0.18], ['Natural', 130, 560, 48, '19706E', 0.28], ['Fluoride', 70, 680, 40, '4F6B4C', 0.32], ['Advanced', 1580, 400, 72, '13294B', 0.16], ['Charcoal', 1620, 560, 48, '4F6B4C', 0.3], ['Clinical', 1590, 680, 44, '19706E', 0.26], ['Stain removal', 90, 800, 72, '13294B', 0.16], ['Daily protection', 700, 780, 52, '19706E', 0.26], ['Strengthening', 1220, 800, 60, '13294B', 0.18], ['Herbal', 520, 930, 44, '4F6B4C', 0.3], ['Extra fresh', 1000, 920, 56, '13294B', 0.16], ['Complete', 1520, 950, 48, '19706E', 0.26], ['Pro formula', 160, 960, 40, '13294B', 0.2]];
  for (const [t, x, y, px, c, a] of words) T(s, t, x, y, Math.min(t.length * px * 0.62 + 20, 1910 - x), px * 1.3, { px, bold: true, color: mix(c, a), wrap: false });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: I(360), y: I(335), w: I(1200), h: I(411), rectRadius: I(32), fill: { color: 'FCFAF4', transparency: 6 }, line: { color: 'E3DDD0', width: 0.75 }, shadow: { type: 'outer', color: '13294B', opacity: 0.08, blur: 30, offset: 8, angle: 90 }, objectName: 'perception-panel' });
  EB(s, 'Consumer perception', 440, 391, 1040, TEAL, 'center');
  T(s, 'To many shoppers, toothpastes can feel interchangeable.', 440, 445, 1040, 160, { px: 64, bold: true, color: NAVY, align: 'center', lineSpacingMultiple: 1.05 });
  T(s, 'The category keeps innovating, yet similar-sounding claims can blur together at the shelf.', 440, 620, 1040, 90, { px: 28, align: 'center' });

  s = slide('Light statement', 'Opening');
  EB(s, 'The challenge', 128, 283, 1000);
  T(s, 'An established habit, a low-awareness benefit and a category where many options can feel alike.', 128, 360, 1300, 120, { px: 40 });
  T(s, [
    { text: 'How can Crest make an unfamiliar benefit ', options: { color: NAVY } }, { text: 'understandable', options: { color: TEAL } }, { text: ', ', options: { color: NAVY } },
    { text: 'emotionally relevant', options: { color: TEAL } }, { text: ' and ', options: { color: NAVY } }, { text: 'worth choosing', options: { color: TEAL } }, { text: '?', options: { color: NAVY } },
  ], 128, 520, 1600, 300, { px: 76, bold: true, lineSpacingMultiple: 1.05 });

  // ================= STRATEGY =================
  pres.addSection({ title: 'Strategy' });
  s = slide('Light title', 'Strategy');
  s.addText('Target Consumer', { placeholder: 'title' });
  T(s, 'Wellness-minded adults, aged 25–45', 128, 236, 760, 56, { px: 40, color: TEAL, valign: 'middle' });
  TAG(s, 'fact', 'Case fact', 900, 241);
  const aud = [['LuActivity', 'Interested in health', 'Show brushing as part of how they already care for themselves.'], ['LuBadgeCheck', 'Open to premium when the benefit is clear', 'Make the added benefit simple, specific and credible.'], ['LuClock', 'Prefer simple routines', 'Build on the brushing they already do. Add no new steps.']];
  for (let i = 0; i < 3; i++) {
    const x = 128 + i * 565.3; CARDBOX(s, x, 336, 533, 600);
    await ICON(s, aud[i][0], x + 48, 384, 80, false);
    T(s, aud[i][1], x + 48, 488, 437, 160, { px: 40, bold: true, color: NAVY });
    EB(s, 'What it means for us', x + 48, 744, 437);
    T(s, aud[i][2], x + 48, 790, 437, 120, { px: 28 });
  }

  s = slide('Light statement', 'Strategy');
  EB(s, 'Positioning', 128, 128, 800);
  T(s, 'Make brushing your\nfirst act of self-care.', 128, 196, 1016, 200, { px: 80, fontFace: HEAD, italic: true, color: NAVY, lineSpacingMultiple: 1.05 });
  T(s, 'For wellness-minded Canadians, Crest MicroBiome makes everyday brushing an act of self-care—with cavity protection and support for the helpful bacteria already in your mouth.', 128, 420, 1016, 190, { px: 30, lineSpacingMultiple: 1.25 });
  CARDBOX(s, 128, 640, 496, 240);
  EB(s, 'Emotional relevance', 160, 672, 440);
  T(s, 'A small moment of care for yourself before the demands of the day.', 160, 718, 432, 140, { px: 28, color: NAVY });
  BOX(s, 648, 640, 496, 240, { fill: NAVY });
  EB(s, 'Functional difference', 680, 672, 440, TLIGHT);
  T(s, 'Cavity protection plus support for helpful bacteria.', 680, 718, 432, 140, { px: 28, color: IVORY });
  IMG(s, 'hero.png', 1192, 290, 600, 520, 'Crest MicroBiome carton and tube, packaging concept');

  s = slide('Light statement', 'Strategy');
  EB(s, 'The product', 128, 128, 800);
  T(s, 'Your mouth has helpful bacteria, too.', 128, 196, 936, 200, { px: 80, bold: true, color: NAVY, lineSpacingMultiple: 1.0, charSpacing: -1 });
  T(s, 'Crest MicroBiome helps support them while protecting your teeth against cavities.', 128, 410, 936, 120, { px: 40 });
  PILL(s, 'Cavity protection', 128, 556, 300, 56, { fill: NAVY, color: IVORY });
  T(s, '+', 440, 556, 40, 56, { px: 40, bold: true, color: TEAL, align: 'center', valign: 'middle' });
  PILL(s, 'Care for helpful bacteria', 492, 556, 410, 56, { fill: TEAL, color: IVORY });
  T(s, 'OralBio Complex: fluoride, zinc, vitamin B3 and a plant-based prebiotic. It supports bacteria already in the mouth; it does not add live probiotics.', 128, 644, 936, 80, { px: 24, color: MUTED });
  const tw = TAG(s, 'fact', 'Case fact', 128, 752);
  TAG(s, 'proposed', 'Packaging concept', 128 + tw + 12, 752);
  IMG(s, 'hero.png', 1112, 270, 680, 560, 'Crest MicroBiome carton and tube, packaging concept');

  s = slide('Teal statement', 'Strategy');
  IMG(s, 'tube.png', 1422, 190, 328, 700, 'Crest MicroBiome tube, packaging concept');
  EB(s, 'Campaign idea', 128, 290, 800, PALE);
  T(s, 'The first two minutes are yours.', 128, 340, 1180, 250, { px: 100, fontFace: HEAD, italic: true, color: IVORY, lineSpacingMultiple: 1.0 });
  T(s, 'Before messages, work and school begin, take two minutes for yourself. The campaign gives an existing habit new meaning, with no complicated wellness routine to adopt.', 128, 620, 1080, 140, { px: 30, color: 'EEF5F3', lineSpacingMultiple: 1.25 });
  T(s, 'Mornings are the hero moment. The message stays consistent with brushing twice a day.', 128, 790, 1080, 70, { px: 24, color: PALE });

  // ================= CREST =================
  pres.addSection({ title: 'CREST Framework' });
  s = slide('Light title', 'CREST Framework');
  s.addText('CREST Framework', { placeholder: 'title' });
  const cw = 284.8, cx = (i) => 320 + i * (cw + 12);
  const names = ['Connect', 'Reveal', 'Experience', 'Shop', 'Thrive'];
  const role = ['Build emotional relevance', 'Explain the difference', 'Encourage trial', 'Convert to purchase', 'Build repeat & community'];
  const how = ['Wellness creators + Meta ads', 'Dentists & hygienists', 'Dental samples + marathon expos', 'Retail links, coupons, shelf', 'Same creators + customer stories'];
  const out = ['Relevance', 'Understanding', 'Trial', 'First purchase', 'Repeat purchase'];
  const cell = (text, y, h, o) => s.addText(text, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: I(16), x: I(cx(i0)), y: I(y), w: I(cw), h: I(h), margin: [0, 10, 0, 10], valign: 'middle', align: 'center', fit: 'none', wrap: true, objectName: 'crest-cell-' + (++objN), ...o });
  let i0 = 0;
  for (let i = 0; i < 5; i++) {
    i0 = i;
    cell([{ text: LETTERS[i], options: { fontFace: HEAD, fontSize: 48, bold: true, color: IVORY, breakLine: true } }, { text: names[i], options: { fontSize: 14, bold: true, color: TLIGHT } }], 256, 176, { fill: { color: NAVY }, line: { type: 'none' }, rectRadius: I(20) });
    cell(role[i], 444, 116, { fontSize: 14, bold: true, color: NAVY, fill: { color: CARD }, line: { color: HAIR, width: 0.75 } });
    cell(how[i], 572, 150, { fontSize: 14, color: BODY, fill: { color: CARD }, line: { color: HAIR, width: 0.75 } });
    cell(out[i], 734, 84, { fontSize: 14, bold: true, color: NAVY, fill: { color: PALE }, line: { type: 'none' } });
  }
  EB(s, 'Role', 128, 484, 180); EB(s, 'How', 128, 629, 180); EB(s, 'Outcome', 128, 758, 180);
  T(s, 'Each stage hands a measurable outcome to the next: relevance → understanding → trial → purchase → repeat.', 128, 856, 1664, 40, { px: 24, color: MUTED });

  // Connect: creators
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Connect', 'Build emotional relevance', 0);
  IMG(s, 'creator.png', 128, 268, 340, 680, 'Concept creator post: phone face down beside Crest MicroBiome on a bathroom counter, with a caption about taking the first two minutes');
  const cc = [['LuUsers', 'Recurring wellness micro-influencers', 'The same recognizable faces all year, sharing relatable morning routines.'], ['LuMessageCircle', 'Their own words', 'Each creator shares what their first two minutes mean, without an identical script.'], ['LuZap', 'Meta ads amplify what works', 'Paid media boosts the best-performing creator posts to our 25–45 wellness audience.']];
  for (let i = 0; i < 3; i++) {
    const y = 290 + i * 172; await ICON(s, cc[i][0], 564, y, 72);
    T(s, cc[i][1], 664, y + 4, 1128, 54, { px: 40, bold: true, color: NAVY });
    T(s, cc[i][2], 664, y + 62, 1128, 90, { px: 28 });
  }
  const tw2 = TAG(s, 'proposed', 'Proposed tactic', 564, 826);
  T(s, 'Concept post. Crest MicroBiome is always in frame, so the emotion stays tied to the product.', 564 + tw2 + 20, 818, 1228 - tw2 - 20, 70, { px: 24, color: MUTED, valign: 'middle' });

  // Connect: format
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Connect', 'Build emotional relevance', 0);
  EB(s, 'One recognizable creator format', 128, 260, 1000);
  const fr = [['story1.png', 'Phone face down', 'Messages can wait two minutes.', 'Phone lying face down on a bathroom counter while message bubbles wait'], ['story2.png', 'Crest MicroBiome in view', 'The product is always in frame.', 'Crest MicroBiome tube on the counter beside a toothbrush cup and plant'], ['story3.png', 'Brushing as self-care', 'Two calm minutes, just for you.', 'A two-minute timer ring labelled for you, beside the toothbrush and tube'], ['story4.png', 'A personal story', 'Why these two minutes matter to them.', 'Creator avatar with a speech bubble']];
  for (let i = 0; i < 4; i++) {
    const x = 128 + i * 424;
    IMG(s, fr[i][0], x, 312, 392, 294, fr[i][3], { rounding: false });
    BOX(s, x, 312, 392, 294, { fill: null, line: HAIR, r: 0 });
    T(s, fr[i][1], x, 628, 392, 100, { px: 40, bold: true, color: NAVY, lineSpacingMultiple: 1.05 });
    T(s, fr[i][2], x, 740, 392, 80, { px: 28 });
  }
  const tw3 = TAG(s, 'proposed', 'Proposed tactic', 128, 872);
  T(s, 'Meta ads amplify the posts that perform best. Creator links lead to participating retailers.', 128 + tw3 + 20, 866, 1400, 58, { px: 28, valign: 'middle' });

  // Reveal
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Reveal', 'Explain the product difference', 1);
  EB(s, 'Key message from dentists and hygienists', 128, 280, 780);
  T(s, '“Cavity protection, plus care for the helpful bacteria already in your mouth.”', 128, 330, 780, 230, { px: 56, fontFace: HEAD, italic: true, color: NAVY, lineSpacingMultiple: 1.05 });
  const chk = ['Plain language from trusted professionals', 'Evidence and accurate materials for clinics', 'Professionals decide whether to recommend it'];
  for (let i = 0; i < 3; i++) { const y = 590 + i * 80; await ICON(s, 'LuCheck', 128, y, 56, false); T(s, chk[i], 204, y, 704, 56, { px: 28, valign: 'middle' }); }
  TAG(s, 'proposed', 'Proposed tactic', 128, 850);
  IMG(s, 'venn.png', 972, 290, 760, 481, 'Two overlapping circles: a protected tooth and a calm cluster of helpful bacteria, with Crest MicroBiome in the overlap');
  T(s, 'Cavity protection', 992, 782, 360, 44, { px: 28, bold: true, color: NAVY, align: 'center' });
  T(s, 'Care for helpful bacteria', 1344, 782, 440, 44, { px: 28, bold: true, color: TEAL, align: 'center' });
  T(s, 'A simple balance visual, with no frightening germ imagery', 952, 840, 840, 40, { px: 24, color: MUTED, align: 'center' });

  // Experience: kit
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Experience', 'Encourage trial', 2);
  IMG(s, 'kit.png', 128, 300, 800, 571, 'Dental take-home pouch with toothbrush and Crest MicroBiome sample, patient card and first-tube coupon');
  EB(s, 'Dental sampling · core trial channel', 992, 290, 800);
  T(s, 'Free starter kits for a 50–100-clinic pilot in launch markets', 992, 338, 800, 110, { px: 40, bold: true, color: NAVY });
  BULLETS(s, ['Sealed toothpaste samples', 'Simple patient education cards', 'Clinic-specific QR codes', 'Trackable retailer coupons', 'A short professional product briefing'], 992, 466, 800, 250);
  T(s, 'Samples and materials are free. No payment per recommendation.', 992, 730, 800, 70, { px: 24, color: MUTED });
  TAG(s, 'proposed', 'Proposed tactic', 992, 814);

  // Experience: patient card
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Experience', 'Encourage trial', 2);
  IMG(s, 'card.png', 260, 268, 1400, 573, 'Patient card front reading Your first two minutes start here, and back explaining helpful bacteria with a QR code and clinic code');
  const cwid = tagW('Patient card concept');
  TAG(s, 'proposed', 'Patient card concept', 216, 876);
  T(s, 'Plain-language benefit, twice-daily reminder, clinic QR code and first-tube offer.', 216 + cwid + 20, 870, 1300, 58, { px: 28, valign: 'middle' });

  // Experience: pilot
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Experience', 'Encourage trial', 2);
  EB(s, 'How the clinic pilot works', 128, 252, 1000);
  const steps = [['1 · Recruit', 'Clinics that reach 25–45s and will report stock'], ['2 · Brief', 'Short product briefing for the clinic team'], ['3 · Hand out', 'Brief explanation if appropriate; sample in the take-home bag'], ['4 · Track', 'Stock reports, QR visits and coupon purchases'], ['5 · Replenish', 'Restock by actual distribution; expand on results']];
  for (let i = 0; i < 5; i++) {
    const x = 128 + i * 344; CARDBOX(s, x, 300, 288, 230);
    T(s, steps[i][0], x + 24, 324, 240, 40, { px: 28, bold: true, color: NAVY });
    T(s, steps[i][1], x + 24, 372, 240, 140, { px: 24 });
    if (i < 4) s.addShape(pres.shapes.RIGHT_ARROW, { x: I(x + 300), y: I(405), w: I(32), h: I(20), fill: { color: TEAL }, line: { type: 'none' }, objectName: 'arrow-' + i });
  }
  CARDBOX(s, 128, 562, 816, 390);
  EB(s, 'Pilot test', 160, 594, 700);
  BOX(s, 160, 652, 330, 120, { fill: PALE, r: 16 });
  T(s, 'Sample only', 184, 652, 290, 120, { px: 28, bold: true, color: NAVY, valign: 'middle' });
  T(s, 'vs', 500, 652, 60, 120, { px: 28, bold: true, color: TEAL, align: 'center', valign: 'middle' });
  BOX(s, 570, 652, 342, 120, { fill: NAVY, r: 16 });
  T(s, 'Sample + brief explanation', 594, 652, 300, 120, { px: 28, bold: true, color: IVORY, valign: 'middle' });
  T(s, 'Compare understanding, purchases and cost per buyer before expanding.', 160, 800, 752, 80, { px: 24 });
  CARDBOX(s, 976, 562, 816, 390);
  EB(s, 'Four separate measures', 1008, 594, 700);
  const bars = [['Samples delivered', 752, NAVY], ['Samples handed out (stock reports)', 662, NAVY2], ['QR visits', 572, TEAL], ['Coupon purchases', 481, SAGED]];
  bars.forEach(([t, w, c], i) => { BOX(s, 1008, 642 + i * 56, w, 46, { fill: c, r: 10 }); T(s, t, 1028, 642 + i * 56, w - 40, 46, { px: 24, bold: true, color: IVORY, valign: 'middle' }); });
  T(s, 'A scan is not a purchase; a handed-out sample may go unused.', 1008, 874, 752, 44, { px: 24, color: MUTED });

  // Experience: expo
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Experience', 'Encourage trial', 2);
  IMG(s, 'booth.png', 128, 300, 960, 587, 'Expo booth concept: navy wall reading The first two minutes are yours, a sample counter, a free-sample tower with QR code and a photo spot');
  EB(s, 'Marathon expos · bib pickup', 1144, 284, 648);
  T(s, 'Targeted trial while attendees have time to browse', 1144, 330, 648, 110, { px: 40, bold: true, color: NAVY });
  T(s, [
    { text: 'Primary: ', options: { bold: true, bullet: { indent: 18 } } }, { text: 'targeted product trial', options: { breakLine: true } },
    { text: 'Secondary: ', options: { bold: true, bullet: { indent: 18 } } }, { text: 'education, offers, content', options: { breakLine: true } },
    { text: 'Sealed samples, short explanation, coupon or QR', options: { bullet: { indent: 18 }, breakLine: true } },
    { text: 'MicroBiome suit as a photo element only', options: { bullet: { indent: 18 } } },
  ], 1144, 456, 648, 300, { px: 28, paraSpaceAfter: 6 });
  T(s, 'The link is wellness and routine, never running performance. Compare cost per acquisition with the dental program before expanding.', 1144, 764, 648, 110, { px: 24, color: MUTED });
  TAG(s, 'proposed', 'Proposed tactic', 1144, 884);

  // Shop
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Shop', 'Convert interest into purchase', 3);
  IMG(s, 'shelf.png', 128, 286, 900, 560, 'Retail shelf concept: a block of navy Crest MicroBiome cartons at eye level with a teal shelf strip reading Cavity protection. Care for helpful bacteria.');
  T(s, 'Shelf concept: MicroBiome blocked together under one clear message.', 128, 862, 900, 40, { px: 24, color: MUTED });
  EB(s, 'Paths to purchase', 1084, 284, 708);
  const paths = [['LuLink', 'Creator links to participating retailers'], ['LuStar', 'A trackable coupon with every sample'], ['LuGlobe', 'QR landing pages with retailer links'], ['LuSearch', 'Shelf: “Cavity protection. Care for helpful bacteria.”'], ['LuBookOpen', 'Retail product pages that explain the benefit']];
  for (let i = 0; i < 5; i++) { const y = 336 + i * 86; await ICON(s, paths[i][0], 1084, y, 56); T(s, paths[i][1], 1160, y - 8, 632, 72, { px: 28, valign: 'middle' }); }
  T(s, 'An additional Crest choice for wellness-minded shoppers, never at the expense of confidence in existing Crest products.', 1084, 776, 708, 100, { px: 24, color: MUTED });
  TAG(s, 'proposed', 'Proposed tactic', 1084, 884);

  // Thrive
  s = slide('Light section', 'CREST Framework');
  HDR(s, 'Thrive', 'Build repeat purchase & community', 4);
  T(s, 'One shared, accessible action: taking two minutes for yourself.', 128, 264, 1664, 140, { px: 52, fontFace: HEAD, italic: true, color: NAVY, lineSpacingMultiple: 1.05 });
  EB(s, 'A movement needs more than a hashtag', 128, 430, 1200);
  const th = [['LuUsers', 'Recognizable faces', 'Continuing relationships with the same creators, not one-off posts.'], ['LuMessageCircle', 'Repeat participation', 'Customers share what their first two minutes mean; we feature stories with permission.'], ['LuStar', 'A product connection', 'Optional replenishment offers through participating retailers.']];
  for (let i = 0; i < 3; i++) {
    const x = 128 + i * 565.3; CARDBOX(s, x, 480, 533, 370);
    await ICON(s, th[i][0], x + 40, 520, 72);
    T(s, th[i][1], x + 40, 612, 453, 56, { px: 40, bold: true, color: NAVY });
    T(s, th[i][2], x + 40, 680, 453, 150, { px: 28 });
  }
  T(s, '“Thrive” refers to the routine and the community, not a promised clinical outcome.', 128, 880, 1664, 40, { px: 24, color: MUTED });

  // ================= BUSINESS CASE =================
  pres.addSection({ title: 'Business Case' });
  s = slide('Light title', 'Business Case');
  s.addText('Why Crest Can Execute', { placeholder: 'title' });
  const ex = [['LuBadgeCheck', 'Brand recognition', "Crest's established name supports reach for a new benefit."], ['LuGraduationCap', 'Professional relationships', 'Dental ties support education and clinic sampling.'], ['LuUsers', 'Recognizable human faces', 'Recurring creators, dentists and community members.']];
  for (let i = 0; i < 3; i++) {
    const x = 128 + i * 565.3; CARDBOX(s, x, 264, 533, 380);
    await ICON(s, ex[i][0], x + 36, 304, 72);
    T(s, ex[i][1], x + 36, 396, 461, 110, { px: 40, bold: true, color: NAVY });
    T(s, ex[i][2], x + 36, 512, 461, 110, { px: 28 });
  }
  CARDBOX(s, 128, 676, 1664, 276);
  EB(s, 'A small launch team', 168, 708, 800);
  T(s, 'Fast on routine content, careful on health claims', 1000, 708, 752, 36, { px: 24, color: MUTED, align: 'right' });
  const lane = (y, items) => {
    let x = 168;
    items.forEach(([t, kind], i) => {
      const w = Math.round(t.length * 15.5 + 52);
      const st = kind === 'pale' ? { fill: PALE, color: NAVY } : kind === 'teal' ? { fill: TEAL, color: IVORY } : kind === 'navy' ? { fill: NAVY, color: IVORY } : { line: NAVY, color: NAVY, fill: CARD };
      PILL(s, t, x, y, w, 56, st); x += w + 16;
      if (i < items.length - 1) { s.addShape(pres.shapes.RIGHT_ARROW, { x: I(x), y: I(y + 18), w: I(40), h: I(20), fill: { color: kind === 'navy' || kind === 'outline' ? NAVY : TEAL }, line: { type: 'none' }, objectName: 'lane-arrow-' + (++objN) }); x += 56; }
    });
  };
  lane(764, [['Routine post, approved format', 'pale'], ['Launch team', 'pale'], ['Publish', 'teal']]);
  lane(852, [['New health claim', 'outline'], ['Claims review', 'navy'], ['Launch team', 'pale'], ['Publish', 'teal']]);

  s = slide('Light title', 'Business Case');
  s.addText('Launch Roadmap', { placeholder: 'title' });
  const ph = [[128, 'Before launch', SAGED, '9DB39A', 'Preparation', ['Validate claims', 'Recruit creators and clinics', 'Secure retail partners', 'Establish tracking']], [616, 'Summer 2027', TEAL, '19706E', 'Launch', ['Begin the dental pilot', 'Creator content and Meta ads', 'Selected expo tests']], [1328, 'After the pilot', NAVY, '13294B', 'Expansion', ['Scale effective channels', 'Replenish samples', 'Focus on repeat purchase']]];
  for (const [x, eb, ec, bar, title, items] of ph) {
    CARDBOX(s, x, 264, 464, 620);
    BOX(s, x + 40, 304, 384, 8, { fill: bar, r: 4 });
    EB(s, eb, x + 40, 336, 384, ec);
    T(s, title, x + 40, 384, 384, 60, { px: 40, bold: true, color: NAVY });
    BULLETS(s, items, x + 40, 464, 384, 380);
  }
  s.addShape(pres.shapes.DIAMOND, { x: I(1156), y: I(450), w: I(96), h: I(96), fill: { color: TEAL }, line: { type: 'none' }, objectName: 'decision-gate' });
  T(s, 'Decision gate', 1104, 566, 200, 40, { px: 24, bold: true, color: NAVY, align: 'center' });
  T(s, 'Pilot results vs. targets', 1104, 606, 200, 70, { px: 24, color: MUTED, align: 'center' });
  T(s, 'Timing is shown relative to launch.', 128, 908, 1000, 40, { px: 24, color: MUTED });

  s = slide('Light title', 'Business Case');
  s.addText('Year 1 Budget', { placeholder: 'title' });
  const bw = TAG(s, 'proposed', 'Proposed allocations', 1792, 153, true);
  T(s, 'CAD $1,000,000', 1792 - bw - 300, 148, 280, 56, { px: 28, bold: true, color: NAVY, align: 'right', valign: 'middle' });
  const seg = [[749, NAVY, IVORY, 'Connect · $450K'], [582, TEAL, IVORY, 'Experience · $350K'], [166, SAGE, NAVY, '$100K'], [167, HAIR, NAVY, '$100K']];
  let sx = 128;
  for (const [w, f, c, t] of seg) { BOX(s, sx, 256, w, 72, { fill: f, r: 0 }); T(s, t, sx + (w > 200 ? 24 : 0), 256, w > 200 ? w - 48 : w, 72, { px: 24, bold: true, color: c, valign: 'middle', align: w > 200 ? 'left' : 'center' }); sx += w; }
  TABLE(s, [
    ['Stage', 'Line item', 'Amount (CAD)', 'Share'],
    [{ text: 'Connect', color: NAVY }, 'Paid media', '$300,000', '30%'],
    [{ text: 'Connect', color: NAVY }, 'Creators and content', '$150,000', '15%'],
    [{ text: 'Experience', color: TEAL }, 'Non-dental sampling and distribution', '$150,000', '15%'],
    [{ text: 'Experience', color: TEAL }, 'Event activation, staffing and logistics', '$100,000', '10%'],
    [{ text: 'Experience', color: TEAL }, 'Dental program, including dental samples', '$100,000', '10%'],
    [{ text: 'Shop', color: SAGED }, 'Retail offers and merchandising', '$100,000', '10%'],
    [{ text: 'Measure', color: MUTED }, 'Research and measurement', '$50,000', '5%'],
    [{ text: 'Reserve', color: MUTED }, 'Reserve', '$50,000', '5%'],
    ['Total', 'Year 1 marketing budget', '$1,000,000', '100%'],
  ], 128, 360, 1664, [20, 48, 18, 14], { px: 26, rowH: 54, alignRight: [2, 3], total: true });

  s = slide('Light title', 'Business Case');
  s.addText('Dental Program Budget', { placeholder: 'title' });
  TAG(s, 'proposed', 'Proposed allocations', 1792, 153, true);
  TABLE(s, [
    ['Line item', 'Amount (CAD)'], ['Sample production', '$50,000'], ['Shipping and clinic kits', '$15,000'], ['Patient cards and education materials', '$10,000'],
    ['Clinic recruitment, onboarding and support', '$15,000'], ['Measurement and contingency', '$10,000'], ['Total dental program', '$100,000'],
  ], 128, 264, 1000, [68, 32], { px: 26, rowH: 56, alignRight: [1], total: true });
  T(s, 'Proposed allocations that require supplier quotes. Coupon discounts come from the retail-offers budget, not this one.', 128, 680, 1000, 80, { px: 24, color: MUTED });
  EB(s, 'Staged release', 1192, 264, 600);
  BOX(s, 1192, 312, 600, 260, { fill: TEAL });
  T(s, '$25,000', 1228, 348, 528, 100, { px: 80, bold: true, color: IVORY, valign: 'middle' });
  T(s, 'Released now for the 50–100-clinic pilot', 1228, 456, 528, 90, { px: 28, color: IVORY });
  BOX(s, 1192, 592, 600, 260, { fill: CARD, line: TEAL, dash: true, lw: 1.5 });
  T(s, '$75,000', 1228, 628, 528, 100, { px: 80, bold: true, color: NAVY, valign: 'middle' });
  T(s, 'Held for replenishment and expansion, released on results', 1228, 736, 528, 90, { px: 28 });

  s = slide('Light title', 'Business Case');
  s.addText('Dental Sales Scenarios', { placeholder: 'title' });
  TAG(s, 'assume', 'Financial assumption', 1792, 153, true);
  const chips = [['$50K for samples', 0], ['$1 each (assumed)', 1], ['50,000 samples', 0], ['80% reach recipients (assumed)', 1], ['40,000 recipients', 2]];
  let chx = 128;
  chips.forEach(([t, k], i) => {
    const w = Math.round(t.length * 13.5 + 36);
    PILL(s, t, chx, 252, w, 46, { px: 24, ...(k === 1 ? { line: NAVY, dash: true, fill: CARD } : k === 2 ? { fill: NAVY, color: IVORY } : { line: CHIPLINE, fill: CARD, lw: 0.75 }) });
    chx += w;
    if (i < chips.length - 1) { T(s, '→', chx + 6, 252, 30, 46, { px: 28, bold: true, color: TEAL, align: 'center', valign: 'middle' }); chx += 42; }
  });
  TABLE(s, [
    ['Illustrative dental model', 'Conservative', 'Base', 'Strong'],
    ['Purchase within 60 days', '5%', { text: '10%', bold: true, color: TEAL }, '15%'],
    ['First-time MicroBiome buyers', '2,000', { text: '4,000', bold: true, color: TEAL }, '6,000'],
    ['Full program cost per buyer', '$50', { text: '$25', bold: true, color: TEAL }, '≈ $16.67'],
    ['Initial retail sales at $8 per tube', '$16,000', { text: '$32,000', bold: true, color: TEAL }, '$48,000'],
  ], 128, 330, 1664, [40, 20, 20, 20], { px: 28, rowH: 59, alignRight: [1, 2, 3] });
  BOX(s, 128, 657, 1664, 142, { fill: NAVY });
  T(s, [{ text: 'First purchases alone do not recover the $100,000 program. ', options: { color: IVORY } }, { text: 'The business case depends on repeat buying and incremental contribution.', options: { color: TLIGHT } }], 168, 657, 1584, 142, { px: 28, valign: 'middle' });
  T(s, 'Not a launch forecast. Conversion rates and the $8 price are assumptions, not case facts. Retail sales are not Crest net revenue or profit. Repeat purchases are excluded, and some buyers may switch from other Crest products.', 128, 828, 1664, 90, { px: 24, color: MUTED });

  s = slide('Light title', 'Business Case');
  s.addText('Measurement & Decisions', { placeholder: 'title' });
  TAG(s, 'proposed', 'Proposed pilot targets', 1792, 153, true);
  const kpi = [['70%', NAVY, 'correctly understand the benefit'], ['10%', TEAL, 'of sample recipients buy within 60 days'], ['30%', SAGED, 'of buyers repeat within 90 days']];
  for (let i = 0; i < 3; i++) {
    const x = 128 + i * 565.3; CARDBOX(s, x, 264, 533, 286);
    T(s, kpi[i][0], x + 40, 296, 453, 136, { px: 120, bold: true, color: kpi[i][1], lineSpacingMultiple: 1 });
    T(s, kpi[i][2], x + 40, 446, 453, 90, { px: 28 });
  }
  EB(s, 'What we track', 128, 586, 800);
  const rowsC = [['Correct benefit understanding', 'Samples distributed', 'Sample-to-purchase conversion', 'Cost per buyer'], ['Repeat purchase', 'Incremental retail sales', 'New-to-Crest vs. existing Crest buyers', 'Community participation']];
  rowsC.forEach((row, ri) => { let x = 128; row.forEach((t) => { const w = Math.round(t.length * 13.2 + 40); PILL(s, t, x, 634 + ri * 60, w, 46, { px: 24, bold: false, line: CHIPLINE, fill: CARD, lw: 0.75 }); x += w + 12; }); });
  BOX(s, 128, 790, 1664, 134, { fill: PALE });
  T(s, [{ text: 'Decision rule: ', options: { bold: true } }, { text: 'scale channels that meet targets at an acceptable cost per buyer; fix or stop the rest. Customers are deduplicated across dental, event, creator and paid-media channels.' }], 168, 790, 1584, 134, { px: 28, color: NAVY, valign: 'middle' });

  s = slide('Light title', 'Business Case');
  s.addText('Risks & Mitigations', { placeholder: 'title' });
  const rk = [['LuLightbulb', 'Benefit is misunderstood', 'Plain language, professional explanations and a 70% understanding target before scaling.'], ['LuMessageCircle', 'Message turns generic', 'A recognizable format with Crest MicroBiome always in frame and retailer links.'], ['LuUsers', 'Sales shift within Crest', 'Position as an additional Crest choice; track new-to-Crest versus existing Crest buyers.'], ['LuChartColumn', 'Costs outrun results', 'Release $25K first, restock by actual distribution and compare channel cost per buyer.']];
  for (let i = 0; i < 4; i++) {
    const x = 128 + i * 423; CARDBOX(s, x, 264, 395, 660);
    await ICON(s, rk[i][0], x + 36, 300, 72);
    T(s, rk[i][1], x + 36, 396, 323, 110, { px: 40, bold: true, color: NAVY });
    EB(s, 'Mitigation', x + 36, 524, 323);
    T(s, rk[i][2], x + 36, 570, 323, 300, { px: 28 });
  }

  // ================= CLOSE =================
  pres.addSection({ title: 'Close' });
  s = slide('Light statement', 'Close');
  T(s, 'THE FIRST TWO MINUTES ARE YOURS', 128, 112, 1664, 90, { px: 56, fontFace: HEAD, color: NAVY, align: 'center', charSpacing: 4, valign: 'middle' });
  IMG(s, 'hero.png', 500, 220, 920, 613, 'Crest MicroBiome carton and tube, packaging concept');
  T(s, 'Crest MicroBiome · Make brushing your first act of self-care', 128, 856, 1664, 50, { px: 30, align: 'center' });

  // ================= APPENDIX =================
  pres.addSection({ title: 'Appendix' });
  s = slide('Navy divider', 'Appendix');
  T(s, 'EXHIBITS', 128, 330, 760, 120, { px: 96, fontFace: HEAD, color: IVORY, charSpacing: 8, valign: 'middle' });
  T(s, 'Detail for judge questions', 128, 460, 760, 50, { px: 28, color: 'C9D3DF' });
  ['Claims guardrails', 'Dental scenario math', 'Sampling research', 'Measurement plan', 'Budget and event notes'].forEach((t, i) => {
    const y = 200 + i * 84;
    T(s, [{ text: 'A' + (i + 1) + '     ', options: { color: TLIGHT } }, { text: t, options: { color: IVORY } }], 1032, y, 760, 84, { px: 30, valign: 'middle' });
    if (i < 4) s.addShape(pres.shapes.LINE, { x: I(1032), y: I(y + 84), w: I(760), h: 0, line: { color: '3B4F70', width: 0.75 }, objectName: 'rule-' + i });
  });
  EB(s, 'How we label information', 128, 806, 800, TLIGHT);
  let kx = 128;
  for (const [k, t] of [['factD', 'Case fact'], ['researchD', 'External research'], ['proposedD', 'Proposed tactic'], ['assumeD', 'Financial assumption']]) kx += TAG(s, k, t, kx, 856) + 16;

  s = slide('Ivory appendix', 'Appendix');
  s.addText('A1 · Claims Guardrails', { placeholder: 'title' });
  TAG(s, 'fact', 'Case fact', 1792, 153, true);
  TABLE(s, [
    ['What we say', 'What we avoid'],
    ['Supports the helpful bacteria already in your mouth', 'Adds live probiotics or creates new bacteria'],
    ['Cavity protection, plus care for helpful bacteria', 'Ordinary toothpaste kills all bacteria'],
    ['An additional Crest choice for wellness-minded shoppers', 'Other toothpastes lack protection or innovation'],
    ['“Thrive” means a routine and a community', 'Superior clinical outcomes vs. ordinary toothpaste'],
    ['Make the morning brush yours; brush twice a day', 'Athletic performance, immunity or systemic benefits'],
    ['Dentists and hygienists explain it in plain language', 'Paying professionals per recommendation'],
  ], 128, 264, 1664, [50, 50], { px: 26, rowH: 60 });
  T(s, 'Professionals receive supporting evidence and accurate materials, and decide whether the product is appropriate to recommend. New health claims go through review before use.', 128, 720, 1664, 80, { px: 24, color: MUTED });

  s = slide('Ivory appendix', 'Appendix');
  s.addText('A2 · Dental Scenario Math', { placeholder: 'title' });
  TAG(s, 'assume', 'Financial assumption', 1792, 153, true);
  TABLE(s, [
    ['Input', 'Value', 'Type'], ['Sample production budget', '$50,000', 'Proposed'], ['Production cost per sample', '$1', 'Assumed'], ['Samples produced', '50,000', 'Derived'],
    ['Reach distinct recipients', '80%', 'Assumed'], ['Recipients', '40,000', 'Derived'], ['Purchase window', '60 days', 'Proposed'], ['Retail price per tube', '$8', 'Assumed'], ['Full dental program cost', '$100,000', 'Proposed'],
  ], 128, 264, 760, [56, 22, 22], { px: 24, rowH: 54, alignRight: [1] });
  EB(s, 'Formulas', 936, 264, 856);
  T(s, 'Buyers = 40,000 × conversion rate\nCost per buyer = $100,000 ÷ buyers\nInitial sales = buyers × $8 (one tube)', 936, 312, 856, 150, { px: 28, color: NAVY, lineSpacingMultiple: 1.35 });
  TABLE(s, [
    ['Scenario', 'Rate', 'Buyers', 'Cost / buyer', 'Retail sales'],
    ['Conservative', '5%', '2,000', '$50.00', '$16,000'], [{ text: 'Base', bold: true, color: TEAL }, '10%', '4,000', '$25.00', '$32,000'], ['Strong', '15%', '6,000', '≈ $16.67', '$48,000'],
  ], 936, 490, 856, [24, 14, 18, 22, 22], { px: 24, rowH: 54, alignRight: [1, 2, 3, 4] });
  T(s, 'Repeat purchases are excluded. Retail sales are not Crest net revenue or profit. Not every buyer is new to Crest; some purchases may switch from other Crest products.', 128, 830, 1664, 80, { px: 24, color: MUTED });

  s = slide('Ivory appendix', 'Appendix');
  s.addText('A3 · Sampling Research', { placeholder: 'title' });
  TAG(s, 'research', 'External research', 1792, 153, true);
  const rs = [['Sampl · Colgate, Italy and Spain', '26%', 'self-reported purchase rate within two weeks, for a targeted toothpaste campaign that included media, audience profiling and follow-up.', 'sampltech.com/case-studies/40000-marketing-optins-colgate', 'https://www.sampltech.com/case-studies/40000-marketing-optins-colgate'], ['SoPost · across its campaigns', '≈ 1 in 6', 'consumers purchase after sampling, as reported by the provider.', 'sopost.com/blog/your-sampling-campaign-is-flying-is-it-working', 'https://sopost.com/blog/your-sampling-campaign-is-flying-is-it-working/']];
  for (let i = 0; i < 2; i++) {
    const x = 128 + i * 848; CARDBOX(s, x, 264, 816, 480);
    EB(s, rs[i][0], x + 40, 304, 736, SAGED);
    T(s, rs[i][1], x + 40, 350, 736, 136, { px: 120, bold: true, color: NAVY, lineSpacingMultiple: 1 });
    T(s, rs[i][2], x + 40, 500, 736, 130, { px: 28 });
    T(s, [{ text: rs[i][3], options: { hyperlink: { url: rs[i][4] } } }], x + 40, 650, 736, 70, { px: 24, color: TEAL });
  }
  BOX(s, 128, 776, 1664, 140, { fill: PALE });
  T(s, 'Provider-reported results from different programs, not verified Canadian dental-clinic benchmarks. Our 5%, 10% and 15% scenarios are planning assumptions informed by this adjacent evidence.', 168, 776, 1584, 140, { px: 28, color: NAVY, valign: 'middle' });

  s = slide('Ivory appendix', 'Appendix');
  s.addText('A4 · Measurement Plan', { placeholder: 'title' });
  TAG(s, 'proposed', 'Proposed tactic', 1792, 153, true);
  TABLE(s, [
    ['Measure', 'Source', 'Watch-out'],
    [{ text: 'Samples delivered', color: NAVY }, 'Shipments to clinics and events', 'Not the same as samples handed out'],
    [{ text: 'Samples handed out', color: NAVY }, 'Estimated from clinic stock reporting', 'A handed-out sample may go unused'],
    [{ text: 'QR visits', color: NAVY }, 'Clinic-specific QR codes and landing pages', 'A scan is not a purchase'],
    [{ text: 'Coupon purchases', color: NAVY }, 'Trackable retailer coupons', 'Misses purchases made without the offer; not all incremental'],
    [{ text: 'Benefit understanding', color: NAVY }, 'Optional follow-up research', 'Target: 70% correct understanding'],
    [{ text: 'Repeat purchase', color: NAVY }, 'Retailer data where available', 'Target: 30% of buyers within 90 days'],
    [{ text: 'Incremental sales', color: NAVY }, 'Matched retail comparisons where feasible', 'Split new-to-Crest vs. existing Crest buyers'],
    [{ text: 'Community participation', color: NAVY }, 'Customer stories shared and featured with permission', 'Deduplicate customers across all channels'],
  ], 128, 264, 1664, [24, 38, 38], { px: 24, rowH: 70 });

  s = slide('Ivory appendix', 'Appendix');
  s.addText('A5 · Budget & Event Notes', { placeholder: 'title' });
  TAG(s, 'proposed', 'Proposed allocations', 1792, 153, true);
  const nt = [['No double-counting', 'Dental samples sit only in the $100K dental program, not the $150K non-dental sampling line.'], ['Event costs split', 'Event samples come from non-dental sampling; staffing and logistics from event activation.'], ['Coupons', 'Coupon discounts are funded from the $100K retail offers and merchandising line.'], ['Quotes needed', 'All figures are proposed allocations that require supplier quotes.'], ['Expo audience', 'Pre-race expos at bib pickup, when attendees can browse, not exhausted finishers.'], ['MicroBiome suit', 'A booth or photo element. Running a race in suits is optional and must justify its cost.']];
  nt.forEach(([t, d], i) => {
    const x = 128 + (i % 3) * 565.3, y = 264 + Math.floor(i / 3) * 340; CARDBOX(s, x, y, 533, 308);
    T(s, t, x + 36, y + 36, 461, 56, { px: 40, bold: true, color: NAVY });
    T(s, d, x + 36, y + 104, 461, 180, { px: 28 });
  });

  const outFile = __dirname + '/Crest_MicroBiome_Pitch.pptx';
  await pres.writeFile({ fileName: outFile });
  await applyTheme(outFile, THEME);
  console.log('wrote', outFile);
})().catch((e) => { console.error(e); process.exit(1); });
