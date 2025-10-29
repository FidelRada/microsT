const jwt = require('jsonwebtoken');

// ⚠️ ¡IMPORTANTE! Usa la misma clave secreta que en routes/auth.js
const JWT_SECRET = 'TU_SECRETO_SUPER_SEGURO'; 

/**
 * Middleware 1: Verifica la existencia y validez del token JWT en la cookie.
 * Si es válido, adjunta la data del usuario (payload) a req.userData.
 */
exports.verifyToken = (req, res, next) => {
    // 1. Obtener el token de la cookie 'authToken'
    const token = req.cookies.authToken;

    if (!token) {
        // Si no hay token, denegar acceso (ej: para API)
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // 2. Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Adjuntar la data decodificada para usarla en el proxy
        req.userData = decoded; 
        
        // 4. Continuar el flujo (al proxy)
        next();
    } catch (err) {
        // Token inválido (expirado, modificado)
        console.error("JWT Verification Error:", err.message);
        // Limpiar la cookie si es inválida para forzar al usuario a iniciar sesión de nuevo
        res.clearCookie('authToken'); 
        return res.status(401).json({ message: 'Token inválido o expirado. Acceso denegado.' });
    }
};


/**
 * Middleware 2: Se usa con express-http-proxy para añadir la identidad del usuario 
 * (verificada por el Gateway) en un encabezado para el microservicio interno.
 */
exports.addUserHeader = (proxyReq, req) => {
    // Solo si la verificación fue exitosa, añadimos el encabezado
    if (req.userData && req.userData.userId) {
        // El microservicio Express interno (ej: Inscripción) leerá 'X-User-ID'
        proxyReq.setHeader('X-User-ID', req.userData.userId);
    }
};