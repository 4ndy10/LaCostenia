export const PRODUCTS = [
  {
    id: 'prod-jalapenos',
    sku: 'LC-JAL-220',
    name: 'Chiles Jalapeños Enteros en Escabeche',
    weight: '220 g',
    category: 'chiles',
    categoryLabel: 'Chiles en Escabeche',
    heat: 'medio',
    heatLabel: 'Picor Medio',
    heatLevel: 2,
    price: '18.50',
    rating: '4.9',
    image: 'assets/img/prod-jalapenos',
    description: 'Cosechados en su punto exacto de madurez, conservados con zanahoria, cebolla y especias aromáticas.',
    badge: 'Clásico de México'
  },
  {
    id: 'prod-chipotles',
    sku: 'LC-CHI-215',
    name: 'Chiles Chipotles Adobados',
    weight: '215 g',
    category: 'chiles',
    categoryLabel: 'Chiles Adobados',
    heat: 'alto',
    heatLabel: 'Picor Intenso',
    heatLevel: 3,
    price: '22.00',
    rating: '4.9',
    image: 'assets/img/prod-chipotles',
    description: 'Jalapeños maduros ahumados lentamente en un adobo dulce y especiado de jitomate.',
    badge: 'Ahumado Natural'
  },
  {
    id: 'prod-salsa-verde',
    sku: 'LC-SAL-250V',
    name: 'Salsa Verde Mexicana de Tomatillo',
    weight: '250 g',
    category: 'salsas',
    categoryLabel: 'Salsas Caseras',
    heat: 'suave',
    heatLabel: 'Picor Suave',
    heatLevel: 1,
    price: '21.00',
    rating: '4.8',
    image: 'assets/img/prod-salsa-verde',
    description: 'Tomatillo fresco tatemado con cilantro, cebolla y un toque vibrante de chile serrano.',
    badge: 'Sin Conservadores'
  },
  {
    id: 'prod-frijoles-bayos',
    sku: 'LC-FRI-430B',
    name: 'Frijoles Bayos Refritos Tradicionales',
    weight: '430 g',
    category: 'frijoles',
    categoryLabel: 'Frijoles Caseros',
    heat: 'suave',
    heatLabel: 'Sin Picante',
    heatLevel: 1,
    price: '24.50',
    rating: '4.8',
    image: 'assets/img/prod-frijoles-bayos',
    description: 'Textura cremosa y sazón de hogar listos para servir o gratinar en minutos.',
    badge: 'Fuente de Fibra'
  },
  {
    id: 'prod-elotes',
    sku: 'LC-ELO-410',
    name: 'Elotes Dorados Dulces en Grano',
    weight: '410 g',
    category: 'vegetales',
    categoryLabel: 'Vegetales Selectos',
    heat: 'suave',
    heatLabel: 'Sin Picante',
    heatLevel: 1,
    price: '19.50',
    rating: '4.9',
    image: 'assets/img/prod-elotes',
    description: 'Granos tiernos y crujientes envasados al vapor horas después de su cosecha.',
    badge: 'Cosecha Fresca'
  },
  {
    id: 'prod-salsa-ranchera',
    sku: 'LC-SAL-250R',
    name: 'Salsa Ranchera Tatemada',
    weight: '250 g',
    category: 'salsas',
    categoryLabel: 'Salsas Caseras',
    heat: 'medio',
    heatLabel: 'Picor Medio',
    heatLevel: 2,
    price: '21.50',
    rating: '4.9',
    image: 'assets/img/prod-salsa-ranchera',
    description: 'Jitomate asado al comal con ajo, cebolla y chile jalapeño rojo molido en molcajete.',
    badge: 'Sazón al Comal'
  }
];

