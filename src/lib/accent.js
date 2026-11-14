// Which accent colour is active: lime (default) or Claude orange (?accent=orange).
export const isOrange = typeof document !== 'undefined' && document.documentElement.dataset.accent === 'orange'
export const ACCENT = isOrange ? '#d97757' : '#c6ff3d'
// accent colour for text on the light (cream) sections, dark enough to read
export const ACCENT_TEXT_LIGHT = isOrange ? '#a8461f' : '#4a6a00'
