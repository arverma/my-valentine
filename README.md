# Valentine Week

A single-page Valentine Week site (7–14 February): one day per view, couple photo, YouTube Shorts, optional floating music hearts and decorative effects. **Fully config-driven** — create your own version by editing **config.js** only; no build step.

---

## Quick start

- **Run locally:** Open `index.html` in a browser, or use a static server (e.g. `npx serve`, `python -m http.server`).
- **No build:** Plain HTML, CSS, and JavaScript. No bundler or Node required.
- **Create your page:** Copy the repo, add your image and music files, then edit **config.js** (see [Configuration](#configuration)).

---

## Project structure

```
my-valentine/
├── index.html    # Single HTML shell; load order: config.js → script.js
├── config.js     # ← Edit this to customize (names, photo, days, videos, music, counts)
├── script.js     # App logic (no need to touch for standard customization)
├── style.css     # Styles (optional overrides)
├── images/       # Put your couple photo here (e.g. we.jpg)
├── music/        # Put audio files here (e.g. 1.webm, 2.webm)
└── README.md
```

- **config.js** must define `window.VALENTINE_CONFIG`. It is loaded before `script.js`.
- **Assets:** Reference images and music with paths relative to the project root (e.g. `images/we.jpg`, `music/1.webm`).

---

## Configuration

All customization is done in **config.js** via the `VALENTINE_CONFIG` object. Below is a full reference.

### `personal`

| Key | Description |
|-----|-------------|
| `fromName` | Your name (used in floating text and labels). |
| `toName` | Partner’s name. |
| `photoUrl` | URL/path to the couple photo (e.g. `"images/we.jpg"`). |
| `photoClickMessage` | Reserved for future use (e.g. toast message). |

### `page`

| Key | Description |
|-----|-------------|
| `title` | Document title (browser tab). |
| `lang` | HTML `lang` attribute (e.g. `"en"`). |
| `comingSoonMessage` | Shown when the current date is before Valentine Week. |
| `pastWeekMessage` | Shown when the current date is after 14 Feb. |

### `days`

Array of day objects, one per day (7–14 Feb). Order should match the week.

| Key | Description |
|-----|-------------|
| `nameEn` | Day label (e.g. `"Rose Day"`, `"Valentine's Day"`). |
| `date` | Day of month (7–14). |
| `videoId` | YouTube video ID for the Shorts embed (e.g. `"yYHGvhs06Xc"`). |

Example:

```js
days: [
  { nameEn: "Rose Day", date: 7, videoId: "oDSfEuErIEc" },
  { nameEn: "Valentine's Day", date: 14, videoId: "yYHGvhs06Xc" }
  // ... 8 entries total
]
```

### `emojiConfig`

Per-day emoji sets for the floating emoji layer. Keys are day indices **1–8** (1 = first day, 8 = last).

- **Key:** Day index (1–8).  
- **Value:** Array of strings (emoji or unicode decorators) to pick from randomly.

Example:

```js
emojiConfig: {
  1: ["ℛosé", "🌷", "♡"],
  8: ["❤︎", "♡", "⋆˙⟡"]
}
```

Missing keys fall back to a default set.

### `emojiCount`, `floatEmojiDuration`, `floatEmojiDelayMax`

| Key | Description |
|-----|-------------|
| `emojiCount` | Number of floating emoji elements. |
| `floatEmojiDuration` | `{ min, max }` — animation duration in seconds. |
| `floatEmojiDelayMax` | Max delay (seconds) before an emoji starts animating. |

### `musicTracks`

Array of track objects for the floating music buttons. Each plays a looping audio track.

| Key | Description |
|-----|-------------|
| `id` | Unique ID (used for the `<audio>` element). |
| `src` | Path to audio file (e.g. `"music/1.webm"`). |
| `emoji` | Label shown on the button (emoji or character). |

Example:

```js
musicTracks: [
  { id: "track1", src: "music/1.webm", emoji: "🎧" },
  { id: "track2", src: "music/2.webm", emoji: "♬" }
]
```

Supported formats depend on the browser (e.g. WebM, MP3). Use paths relative to the project root.

### `yellowHeartCount`

Controls how many yellow heart buttons appear in the music float layer (random count per load/reset).

| Key | Description |
|-----|-------------|
| `min` | Minimum number of yellow hearts. |
| `max` | Maximum number (inclusive). |

Example: `{ min: 3, max: 5 }` gives 3–5 hearts. **Double-clicking the couple photo** resets these hearts to a new random count in this range.

### `heartBurst`

Particle burst when clicking a yellow heart.

| Key | Description |
|-----|-------------|
| `emoji` | Character/emoji used for particles (e.g. `"❤️"`). |
| `color` | CSS color for the particles. |

### Other numeric options

| Key | Description |
|-----|-------------|
| `floatNamesCount` | Number of floating “From → To” name labels. |
| `starCount` | Number of stars in the starfield. |
| `confettiCount` | Particles used in confetti effect. |
| `heartBurstParticleCount` | Particles per heart burst. |
| `toastDurationMs` | Reserved for future toast use (ms). |

---

## Assets

- **Images:** Place files in `images/` and set `personal.photoUrl` (e.g. `"images/we.jpg"`). Any format the browser supports (JPEG, PNG, WebP, etc.) is fine.
- **Music:** Place files in `music/` and set each `musicTracks[].src` (e.g. `"music/1.webm"`). Prefer formats with broad support (e.g. WebM and/or MP3).

---

## Behaviour (for developers)

- **Navigation:** Left/right arrows or on-screen prev/next switch between days (1–8). The correct day is chosen by current date when the page loads.
- **YouTube:** Videos are embedded via the YouTube iframe API; each day uses `days[i].videoId`. Ensure the IDs are valid Shorts or videos.
- **Photo:** Single click does nothing. **Double-click** on the couple photo resets the **yellow hearts** in the music layer to a new random count (between `yellowHeartCount.min` and `yellowHeartCount.max`).
- **Music:** Clicking a music emoji button plays that track (and stops others). Clicking a yellow heart triggers a heart-burst animation and removes that heart.

---

## Customization summary

- **Names, photo, messages:** `personal`, `page`.
- **Days and videos:** `days` (labels + YouTube IDs).
- **Floating emojis:** `emojiConfig`, `emojiCount`, `floatEmojiDuration`, `floatEmojiDelayMax`.
- **Music:** `musicTracks` (+ add files in `music/`).
- **Yellow hearts:** `yellowHeartCount`; reset by double-clicking the photo.
- **Visual density:** `floatNamesCount`, `starCount`, `confettiCount`, `heartBurst`, `heartBurstParticleCount`.

You do **not** need to edit **script.js** or **index.html** for the above. For deeper changes (e.g. new UI or behaviour), extend `script.js` and/or `style.css` as needed.

---

## Browser support

Modern browsers with ES5+ and standard DOM/CSS. YouTube embed requires network access and depends on YouTube’s iframe API.

---

## License

Use and modify as you like. No warranty. If you redistribute, keeping attribution is appreciated.
