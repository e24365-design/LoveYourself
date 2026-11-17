# LoveYourself – next set of files

Upload everything in this folder to the root of your repo (keep the `assets` folder), replacing files with the same name.

Then delete from the repo:
- `index .html` (the one with a space in its name – GitHub never uses it)
- `mood.css` (old, replaced by `pages.css`)

New / changed:
- index.html – Mood Tracker and Win Jar tiles now open their own pages
- mood.html, mood.js – cat shelves for the current month/year (28–31 cats), month stickers, bold numbers, history
- win.html, jar.html, jar.js – four jars, each with its own page, saved items with date + time, add form
- common.js – saving + Backup/Restore buttons; pages.css – shared styling
- assets/ – cut-out jars, month stickers, botanical stickers

Saving: entries live in your browser (localStorage). Use the Backup button now and then, because clearing browser data erases them.
