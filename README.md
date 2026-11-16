# LoveYourself — Mood Tracker Integration Guide

## Included Files
1. `mood.html` — The complete `<section id="mood">` markup to replace your current placeholder section in `index.html`.
2. `mood.css` — All styles for the cat shelves, die-cut month stickers, bold geometric outline numbers, botanical corner stickers, watercolor quote badge, and history archive.
3. `mood.js` — Interactive logic that detects the current month/year, generates the exact number of kitties (`28`, `29`, `30`, or `31`), saves moods & daily notes permanently in `localStorage`, and provides full history viewing + JSON backup/restore.

## Quick Setup in `index.html`
1. Place `mood.css` and `mood.js` in the root folder of your `LoveYourself` repository (alongside `index.html`).
2. Inside `<head>` of `index.html`, add:
   ```html
   <link rel="stylesheet" href="mood.css?v=1">
   ```
3. Replace your existing Mood Tracker `<section>` in `index.html` with the contents of `mood.html`.
4. Just before `</body>` in `index.html`, add:
   ```html
   <script src="mood.js?v=1"></script>
   ```
