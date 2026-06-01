# Pebbles 💛 — Daily Bible Verse Desktop App

A personal Electron desktop application for Windows that delivers a daily Bible verse through a beautiful love-letter experience. Built as a heartfelt gift for a long-distance relationship, with special surprises on birthdays and anniversaries.

---

## What it does

- **Daily verse** — displays one Bible verse per day (deterministic by day of year, cycles through up to 365 entries)
- **Envelope interaction** — verse is delivered inside an animated envelope you tap to open; the letter card rises out and can be flipped to reveal a postcard on the back
- **Time-aware greeting** — shows Good Morning / Good Afternoon / Good Evening with the recipient's name
- **Birthday screen** — on June 4 every year, a full-screen celebration with confetti replaces the normal view
- **Anniversary screen** — on January 17 every year, a dedicated anniversary message with confetti
- **Floating hearts** — soft animated hearts drift across the lavender background
- **Works in browser too** — open `index.html` directly in Chrome/Edge as a fallback (no install needed)

---

## Tech stack

| Layer | Technology |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) v29 |
| Frontend | Vanilla HTML5 / CSS3 / JavaScript (ES5-compatible, no framework) |
| Fonts | Google Fonts — Cormorant Garamond, Nunito, Caveat |
| Animations | Pure CSS keyframe animations + Canvas API (confetti) |
| Packaging | [electron-builder](https://www.electron.build/) — produces a Windows NSIS installer |
| Data | Plain JS array in `verses.js` (no database) |

---

## Project structure

```
loveverse/
├── main.js          # Electron main process — window creation
├── index.html       # App UI structure
├── styles.css       # All styling (lavender theme, animations, envelope/card)
├── renderer.js      # App logic — verse selection, greetings, interactions
├── verses.js        # ✏️  Bible verse data — easy to edit, up to 365 entries
├── assets/          # Your personal images (not included in repo)
│   ├── Postcard.png     # Photo shown on the back of the card
│   ├── animal.png       # Decorative corner character
│   └── logo.ico         # App icon
└── package.json     # Dependencies + electron-builder config
```

---

## Setup & running

### Prerequisites
- [Node.js](https://nodejs.org) (LTS version recommended)

### Install & run
```bash
npm install
npm start
```

### Build Windows installer
```bash
npm run build
```
Output goes to `dist/`. The installer is unsigned — Windows SmartScreen will show a warning; click **More info → Run anyway** to proceed.

---

## Personalisation

Open **`renderer.js`** and edit the settings at the top:

```js
var RECIPIENT_NAME  = 'Your Love';   // name shown in the greeting
```

Open **`index.html`** to edit birthday/anniversary message text.

Open **`verses.js`** to add or replace Bible verses — each entry is just:
```js
{ reference: "John 3:16", verse: "For God so loved the world..." },
```

Drop your photo into the `assets/` folder and set the filename in `styles.css`:
```css
.letter-back {
  background: url('assets/YourPhoto.png') center center / contain no-repeat;
}
```

---

## ⚠️ Assets not included

The `assets/` folder is excluded from this repository as it contains personal images. You will need to supply your own:
- `Postcard.png` — photo shown on the back of the card
- `animal.png` — corner decoration
- `logo.ico` — app icon (generate with `node make-icon.js` or supply your own)

---

*Built with love.*
