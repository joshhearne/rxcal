// ── Theme (Light / Dark / System) ────────────────────

let spTheme = 'system';
const THEME_DESCS = {
  system: 'Follows your device preference.',
  light:  'Forced light mode.',
  dark:   'Forced dark mode.',
};

const mql = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  const prefersDark = mql.matches;
  const useDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.setAttribute('data-theme', useDark ? 'dark' : 'light');
}

// Apply saved theme immediately (before DOM ready) to prevent flash
try {
  const _raw = localStorage.getItem('rxcal_style');
  if (_raw) {
    const _prefs = JSON.parse(_raw);
    if (_prefs.spTheme) { spTheme = _prefs.spTheme; }
  }
} catch(e) {}
applyTheme(spTheme);

function setTheme(theme, silent) {
  spTheme = theme;
  applyTheme(theme);
  ['system','light','dark'].forEach(t => {
    const btn = document.getElementById('spTheme' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === theme);
  });
  const desc = document.getElementById('spThemeDesc');
  if (desc) desc.textContent = THEME_DESCS[theme];
  if (!silent) saveStylePrefs();
}

// Re-apply on system preference change
mql.addEventListener('change', () => { if (spTheme === 'system') applyTheme('system'); });

// ── Style Panel ──────────────────────────────────────────

const PATTERNS = [
  { id: 'none',       label: 'Plain',      bg: '#e8e8e8', img: '' },
  { id: 'diag-lt',   label: 'Diag (lt)',  bg: '#e8e8e8', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2' stroke='%23999' stroke-width='1'/%3E%3C/svg%3E\")" },
  { id: 'diag-bold',  label: 'Diag (bd)', bg: '#d8d8d8', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2' stroke='%23555' stroke-width='2'/%3E%3C/svg%3E\")" },
  { id: 'diag-rev',   label: 'Reverse',   bg: '#e8e8e8', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M9,1 l-2,-2 M8,8 l-8,-8 M1,9 l-2,-2' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E\")" },
  { id: 'crosshatch',  label: 'Crosshatch',bg: '#e0e0e0', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2 M9,1 l-2,-2 M8,8 l-8,-8 M1,9 l-2,-2' stroke='%23888' stroke-width='1'/%3E%3C/svg%3E\")" },
  { id: 'horiz',       label: 'Horiz',     bg: '#e8e8e8', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cline x1='0' y1='4' x2='8' y2='4' stroke='%23999' stroke-width='1'/%3E%3C/svg%3E\")" },
  { id: 'vert',        label: 'Vertical',  bg: '#e8e8e8', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cline x1='4' y1='0' x2='4' y2='8' stroke='%23999' stroke-width='1'/%3E%3C/svg%3E\")" },
  { id: 'dots-sm',     label: 'Dots (sm)', bg: '#f0f0f0', img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Ccircle cx='4' cy='4' r='1' fill='%23888'/%3E%3C/svg%3E\")" },
  { id: 'checker',     label: 'Checker',   bg: '#fff',    img: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='0' y='0' width='5' height='5' fill='%23ccc'/%3E%3Crect x='5' y='5' width='5' height='5' fill='%23ccc'/%3E%3C/svg%3E\")" },
];

const CB_PRESETS = {
  deuteranopia: { med1: '#0077bb', med2: '#ee7733', med3: '#009988' },
  tritanopia:   { med1: '#cc3311', med2: '#004488', med3: '#ddaa33' },
  highcontrast: { med1: '#000000', med2: '#e69f00', med3: '#56b4e9' },
};

const DEFAULT_COLORS = { med1: '#c8502a', med2: '#2a6fc8', med3: '#3a7d5e' };
const DEFAULT_PATTERNS = { med1: 'none', med2: 'diag-lt', med3: 'crosshatch' };

let spPrintMode = 'color';
let spColors = { ...DEFAULT_COLORS };
let spPatterns = { ...DEFAULT_PATTERNS };

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}
function lighten(hex, amt=0.85) {
  const { r, g, b } = hexToRgb(hex);
  const mix = v => Math.round(v + (255 - v) * amt);
  return `#${mix(r).toString(16).padStart(2,'0')}${mix(g).toString(16).padStart(2,'0')}${mix(b).toString(16).padStart(2,'0')}`;
}
function midtone(hex, amt=0.45) {
  const { r, g, b } = hexToRgb(hex);
  const mix = v => Math.round(v + (255 - v) * amt);
  return `#${mix(r).toString(16).padStart(2,'0')}${mix(g).toString(16).padStart(2,'0')}${mix(b).toString(16).padStart(2,'0')}`;
}
function shiftHue(hex, deg) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min;
  let h = 0, s = max === 0 ? 0 : d/max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g-b)/d + 6) % 6;
    else if (max === g) h = (b-r)/d + 2;
    else h = (r-g)/d + 4;
    h *= 60;
  }
  h = (h + deg + 360) % 360;
  const c = v * s, x = c * (1 - Math.abs((h/60)%2-1)), m = v - c;
  let rr,gg,bb;
  if (h<60){rr=c;gg=x;bb=0} else if(h<120){rr=x;gg=c;bb=0} else if(h<180){rr=0;gg=c;bb=x}
  else if(h<240){rr=0;gg=x;bb=c} else if(h<300){rr=x;gg=0;bb=c} else{rr=c;gg=0;bb=x}
  const toHex = n => Math.round((n+m)*255).toString(16).padStart(2,'0');
  return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
}

