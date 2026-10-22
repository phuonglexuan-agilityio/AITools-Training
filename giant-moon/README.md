# Giant Moon's Universe

A single-page birthday website for Giant Moon (October 24). Plain HTML, CSS and
JavaScript with no build step.

## Sections

1. **Welcome** – glowing moon, "Enter Your Universe ✨" button (unlocks sound and the rest of the page).
2. **Birthday songs** – English and Chinese cards; tapping one plays a music-box
   Happy Birthday (Web Audio, no audio files), lights up the lyrics and fires confetti.
3. **Personality** – four tappable stars (Scorpio, Water element).
4. **Gym-Food Paradox** – looping chibi (lift → drink → spot food → sparkle → hug cake),
   rotating slogans; tap her to make her jump and wink.
5. **A Wish Just for You** – envelope, letter revealed line by line, finale with fireworks replay.

## Run locally

```bash
cd giant-moon
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

| Path | What |
| --- | --- |
| `index.html` | Page markup and all copy (letter, star texts, lyrics) |
| `styles.css` | Moonlit Dream theme, mobile first |
| `main.js` | Starfield, reveals, interactions, confetti and fireworks |
| `music.js` | Music-box Happy Birthday via Web Audio |
| `assets/chibi/*.svg` | Chibi poses |
| `assets/og-image.png` | WhatsApp / social link preview |
| `vendor/confetti.browser.js` | [canvas-confetti](https://github.com/catdad/canvas-confetti) 1.9.3 (ISC) |

## Deploy on Netlify

1. Sign up at netlify.com with **Sign up with GitHub**.
2. **Add new site → Import an existing project → GitHub**, pick this repo.
3. Set **Base directory** to `giant-moon`. Leave the build command empty; publish directory is `.` (from `netlify.toml`).
4. **Site configuration → Change site name** to `giantmoon` → https://giantmoon.netlify.app.

If you pick a different site name, update the `og:image` URL in `index.html` so the link preview works.

The site is marked `noindex` (meta tag, `robots.txt` and an `X-Robots-Tag` header), so search
engines skip it; anyone with the link can still open it.
