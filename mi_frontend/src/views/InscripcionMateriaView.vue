<template>

    <div class="container py-4">

        <div class="row justify-content-center">

            <div class="col-12">


                <h2 class="text-center mb-4 text-primary">📋 Oferta Académica Disponible</h2>


                <div v-if="isLoading" class="alert alert-info text-center" role="alert">

                    Cargando datos del estudiante y oferta académica...

                </div>

                <div v-else-if="tieneBoletaInscrita" class="alert alert-success text-center py-4 shadow-lg">

                    <h4 class="alert-heading">¡Ya estás inscrito! 🎉</h4>

                    <p class="lead">

                        Tu boleta de inscripción ya está registrada en el sistema. No puedes inscribir más materias.

                    </p>

                    <hr>

                    <p class="mb-0">

                        Serás redirigido a tu <strong class="text-primary">Boleta de Inscripción</strong> en <span
                            class="fw-bold">{{ countdown }}</span> segundos...

                    </p>

                </div>


                <div v-else-if="oferta.length > 0">

                    <p class="lead text-success fw-bold mb-3">

                        Se encontraron {{ oferta.length }} Materia(s) en la oferta actual.

                    </p>
                    
                    <h3 class="mt-4 mb-3 text-primary fs-5">🗓️ Horario de Clases Seleccionado</h3>

                    <div v-if="Object.keys(horarioGrid).length > 0" class="table-responsive shadow-lg rounded mb-3">
                        
                        <table class="table table-bordered table-sm align-middle text-center mb-0">

                            <thead class="table-dark">
                                <tr>
                                    <th style="width: 10%;">Hora</th>
                                    <th v-for="dia in DIAS" :key="dia">{{ dia }}</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(hourData, hour) in horarioGrid" :key="hour">

                                    <td class="fw-bold bg-light" style="width: 10%;">{{ hour }}</td>

                                    <td v-for="dia in DIAS" :key="dia" :class="{
                                        // Aplica ROJO si el slot es un Array (Colisión)
                                        'bg-danger text-white': Array.isArray(hourData[dia]),

                                        // Aplica Amarillo si es una clase normal (Objeto único)
                                        'bg-warning bg-opacity-25': hourData[dia] && !Array.isArray(hourData[dia]),
                                    }">

                                        <div v-if="hourData[dia]">

                                            <div v-if="Array.isArray(hourData[dia])">
                                                <span class="fw-bold d-block mb-1">🚨 ¡COLISIÓN DE HORARIO!</span>
                                                <ul class="list-unstyled small text-start ps-2">
                                                    <li v-for="(colision, index) in hourData[dia]" :key="index"
                                                        class="mb-1 border-top border-light pt-1">
                                                        <span class="fw-bold">{{ colision.materia }} - {{ colision.grupo
                                                            }}</span>
                                                        <br>
                                                        <small>{{ colision.nombre }}</small>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div v-else>
                                                <span class="fw-bold d-block">{{ hourData[dia].materia }} - {{
                                                    hourData[dia].grupo }}</span>
                                                <small class="d-block">{{ hourData[dia].nombre }}</small>

                                                <small class="text-muted d-block">
                                                    Aula: {{ hourData[dia].aula }}
                                                </small>
                                            </div>
                                        </div>

                                        <span v-else class="text-black-50 small">—</span>
                                    </td>
                                </tr>
                            </tbody>

                        </table>

                    </div>
                    
                    <div v-else-if="Object.keys(selectedGroups).length > 0" class="alert alert-info mt-3 mb-3 text-center">
                        Los grupos seleccionados no tienen horarios definidos.
                    </div>
                    <div v-else class="alert alert-info mt-3 mb-3 text-center">
                        Selecciona grupos de la oferta académica para construir tu horario.
                    </div>
                    
                    
                    <div v-if="hasCollision" class="alert alert-danger mb-3 text-center shadow-sm">
                        <h5 class="alert-heading fs-6">🚫 ¡Colisión de Horario!</h5>
                        <p class="mb-0 small">No puedes inscribirte mientras existan materias solapadas. Por favor, cambia
                            tus selecciones para continuar.</p>
                    </div>

                    <div class="d-flex justify-content-end mb-4">

                        <button @click="submitInscripcion" class="btn btn-primary btn-sm" :disabled="!canSubmit">

                            Inscribir Grupos Seleccionados ({{ Object.keys(selectedGroups).length }} Materias)

                        </button>

                    </div>
                    
                    <hr>

                    <h3 class="mt-4 mb-3 text-primary fs-5">Selección de Grupos por Materia</h3>
                    
                    <div class="accordion" id="ofertaAccordion">

                        <div v-for="(materia) in oferta" :key="materia.id" class="accordion-item mb-3 shadow-sm">

                            <h2 class="accordion-header" :id="'heading-' + materia.id">

                                <button class="accordion-button collapsed fw-bold" type="button"
                                    data-bs-toggle="collapse" :data-bs-target="'#collapse-' + materia.id"
                                    aria-expanded="false" :aria-controls="'collapse-' + materia.id">

                                    <span class="me-3 text-primary">{{ materia.sigla }}</span>

                                    <span>{{ materia.nombre }}</span>

                                    <span class="badge bg-secondary ms-auto">Semestre: {{ materia.nivel }}</span>

                                </button>

                            </h2>


                            <div :id="'collapse-' + materia.id" class="accordion-collapse collapse"
                                :aria-labelledby="'heading-' + materia.id" data-bs-parent="#ofertaAccordion">

                                <div class="accordion-body p-0">


                                    <ul class="list-group list-group-flush">


                                        <li v-for="grupo in materia.Grupo_Materia" :key="grupo.id"
                                            class="list-group-item d-flex align-items-center"
                                            :class="{ 'list-group-item-action': grupo.cupo > 0, 'list-group-item-secondary': grupo.cupo <= 0 }">


                                            <input class="form-check-input me-3" type="radio"
                                                :name="'materia-' + materia.id" :id="'grupo-' + grupo.id"
                                                :value="grupo.id" v-model="selectedGroups[materia.id]"
                                                :disabled="grupo.cupo <= 0">


                                            <label class="d-flex flex-grow-1 form-check-label py-1"
                                                :for="'grupo-' + grupo.id" :class="{ 'text-muted': grupo.cupo <= 0 }">


                                                <div class="flex-grow-1">


                                                    <div class="d-flex justify-content-between align-items-center mb-1">

                                                        <span class="fs-6 fw-bold">GRUPO {{ grupo.sigla }}</span>

                                                        <span class="badge"
                                                            :class="{ 'bg-success': grupo.cupo > 0, 'bg-danger': grupo.cupo <= 0 }">

                                                            Cupo: {{ grupo.cupo }}

                                                        </span>

                                                    </div>


                                                    <p class="mb-1 text-muted small">

                                                        Docente: {{ grupo.Docente.nombre }} {{
                                                            grupo.Docente.apellidoPaterno }}

                                                    </p>


                                                    <div class="mt-2 border-top pt-2">

                                                        <p class="fw-bold mb-1">Horarios:</p>

                                                        <div v-if="grupo.AulaHorarios.length === 0"
                                                            class="alert alert-warning py-1 px-2 small">

                                                            (Sin horario asignado)

                                                        </div>

                                                        <div v-for="ah in grupo.AulaHorarios" :key="ah.horarioId"
                                                            class="small">

                                                            🗓️ <span class="fw-bold">{{ ah.Horario.dia }}</span> |

                                                            ⏰ {{ ah.Horario.inicio }} - {{ ah.Horario.final }} |

                                                            🏠 {{ ah.Aula.Modulo.nombre }} (Aula: {{ ah.Aula.numero }})

                                                        </div>

                                                    </div>


                                                </div>


                                            </label>


                                        </li>

                                    </ul>


                                </div>

                            </div>

                        </div>

                    </div>


                    <div v-if="false" class="mt-4 p-3 bg-light border rounded">
                        <p class="fw-bold">Grupos Seleccionados (Materia ID : Grupo ID):</p>
                        <pre class="small text-break">{{ selectedGroups }}</pre>
                    </div>

                </div>


                <div v-else-if="estudiante" class="alert alert-info text-center" role="alert">

                    ℹ️ No se encontró ninguna oferta académica para el periodo actual.

                </div>


                <div v-else class="alert alert-danger text-center" role="alert">

                    ⚠️ Los datos del estudiante no han sido cargados. Por favor, vuelve al

                    <router-link to="/login" class="alert-link">Login</router-link>.

                </div>


            </div>

        </div>

    </div>

