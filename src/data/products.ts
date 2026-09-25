export type ProductSlug = 'landing' | 'catalogo' | 'corporativa';

export type Product = {
  slug: ProductSlug;
  name: string;
  eyebrow: string;
  netPrice: number;
  finalPrice: number;
  purpose: string;
  shortPurpose: string;
  bestFor: string;
  scope: string;
  includes: string[];
  excludes: string[];
  demoName: string;
  demoCategory: string;
  demoDescription: string;
};

export const products: Product[] = [
  {
    slug: 'landing',
    name: 'Landing',
    eyebrow: 'Presencia directa',
    netPrice: 49900,
    finalPrice: 59381,
    purpose: 'Una página enfocada en presentar tu propuesta y llevar a una acción clara.',
    shortPurpose: 'Una oferta. Una acción principal.',
    bestFor: 'Profesionales, emprendimientos y campañas con una oferta principal.',
    scope: '1 página · hasta 6 secciones · 1 revisión consolidada',
    includes: ['Branding básico', 'Estructura comercial', 'CTA y contacto', 'Diseño responsive', 'Publicación inicial en Vercel', 'Conexión de dominio'],
    excludes: ['Tienda o carrito', 'Pasarela de pago', 'Agenda o integraciones', 'Producción fotográfica'],
    demoName: 'Lumen Café',
    demoCategory: 'Cafetería de especialidad',
    demoDescription: 'Una propuesta breve que conduce desde el deseo hasta una reserva.'
  },
  {
    slug: 'catalogo',
    name: 'Catálogo',
    eyebrow: 'Oferta organizada',
    netPrice: 79900,
    finalPrice: 95081,
    purpose: 'Una vitrina ordenada para recorrer productos o servicios y consultar por ellos.',
    shortPurpose: 'Varias opciones. Sin ecommerce.',
    bestFor: 'Negocios con una oferta amplia que venden por contacto o cotización.',
    scope: '1 catálogo · hasta 12 ítems · 1 revisión consolidada',
    includes: ['Branding básico', 'Categorías simples', 'Fichas o bloques', 'CTA y contacto', 'Publicación inicial en Vercel', 'Conexión de dominio'],
    excludes: ['Carrito o stock', 'Pago en línea', 'Carga masiva', 'Integración con ERP'],
    demoName: 'Noma Objetos',
    demoCategory: 'Diseño y hogar',
    demoDescription: 'Una colección visual que permite explorar, filtrar y consultar.'
  },
  {
    slug: 'corporativa',
    name: 'Web Corporativa',
    eyebrow: 'Empresa completa',
    netPrice: 119900,
    finalPrice: 142681,
    purpose: 'Una presencia institucional con áreas claras para empresa, servicios y contacto.',
    shortPurpose: 'Más contexto. Varias áreas.',
    bestFor: 'Pequeñas empresas y organizaciones que necesitan respaldo institucional.',
    scope: '4 áreas · Inicio, Empresa, Servicios y Contacto · 1 revisión consolidada',
    includes: ['Branding básico', 'Navegación completa', '4 áreas principales', 'CTA y contacto', 'Publicación inicial en Vercel', 'Conexión de dominio'],
    excludes: ['Ecommerce', 'Área privada', 'Redacción extensa', 'Integraciones empresariales'],
    demoName: 'Arista Ingeniería',
    demoCategory: 'Servicios técnicos',
    demoDescription: 'Una presencia sobria que explica experiencia, servicios y forma de trabajo.'
  }
];

export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<ProductSlug, Product>;

export const formatCLP = (value: number) => `$${new Intl.NumberFormat('es-CL').format(value)}`;
