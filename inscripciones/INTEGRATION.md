# Configuración para Integración de Microservicios

## 1. Endpoints Disponibles

### Base URL
- Desarrollo: `http://localhost:3001`
- Docker interno: `http://inscripciones:3001` (cuando uses docker-compose)

### Principales Endpoints
- `GET /api/status` - Health check del servicio
- `GET /api-docs` - Documentación Swagger
- Otros endpoints específicos en la documentación Swagger

## 2. Configuración para el API Gateway

### Docker Compose
Para integrar este servicio con tu API Gateway, añade este servicio a tu `docker-compose.yml`:

```yaml
services:
  inscripciones:
    image: inscripciones:latest
    environment:
      - PORT=3001
      - DB_HOST=db
      - REDIS_HOST=redis
      - ALLOWED_ORIGINS=http://localhost:3000,http://gateway:3000
    ports:
      - "3001:3001"
    networks:
      - gateway_network
```

### Variables de Entorno
- `PORT`: Puerto del servicio (3001 por defecto)
- `ALLOWED_ORIGINS`: URLs permitidas para CORS (separadas por comas)
- `DB_HOST`: Host de PostgreSQL
- `REDIS_HOST`: Host de Redis

## 3. Ejemplo de Integración con Gateway

```javascript
// En tu API Gateway
const axios = require('axios');

const inscripcionesService = axios.create({
  baseURL: process.env.INSCRIPCIONES_URL || 'http://inscripciones:3001',
  timeout: 5000
});

// Ejemplo de proxy a través del gateway
app.use('/inscripciones', async (req, res) => {
  try {
    const response = await inscripcionesService({
      method: req.method,
      url: req.url,
      data: req.body,
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || { error: 'Service unavailable' });
  }
});
```

## 4. Monitoreo y Health Check

### Health Check Endpoint
```bash
curl http://localhost:3001/api/status
```

### Verificar Conexión desde Gateway
```bash
# Desde el contenedor del gateway
curl http://inscripciones:3001/api/status
```

## 5. Seguridad y Buenas Prácticas

1. En producción, especifica ALLOWED_ORIGINS exactos
2. Usa HTTPS en producción
3. Implementa rate limiting
4. Usa circuit breakers para llamadas entre servicios
5. Configura timeouts adecuados

## 6. Diagnóstico de Problemas

### Verificar Conectividad
```bash
# Desde el contenedor del gateway
nc -zv inscripciones 3001
```

### Logs del Servicio
```bash
docker logs inscripciones
```

### Verificar Red Docker
```bash
docker network inspect gateway_network
```