</template>

<script setup>

import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';


const router = useRouter();
const authStore = useAuthStore();

const { estudiante, isLoading, inscripcionResponse } = storeToRefs(authStore);

// Estado local
const selectedGroups = ref({});
const countdown = ref(5);

// Lista de clases de Bootstrap para la coloración de horarios (excluyendo bg-danger/red)
const COLOR_CLASSES = [
    'bg-primary bg-opacity-25',   // Azul
    'bg-success bg-opacity-25',   // Verde
    'bg-info bg-opacity-25',      // Celeste
    'bg-secondary bg-opacity-25', // Gris
    'bg-warning bg-opacity-50',   // Amarillo (un poco más fuerte para diferenciación)
    'bg-dark bg-opacity-10',      // Negro muy claro
];

// Mapa para asignar una clase de color única a cada ID de materia.
const materiaColorMap = ref({});

// ----------------------------------------------------
// LÓGICA DE HORARIO DINÁMICO
// ----------------------------------------------------

// 1. Definir el orden de los días
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Función de ayuda para crear una entrada vacía para una hora específica
const createEmptyTimeSlot = () => {
	return DIAS.reduce((acc, dia) => {
		acc[dia] = null;
		return acc;
	}, {});
};

// 2. PROPIEDAD COMPUTADA: Transforma las selecciones en un horario de tabla
const horarioGrid = computed(() => {
	const grid = {};
	const selectedGroupIds = Object.values(selectedGroups.value);

	// Devolvemos un objeto vacío si no hay oferta o no hay selecciones
	if (!oferta.value || selectedGroupIds.length === 0) {
		return {};
	}

	oferta.value.forEach(materia => {
		materia.Grupo_Materia.forEach(grupo => {

			// Solo procesamos los grupos seleccionados por el usuario
			if (selectedGroupIds.includes(grupo.id)) {

				grupo.AulaHorarios.forEach(ah => {
					const horario = ah.Horario;
					const aula = ah.Aula;

					const inicio = horario.inicio;
					const dia = horario.dia;

					// Aseguramos que el slot de la hora exista en el grid
					if (!grid[inicio]) {
						grid[inicio] = createEmptyTimeSlot();
					}

					// Información del grupo actual que intentamos insertar
					const currentClassInfo = {
						materia: materia.sigla,
						nombre: materia.nombre,
						grupo: grupo.sigla,
						aula: `${aula.Modulo.nombre} ${aula.numero}`,
						isConflict: false
					};

					// === VERIFICACIÓN DE COLISIÓN ===
					if (grid[inicio][dia] !== null) {

						let collisionSlot = grid[inicio][dia];

						// Si es la primera colisión, el slot contiene un solo objeto.
						// Lo convertimos en un array y añadimos la bandera de conflicto.
						if (!Array.isArray(collisionSlot)) {
							// 1. Convertimos el elemento existente a array
							collisionSlot = [collisionSlot];
							// 2. Marcamos el elemento existente como conflicto
							collisionSlot.forEach(item => item.isConflict = true);
						}

						// 3. Añadimos la nueva clase al array de colisiones
						currentClassInfo.isConflict = true; // El nuevo elemento también está en conflicto
						collisionSlot.push(currentClassInfo);

						// Reasignamos el array (colisión) al slot
						grid[inicio][dia] = collisionSlot;

						console.warn(`⚠️ COLISIÓN detectada en ${dia} a las ${inicio}. Clases:`, collisionSlot.map(c => c.materia));

					} else {
						// NO hay colisión, insertamos la información directamente
						grid[inicio][dia] = currentClassInfo;
					}
				});
			}
		});
	});

	// 4. Ordenar las horas de inicio cronológicamente
	const orderedGrid = {};
	Object.keys(grid).sort().forEach(key => {
		orderedGrid[key] = grid[key];
	});

	return orderedGrid;
});

