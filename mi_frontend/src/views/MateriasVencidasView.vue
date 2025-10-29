<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h2 class="text-center mb-4 text-primary">📚 Materias Vencidas</h2>
        
        <div v-if="isLoading" class="alert alert-info text-center" role="alert">
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Cargando datos...
        </div>

        <div v-else-if="vencidas.length > 0">
          <p class="lead text-success fw-bold">
            Tienes {{ vencidas.length }} Materias vencidas:
          </p>
          
          <div class="row">
            <div v-for="materia in vencidas" :key="materia.id" class="col-12 mb-3">
              <div class="card border-success shadow">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <span class="fs-5 fw-bold">{{ materia.sigla }}</span>
                  <span class="text-end">{{ materia.nombre }}</span>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      Nivel: <span class="badge bg-secondary">{{ materia.nivel }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      Horas de Estudio: <span class="badge bg-secondary">{{ materia.horasDeEstudio }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      Nota: <span class="badge bg-success text-dark">{{ materia.nota }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-success text-center" role="alert">
            ⚠️ Los datos del estudiante no han sido cargados. Por favor, vuelve al 
            <router-link to="/login" class="alert-link">Login</router-link>.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'; 

const authStore = useAuthStore();
const { estudiante, isLoading } = storeToRefs(authStore);

const vencidas = computed(() => {
    return estudiante.value?.materiasVencidasLista || [];
});
</script>

<style scoped>


</style>