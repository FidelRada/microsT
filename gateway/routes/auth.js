const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TU_SECRETO_SUPER_SEGURO'; 

// ⚠️ Simulación de base de datos de usuarios para la prueba
const mockUserDB = { 
    'test@example.com': { id: 123, role: 'student', password: 'password' } 
};

// RUTA GET: Muestra el formulario de login (si usas EJS)
router.get('/login', (req, res) => {
    res.render('login', { error: null }); 
});

// RUTA POST: Procesa el formulario, valida y genera el token
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = mockUserDB[email]; 

    // 1. Simular validación de credenciales
    if (user && user.password === password) {
        
        // 2. CREAR EL PAYLOAD (Datos del usuario)
        const payload = { 
            userId: user.id, 
            email: user.email, 
            role: user.role 
        };
        
        // 3. GENERAR EL TOKEN JWT
        const token = jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        // 4. Establecer la cookie HTTP-Only
        res.cookie('authToken', token, { 
            httpOnly: true, 
            // req.secure es true si la conexión es HTTPS. Útil para producción.
            secure: req.secure, 
            maxAge: 3600000 // 1 hora en milisegundos
        });

        // 5. Redirigir al home (o responder con JSON si es una API pura)
        return res.redirect('/'); 
    }

    // Si las credenciales son inválidas, re-renderiza el login con error
    res.render('login', { error: 'Credenciales inválidas' });
});

// RUTA POST: Cierra la sesión
router.post('/logout', (req, res) => {
    res.clearCookie('authToken'); // Borra la cookie del token
    res.redirect('/auth/login');
});

module.exports = router;