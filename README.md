# Aayush Upadhyay — Portfolio

[View the live portfolio](https://aayush-digital-studio.stormyhill8.chatgpt.site)

A responsive personal portfolio featuring EvalOps, NEXUS, and JobFlowQ, with an off-white and sage palette, interactive geometric 3D artwork, and scroll-driven project displays.

## Run locally

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://localhost:8080. This is a static website; no package installation or build step is required.

## Files

- `index.html`: page content and links
- `style.css`, `natural.css`, `motion.css`: layout, theme, and project perspective effects
- `app.js`: project details and copy-email interaction
- `scene.js`: Three.js artwork and motion controls
- `motion.js`: scroll and pointer interactions
- `assets/`: local fonts, Three.js, favicon, and downloadable resume

The resume download uses the PDF supplied by Aayush. LinkedIn, GitHub, and email links appear on the page. Project previews are labeled illustrative interfaces rather than live application screenshots.

## Accessibility and hosting

Project dialogs support keyboard dismissal and restore focus. Reduced-motion preferences disable automatic movement; the animation control pauses both the artwork and scrolling effects. The content remains accessible without WebGL.

All required assets use relative paths, so the repository root can be served by a static host or GitHub Pages. `.nojekyll` keeps the site as plain static files. Hosting settings are managed separately from the source.

The bundled Three.js license is in `assets/three-LICENSE.txt`.

[GitHub](https://github.com/Aayush-25) · [LinkedIn](https://www.linkedin.com/in/aayush-upadhyay-63bb3a27b) · [Email](mailto:aayushupadhyaydev@gmail.com)
