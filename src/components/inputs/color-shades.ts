/**
 * CSS + JS Alternative: Generate shade variants from a single hex color.
 *
 * Usage (call once on app init):
 *   generateStateShades('error', '#E5533D');
 *   generateStateShades('warning', '#8A8A1F');
 *
 * This sets CSS variables:
 *   --state-error: #E5533D
 *   --state-error-light: (88% lighter)
 *   --state-error-muted: (60% lighter)
 *
 * COMPARISON NOTE:
 *   The CSS color-mix() approach (in input.css) does this without any JS.
 *   This file exists for comparison. Delete whichever approach you don't want.
 */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function mixWithWhite(hex: string, ratio: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * ratio,
    g + (255 - g) * ratio,
    b + (255 - b) * ratio
  );
}

export function generateStateShades(stateName: string, hex: string) {
  const root = document.documentElement;
  root.style.setProperty(`--state-${stateName}`, hex);
  root.style.setProperty(`--state-${stateName}-light`, mixWithWhite(hex, 0.88));
  root.style.setProperty(`--state-${stateName}-muted`, mixWithWhite(hex, 0.6));
}

/**
 * Apply all state colors at once.
 * Call this once to set up the JS-based shade system.
 */
export function initColorShades(colors: Record<string, string>) {
  for (const [state, hex] of Object.entries(colors)) {
    generateStateShades(state, hex);
  }
}
