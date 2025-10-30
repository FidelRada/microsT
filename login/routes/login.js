require('dotenv').config();
// Imports necesarios para generar el token
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Necesario para la seguridad de contraseñas

const {Estudiante} = require('../models');

// Cargar la clave secreta
const JWT_SECRET = process.env.JWT_SECRET; 

// --- SIMULACIÓN DE DATOS DE USUARIO ---
/*/ En una aplicación real, esto se buscaría en una base de datos.
const users = [
    { 
        id: 1, 
        email: 'test@example.com', 
        passwordHashed:'$2a$12$ZdsFn9oUokTTZCKfD61Tae0dhkjAdyYkDSWKwLm1E9KsGExwNdKRW', // Contraseña: '123456'
        role: 'admin' // Ejemplo de información adicional
    }
];*/
// -------------------------------------

/* POST /login - Maneja la solicitud de autenticación */
router.post('/login', async function(req, res, next) {
    const { registro, ci } = req.body;

    if (!registro || !ci) {
        return res.status(400).json({ message: 'Faltan credenciales.' });
    }

    console.log(`Intento de login para el registro: ${registro}`);
    console.log(`C.I. recibido: ${ci}`);

    // 1. Buscar usuario por registro
    const estudiante = await Estudiante.findOne({ where: { registro } });
    if (!estudiante) {
        // Usar 401 para credenciales incorrectas (no revelar si es usuario o password)
        return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Comparar la contraseña ingresada con el hash
    // **IMPORTANTE: Usa bcrypt.compare en producción**
    /*const isMatch = await bcrypt.compare(password, user.passwordHashed);

    if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
        */
    if (ci !== estudiante.ci) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    
    // 3. Generar el Payload (Datos que el Gateway usará para la autorización)
    const payload = {
        id: estudiante.id,          // ¡CLAVE! El Gateway lee 'req.user.id'
        registro: estudiante.registro,
        role: "estudiante" //por el momento solo lo dejatemos como estudiante
    };

    // 4. Firmar y generar el Token
    // Usar la clave secreta y darle un tiempo de expiración (ej. 1h)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // 5. Enviar el Token al cliente
    res.json({ token });
});


// Puedes agregar una ruta de prueba simple si lo deseas
router.get('/', function(req, res, next) {
  res.send('El servicio de login está funcionando.');
});

module.exports = router;