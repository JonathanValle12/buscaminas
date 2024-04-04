import Globals from "./globals.js";
import Popups from "./popups.js";

class Score {
    constructor() {

        this.guardarDatos = [];

        this.comprobarExistTabla();

    }

    // FUNCION PARA ALMACENAR LOS DATOS EN LA MATRIX GUARDARDATOS
    datosGlobales(usuario, puntuacion, time) {

        let datos = JSON.parse(localStorage.getItem("lista"));

        do {
            Popups.mostrarModal("Necesitas ingresar un usuario valido: ");
        } while (usuario == "");

        if (datos && datos.some(elemento => elemento.user.trim() === usuario.trim())) {
            Popups.mostrarModal("El nombre de usuario ya existe. Por favor, ingrese un nombre diferente:");
        } else {
            // Guardar los datos a un formato JSON
            let newDatos = {
                user: usuario,
                puntuar: puntuacion,
                tiempo: time
            };
            this.guardarDatos.push(newDatos); // Hacer un push de los datos a la variable Global
            localStorage.setItem("lista", JSON.stringify(this.guardarDatos));
            this.crearTabla();
            window.scroll({
                top: 100000000 // Ajusta según sea necesario
            });

            Popups.ocultarModal();
        }
    }

    // CREACION DE LA TABLA CON LOS DATOS A REGISTRAR
    crearTabla() {
        let body = document.getElementsByTagName("body")[0]; // Añadir la tabla en el body
        // Cuando se cree la tabla, muestra el texto
        Globals.registrar.style.display = "block";
        Globals.tbody.innerHTML = '';
        let recoger = JSON.parse(localStorage.getItem("lista"));
        this.guardarDatos = recoger; // Guardar los datos a recoger en la variable global para no sobrescribir ningun dato
        // Recorrer los datos guardados en la variable global

        this.guardarDatos.forEach((elemento, index) => {
            let row = Globals.tbody.insertRow(index); //Insertamos filas
            let userCell = row.insertCell(0); // En la columna 0 ("NOM")
            let puntuarCell = row.insertCell(1); // En la columna 1 ("Puntuacion")
            let tiempoCell = row.insertCell(2); // En la columna 2 ("Tiempo")
            let buttonCell = row.insertCell(3); // En la columna 3 (" Boton de eliminar")
            userCell.innerHTML = elemento.user; // Añademe el usuario en la columna 0
            puntuarCell.innerHTML = elemento.puntuar; // Añademe la puntuacion en la columna 1
            tiempoCell.innerHTML = elemento.tiempo; // Añade el tiempo en la columna 2

            buttonCell.innerHTML = `<button id='eliminarPuntuacion'>Eliminar</button>`;
            buttonCell.querySelector("#eliminarPuntuacion").addEventListener("click", () => this.eliminarPuntuacion(index));
            Globals.tbody.appendChild(row); // Añadir la fila en el tbody
        });

        // Añadir el tbody dentro de la tabla y dentro del body
        Globals.taula.appendChild(Globals.tbody);
        body.appendChild(Globals.taula);
    }
    
    eliminarPuntuacion(index) {

        // Obtener los datos de la lista del localStorage, si no tenemos nada sera un array vacio
        let recogerDatos = JSON.parse(localStorage.getItem("lista")) || [];

        // Verificar que el indice no se salga del rango
        if (index >= 0 && index < recogerDatos.length) {

            // Elimina la puntuación en el índice dado
            recogerDatos.splice(index, 1);
            // Actualiza el almacenamiento local con la lista de puntuaciónes
            localStorage.setItem("lista", JSON.stringify(recogerDatos));
            // Volver a renderizar la Tabla
            this.crearTabla();
        } else {
            console.log("Indice fuera de rango");
        }
    }

    comprobarExistTabla() {
        // Comprobar de que exista nuestra lista de datos en el LocalStorage
        // Si existe creame la tabla, si no existe no me la crees ya que daria error (Esto es para que se pueda visualizar la tabla y que no se piedan los datos)
        if (JSON.parse(localStorage.getItem("lista"))) {
            this.crearTabla();
        }
    }
}

export default new Score();