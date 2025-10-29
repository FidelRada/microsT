<template>
  <div class="container my-5 text-center">
    
    <h1 class="mb-5">🏠 Bienvenido, {{ estudiante?.estudiante?.nombre || 'Usuario' }}</h1>

    <div v-if="estudiante?.estudiante" class="row justify-content-center">
      
      <div class="col-md-8">
        
        <div class="card shadow-lg border-success">
          <div class="card-header bg-success text-white">
            <h2 class="h5 mb-0">Información del Estudiante</h2>
          </div>
          <div class="card-body text-start">
            
            <p class="card-text">
              <strong>Registro:</strong> {{ estudiante.estudiante.registro }}
            </p>
            <p class="card-text">
              <strong>CI:</strong> {{ estudiante.estudiante.ci }}
            </p>
            <p class="card-text">
              <strong>Nombre Completo:</strong>
              {{ estudiante.estudiante.nombre }} {{ estudiante.estudiante.apellidoPaterno }} {{ estudiante.estudiante.apellidoMaterno }}
            </p>
            <hr class="text-muted"> 
            <p class="card-text">
              <strong>Fecha Nacimiento:</strong> {{ estudiante.estudiante.fechaNacimiento ? new Date(estudiante.estudiante.fechaNacimiento).toLocaleDateString() : 'N/A' }}
            </p>
            <p class="card-text">
              <strong>Nacionalidad:</strong> {{ estudiante.estudiante.nacionalidad }}
            </p>
            
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-5">
      <div class="alert alert-danger" role="alert">
        <p class="mb-0">Cargando información o error al iniciar sesión. Por favor, vuelve al <router-link to="/login" class="alert-link">Login</router-link>.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { estudiante, isLoading } = storeToRefs(authStore);

// Al montar el componente Home, iniciamos la consulta al backend
onMounted(async () => {
  console.log("HomeView Montado. Iniciando fetchStudentData.");

  if (!estudiante.value?.estudiante && !isLoading.value) { // Se incluye la verificación del objeto anidado
    await authStore.fetchStudentData();
  }
});
</script>

<style scoped>
/*
  ¡BLOQUE CSS ELIMINADO!
  Todos los estilos ahora son manejados por las clases de Bootstrap.
*/
</style>