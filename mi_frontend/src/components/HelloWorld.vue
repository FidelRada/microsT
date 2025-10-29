<template>
  <div class="home-container">
    <h1>🏠 Bienvenido, {{ estudiante?.estudiante?.nombre || 'Usuario' }}</h1>
    
    <div v-if="isLoading" class="loading-state">
      <p>Cargando información del sistema... Por favor, espere un momento.</p>
    </div>

    <div v-else-if="estudiante && estudiante.estudiante" class="estudiante-info">
      <h3>Datos del Estudiante (Cargados por Backend):</h3>
      <p>✅ ¡Datos cargados exitosamente!</p>
      
      <div class="data-block">
        <p><strong>Registro:</strong> {{ estudiante.estudiante.registro }}</p>
        <p><strong>CI:</strong> {{ estudiante.estudiante.ci }}</p>
        <p><strong>Nombre Completo:</strong> 
          {{ estudiante.estudiante.nombre }} {{ estudiante.estudiante.apellidoPaterno }} {{ estudiante.estudiante.apellidoMaterno }}
        </p>
        <p><strong>Nacionalidad:</strong> {{ estudiante.estudiante.nacionalidad }}</p>
      </div>

      <hr>

      <h4>Detalle de Carrera Cursada:</h4>
      <div v-if="estudiante.estudiante.Detalle_carrera_cursadas?.length > 0">
          <p><strong>Plan:</strong> {{ estudiante.estudiante.Detalle_carrera_cursadas[0].Plan_de_estudio.nombre }}</p>
          <p><strong>Modalidad:</strong> {{ estudiante.estudiante.Detalle_carrera_cursadas[0].Plan_de_estudio.modalidad }}</p>
          <p><strong>Fecha Inscripción:</strong> {{ new Date(estudiante.estudiante.Detalle_carrera_cursadas[0].fechaInscripcion).toLocaleDateString() }}</p>
      </div>
      <div v-else>
        <p>No se encontraron detalles de carreras cursadas.</p>
      </div>
    </div>
    
    <div v-else class="error-state">
      <p>No se pudo cargar la información completa. Verifique si su backend está corriendo en <code>localhost:3000</code> y revise la consola del navegador.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
// Obtenemos los estados reactivos del store
const estudiante = authStore.estudiante; 
const isLoading = authStore.isLoading;

// Al montar el componente Home, iniciamos la consulta al backend
onMounted(() => {
    // Solo llamamos al backend si los datos no se han cargado aún
    if (!estudiante.value) { 
        authStore.fetchStudentData();
    }
});
</script>

<style scoped>
.home-container {
    padding: 20px;
    text-align: center;
}
.estudiante-info {
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #42b983;
    border-radius: 8px;
    max-width: 700px;
    text-align: left;
}
.estudiante-info hr {
    margin: 15px 0;
    border: 0;
    border-top: 1px solid #eee;
}
.estudiante-info p {
    margin: 5px 0;
}
.loading-state, .error-state {
    padding: 15px;
    border-radius: 4px;
    margin: 20px auto;
    max-width: 500px;
    font-weight: bold;
}
.loading-state {
    background-color: #e0f7fa;
    color: #00796b;
}
.error-state {
    background-color: #ffebee;
    color: #c62828;
}
.data-block {
    margin-top: 10px;
    padding-left: 15px;
}
</style>

---

## Próximo Paso:

1.  Asegúrate de que tu **backend esté corriendo** en `http://localhost:3000`.
2.  Abre tu frontend (`npm run dev`).
3.  Ve a Login, ingresa el `registro` **(ej: 1)** y cualquier CI.
4.  Serás redirigido a Home, donde verás el mensaje de "Cargando..." hasta que la tarea en tu backend se complete y la información sea consultada con éxito.