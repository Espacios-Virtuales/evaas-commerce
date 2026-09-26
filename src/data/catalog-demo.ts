export type CatalogDemoCategory = 'mesa' | 'textil';

export type CatalogDemoItem = {
  name: string;
  category: CatalogDemoCategory;
  categoryLabel: string;
  description: string;
  material: string;
  visual: 'vessel' | 'glass' | 'bowl' | 'pitcher' | 'throw' | 'cushion' | 'runner' | 'linen';
};

// Contenido ficticio autorizado por brand-content.md para la demo de objetos de diseño y hogar.
export const catalogDemoItems: CatalogDemoItem[] = [
  { name: 'Fuente Sur', category: 'mesa', categoryLabel: 'Mesa', description: 'Una pieza amplia para compartir pan, fruta o pequeños objetos cotidianos.', material: 'Cerámica esmaltada · pieza de ejemplo', visual: 'vessel' },
  { name: 'Vaso Piedra', category: 'mesa', categoryLabel: 'Mesa', description: 'Vidrio de tono mineral y forma sencilla para acompañar la mesa diaria.', material: 'Vidrio trabajado · pieza de ejemplo', visual: 'glass' },
  { name: 'Cuenco Alba', category: 'mesa', categoryLabel: 'Mesa', description: 'Un cuenco de líneas suaves pensado para desayunos sin apuro.', material: 'Gres mate · pieza de ejemplo', visual: 'bowl' },
  { name: 'Jarra Lenta', category: 'mesa', categoryLabel: 'Mesa', description: 'Volumen equilibrado y asa generosa para servir en una mesa compartida.', material: 'Cerámica torneada · pieza de ejemplo', visual: 'pitcher' },
  { name: 'Manta Bruma', category: 'textil', categoryLabel: 'Textil', description: 'Una capa liviana para sumar abrigo y textura a un rincón de descanso.', material: 'Lana de textura suave · pieza de ejemplo', visual: 'throw' },
  { name: 'Cojín Origen', category: 'textil', categoryLabel: 'Textil', description: 'Textura natural y proporción simple para combinar con distintos espacios.', material: 'Lino lavado · pieza de ejemplo', visual: 'cushion' },
  { name: 'Camino Claro', category: 'textil', categoryLabel: 'Textil', description: 'Una franja de color sereno que acompaña comidas y encuentros cotidianos.', material: 'Algodón tejido · pieza de ejemplo', visual: 'runner' },
  { name: 'Funda Niebla', category: 'textil', categoryLabel: 'Textil', description: 'Una textura discreta para renovar una silla o un pequeño asiento.', material: 'Mezcla de fibras · pieza de ejemplo', visual: 'linen' }
];