function applyColor(med, hex, silent) {
  spColors[med] = hex;
  const light = lighten(hex);
  const mid   = midtone(hex);
  const root  = document.documentElement;
  root.style.setProperty(`--${med}`, hex);
  root.style.setProperty(`--${med}-light`, light);
  root.style.setProperty(`--${med}-mid`, mid);
  if (med === 'med1') {
    root.style.setProperty('--accent', hex);
    root.style.setProperty('--accent-light', light);
    updateLogoPreview(hex);
    updateHeaderGradient(hex);
  }
  updateSwatches();
  if (!silent) saveStylePrefs();
}

function updateLogoPreview(hex) {
  const span = document.getElementById('spLogoSpan');
  const bar  = document.getElementById('spGradBar');
  if (span) span.style.color = hex;
  if (bar)  bar.style.background = `linear-gradient(90deg, ${hex}, ${shiftHue(hex, 30)})`;
  // Update actual logo span
  const logoSpan = document.querySelector('.logo span');
  if (logoSpan) logoSpan.style.color = hex;
}

function updateHeaderGradient(hex) {
  const hdr = document.querySelector('header');
  if (!hdr) return;
  // Inject dynamic style for header::after — use a style tag trick
  let st = document.getElementById('dynamicHeaderStyle');
  if (!st) { st = document.createElement('style'); st.id = 'dynamicHeaderStyle'; document.head.appendChild(st); }
  const h2 = shiftHue(hex, 20), h3 = shiftHue(hex, 45);
  st.textContent = `header::after { background: repeating-linear-gradient(90deg, ${hex} 0, ${hex} 12px, transparent 12px, transparent 16px) !important; }`;
}

function updateSwatches() {
  ['med1','med2','med3'].forEach(m => {
    const sw = document.getElementById('swatchMed' + m.slice(-1));
    if (sw) sw.style.background = spColors[m];
    const pk = document.getElementById('pickerMed' + m.slice(-1));
    if (pk) pk.value = spColors[m];
    // Update B&W dot indicators
    const dot = document.getElementById('bwDot' + m.slice(-1));
    if (dot) dot.style.background = spColors[m];
  });
}

