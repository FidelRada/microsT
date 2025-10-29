const express = require('express');
const app = express();
const PORT = 3002;

app.get('/catalogo', (req, res) => {
    res.json({
        cursos: [
            { id: 1, nombre: "Arquitectura de Microservicios" },
            { id: 2, nombre: "Express Avanzado" }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Microservicio CURSOS corriendo en http://localhost:${PORT}`);
});