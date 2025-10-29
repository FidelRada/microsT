<template>
    <div class="container py-4">
        <h1 class="text-center mb-4 text-primary">Boleta de Inscripción 📄</h1>

        <div v-if="boletaData" class="card shadow mb-4 border-start border-primary border-5">
            <div class="card-body">
                <div class="row align-items-center">
                    
                    <div class="col-md-8 text-start border-end">
                        <h4 class="card-title text-dark mb-1">
                            {{ boletaData.Estudiante.nombre }} {{ boletaData.Estudiante.apellidoPaterno }} {{ boletaData.Estudiante.apellidoMaterno }}
                        </h4>
                        <p class="card-text mb-0">
                            <span class="fw-bold me-2 text-secondary">Registro:</span> 
                            <span class="badge bg-primary fs-6">{{ boletaData.Estudiante.registro }}</span>
                        </p>
                        <p class="card-text mb-0 text-muted small">
                            Carrera: Ingeniería Informática (Asunción) </p>
                    </div>

                    <div class="col-md-4 text-start ps-4">
                        <p class="mb-1">
                            <span class="fw-bold text-secondary">Boleta Nro:</span> 
                            <span class="fw-bold text-dark">{{ boletaData.id }}</span>
                        </p>
                        <p class="mb-1">
                            <span class="fw-bold text-secondary">Fecha de Inscripción:</span> 
                            {{ formatDate(boletaData.fechaDeInscripcion) }}
                        </p>
                    </div>

                </div>
            </div>
        </div>
        <div v-else-if="loading" class="alert alert-info text-center" role="alert">
            Cargando Boleta de Inscripción...
        </div>
        <div v-else class="alert alert-danger text-center" role="alert">
            ⚠️ No se pudo obtener la boleta de inscripción o el estudiante no tiene una boleta activa.
        </div>

        <h3 v-if="detalleInscripciones.length > 0" class="mt-5 mb-3 text-start text-secondary">Materias Inscritas ({{ detalleInscripciones.length }})</h3>

        <div v-if="detalleInscripciones.length > 0" class="table-responsive">
            <table class="table table-hover table-striped border">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Sigla</th>
                        <th scope="col">Materia</th>
                        <th scope="col">Grupo</th>
                        <th scope="col">Docente</th>
                        <th scope="col">Horarios y Aula</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="detalle in detalleInscripciones" :key="detalle.id">
                        <th scope="row">{{ detalle.Grupo_Materium.Materium.sigla }}</th>
                        
                        <td>{{ detalle.Grupo_Materium.Materium.nombre }} (Nivel {{ detalle.Grupo_Materium.Materium.nivel }})</td>
                        
                        <td class="fw-bold text-primary">{{ detalle.Grupo_Materium.sigla }}</td>
                        
                        <td>
                            {{ detalle.Grupo_Materium.Docente.nombre }} 
                            {{ detalle.Grupo_Materium.Docente.apellidoPaterno }}
                        </td>
                        
                        <td>
                            <div v-if="detalle.Grupo_Materium.AulaHorarios.length === 0" class="text-muted small">
                                (Sin horarios asignados)
                            </div>
                            <div v-for="ah in detalle.Grupo_Materium.AulaHorarios" :key="ah.id" class="small">
                                🗓️ **{{ ah.Horario.dia }}** | 
                                ⏰ {{ formatTime(ah.Horario.inicio) }} - {{ formatTime(ah.Horario.final) }} | 
                                🏠 M-{{ ah.Aula.Modulo.id }} (Aula: {{ ah.Aula.numero }})
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'; // 🚀 IMPORTAR ref y computed
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import router from '@/router'; // 🚀 IMPORTAR router (necesario para la redirección)

// ----------------------------------------------------------------------
// CONSTANTES Y STORE
// ----------------------------------------------------------------------

// const API_INSCRIPCION_BASE_URL = 'http://localhost:3000/api/inscripcion'; // Usar valor hardcodeado o asegurar la variable de entorno
const API_INSCRIPCION_BASE_URL = import.meta.env.VITE_API_INSCRIPCION_BASE_URL; // Alternativa si usas la variable ENV

const authStore = useAuthStore();
// 🚀 EXTRAER el estado del estudiante y userRegistro correctamente
const { estudiante, userRegistro } = storeToRefs(authStore); 

// ----------------------------------------------------------------------
// ESTADO REACTIVO LOCAL
// ----------------------------------------------------------------------

const boletaData = ref(null); // 🚀 DEFINIDO como ref para ser REACTIVO
const loading = ref(true);    // 🚀 DEFINIDO como ref para ser REACTIVO

// ----------------------------------------------------------------------
// PROPIEDADES COMPUTADAS
// ----------------------------------------------------------------------

// 🚀 COMPUTED para acceder a los detalles de inscripción de manera segura
const detalleInscripciones = computed(() => {
    return boletaData.value?.Detalle_Inscripcions || [];
});

// ----------------------------------------------------------------------
// UTILIDADES DE FORMATO
// ----------------------------------------------------------------------

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); // Muestra solo HH:mm
};

// ----------------------------------------------------------------------
// FUNCIÓN DE CARGA DE DATOS (fetchBoleta)
// ----------------------------------------------------------------------

const fetchBoleta = async () => {
    loading.value = true;
    
    // 1. Verificación de Registro (usamos userRegistro.value que viene del store)
    const registro = userRegistro.value; 
    
    if (!registro) {
        console.error("No hay registro de usuario. Redirigiendo a Login.");
        loading.value = false;
        router.push('/login');
        return;
    }
    
    // 2. Construir la URL
    const url = `${API_INSCRIPCION_BASE_URL}/boleta/${registro}`;
    console.log("buscando boleta:", url);

    try {
        const response = await fetch(url);

        console.log("Respuesta de fetchBoleta:", response);
        
        if (!response.ok) {
            console.error(`Error HTTP: ${response.status}`);
            boletaData.value = null; 
            // ⚠️ Opcional: Si el código es 404, significa que no tiene boleta, no es un error fatal.
            if (response.status !== 404) {
                 throw new Error(`Error al obtener boleta. Código: ${response.status}`);
            }
        }
        
        const jsonRes = await response.json();
        
        // 3. Asignar datos de la Boleta
        if (jsonRes.exito && jsonRes.data) {
            boletaData.value = jsonRes.data;
        } else {
            console.warn("Respuesta de API exitosa, pero no se encontró 'data' de boleta o exito es falso.");
            boletaData.value = null;
        }

    } catch (error) {
        console.error("Error en fetchBoleta:", error);
        boletaData.value = null; 
    } finally {
        loading.value = false;
    }
};


// ----------------------------------------------------------------------
// HOOKS DEL CICLO DE VIDA
// ----------------------------------------------------------------------

onMounted(async () => {
  console.log("BoletaView Montado.");
  await fetchBoleta();
});
</script>

<style scoped>
/*
  ¡BLOQUE CSS ELIMINADO!
  Todos los estilos ahora son manejados por las clases de Bootstrap.
*/
</style>