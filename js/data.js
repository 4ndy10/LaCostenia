const WA_BASE = 'https://wa.me/8002254629?text=';

function makeWaLink(nombre, ingredientes) {
  return `${WA_BASE}${encodeURIComponent(
    `Hola Calimax Tijuana, quiero pedir los ingredientes para "${nombre}": ${ingredientes.join(', ')}`
  )}`;
}

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
    image: 'assets/img/ingrediente-jalapeno',
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
    image: 'assets/img/ingrediente-chipotle',
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
    image: 'assets/img/ingrediente-tomatillo',
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
    image: 'assets/img/ingrediente-cebolla-cilantro',
    description: 'Jitomate asado al comal con ajo, cebolla y chile jalapeño rojo molido en molcajete.',
    badge: 'Sazón al Comal'
  }
];

const RAW_RECIPES = [
  {
    id: 'rec-chilaquiles',
    featured: true,
    nombre: 'Chilaquiles Verdes Crujientes con Pollo Deshebrado',
    categoria: 'Salsas',
    category: 'salsas',
    categoryLabel: 'Con Salsas Caseras',
    picor: 'suave',
    heatLabel: 'Picor Suave',
    tiempo: 'express',
    timeMinutes: 15,
    servings: 4,
    calories: '420 kcal',
    productUsed: 'Salsa Verde Mexicana 250 g',
    image: 'assets/img/receta-chilaquiles-verdes',
    summary: 'Totopos de maíz bañados al momento en Salsa Verde Mexicana caliente, coronados con crema fresca, queso Cotija y cebolla morada.',
    ingredientes_locales: [
      '1 frasco de Salsa Verde Mexicana La Costeña (250 g)',
      '300 g de totopos de maíz dorados de tortillería de Tijuana',
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
    featured: true,
    nombre: 'Tinga Poblana de Pollo al Chipotle Adobado',
    categoria: 'Chiles',
    category: 'chiles',
    categoryLabel: 'Con Chiles',
    picor: 'alto',
    heatLabel: 'Picor Intenso',
    tiempo: 'tradicional',
    timeMinutes: 25,
    servings: 6,
    calories: '380 kcal',
    productUsed: 'Chiles Chipotles Adobados 215 g',
    image: 'assets/img/receta-tinga-pollo',
    summary: 'Hebras de pollo jugosas cocinadas lentamente en caldillo de jitomate asado, cebolla caramelizada y el toque ahumado de Chipotles Adobados.',
    ingredientes_locales: [
      '1 lata de Chiles Chipotles Adobados La Costeña (215 g)',
      '500 g de pechuga de pollo deshebrada',
      '2 cebollas blancas grandes fileteadas en pluma',
      '4 jitomates guaje maduros de San Quintín asados',
      '1 hoja de laurel y tostadas de maíz para servir'
    ],
    steps: [
      'Acitrona la cebolla fileteada en aceite caliente durante 6 minutos hasta que luzca translúcida y dulce.',
      'Licúa los jitomates asados con los Chiles Chipotles Adobados La Costeña y un toque de caldo.',
      'Vierte la salsa sobre la cebolla, incorpora el pollo y el laurel, y cocina 12 minutos a fuego medio.'
    ]
  },
  {
    id: 'rec-esquites',
    featured: true,
    nombre: 'Esquites Callejeros Cremosos con Mayonesa de Chipotle',
    categoria: 'Vegetales',
    category: 'vegetales',
    categoryLabel: 'Con Vegetales',
    picor: 'medio',
    heatLabel: 'Picor Medio',
    tiempo: 'express',
    timeMinutes: 10,
    servings: 4,
    calories: '290 kcal',
    productUsed: 'Elotes Dorados en Grano 410 g',
    image: 'assets/img/receta-esquites',
    summary: 'Elotes Dorados salteados a la mantequilla con epazote fresco, limón real, queso añejo y mayonesa ahumada de chipotle.',
    ingredientes_locales: [
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
    id: 'rec-enfrijoladas',
    featured: false,
    nombre: 'Croquetas de Plátano Macho sobre Frijoles Bayos Refritos',
    categoria: 'Frijoles',
    category: 'frijoles',
    categoryLabel: 'Con Frijoles',
    picor: 'suave',
    heatLabel: 'Picor Suave',
    tiempo: 'tradicional',
    timeMinutes: 20,
    servings: 4,
    calories: '460 kcal',
    productUsed: 'Frijoles Bayos Refritos 430 g',
    image: 'assets/img/receta-croquetas-platano',
    summary: 'Croquetas doradas de plátano macho rellenas de queso fresco y servidas sobre un espejo cremoso de Frijoles Bayos Refritos La Costeña.',
    ingredientes_locales: [
      '1 lata de Frijoles Bayos Refritos La Costeña (430 g)',
      '3 plátanos machos maduros cocidos y machacados',
      '200 g de queso fresco de Real del Castillo desmoronado',
      '1/2 taza de crema ácida y cilantro fresco picado',
      '1 pizca de sal de mar de San Felipe'
    ],
    steps: [
      'Calienta los Frijoles Bayos Refritos La Costeña con un toque de caldo hasta lograr un espejo terso y cremoso.',
      'Forma croquetas con el puré de plátano macho rellenas de queso fresco y dóralas ligeramente.',
      'Sirve las croquetas calientes sobre la cama de frijoles bayos y decora con crema, queso y cilantro.'
    ]
  },
  {
    id: 'rec-huevos-rancheros',
    featured: false,
    nombre: 'Huevos Rancheros de Hacienda con Jalapeños en Escabeche',
    categoria: 'Chiles',
    category: 'chiles',
    categoryLabel: 'Con Chiles',
    picor: 'medio',
    heatLabel: 'Picor Medio',
    tiempo: 'express',
    timeMinutes: 12,
    servings: 2,
    calories: '350 kcal',
    productUsed: 'Chiles Jalapeños Enteros 220 g',
    image: 'assets/img/rec-huevos-rancheros',
    summary: 'Huevos estrellados sobre tortilla dorada, cubiertos con Salsa Ranchera tibia y coronados con Chiles Jalapeños y zanahorias en escabeche.',
    ingredientes_locales: [
      '1 lata de Chiles Jalapeños Enteros La Costeña (220 g)',
      '1 frasco de Salsa Ranchera Tatemada La Costeña (250 g)',
      '4 huevos frescos de granja local',
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
    id: 'rec-tacos-dorados',
    featured: false,
    nombre: 'Tacos Dorados Ahogados en Salsa Ranchera Tatemada',
    categoria: 'Salsas',
    category: 'salsas',
    categoryLabel: 'Con Salsas Caseras',
    picor: 'medio',
    heatLabel: 'Picor Medio',
    tiempo: 'tradicional',
    timeMinutes: 20,
    servings: 4,
    calories: '440 kcal',
    productUsed: 'Salsa Ranchera Tatemada 250 g',
    image: 'assets/img/rec-tacos-dorados',
    summary: 'Flautas crujientes de papa y requesón servidas sobre espejo de Salsa Ranchera Tatemada, lechuga fresca y rajas de jalapeño.',
    ingredientes_locales: [
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
  },
  {
    id: 'rec-burrito-baja',
    featured: false,
    nombre: 'Burrito Fronterizo de Carne Asada y Frijoles Bayos',
    categoria: 'Frijoles',
    category: 'frijoles',
    categoryLabel: 'Con Frijoles',
    picor: 'medio',
    heatLabel: 'Picor Medio',
    tiempo: 'express',
    timeMinutes: 14,
    servings: 2,
    calories: '510 kcal',
    productUsed: 'Frijoles Bayos Refritos 430 g',
    image: 'assets/img/rec-enfrijoladas',
    summary: 'Tortilla sobaquera rellena de carne asada al carbón, Frijoles Bayos Refritos, guacamole rústico y rajas de jalapeño.',
    ingredientes_locales: [
      '1 lata de Frijoles Bayos Refritos La Costeña (430 g)',
      '2 tortillas de harina estilo Baja California',
      '250 g de diezmillo de res asado y picado',
      'Chiles Jalapeños en Escabeche La Costeña en rajas',
      '1 aguacate machacado con limón'
    ],
    steps: [
      'Calienta los Frijoles Bayos Refritos La Costeña y úntalos generosamente sobre las tortillas de harina tibias.',
      'Distribuye la carne asada caliente, el aguacate machacado y las rajas de jalapeño.',
      'Enrolla cerrando los extremos y sella el burrito 1 minuto por lado en comal caliente.'
    ]
  },
  {
    id: 'rec-tostadas-ceviche-verde',
    featured: false,
    nombre: 'Tostadas estilo Ensenada con Salsa Verde de Tomatillo',
    categoria: 'Salsas',
    category: 'salsas',
    categoryLabel: 'Con Salsas Caseras',
    picor: 'suave',
    heatLabel: 'Picor Suave',
    tiempo: 'express',
    timeMinutes: 12,
    servings: 4,
    calories: '310 kcal',
    productUsed: 'Salsa Verde Mexicana 250 g',
    image: 'assets/img/rec-chilaquiles',
    summary: 'Pescado blanco marinado en limón con pepino, cilantro y un baño fresco de Salsa Verde Mexicana de Tomatillo sobre tostadas.',
    ingredientes_locales: [
      '1 frasco de Salsa Verde Mexicana La Costeña (250 g)',
      '400 g de filete de pescado blanco de Ensenada en cubos',
      'Jugo de 6 limones, 1 pepino picado y cebolla morada',
      '8 tostadas de maíz horneadas',
      'Rebanadas de aguacate y cilantro fresco'
    ],
    steps: [
      'Marina el pescado en jugo de limón con sal durante 8 minutos e incorpora pepino y cebolla morada.',
      'Mezcla la mitad de la Salsa Verde Mexicana La Costeña con el ceviche para darle acidez tatemada.',
      'Sirve sobre las tostadas y corona con aguacate y más Salsa Verde al gusto.'
    ]
  },
  {
    id: 'rec-camarones-chipotle',
    featured: false,
    nombre: 'Camarones del Pacífico al Chipotle Cremoso',
    categoria: 'Chiles',
    category: 'chiles',
    categoryLabel: 'Con Chiles',
    picor: 'alto',
    heatLabel: 'Picor Intenso',
    tiempo: 'tradicional',
    timeMinutes: 22,
    servings: 4,
    calories: '430 kcal',
    productUsed: 'Chiles Chipotles Adobados 215 g',
    image: 'assets/img/rec-tinga',
    summary: 'Camarones salteados en mantequilla de ajo y bañados en salsa aterciopelada de crema y Chiles Chipotles Adobados.',
    ingredientes_locales: [
      '1 lata de Chiles Chipotles Adobados La Costeña (215 g)',
      '500 g de camarón mediano limpio de Baja California',
      '1 taza de crema ácida y 1/2 taza de leche evaporada',
      '2 dientes de ajo picados y 2 cucharadas de mantequilla',
      'Arroz blanco al vapor para acompañar'
    ],
    steps: [
      'Licúa la crema, la leche evaporada y de 2 a 3 Chiles Chipotles Adobados La Costeña con su adobo.',
      'Saltea los camarones con ajo y mantequilla durante 3 minutos hasta que cambien de color.',
      'Vierte la salsa de chipotle, cocina a fuego suave por 5 minutos hasta espesar y sirve con arroz.'
    ]
  },
  {
    id: 'rec-sopa-tortilla-ranchera',
    featured: false,
    nombre: 'Sopa Azteca Express con Salsa Ranchera Tatemada',
    categoria: 'Salsas',
    category: 'salsas',
    categoryLabel: 'Con Salsas Caseras',
    picor: 'medio',
    heatLabel: 'Picor Medio',
    tiempo: 'express',
    timeMinutes: 15,
    servings: 4,
    calories: '340 kcal',
    productUsed: 'Salsa Ranchera Tatemada 250 g',
    image: 'assets/img/rec-tacos-dorados',
    summary: 'Caldillo reconfortante preparado en minutos con Salsa Ranchera Tatemada, julianas de tortilla crujiente, aguacate y queso.',
    ingredientes_locales: [
      '1 frasco de Salsa Ranchera Tatemada La Costeña (250 g)',
      '3 tazas de caldo de pollo casero y 1 rama de epazote',
      '200 g de tiras de tortilla de maíz doradas',
      '150 g de queso panela en cubos y 1 aguacate',
      'Crema fresca para decorar'
    ],
    steps: [
      'Vierte la Salsa Ranchera Tatemada La Costeña en una olla con el caldo de pollo y el epazote; hierve 8 minutos.',
      'Reparte las tiras de tortilla dorada, el queso panela y el aguacate en tazones hondos.',
      'Sirve el caldillo bien caliente al momento y añade un toque de crema.'
    ]
  },
  {
    id: 'rec-ensalada-elotes-tijuana',
    featured: false,
    nombre: 'Ensalada Fresca de Elotes Dorados y Aguacate',
    categoria: 'Vegetales',
    category: 'vegetales',
    categoryLabel: 'Con Vegetales',
    picor: 'suave',
    heatLabel: 'Picor Suave',
    tiempo: 'express',
    timeMinutes: 10,
    servings: 4,
    calories: '240 kcal',
    productUsed: 'Elotes Dorados en Grano 410 g',
    image: 'assets/img/rec-esquites',
    summary: 'Guarnición ligera para carnes asadas con Elotes Dorados Dulces, jitomate cherry, aguacate, cilantro y vinagreta de limón.',
    ingredientes_locales: [
      '1 lata de Elotes Dorados La Costeña (410 g) drenada',
      '1 taza de jitomates cherry de San Quintín partidos a la mitad',
      '1 aguacate firme en cubos y 1/4 de cebolla morada picada',
      'Jugo de 2 limones, aceite de oliva del Valle de Guadalupe y cilantro',
      'Queso fresco desmoronado al gusto'
    ],
    steps: [
      'En un tazón amplio mezcla los Elotes Dorados La Costeña con los jitomates cherry y la cebolla morada.',
      'Emulsiona el jugo de limón con el aceite de oliva, sal y pimienta e incorpóralo a la ensalada.',
      'Agrega el aguacate, el cilantro fresco y el queso desmoronado justo antes de servir.'
    ]
  },
  {
    id: 'rec-molletes-jalapeno',
    featured: false,
    nombre: 'Molletes Gratinados con Frijoles Bayos y Pico de Jalapeño',
    categoria: 'Frijoles',
    category: 'frijoles',
    categoryLabel: 'Con Frijoles',
    picor: 'medio',
    heatLabel: 'Picor Medio',
    tiempo: 'express',
    timeMinutes: 12,
    servings: 4,
    calories: '390 kcal',
    productUsed: 'Frijoles Bayos Refritos 430 g',
    image: 'assets/img/rec-huevos-rancheros',
    summary: 'Bolillos crujientes untados con Frijoles Bayos Refritos, queso menonita fundido y pico de gallo con Chiles Jalapeños en Escabeche.',
    ingredientes_locales: [
      '1 lata de Frijoles Bayos Refritos La Costeña (430 g)',
      '1 lata de Chiles Jalapeños Enteros La Costeña (220 g) picados con su zanahoria',
      '4 bolillos artesanales partidos a la mitad',
      '200 g de queso manchego o menonita rallado',
      '2 jitomates picados con cebolla y cilantro'
    ],
    steps: [
      'Tuesta ligeramente las mitades de bolillo y unta una capa abundante de Frijoles Bayos Refritos La Costeña.',
      'Cubre con el queso rallado y gratina en horno o sartén tapado durante 5 minutos.',
      'Mezcla el jitomate con los Chiles Jalapeños La Costeña picados y sirve sobre los molletes calientes.'
    ]
  }
];

export const RECIPES = RAW_RECIPES.map((r) => ({
  ...r,
  title: r.nombre,
  heat: r.picor,
  timeBucket: r.tiempo,
  imagen: `${r.image}.avif`,
  imagenWebp: `${r.image}.webp`,
  ingredientes: r.ingredientes_locales,
  ingredients: r.ingredientes_locales,
  deep_link_whatsapp: makeWaLink(r.nombre, r.ingredientes_locales)
}));

export const RECETAS = RECIPES;
export const FEATURED_RECIPES = RECIPES.filter((r) => r.featured).slice(0, 3);

/**
 * Pure matrix filtering function (shared by UI and unit tests).
 * Filters recipes by category/categoria × heat/picor × time/tiempo × search query.
 */
export function filterRecipes(recipes, { category = 'all', heat = 'all', time = 'all', query = '' } = {}) {
  const catNorm = category.toLowerCase();
  const heatNorm = heat.toLowerCase();
  const timeNorm = time.toLowerCase();
  const q = query.trim().toLowerCase();

  return recipes.filter((r) => {
    const rCat = (r.categoria || r.category || '').toLowerCase();
    const rHeat = (r.picor || r.heat || '').toLowerCase();
    const rTime = (r.tiempo || r.timeBucket || '').toLowerCase();
    const rTitle = r.nombre || r.title || '';
    const rIng = (r.ingredientes_locales || r.ingredientes || r.ingredients || []).join(' ');

    if (catNorm !== 'all' && rCat !== catNorm) return false;
    if (heatNorm !== 'all' && rHeat !== heatNorm) return false;
    if (timeNorm !== 'all' && rTime !== timeNorm) return false;
    if (q && !`${rTitle} ${r.summary || ''} ${r.productUsed || ''} ${rIng}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function buildRecipeSchemaNodes(recipesList) {
  return recipesList.map((r) => ({
    '@type': 'Recipe',
    '@id': `https://www.lacostena.com.mx/#${r.id}`,
    name: r.nombre,
    author: { '@type': 'Organization', name: 'La Costeña' },
    description: r.summary,
    image: [
      `https://www.lacostena.com.mx/${r.image}.avif`,
      `https://www.lacostena.com.mx/${r.image}.webp`
    ],
    totalTime: `PT${r.timeMinutes}M`,
    recipeYield: `${r.servings} porciones`,
    recipeCategory: r.categoria,
    recipeCuisine: 'Mexicana',
    nutrition: {
      '@type': 'NutritionInformation',
      calories: r.calories
    },
    recipeIngredient: r.ingredientes_locales,
    recipeInstructions: r.steps.map((stepText, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      text: stepText
    }))
  }));
}
