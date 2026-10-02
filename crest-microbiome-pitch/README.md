# Crest MicroBiome — Case Competition Pitch

A 7-minute pitch deck for Crest MicroBiome's Canadian launch (Summer 2027, CAD $1M Year 1 budget), built around the **CREST** framework: Connect, Reveal, Experience, Shop, Thrive.

- `project/` holds the deck source: `deck.json` (slide order and sections) and one HTML file per slide in `project/slides/`. Slides 1–26 are the main pitch; slides 27–32 are appendix exhibits.
- `assets/` holds the rendered concept art: the packaging mockup, creator post, storyboard frames, dental take-home kit, patient card, expo booth, shelf display and balance visual.
- `assets-src/` holds the HTML/SVG sources for that art. To re-render one, run `node render.js <scene>.html ../assets/<scene>.png` from that folder. The script needs Playwright and a `fonts.css` file that loads DM Sans and Cormorant Garamond.

The packaging is a concept drawn for this deck, and the QR codes are decorative placeholders. Figures are proposed allocations and illustrative assumptions, and they are labeled that way on the slides.
