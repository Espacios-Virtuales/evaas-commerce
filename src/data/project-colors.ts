// Paleta contractual: docs/contracts/commerce-v04/brand-content.md (L01-C04).
export const PROJECT_COLOR_OPTIONS = [
  { id: 'forest', label: 'Verde bosque', cssValue: '#224A36', textColor: '#FFFFFF' },
  { id: 'garnet', label: 'Granate', cssValue: '#722F37', textColor: '#FFFFFF' },
  { id: 'ocean', label: 'Azul profundo', cssValue: '#003E6B', textColor: '#FFFFFF' }
] as const;

export type ProjectColor = (typeof PROJECT_COLOR_OPTIONS)[number]['id'];
export type ProjectColorOption = (typeof PROJECT_COLOR_OPTIONS)[number];

// Selección inicial solo para la vista demostrativa; no persiste ni fija una elección comercial.
export const INITIAL_PREVIEW_COLOR: ProjectColorOption = PROJECT_COLOR_OPTIONS[0];
