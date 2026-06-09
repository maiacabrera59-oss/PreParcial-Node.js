const API_URL = "http://localhost:3000/api/cantantes";

// Selección de elementos del DOM
const formulario = document.querySelector("#formCantante");
const nombre = document.querySelector("#nombre");
const genero = document.querySelector("#genero");
const edad = document.querySelector("#edad");
const casado = document.querySelector("#casado");
const listado = document.querySelector("#listadoCantantes");
const mensaje = document.querySelector("#mensaje");

const btnCargar = document.querySelector("#btnCargar");
const btnTodas = document.querySelector("#btnTodas");
const btnCasadas = document.querySelector("#btnCasados");
const btnSolteras = document.querySelector("#btnSolteros");


let cantantesActuales = [];


async function cargarCantantes() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener cantantes");
        }

        const cantantes = await respuesta.json();

        cantantesActuales = cantantes;
        mostrarCantantes(cantantesActuales);

    } catch (error) {
        mensaje.textContent = "No se pudo conectar con la API.";
        mensaje.className = "error";
        console.error(error);
    }
}

// Mostrar cantantes
function mostrarCantantes(cantantes) {
    listado.innerHTML = "";

    if (cantantes.length === 0) {
        listado.innerHTML = '<p class="sin-resultados">No hay cantantes para mostrar.</p>';
        return;
    }

    cantantes.forEach(cantante => {

        const esCasado = cantante.casado === true || cantante.casado === 1 || cantante.casado === "true";

        const claseCasado = esCasado ? "casado" : "soltero";
        const textoCasado = esCasado ? "Casado" : "Soltero";

        listado.innerHTML += `
            <div class="tarjeta">
                <h3>${cantante.nombre}</h3>

                <p>
                    <strong>Género:</strong>
                    ${cantante.genero}
                </p>

                <p>
                    <strong>Edad:</strong>
                    ${cantante.edad} años
                </p>

                <p class="${claseCasado}">
                    ${textoCasado}
                </p>

                <button
                    class="eliminar"
                    onclick="eliminarCantante(${cantante.id})">
                    Eliminar
                </button>
            </div>
        `;
    });
}


function mostrarTodas() {
    mostrarCantantes(cantantesActuales);
    mensaje.textContent = "Mostrando todos los cantantes.";
    mensaje.className = "ok";
}


function mostrarCasadas() {
    const cantantesCasados = cantantesActuales.filter(cantante => 
        cantante.casado === true || cantante.cantante === 1 || cantante.casado === "true"
    );

    mostrarCantantes(cantantesCasados);
    mensaje.textContent = "Mostrando cantantes casados.";
    mensaje.className = "ok";
}

// Mostrar solteros
function mostrarSolteras() {
    const cantantesSolteros = cantantesActuales.filter(cantante => 
        !(cantante.casado === true || cantante.casado === 1 || cantante.casado === "true")
    );

    mostrarCantantes(cantantesSolteros);
    mensaje.textContent = "Mostrando cantantes solteros.";
    mensaje.className = "ok";
}

// Guardar cantante
async function guardarCantante(evento) {
    evento.preventDefault();

    // Convierte "1" o "true" en un booleano puro (true) para mandar un formato limpio
    const esCasado = casado.value === "1" || casado.value === "true" || casado.value === true;

    const nuevoCantante = {
        nombre: nombre.value.trim(),
        genero: genero.value,
        edad: Number(edad.value),
        casado: esCasado
    };

    // Validación de seguridad en Frontend
    if (
        nuevoCantante.nombre === "" ||
        nuevoCantante.genero === "" ||
        isNaN(nuevoCantante.edad) ||
        nuevoCantante.edad <= 0
    ) {
        mensaje.textContent = "Debe completar todos los datos correctamente.";
        mensaje.className = "error";
        return;
    }

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoCantante)
        });

       
        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje || "Error al guardar");
        }

        mensaje.textContent = "Cantante guardado correctamente.";
        mensaje.className = "ok";

        formulario.reset();
        cargarCantantes(); 

    } catch (error) {
        mensaje.textContent = `Error al guardar: ${error.message}`;
        mensaje.className = "error";
        console.error("Error en frontend:", error);
    }
}


async function eliminarCantante(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje || "Error al eliminar");
        }

        mensaje.textContent = "Cantante eliminado correctamente.";
        mensaje.className = "ok";

        cargarCantantes();

    } catch (error) {
        mensaje.textContent = "Error al eliminar el cantante.";
        mensaje.className = "error";
        console.error(error);
    }
}


formulario.addEventListener("submit", guardarCantante);
btnCargar.addEventListener("click", cargarCantantes);
btnTodas.addEventListener("click", mostrarTodas);
btnCasadas.addEventListener("click", mostrarCasadas);
btnSolteras.addEventListener("click", mostrarSolteras);


cargarCantantes();