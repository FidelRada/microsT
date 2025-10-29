import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// Asegúrate de importar tu nuevo componente Login
import LoginView from '../views/LoginView.vue' 
import MateriasVencidasView from '@/views/MateriasVencidasView.vue'
import InscripcionMateriaView from '@/views/InscripcionMateriaView.vue'
import VerificarInscripcion from '@/views/VerificarInscripcion.vue'
import BoletaView from '@/views/BoletaView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // Redirige la raíz al login
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView // Tu componente Login
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView // Tu componente Home
    },
    {
      path: '/vencidas',
      name: 'vencidas',
      component: MateriasVencidasView // Tu componente Home
    },
    {
      path: '/inscripcion',
      name: 'inscripcion',
      component: InscripcionMateriaView // Tu componente Home
    },
    {
      path: '/verificarInscripcion',
      name: 'verificarInscripcion',
      component: VerificarInscripcion // Tu componente Home
    },
    {
      path: '/boleta',
      name: 'boleta',
      component: BoletaView
    },
    
    // Puedes agregar más rutas aquí
    {
      path: '/otra-opcion',
      name: 'otra-opcion',
      // Simplemente usa el HomeView o crea un componente placeholder
      component: HomeView 
    },
    
  ]
})

export default router