// ----------------------------------------------------
// PROPIEDADES COMPUTADAS EXISTENTES
// ----------------------------------------------------


const tieneBoletaInscrita = computed(() => {

	return !!estudiante.value?.BoletaInscrita;

});


const oferta = computed(() => {

	// Si tiene boleta, retorna [] para no mostrar la oferta.

	if (tieneBoletaInscrita.value) {

		return [];

	}

	return estudiante.value?.maestroOferta || [];

});


const canSubmit = computed(() => {

	const hasSelections = Object.keys(selectedGroups.value).length > 0;

	// El botón se puede habilitar si hay selecciones Y NO hay colisiones
	return hasSelections && !hasCollision.value;

});


// ----------------------------------------------------------------------
// LÓGICA DE REDIRECCIÓN Y CICLO DE VIDA (EXISTENTE)
// ----------------------------------------------------------------------


const startRedirect = () => {

	let timer = setInterval(() => {

		countdown.value--;

		if (countdown.value <= 0) {

			clearInterval(timer);

			router.push('/Boleta');

		}

	}, 1000);

};

/**
 * Retorna true si existe al menos un array (colisión) en el horarioGrid.
 */
const hasCollision = computed(() => {
	// 1. Itera sobre cada hora en el horarioGrid
	for (const hour in horarioGrid.value) {
		const hourData = horarioGrid.value[hour];

		// 2. Itera sobre cada día en esa hora
		for (const dia in hourData) {
			const slot = hourData[dia];

			// 3. Verifica si el slot es un Array (lo que indica una colisión)
			if (Array.isArray(slot)) {
				return true; // Se encontró una colisión
			}
		}
	}
	// No se encontró ninguna colisión
	return false;
});

