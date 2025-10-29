const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/nueva', (req, res) => {
    // ⚠️ LEER el encabezado que el Gateway inyectó
    const userId = req.header('X-User-ID'); 

    if (!userId) {
        // Esto NO debería pasar si el Gateway funcionó correctamente, 
        // pero es una buena práctica de seguridad.
        return res.status(403).json({ message: "Error: No se encontró ID de usuario. Acceso denegado." });
    }

    const inscripcionData = req.body;
    
    console.log(`✅ Inscripción recibida para el Usuario ID: ${userId}`);
    
    // Simular el procesamiento de la inscripción
    res.status(201).json({ 
        status: "success",
        message: `Inscripción creada exitosamente para el curso ${inscripcionData.cursoId}.`,
        userId: userId 
    });
});

app.listen(PORT, () => {
    console.log(`Microservicio INSCRIPCIÓN corriendo en http://localhost:${PORT}`);
});