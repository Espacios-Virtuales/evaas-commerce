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
  clientInputs: string[];
  additionalInputs: string[];
  demoCategory: string;
};

export const products: Product[] = [
  {
    slug: 'landing',
    name: 'Landing Comercial',
    eyebrow: 'Una propuesta principal',
    netPrice: 99000,
    finalPrice: 117810,
    purpose: 'Una página enfocada en una propuesta principal y una acción clara.',
    shortPurpose: 'Una página. Una acción principal.',
    bestFor: 'Profesionales, emprendimientos y campañas con una oferta principal.',
    scope: '1 página · hasta 6 secciones · 1 revisión consolidada',
    includes: ['Aplicación básica de tu identidad disponible', 'Estructura comercial', 'CTA y contacto', 'Diseño responsive', 'Publicación inicial en Vercel', 'Conexión de dominio'],
    excludes: ['Tienda o carrito', 'Pasarela de pago', 'Agenda o integraciones', 'Producción fotográfica'],
    clientInputs: ['Oferta principal', 'Acción o CTA deseado', 'Datos de contacto', 'Textos dentro del alcance contratado'],
    additionalInputs: ['Imágenes o referencias visuales disponibles'],
    demoCategory: 'Cafetería de especialidad'
  },
  {
    slug: 'catalogo',
    name: 'Catálogo de Productos',
    eyebrow: 'Una oferta organizada',
    netPrice: 129000,
    finalPrice: 153510,
    purpose: 'Una vitrina organizada para presentar productos o servicios y facilitar consultas, sin ecommerce.',
    shortPurpose: 'Varias opciones. Sin ecommerce.',
    bestFor: 'Negocios con una oferta amplia que venden por contacto o cotización.',
    scope: '1 catálogo · hasta 12 ítems · 1 revisión consolidada',
    includes: ['Aplicación básica de tu identidad disponible', 'Categorías simples', 'Fichas o bloques', 'CTA y contacto', 'Publicación inicial en Vercel', 'Conexión de dominio'],
    excludes: ['Carrito o stock', 'Pago en línea', 'Carga masiva', 'Integración con ERP'],
    clientInputs: ['Lista de productos o servicios', 'Categorías', 'Nombres y descripciones', 'Imágenes disponibles', 'Datos o canal de consulta'],
    additionalInputs: [],
    demoCategory: 'Diseño y hogar'
  },
  {
    slug: 'corporativa',
    name: 'Web Corporativa',
    eyebrow: 'Una presencia institucional',
    netPrice: 149000,
    finalPrice: 177310,
    purpose: 'Una presencia institucional con áreas para empresa, servicios, metodología y contacto.',
    shortPurpose: 'Más contexto. Varias áreas.',
    bestFor: 'Pequeñas empresas y organizaciones que necesitan respaldo institucional.',
    scope: '4 áreas · Inicio, Empresa, Servicios y Contacto · 1 revisión consolidada',
    includes: ['Aplicación básica de tu identidad disponible', 'Navegación completa', '4 áreas principales', 'CTA y contacto', 'Publicación inicial en Vercel', 'Conexión de dominio'],
    excludes: ['Ecommerce', 'Área privada', 'Redacción extensa', 'Integraciones empresariales'],
    clientInputs: ['Descripción de la empresa', 'Servicios', 'Forma de trabajo', 'Datos de contacto', 'Material institucional disponible'],
    additionalInputs: ['Imágenes disponibles'],
    demoCategory: 'Servicios técnicos e ingeniería'
  }
];

export const commonClientInputs = [
  'Identidad o logo disponible, si ya los tienes',
  'Textos e información del negocio',
  'Propuesta de valor definida, si ya existe',
  'Datos de contacto',
  'Imágenes o material visual disponible',
  'Dominio, si ya existe'
];

export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<ProductSlug, Product>;

export const formatCLP = (value: number) => `$${new Intl.NumberFormat('es-CL').format(value)}`;