// onMounted ahora se usa correctamente

onMounted(() => {

	// Lógica para iniciar la redirección si el estudiante ya está inscrito

	if (!isLoading.value && tieneBoletaInscrita.value) {

		startRedirect();

	}

});


// ----------------------------------------------------------------------
// ACCIÓN DE INSCRIPCIÓN (EXISTENTE)
// ----------------------------------------------------------------------


const submitInscripcion = async () => {

	console.log('--- Iniciando Inscripción ---');


	if (tieneBoletaInscrita.value) return;


	const groupsToEnroll = Object.values(selectedGroups.value);

	const payload = {

		task: "create_inscripcion_materias",

		data: {

			estudianteId: estudiante.value.estudiante.id,

			grupoMateriasIds: groupsToEnroll,

		}

	};

	console.log(payload)


	try {

		const API_INSCRIPCION_TASK_URL = import.meta.env.VITE_API_INSCRIPCION_TASK_URL;


		const result = await fetch(`${API_INSCRIPCION_TASK_URL}`, {

			method: 'POST',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify(payload),

		});


		if (!result.ok) {

			const errorText = await result.text();

			console.error(`Error ${result.status}: ${errorText}`);

			alert(`❌ Error al inscribir. Código: ${result.status}. Revisa el servidor.`);

			return;

		}


		const jsonRes = await result.json();

		authStore.inscripcionResponse = jsonRes;


		console.log('✅ Inscripción exitosa. Respuesta:', jsonRes);

		alert(`✅ Inscripción enviada y procesada con éxito! ${authStore.inscripcionResponse.shortId}`);


		router.push('/verificarInscripcion');


	} catch (error) {

		console.error('❌ Error de red o error de proceso:', error);

		alert('❌ Error de conexión o la API no respondió correctamente.');

	}

};

</script>


<style scoped>
/* Dejamos el estilo vacío, confiando totalmente en Bootstrap/Bootswatch */
</style>