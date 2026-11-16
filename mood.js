/* ==========================================================================
   LoveYourself — Mood Tracker Logic (mood.js)
   - Automatically detects current month & year (and calculates exact days:
     28, 29 in leap years, 30, or 31).
   - Renders hand-drawn style kitties arranged on 4 cozy shelves with flowers,
     tall/short ears, and curling tails just like your cat tracker illustration.
   - Persists every single entry forever in localStorage (with JSON export/import).
   - Renders die-cut Month Stickers & Bold Art-Deco Outline Numbers.
   ========================================================================== */

(() => {
  const STORAGE_KEY = 'loveyourself_mood_tracker_v1';

  const MOODS = {
    happy:     { label: 'Happy',     color: '#d97373' },
    soso:      { label: 'So So',     color: '#a4b97c' },
    excited:   { label: 'Excited',   color: '#f3b844' },
    sad:       { label: 'Sad',       color: '#a9a8d4' },
    depressed: { label: 'Depressed', color: '#b79678' },
    angry:     { label: 'Angry',     color: '#dc675b' }
  };

  /* Month Sticker Colors inspired by your uploaded Month Sticker Sheet */
  const MONTH_STICKERS = [
    { name: 'January',   tint: '#9ed9db' },
    { name: 'February',  tint: '#f2b5b8' },
    { name: 'March',     tint: '#a8dfb9' },
    { name: 'April',     tint: '#f6c58f' },
    { name: 'May',       tint: '#d7b9ea' },
    { name: 'June',      tint: '#9ac8f2' },
    { name: 'July',      tint: '#b2e3b6' },
    { name: 'August',    tint: '#f29f9f' },
    { name: 'September', tint: '#9bc2e6' },
    { name: 'October',   tint: '#e5be6b' },
    { name: 'November',  tint: '#f3c178' },
    { name: 'December',  tint: '#cbb4e8' }
  ];

  /* Watercolor Affirmation Quotes from your uploaded sticker sheet */
  const QUOTES = [
    'Good things take time',
    'Trust the magic of new beginnings',
    'Life is tough, but so are you',
    'The best is yet to come',
    'Trust the timing of your life',
    'Less thinking, more creating',
    "Don't be afraid to be great",
    "Don't worry!",
    'Think positive',
    'Stay strong',
    'Positive mind, positive vibes, positive life',
    'Trust the process'
  ];

  /* Bold Art-Deco Outline Number Paths (0–9) matching your number reference */
  const ARTDECO_DIGITS = {
    '0': `<rect x="4" y="3" width="16" height="34" rx="8" fill="none" stroke="#2f2523" stroke-width="2.6"/><line x1="12" y1="3" x2="12" y2="37" stroke="#2f2523" stroke-width="2.6"/>`,
    '1': `<path d="M7 4 L15 4 L15 36 L10 36 L10 4" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linejoin="round"/>`,
    '2': `<path d="M5 12 C5 5, 19 5, 19 12 C19 19, 5 36, 5 36 L20 36 M17 8 L8 36" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    '3': `<path d="M6 4 L14 4 C19 4, 19 18, 12 19 C20 19, 20 36, 12 36 C7 36, 5 33, 5 30 M14 19 L14 36" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linecap="round"/>`,
    '4': `<path d="M16 36 L16 4 L5 23 L19 23 M12 11 L12 23" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    '5': `<path d="M19 4 L7 4 L7 18 C14 15, 20 19, 20 27 C20 34, 13 37, 7 35 M14 17 L14 36" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    '6': `<path d="M18 8 C15 3, 5 4, 5 18 L5 25 C5 34, 19 35, 19 26 C19 19, 10 18, 10 18 M10 4 L10 35" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linecap="round"/>`,
    '7': `<path d="M5 4 L19 4 L9 36 L5 36 L14 4" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linejoin="round"/>`,
    '8': `<ellipse cx="12" cy="11" rx="6.5" ry="7" fill="none" stroke="#2f2523" stroke-width="2.6"/><ellipse cx="12" cy="27" rx="7.5" ry="9" fill="none" stroke="#2f2523" stroke-width="2.6"/><line x1="9" y1="18" x2="9" y2="35" stroke="#2f2523" stroke-width="2.4"/><line x1="15" y1="18" x2="15" y2="35" stroke="#2f2523" stroke-width="2.4"/>`,
    '9': `<path d="M6 32 C9 37, 19 36, 19 22 L19 15 C19 6, 5 5, 5 14 C5 21, 14 22, 14 22 M14 5 L14 36" fill="none" stroke="#2f2523" stroke-width="2.6" stroke-linecap="round"/>`
  };

  function renderArtDecoNumber(numStr) {
    return String(numStr)
      .split('')
      .map(ch => `<svg class="artdeco-digit-svg" viewBox="0 0 24 40" aria-hidden="true">${ARTDECO_DIGITS[ch] || ''}</svg>`)
      .join('');
  }

  /* Load & Save Forever in localStorage */
  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('Could not read mood records:', e);
      return {};
    }
  }

  function saveRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      const indicator = document.getElementById('mood-save-indicator');
      if (indicator) {
        indicator.textContent = 'Saved forever ✓';
        indicator.style.opacity = '1';
      }
    } catch (e) {
      console.warn('Could not save mood records:', e);
    }
  }

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-indexed (0 = Jan, 10 = Nov)
  let selectedDay = today.getDate();
  let activeBrush = 'happy';
  let quoteIndex = today.getDate() % QUOTES.length;
  let records = loadRecords();

  function dateKey(year, monthIndex, day) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  /* Generate expressive cat SVG for each day (varying heights, tails, and mood faces) */
  function buildCatSVG(day, moodKey, isTailLeft, isTailRight) {
    const mood = moodKey ? MOODS[moodKey] : null;
    const fill = mood ? mood.color : '#ffffff';
    // Alternate slightly taller and shorter kitties like the hand-drawn reference
    const isShort = day % 4 === 2 || day % 7 === 0;
    const topY = isShort ? 26 : 16;
    const earTipY = isShort ? 13 : 3;

    let tailSVG = '';
    if (isTailLeft) {
      tailSVG = `<path d="M12 72 C2 72, 1 52, 7 49 C11 47, 11 55, 8 58 C5 61, 8 67, 13 67" fill="${fill}" stroke="#2f2523" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    if (isTailRight) {
      tailSVG = `<path d="M58 72 C68 72, 69 52, 63 49 C59 47, 59 55, 62 58 C65 61, 62 67, 57 67" fill="${fill}" stroke="#2f2523" stroke-width="2.4" stroke-linecap="round"/>`;
    }

    let faceSVG = '';
    const faceY = isShort ? 46 : 40;
    if (moodKey === 'happy') {
      faceSVG = `
        <path d="M23 ${faceY} Q26 ${faceY + 4} 29 ${faceY} M41 ${faceY} Q44 ${faceY + 4} 47 ${faceY}" fill="none" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <path d="M33 ${faceY + 3} L37 ${faceY + 3} L35 ${faceY + 5.5} Z" fill="#2f2523"/>
        <path d="M30 ${faceY + 6} Q32.5 ${faceY + 10} 35 ${faceY + 6} Q37.5 ${faceY + 10} 40 ${faceY + 6}" fill="none" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 ${faceY + 1} L21 ${faceY + 2} M16 ${faceY + 5} L21 ${faceY + 4} M54 ${faceY + 1} L49 ${faceY + 2} M54 ${faceY + 5} L49 ${faceY + 4}" stroke="#2f2523" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (moodKey === 'soso') {
      faceSVG = `
        <path d="M23 ${faceY} L29 ${faceY} M41 ${faceY} L47 ${faceY}" stroke="#2f2523" stroke-width="2.1" stroke-linecap="round"/>
        <path d="M33 ${faceY + 3} L37 ${faceY + 3} L35 ${faceY + 5.5} Z" fill="#2f2523"/>
        <path d="M31 ${faceY + 8} L39 ${faceY + 8}" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 ${faceY + 1} L21 ${faceY + 2} M16 ${faceY + 5} L21 ${faceY + 4} M54 ${faceY + 1} L49 ${faceY + 2} M54 ${faceY + 5} L49 ${faceY + 4}" stroke="#2f2523" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (moodKey === 'excited') {
      faceSVG = `
        <circle cx="26" cy="${faceY}" r="2" fill="#2f2523"/>
        <circle cx="44" cy="${faceY}" r="2" fill="#2f2523"/>
        <path d="M33 ${faceY + 3} L37 ${faceY + 3} L35 ${faceY + 5.5} Z" fill="#2f2523"/>
        <path d="M30 ${faceY + 6} Q32.5 ${faceY + 9} 35 ${faceY + 6} Q37.5 ${faceY + 9} 40 ${faceY + 6}" fill="none" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <path d="M32.5 ${faceY + 8} C32.5 ${faceY + 13}, 37.5 ${faceY + 13}, 37.5 ${faceY + 8}" fill="#e67e7e" stroke="#2f2523" stroke-width="1.7"/>
        <path d="M16 ${faceY} L21 ${faceY + 2} M15 ${faceY + 4} L21 ${faceY + 4} M16 ${faceY + 8} L21 ${faceY + 6} M54 ${faceY} L49 ${faceY + 2} M55 ${faceY + 4} L49 ${faceY + 4} M54 ${faceY + 8} L49 ${faceY + 6}" stroke="#2f2523" stroke-width="1.7" stroke-linecap="round"/>
      `;
    } else if (moodKey === 'sad') {
      faceSVG = `
        <path d="M23 ${faceY + 1} L29 ${faceY - 1} M41 ${faceY - 1} L47 ${faceY + 1}" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <circle cx="26" cy="${faceY + 2.5}" r="1.5" fill="#2f2523"/>
        <circle cx="44" cy="${faceY + 2.5}" r="1.5" fill="#2f2523"/>
        <path d="M33 ${faceY + 4} L37 ${faceY + 4} L35 ${faceY + 6} Z" fill="#2f2523"/>
        <path d="M31 ${faceY + 10} Q35 ${faceY + 6} 39 ${faceY + 10}" fill="none" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 ${faceY + 2} L21 ${faceY + 3} M16 ${faceY + 6} L21 ${faceY + 5} M54 ${faceY + 2} L49 ${faceY + 3} M54 ${faceY + 6} L49 ${faceY + 5}" stroke="#2f2523" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (moodKey === 'depressed') {
      faceSVG = `
        <path d="M23 ${faceY + 1} Q26 ${faceY - 2.5} 29 ${faceY + 1} M41 ${faceY + 1} Q44 ${faceY - 2.5} 47 ${faceY + 1}" fill="none" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
        <path d="M25 ${faceY + 3} L22 ${faceY + 13} M28 ${faceY + 3} L26 ${faceY + 13} M45 ${faceY + 3} L48 ${faceY + 13} M42 ${faceY + 3} L44 ${faceY + 13}" stroke="#2f2523" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M33 ${faceY + 4} L37 ${faceY + 4} L35 ${faceY + 6} Z" fill="#2f2523"/>
        <path d="M30 ${faceY + 11} Q35 ${faceY + 5} 40 ${faceY + 11}" fill="none" stroke="#2f2523" stroke-width="2" stroke-linecap="round"/>
      `;
    } else if (moodKey === 'angry') {
      faceSVG = `
        <path d="M22 ${faceY - 2} L29 ${faceY + 2} M48 ${faceY - 2} L41 ${faceY + 2}" stroke="#2f2523" stroke-width="2.1" stroke-linecap="round"/>
        <circle cx="25.5" cy="${faceY + 2.5}" r="1.7" fill="#2f2523"/>
        <circle cx="44.5" cy="${faceY + 2.5}" r="1.7" fill="#2f2523"/>
        <path d="M29 ${faceY + 11} C29 ${faceY + 5}, 41 ${faceY + 5}, 41 ${faceY + 11} Z" fill="#ffffff" stroke="#2f2523" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M32 ${faceY + 7} L33.5 ${faceY + 9.5} L35 ${faceY + 7} L36.5 ${faceY + 9.5} L38 ${faceY + 7}" fill="none" stroke="#2f2523" stroke-width="1.4"/>
      `;
    }

    return `
      <svg class="cat-day-svg" viewBox="0 0 70 76" aria-hidden="true">
        ${tailSVG}
        <path d="M12 74 L14 ${topY + 12} L13 ${earTipY} L25 ${topY} C31 ${topY - 2}, 39 ${topY - 2}, 45 ${topY} L57 ${earTipY} L56 ${topY + 12} L58 74 Z"
              fill="${fill}" stroke="#2f2523" stroke-width="2.5" stroke-linejoin="round"/>
        ${faceSVG}
      </svg>
    `;
  }

  function buildFlowerSVG(petalColor) {
    return `
      <svg class="shelf-flower-svg" viewBox="0 0 54 64" aria-hidden="true">
        <path d="M27 62 Q27 42 22 28" fill="none" stroke="#2f2523" stroke-width="2.3" stroke-linecap="round"/>
        <path d="M27 56 C15 54, 10 45, 13 39 C20 41, 25 48, 27 56 Z" fill="#8cb369" stroke="#2f2523" stroke-width="2" stroke-linejoin="round"/>
        <path d="M27 56 C38 54, 43 46, 40 40 C34 42, 29 48, 27 56 Z" fill="#8cb369" stroke="#2f2523" stroke-width="2" stroke-linejoin="round"/>
        <path d="M22 28 C12 27, 10 15, 18 14 C21 14, 23 17, 24 18 C25 15, 29 13, 33 16 C37 20, 32 29, 22 28 Z"
              fill="${petalColor}" stroke="#2f2523" stroke-width="2.2" stroke-linejoin="round"/>
      </svg>
    `;
  }

  /* Split total days (28..31) into 4 cozy shelves matching your illustration */
  function splitIntoShelves(totalDays) {
    const base = Math.floor(totalDays / 4);
    const rem = totalDays % 4;
    const counts = [
      base + (rem > 0 ? 1 : 0),
      base + (rem > 1 ? 1 : 0),
      base + (rem > 2 ? 1 : 0),
      base
    ];
    const shelves = [];
    let currentDay = 1;
    for (const c of counts) {
      const row = [];
      for (let i = 0; i < c; i++) {
        row.push(currentDay++);
      }
      shelves.push(row);
    }
    return shelves;
  }

  function renderTracker() {
    const totalDays = daysInMonth(viewYear, viewMonth);
    if (selectedDay > totalDays) selectedDay = totalDays;

    // 1. Update Month Sticker & Art-Deco Year
    const stickerData = MONTH_STICKERS[viewMonth];
    const stickerWrap = document.getElementById('month-sticker');
    const stickerBack = document.getElementById('month-sticker-back');
    const stickerScript = document.getElementById('month-sticker-script');
    if (stickerWrap && stickerBack && stickerScript) {
      stickerWrap.style.setProperty('--sticker-tint', stickerData.tint);
      stickerBack.textContent = stickerData.name.toUpperCase();
      stickerScript.textContent = stickerData.name;
    }

    const yearDisplay = document.getElementById('mood-year-display');
    if (yearDisplay) {
      yearDisplay.innerHTML = renderArtDecoNumber(viewYear);
      yearDisplay.setAttribute('aria-label', String(viewYear));
    }

    // 2. Render 4 Cat Shelves with exact days of the month
    const container = document.getElementById('cat-shelves-container');
    if (!container) return;
    container.innerHTML = '';

    const shelves = splitIntoShelves(totalDays);
    shelves.forEach((daysRow, rowIdx) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'cat-shelf-row';

      // Row 3 has a cute purple flower on the left (matching your illustration)
      if (rowIdx === 2) {
        rowEl.insertAdjacentHTML('beforeend', buildFlowerSVG('#a9a8d4'));
      }

      daysRow.forEach((day, idxInRow) => {
        const key = dateKey(viewYear, viewMonth, day);
        const entry = records[key] || {};
        const isToday =
          viewYear === today.getFullYear() &&
          viewMonth === today.getMonth() &&
          day === today.getDate();

        const isTailLeft = (rowIdx === 1 || rowIdx === 3) && idxInRow === 0;
        const isTailRight = (rowIdx === 0 || rowIdx === 1 || rowIdx === 2) && idxInRow === daysRow.length - 1;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cat-day-btn';
        if (isToday) btn.classList.add('is-today');
        if (day === selectedDay) btn.classList.add('is-active-day');
        btn.dataset.day = String(day);
        btn.setAttribute(
          'aria-label',
          `${stickerData.name} ${day}, ${viewYear}: ${entry.mood ? MOODS[entry.mood].label : 'Not logged yet'}`
        );

        btn.innerHTML = `
          ${buildCatSVG(day, entry.mood, isTailLeft, isTailRight)}
          <span class="cat-day-badge">${day}</span>
        `;

        btn.addEventListener('click', () => handleDayClick(day));
        rowEl.appendChild(btn);
      });

      // Row 4 has a warm coral-orange flower on the right (matching your illustration)
      if (rowIdx === 3) {
        rowEl.insertAdjacentHTML('beforeend', buildFlowerSVG('#e67e5a'));
      }

      container.appendChild(rowEl);
    });

    updateSelectedDayBar();
    updateHistoryBadge();
  }

  function handleDayClick(day) {
    selectedDay = day;
    const key = dateKey(viewYear, viewMonth, day);
    const existing = records[key] || {};

    if (activeBrush === 'clear') {
      if (existing.note) {
        records[key] = { note: existing.note, updatedAt: new Date().toISOString() };
      } else {
        delete records[key];
      }
    } else {
      records[key] = {
        ...existing,
        mood: activeBrush,
        updatedAt: new Date().toISOString()
      };
    }

    saveRecords(records);
    renderTracker();
    if (!document.getElementById('mood-history-panel').hidden) {
      renderHistoryPanel();
    }
  }

  function updateSelectedDayBar() {
    const key = dateKey(viewYear, viewMonth, selectedDay);
    const entry = records[key] || {};
    const dayArtDeco = document.getElementById('selected-day-artdeco');
    const moodText = document.getElementById('selected-day-mood-text');
    const noteInput = document.getElementById('mood-day-note');

    if (dayArtDeco) {
      dayArtDeco.innerHTML = renderArtDecoNumber(selectedDay);
    }
    if (moodText) {
      moodText.textContent = entry.mood
        ? `• Feeling ${MOODS[entry.mood].label}`
        : '• Tap a kitty to log mood';
    }
    if (noteInput) {
      noteInput.value = entry.note || '';
    }
  }

  function updateHistoryBadge() {
    const badge = document.getElementById('history-count-badge');
    if (badge) {
      const count = Object.values(records).filter(r => r && r.mood).length;
      badge.textContent = String(count);
    }
  }

  function renderHistoryPanel() {
    const summaryStrip = document.getElementById('history-summary-strip');
    const filterSelect = document.getElementById('history-month-filter');
    const listEl = document.getElementById('history-records-list');
    if (!summaryStrip || !filterSelect || !listEl) return;

    const allKeys = Object.keys(records)
      .filter(k => records[k] && (records[k].mood || records[k].note))
      .sort()
      .reverse();

    // Populate month dropdown
    const monthsSet = new Set(allKeys.map(k => k.slice(0, 7)));
    const prevVal = filterSelect.value;
    filterSelect.innerHTML = `<option value="all">All Recorded Months (${allKeys.length} entries)</option>`;
    Array.from(monthsSet).forEach(ym => {
      const [y, m] = ym.split('-');
      const mName = MONTH_STICKERS[parseInt(m, 10) - 1]?.name || m;
      const opt = document.createElement('option');
      opt.value = ym;
      opt.textContent = `${mName} ${y}`;
      filterSelect.appendChild(opt);
    });
    if (Array.from(monthsSet).includes(prevVal)) {
      filterSelect.value = prevVal;
    }

    const activeFilter = filterSelect.value;
    const filteredKeys = activeFilter === 'all'
      ? allKeys
      : allKeys.filter(k => k.startsWith(activeFilter));

    // Mood counts summary
    const counts = { happy: 0, soso: 0, excited: 0, sad: 0, depressed: 0, angry: 0 };
    filteredKeys.forEach(k => {
      const m = records[k].mood;
      if (m && counts[m] !== undefined) counts[m]++;
    });

    summaryStrip.innerHTML = Object.entries(MOODS)
      .map(([key, info]) => `
        <span class="summary-chip" style="background: ${info.color}33;">
          <span class="history-dot" style="background: ${info.color};"></span>
          ${info.label}: ${counts[key]}
        </span>
      `)
      .join('');

    if (filteredKeys.length === 0) {
      listEl.innerHTML = `<li class="history-record-item">No mood entries recorded yet. Tap any kitty above to start your forever log!</li>`;
      return;
    }

    listEl.innerHTML = filteredKeys
      .map(k => {
        const entry = records[k];
        const [y, m, d] = k.split('-');
        const mName = MONTH_STICKERS[parseInt(m, 10) - 1]?.name || m;
        const moodInfo = entry.mood ? MOODS[entry.mood] : { label: 'Note only', color: '#ffffff' };
        return `
          <li class="history-record-item">
            <div class="history-record-left">
              <span class="history-dot" style="background: ${moodInfo.color};"></span>
              <div>
                <strong>${mName} ${parseInt(d, 10)}, ${y}</strong> — ${moodInfo.label}
                ${entry.note ? `<div style="color:#7c6b66;font-size:0.8rem;">“${escapeHTML(entry.note)}”</div>` : ''}
              </div>
            </div>
            <button type="button" class="history-jump-btn" data-jump-key="${k}">View Month</button>
          </li>
        `;
      })
      .join('');

    listEl.querySelectorAll('[data-jump-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [y, m, d] = btn.dataset.jumpKey.split('-');
        viewYear = parseInt(y, 10);
        viewMonth = parseInt(m, 10) - 1;
        selectedDay = parseInt(d, 10);
        renderTracker();
      });
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  /* Bind UI Events */
  function initMoodTracker() {
    // Swatch selection
    document.querySelectorAll('#mood-legend .mood-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#mood-legend .mood-swatch').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        activeBrush = btn.dataset.mood;
      });
    });

    // Month Navigation
    document.getElementById('mood-prev-month')?.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderTracker();
    });

    document.getElementById('mood-next-month')?.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderTracker();
    });

    document.getElementById('mood-today-btn')?.addEventListener('click', () => {
      const now = new Date();
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();
      selectedDay = now.getDate();
      renderTracker();
    });

    // Daily Note Auto-Save Forever
    document.getElementById('mood-day-note')?.addEventListener('input', e => {
      const key = dateKey(viewYear, viewMonth, selectedDay);
      const existing = records[key] || {};
      const val = e.target.value.trim();
      if (!val && !existing.mood) {
        delete records[key];
      } else {
        records[key] = {
          ...existing,
          note: e.target.value,
          updatedAt: new Date().toISOString()
        };
      }
      saveRecords(records);
      updateHistoryBadge();
    });

    // Quote sticker cycle
    const quoteEl = document.getElementById('mood-quote-text');
    if (quoteEl) {
      quoteEl.textContent = QUOTES[quoteIndex];
      document.getElementById('mood-quote-sticker')?.addEventListener('click', () => {
        quoteIndex = (quoteIndex + 1) % QUOTES.length;
        quoteEl.textContent = QUOTES[quoteIndex];
      });
    }

    // History Drawer Toggle
    const historyPanel = document.getElementById('mood-history-panel');
    document.getElementById('mood-history-btn')?.addEventListener('click', () => {
      if (!historyPanel) return;
      historyPanel.hidden = !historyPanel.hidden;
      if (!historyPanel.hidden) {
        renderHistoryPanel();
        historyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    document.getElementById('mood-close-history')?.addEventListener('click', () => {
      if (historyPanel) historyPanel.hidden = true;
    });

    document.getElementById('history-month-filter')?.addEventListener('change', renderHistoryPanel);

    // JSON Export / Import for permanent backup across devices
    document.getElementById('mood-export-btn')?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LoveYourself-Mood-History-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('mood-import-input')?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (imported && typeof imported === 'object') {
            records = { ...records, ...imported };
            saveRecords(records);
            renderTracker();
            renderHistoryPanel();
          }
        } catch (err) {
          alert('Invalid backup file.');
        }
      };
      reader.readAsText(file);
    });

    renderTracker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMoodTracker);
  } else {
    initMoodTracker();
  }
})();
