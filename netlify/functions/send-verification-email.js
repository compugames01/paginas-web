// Protect against bots & common attacks e.g. SQL injection, XSS, CSRF
const { default: arcjet, shield, detectBot } = require("@arcjet/node");

const aj = arcjet({
  // ARCJET_KEY automatically set by the Netlify integration
  // Log in at https://app.arcjet.com
  key: process.env.ARCJET_KEY,
  rules: [
    // Block common attacks e.g. SQL injection, XSS, CSRF
    shield({
      // Will block requests. Use "DRY_RUN" to log only
      mode: "LIVE",
    }),
    // Detect bots
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except search engine crawlers. See the full list of bots
      // for other options: https://arcjet.com/bot-list
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

// Esta función maneja el envío del correo electrónico de verificación.
// Se ejecuta en un entorno de backend seguro de Node.js en Netlify.

exports.handler = async function(event, context) {
  const decision = await aj.protect(event);

  if (decision.isDenied()) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

  // Solo aceptamos solicitudes POST a esta función.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    const { email, name, token } = JSON.parse(event.body);

    // Validamos que los datos necesarios estén presentes.
    if (!email || !name || !token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Faltan campos obligatorios: email, name, token' }),
      };
    }

    console.log(`Función: Simulando el envío del correo de verificación a ${email}...`);

    const verificationLink = `https://abarrotes-fresco.app/verify?token=${token}&email=${encodeURIComponent(email)}`;

    const emailContent = `
    -----------------------------------------
    To: ${email}
    From: no-reply@abarrotesfresco.com
    Subject: Verifica tu cuenta en Abarrotes Fresco

    Hola ${name},

    ¡Gracias por registrarte en Abarrotes Fresco!
    Para completar tu registro y asegurar tu cuenta, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:

    ${verificationLink}

    Si no te registraste en nuestro sitio, por favor ignora este correo.

    ¡Felices compras!

    El equipo de Abarrotes Fresco
    -----------------------------------------
    `;
    
    console.log("Función: Contenido del correo:");
    console.log(emailContent.trim());
    console.log(`Función: Correo de verificación "enviado" exitosamente a ${name} <${email}>.`);

    // En una aplicación real, aquí usarías un servicio de correo como SendGrid, Mailgun o AWS SES.
    // Por ejemplo: await sendEmailWithSendGrid(email, emailContent);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Correo de verificación enviado exitosamente.' }),
    };

  } catch (error) {
    console.error('Error en la función:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};
