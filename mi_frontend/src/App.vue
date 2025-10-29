<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Necesitas importar el store

const route = useRoute();
const authStore = useAuthStore(); // Inicializa el store

// Computada para saber si estamos en la ruta de login
const isLoginPage = computed(() => route.path === '/login');
// Computada para saber si el usuario está logueado (necesario para la navegación condicional)
const isLoggedIn = computed(() => !!authStore.userRegistro); // Verifica si el registro existe

// Función para cerrar sesión (si la usas)
const handleLogout = () => {
  authStore.logout(); // Asume que tienes una acción logout en tu store
  // Opcional: Redirigir al login
  // router.push('/login'); 
};
</script>

<template>

  <header v-if="!isLoginPage && isLoggedIn">

    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container-fluid">

        <a class="navbar-brand text-success fw-bold" href="#">Estudiante App</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink to="/home" class="nav-link">🏠 Home (Ver Datos)</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/inscripcion" class="nav-link">📝 Oferta para Inscripción</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/vencidas" class="nav-link">🏆 Materias Vencidas</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/verificarInscripcion" class="nav-link">🕵🏼‍♂️ Verificar Inscripción</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/Boleta" class="nav-link">📃 Boleta de Inscripción</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/otra-opcion" class="nav-link">⚙️ Otra Opción</RouterLink>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/login" @click="handleLogout" class="btn btn-outline-danger">
                🚪 Cerrar Sesión
              </RouterLink>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  </header>

  <main class="container mt-4">
    <RouterView />
  </main>
</template>

<style></style>