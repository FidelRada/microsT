<template>
  <div class="container my-5"> 
    
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        
        <div class="card shadow p-4">
          <div class="card-body">
            
            <h2 class="card-title text-center mb-4">🔑 Iniciar Sesión</h2>
            
            <form @submit.prevent="handleLogin">
              
              <div class="mb-3">
                <label for="registro" class="form-label">Registro:</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="registro" 
                  v-model="registro" 
                  required
                >
              </div>

              <div class="mb-4">
                <label for="ci" class="form-label">C.I.:</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="ci" 
                  v-model="ci" 
                  required
                >
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-success">Entrar</button>
              </div>
            </form>
            
            <p class="text-muted mt-3">¡Nota: El login redirigirá directamente al Home!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const registro = ref('');
const ci = ref('');
const router = useRouter(); 
const authStore = useAuthStore(); 

const handleLogin = () => {
  const success = authStore.login(registro.value, ci.value);

  if (success) {
    router.push('/home');
  } 
};
</script>

<style scoped>
/* ¡BLOQUE CSS ELIMINADO! */
/* Se podría añadir aquí: .card-title { color: #00796b; } si quieres un color específico. */
</style>