function applyColorblindPreset(name, el) {
  const p = CB_PRESETS[name];
  if (!p) return;
  Object.entries(p).forEach(([med, hex]) => applyColor(med, hex, true));
  saveStylePrefs();
  document.querySelectorAll('.sp-cb-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

// ── Print mode ─────────────────────────────────────────
function setPrintMode(mode, silent) {
  spPrintMode = mode;
  document.getElementById('spColorBtn').classList.toggle('active', mode === 'color');
  document.getElementById('spBwBtn').classList.toggle('active', mode === 'bw');
  document.getElementById('spColorSection').style.display = mode === 'color' ? 'block' : 'none';
  document.getElementById('spBwSection').style.display   = mode === 'bw'    ? 'block' : 'none';
  applyPrintStyles();
  if (!silent) saveStylePrefs();
}

function applyPrintStyles() {
  let st = document.getElementById('dynamicPrintStyle');
  if (!st) { st = document.createElement('style'); st.id = 'dynamicPrintStyle'; document.head.appendChild(st); }
  if (spPrintMode === 'color') {
    st.textContent = '';
  } else {
    // B&W: replace row backgrounds with patterns
    const rules = ['med1','med2','med3'].map(m => {
      const pat = PATTERNS.find(p => p.id === spPatterns[m]) || PATTERNS[0];
      const bg = pat.img ? `${pat.img}, none` : 'none';
      return `@media print { tr.row-${m} td { background-color: ${pat.bg} !important; background-image: ${pat.img || 'none'} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`;
    });
    // Also grayscale dots
    rules.push('@media print { .dot-med1,.dot-med2,.dot-med3 { background: #444 !important; } }');
    st.textContent = rules.join('\n');
  }
}

// ── Pattern grids ──────────────────────────────────────
function buildPatternGrids() {
  ['med1','med2','med3'].forEach((med, mi) => {
    const grid = document.getElementById('patternGridMed' + (mi+1));
    if (!grid) return;
    grid.innerHTML = '';
    PATTERNS.forEach(pat => {
      const item = document.createElement('div');
      item.className = 'sp-pattern-item' + (spPatterns[med] === pat.id ? ' selected' : '');
      item.innerHTML = `<div class="sp-pattern-swatch" style="background-color:${pat.bg};background-image:${pat.img || 'none'}"></div><div class="sp-pattern-label">${pat.label}</div>`;
      item.onclick = () => selectPattern(med, pat.id, mi+1);
      grid.appendChild(item);
    });
  });
}

function selectPattern(med, patId, gridNum) {
  spPatterns[med] = patId;
  const grid = document.getElementById('patternGridMed' + gridNum);
  grid.querySelectorAll('.sp-pattern-item').forEach((el, i) => {
    el.classList.toggle('selected', PATTERNS[i].id === patId);
  });
  applyPrintStyles();
  saveStylePrefs();
}

// ── Open / close ───────────────────────────────────────
function openStylePanel() {
  buildPatternGrids();
  updateSwatches();
  document.getElementById('stylePanel').classList.add('open');
  document.getElementById('stylePanelOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStylePanel() {
  document.getElementById('stylePanel').classList.remove('open');
  document.getElementById('stylePanelOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Persist ────────────────────────────────────────────
function saveStylePrefs() {
  try {
    localStorage.setItem('rxcal_style', JSON.stringify({ spColors, spPatterns, spPrintMode, spTheme }));
  } catch(e) {}
}

function loadStylePrefs() {
  try {
    const raw = localStorage.getItem('rxcal_style');
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (prefs.spColors)    spColors    = { ...DEFAULT_COLORS, ...prefs.spColors };
    if (prefs.spPatterns)  spPatterns  = { ...DEFAULT_PATTERNS, ...prefs.spPatterns };
    if (prefs.spPrintMode) spPrintMode = prefs.spPrintMode;
    if (prefs.spTheme)    spTheme    = prefs.spTheme;
    // Apply colors
    Object.entries(spColors).forEach(([med, hex]) => applyColor(med, hex, true));
    setPrintMode(spPrintMode, true);
    setTheme(spTheme, true);
  } catch(e) {}
}

function resetStyles() {
  spColors   = { ...DEFAULT_COLORS };
  spPatterns = { ...DEFAULT_PATTERNS };
  spPrintMode = 'color';
  spTheme     = 'system';
  Object.entries(spColors).forEach(([med, hex]) => applyColor(med, hex, true));
  setPrintMode('color', true);
  setTheme('system', true);
  document.querySelectorAll('.sp-cb-btn').forEach(b => b.classList.remove('active'));
  buildPatternGrids();
  try { localStorage.removeItem('rxcal_style'); } catch(e) {}
}

// Init on load — runs on every page that loads style.js
window.addEventListener('DOMContentLoaded', () => {
  loadStylePrefs();
  // Always apply theme — covers pages with no saved prefs too
  applyTheme(spTheme);
  if (!localStorage.getItem('rxcal_style')) setTheme('system', true);
  updateLogoPreview(spColors.med1);
  updateHeaderGradient(spColors.med1);
  // style.html only: build pattern grids and swatches
  if (document.getElementById('patternGridMed1')) {
    buildPatternGrids();
    updateSwatches();
  }
});