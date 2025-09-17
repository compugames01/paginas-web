// Esta es tu primera función de backend. Se ejecuta en un entorno de Node.js seguro en Netlify.
// A diferencia del código del frontend, este código NUNCA es visible para los usuarios en sus navegadores.

// --- ¡AQUÍ ES DONDE CONECTAS TU BASE DE DATOS! ---
// Este es el lugar seguro para poner tus credenciales y tu lógica de base de datos.
//
// Descomenta y adapta el código que ya tienes para usarlo aquí:
/*
require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
  
// En lugar de devolver MOCK_PRODUCTS, consulta tu base de datos:
const products = await sql`SELECT * FROM products;`;
*/

// Los datos del producto ahora están definidos directamente aquí para evitar problemas de compilación.
// Reemplaza esto con la consulta a tu base de datos cuando estés listo.
const MOCK_PRODUCTS = [
    { 
        id: 1, 
        name: 'Manzanas Frescas', 
        price: 2.50, 
        image: 'https://picsum.photos/id/1080/400/300', 
        category: 'Frutas y Verduras', 
        tags: ['destacado', 'oferta'],
        description: 'Manzanas rojas crujientes y jugosas, perfectas para comer solas o en tus recetas favoritas. Cosechadas localmente para garantizar la máxima frescura.',
        rating: 4.5,
        reviews: [
            { id: 1, author: 'Ana Pérez', rating: 5, comment: '¡Deliciosas y muy frescas! Las mejores que he probado.' },
            { id: 2, author: 'Carlos García', rating: 4, comment: 'Muy buenas, aunque un poco pequeñas.' },
        ]
    },
    { 
        id: 2, 
        name: 'Leche Entera', 
        price: 1.20, 
        image: 'https://picsum.photos/id/292/400/300', 
        category: 'Lácteos y Huevos', 
        tags: ['destacado'],
        description: 'Leche entera pasteurizada de vaca, rica en calcio y vitaminas. Ideal para el desayuno de toda la familia.',
        rating: 4.8,
        reviews: [
            { id: 3, author: 'Laura Martínez', rating: 5, comment: 'La leche más cremosa y con mejor sabor.' },
        ]
    },
    { 
        id: 3, 
        name: 'Pan de Molde', 
        price: 2.00, 
        image: 'https://picsum.photos/id/160/400/300', 
        category: 'Panadería', 
        tags: ['nuevo'],
        description: 'Pan de molde tierno y esponjoso, perfecto para sándwiches y tostadas. Elaborado con ingredientes de alta calidad.',
        rating: 4.2,
        reviews: [
            { id: 4, author: 'Juan Rodríguez', rating: 4, comment: 'Buen pan, aunque me gustaría que las rebanadas fueran más gruesas.' },
        ]
    },
    { 
        id: 4, 
        name: 'Pechuga de Pollo', 
        price: 8.50, 
        image: 'https://picsum.photos/id/1078/400/300', 
        category: 'Carnes y Pescados', 
        tags: ['nuevo'],
        description: 'Pechuga de pollo fresca y sin hueso, criada sin antibióticos. Carne magra y versátil para todo tipo de preparaciones.',
        rating: 4.9,
        reviews: [
            { id: 5, author: 'Sofía Gómez', rating: 5, comment: 'Calidad excelente. El pollo estaba muy tierno y sabroso.' },
        ]
    },
    { 
        id: 5, 
        name: 'Huevos Camperos (Docena)', 
        price: 3.50, 
        image: 'https://picsum.photos/id/431/400/300', 
        category: 'Lácteos y Huevos', 
        tags: ['destacado'],
        description: 'Docena de huevos de gallinas criadas en libertad. Yemas de color intenso y sabor inigualable.',
        rating: 4.7,
        reviews: [
             { id: 6, author: 'David Fernández', rating: 5, comment: 'Se nota la diferencia con los huevos normales. ¡Muy recomendados!' },
             { id: 7, author: 'Elena Castillo', rating: 4, comment: 'Buenos, pero el empaque llegó un poco dañado.' },
        ]
    },
    { 
        id: 6, 
        name: 'Plátanos', 
        price: 1.80, 
        image: 'https://picsum.photos/id/1025/400/300', 
        category: 'Frutas y Verduras', 
        tags: ['oferta'],
        description: 'Plátanos de Canarias, dulces y llenos de potasio. Perfectos para un snack energético o para postres.',
        rating: 4.6,
        reviews: []
    },
    { 
        id: 7, 
        name: 'Arroz Blanco (1kg)', 
        price: 1.50, 
        image: 'https://picsum.photos/id/25/400/300', 
        category: 'Despensa',
        description: 'Arroz de grano largo de alta calidad, ideal como guarnición o para preparar tus platos favoritos como paella o risotto.',
        rating: 4.4,
        reviews: []
    },
    { 
        id: 8, 
        name: 'Yogur Natural', 
        price: 0.80, 
        image: 'https://picsum.photos/id/312/400/300', 
        category: 'Lácteos y Huevos', 
        tags: ['nuevo'],
        description: 'Yogur natural cremoso sin azúcares añadidos. Una opción saludable y deliciosa para cualquier momento del día.',
        rating: 4.8,
        reviews: []
    },
    { 
        id: 9, 
        name: 'Tomates', 
        price: 2.20, 
        image: 'https://picsum.photos/id/1082/400/300', 
        category: 'Frutas y Verduras', 
        tags: ['destacado'],
        description: 'Tomates maduros y sabrosos, cultivados de forma sostenible. Ideales para ensaladas, salsas o para comer solos.',
        rating: 4.9,
        reviews: []
    },
    { 
        id: 10, 
        name: 'Salmón Fresco', 
        price: 15.00, 
        image: 'https://picsum.photos/id/106/400/300', 
        category: 'Carnes y Pescados', 
        tags: ['nuevo'],
        description: 'Lomo de salmón fresco de primera calidad, rico en Omega-3. Perfecto para cocinar a la plancha, al horno o al vapor.',
        rating: 5.0,
        reviews: []
    },
    { 
        id: 11, 
        name: 'Pasta Espagueti', 
        price: 1.10, 
        image: 'https://picsum.photos/id/464/400/300', 
        category: 'Despensa', 
        tags: ['oferta'],
        description: 'Pasta de sémola de trigo duro de alta calidad. El clásico espagueti que nunca falla para una comida rápida y deliciosa.',
        rating: 4.3,
        reviews: []
    },
    { 
        id: 12, 
        name: 'Baguette Rústica', 
        price: 1.30, 
        image: 'https://picsum.photos/id/349/400/300', 
        category: 'Panadería', 
        tags: ['destacado', 'nuevo'],
        description: 'Baguette artesanal con corteza crujiente y miga tierna. Horneada diariamente en nuestra tienda.',
        rating: 4.9,
        reviews: []
    },
    { 
        id: 13, 
        name: 'Queso Manchego', 
        price: 7.80, 
        image: 'https://picsum.photos/id/30/400/300', 
        category: 'Lácteos y Huevos', 
        tags: ['nuevo', 'destacado'],
        description: 'Queso curado con denominación de origen Manchego. Sabor intenso y textura firme, ideal para tapas y tablas de quesos.',
        rating: 4.8,
        reviews: []
    },
    { 
        id: 14, 
        name: 'Aceite de Oliva Extra Virgen', 
        price: 9.99, 
        image: 'https://picsum.photos/id/495/400/300', 
        category: 'Despensa', 
        tags: ['nuevo'],
        description: 'Aceite de oliva virgen extra de extracción en frío. Sabor frutado y equilibrado, perfecto para aliñar ensaladas o cocinar.',
        rating: 4.9,
        reviews: []
    },
];

exports.handler = async function(event, context) {
  const products = MOCK_PRODUCTS;

  // Devolvemos los productos como una respuesta JSON.
  // El frontend recibirá estos datos.
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(products),
  };
};