export const RECIPES = [
  {
    id: 'rec-chilaquiles',
    title: 'Chilaquiles Verdes Crujientes con Pollo Deshebrado',
    category: 'salsas',
    categoryLabel: 'Con Salsas Caseras',
    heat: 'suave',
    heatLabel: 'Picor Suave',
    timeBucket: 'express',
    timeMinutes: 15,
    servings: 4,
    calories: '420 kcal',
    productUsed: 'Salsa Verde Mexicana 250 g',
    image: 'assets/img/rec-chilaquiles',
    summary: 'Totopos de maíz bañados al momento en Salsa Verde Mexicana caliente, coronados con crema fresca, queso Cotija y cebolla morada.',
    ingredients: [
      '1 frasco de Salsa Verde Mexicana La Costeña (250 g)',
      '300 g de totopos de maíz dorados',
      '200 g de pechuga de pollo cocida y deshebrada',
      '1/2 taza de crema ácida fresca y 80 g de queso Cotija',
      'Cilantro fresco picado y aros de cebolla morada'
    ],
    steps: [
      'Calienta la Salsa Verde Mexicana La Costeña con media taza de caldo de pollo hasta que rompa el primer hervor.',
      'Sirve una cama de totopos crujientes y báñalos inmediatamente con la salsa caliente para conservar su textura.',
      'Añade el pollo deshebrado, decora con crema, queso Cotija, cebolla morada y cilantro fresco.'
    ]
  },
  {
    id: 'rec-tinga',
    title: 'Tinga Poblana de Pollo al Chipotle Adobado',
    category: 'chiles',
    categoryLabel: 'Con Chiles',
    heat: 'alto',
    heatLabel: 'Picor Intenso',
    timeBucket: 'tradicional',
    timeMinutes: 25,
    servings: 6,
    calories: '380 kcal',
    productUsed: 'Chiles Chipotles Adobados 215 g',
    image: 'assets/img/rec-tinga',
    summary: 'Hebras de pollo jugosas cocinadas lentamente en caldillo de jitomate asado, cebolla caramelizada y el toque ahumado de Chipotles Adobados.',
    ingredients: [
      '1 lata de Chiles Chipotles Adobados La Costeña (al gusto)',
      '500 g de pechuga de pollo deshebrada',
      '2 cebollas blancas grandes fileteadas en pluma',
      '4 jitomates guaje maduros asados',
      '1 hoja de laurel y tostadas de maíz para servir'
    ],
    steps: [
      'Acitrona la cebolla fileteada en aceite caliente durante 6 minutos hasta que luzca translúcida y dulce.',
      'Licúa los jitomates asados con los Chiles Chipotles Adobados La Costeña y un toque de caldo.',
      'Vierte la salsa sobre la cebolla, incorpora el pollo y el laurel, y cocina 12 minutos a fuego medio.'
    ]
  },
  {
    id: 'rec-enfrijoladas',
    title: 'Enfrijoladas de Hogar con Chorizo y Queso Fresco',
    category: 'frijoles',
    categoryLabel: 'Con Frijoles',
    heat: 'suave',
    heatLabel: 'Picor Suave',
    timeBucket: 'tradicional',
    timeMinutes: 20,
    servings: 4,
    calories: '460 kcal',
    productUsed: 'Frijoles Bayos Refritos 430 g',
    image: 'assets/img/rec-enfrijoladas',
    summary: 'Tortillas recién hechas rellenas de queso panela y cubiertas con una salsa aterciopelada de Frijoles Bayos Refritos y epazote.',
    ingredients: [
      '1 lata de Frijoles Bayos Refritos La Costeña (430 g)',
      '12 tortillas de maíz calientes',
      '150 g de chorizo dorado y escurrido',
      '200 g de queso fresco desmoronado',
      '1 taza de leche o caldo de pollo y rodajas de aguacate'
    ],
    steps: [
      'Licúa los Frijoles Bayos Refritos La Costeña con el caldo caliente hasta lograr una salsa tersa y cremosa.',
      'Rellena las tortillas calientes con queso fresco, dóblalas y colócalas en el plato.',
      'Baña generosamente con la salsa de frijol caliente y corona con chorizo dorado y aguacate.'
    ]
  },
  {
    id: 'rec-huevos-rancheros',
    title: 'Huevos Rancheros de Hacienda con Jalapeños en Escabeche',
    category: 'chiles',
    categoryLabel: 'Con Chiles',
    heat: 'medio',
    heatLabel: 'Picor Medio',
    timeBucket: 'express',
    timeMinutes: 12,
    servings: 2,
    calories: '350 kcal',
    productUsed: 'Chiles Jalapeños Enteros 220 g',
    image: 'assets/img/rec-huevos-rancheros',
    summary: 'Huevos estrellados sobre tortilla dorada, cubiertos con Salsa Ranchera tibia y coronados con Chiles Jalapeños y zanahorias en escabeche.',
    ingredients: [
      '1 lata de Chiles Jalapeños Enteros La Costeña (220 g)',
      '1 frasco de Salsa Ranchera Tatemada La Costeña (250 g)',
      '4 huevos frescos de granja',
      '4 tortillas de maíz pasadas por aceite caliente',
      'Frijoles Bayos Refritos para acompañar'
    ],
    steps: [
      'Pasa ligeramente las tortillas por aceite caliente para suavizarlas y colócalas de dos en dos por plato.',
      'Estrella los huevos al gusto y colócalos sobre las tortillas.',
      'Baña con la Salsa Ranchera caliente y sirve con Chiles Jalapeños y zanahorias en escabeche.'
    ]
  },
  {
    id: 'rec-esquites',
    title: 'Esquites Callejeros Cremosos con Mayonesa de Chipotle',
    category: 'vegetales',
    categoryLabel: 'Con Vegetales',
    heat: 'medio',
    heatLabel: 'Picor Medio',
    timeBucket: 'express',
    timeMinutes: 10,
    servings: 4,
    calories: '290 kcal',
    productUsed: 'Elotes Dorados en Grano 410 g',
    image: 'assets/img/rec-esquites',
    summary: 'Elotes Dorados salteados a la mantequilla con epazote fresco, limón real, queso añejo y mayonesa ahumada de chipotle.',
    ingredients: [
      '1 lata de Elotes Dorados La Costeña (410 g) drenada',
      '1 cucharada de adobo de Chiles Chipotles La Costeña',
      '2 cucharadas de mantequilla y 1 rama de epazote picado',
      '3 cucharadas de mayonesa y jugo de 2 limones',
      '100 g de queso Cotija rallado'
    ],
    steps: [
      'Saltea los Elotes Dorados La Costeña en mantequilla con el epazote picado durante 5 minutos a fuego vivo.',
      'Mezcla la mayonesa con el adobo de Chipotles La Costeña y el jugo de limón.',
      'Sirve los elotes calientes en vaso o tazón y cubre con la mayonesa de chipotle y el queso Cotija.'
    ]
  },
  {
    id: 'rec-tacos-dorados',
    title: 'Tacos Dorados Ahogados en Salsa Ranchera Tatemada',
    category: 'salsas',
    categoryLabel: 'Con Salsas Caseras',
    heat: 'medio',
    heatLabel: 'Picor Medio',
    timeBucket: 'tradicional',
    timeMinutes: 20,
    servings: 4,
    calories: '440 kcal',
    productUsed: 'Salsa Ranchera Tatemada 250 g',
    image: 'assets/img/rec-tacos-dorados',
    summary: 'Flautas crujientes de papa y requesón servidas sobre espejo de Salsa Ranchera Tatemada, lechuga fresca y rajas de jalapeño.',
    ingredients: [
      '1 frasco de Salsa Ranchera Tatemada La Costeña (250 g)',
      '12 tortillas para taquear rellenas de papa con requesón',
      'Rajas de Chiles Jalapeños La Costeña al gusto',
      '1 taza de lechuga finamente picada y crema fresca',
      'Queso fresco desmoronado y aguacate en cubos'
    ],
    steps: [
      'Dora los tacos enrollados en aceite caliente hasta que queden uniformemente crujientes y escurre.',
      'Calienta la Salsa Ranchera Tatemada La Costeña y forma un espejo abundante en el fondo del plato.',
      'Acomoda los tacos sobre la salsa y corona con lechuga, crema, queso y rajas de jalapeño.'
    ]
  }
];

/**
 * Pure matrix filtering function (shared by UI and unit tests).
 * Filters recipes by category × heat × timeBucket × search query.
 */
export function filterRecipes(recipes, { category = 'all', heat = 'all', time = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return recipes.filter((r) => {
    if (category !== 'all' && r.category !== category) return false;
    if (heat !== 'all' && r.heat !== heat) return false;
    if (time !== 'all' && r.timeBucket !== time) return false;
    if (q && !`${r.title} ${r.summary} ${r.productUsed} ${r.ingredients.join(' ')}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
