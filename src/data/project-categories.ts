export const PROJECT_CATEGORIES = [
  { id: 'professional-services', label: 'Servicios profesionales' },
  { id: 'commerce-products', label: 'Comercio / productos' },
  { id: 'gastronomy-hospitality', label: 'Gastronomía / hospitalidad' },
  { id: 'construction-technical', label: 'Construcción / oficios / servicios técnicos' },
  { id: 'education-community', label: 'Educación / comunidad / organización' },
  { id: 'technology-digital', label: 'Tecnología / servicios digitales' },
  { id: 'other', label: 'Otro' }
] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number]['id'];

const projectCategoryIds = new Set<string>(PROJECT_CATEGORIES.map(({ id }) => id));

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return typeof value === 'string' && projectCategoryIds.has(value);
}

export function getProjectCategoryLabel(value: ProjectCategory): string {
  return PROJECT_CATEGORIES.find((category) => category.id === value)!.label;
}
