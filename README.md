# Vibhav — portfolio

Vite + vanilla JS · animejs v4 (4.0.2) · three.js (0.170.0) · Lenis · @fontsource (Bricolage Grotesque, JetBrains Mono).

```
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
```

## Where to edit things
- `src/data/site.js` — email, GitHub, social, hero subtitle, bio, facts, terminal lines
- `src/data/projects.js` — project cards + detail view
- `src/scenes/phoneSpec.js` — blueprint label text/sides, timeline length
- `src/styles/tokens.css` — colours and fonts

## Structure
```
src/
  animations/  anime.js (v4 imports + createDrawable shim) · scroll.js (Lenis) · cursor.js · split.js · reveal.js · thumbs.js
  scenes/      signalCore.js (hero SVG) · phoneModel.js (pivots/parts) · phoneScene.js (renderer) · phoneSpec.js
  sections/    intro · nav · hero · phone (master timeline) · blueprint (labels + leader lines) · scrubber · work · detail · lab · about
  data/        site.js · projects.js
  styles/      tokens · base · hero · stage · work · lab · about · detail
```

## Notes
- three.js loads lazily (own chunk) when the phone section is within ~900px of the viewport; rendering pauses off-screen.
- One master `createTimeline` is seeked from scroll progress, so reversing is exact. The scrubber moves the page scroll.
- `prefers-reduced-motion`: Lenis off, loops off, the opening becomes a crossfade between closed and blueprint states.
- Tune the look of the 3D scene in `phoneScene.js` (light intensities) and `phoneModel.js` (part colours, sizes, hinge angles).
