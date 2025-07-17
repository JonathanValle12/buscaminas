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

        if (datos && datos.some(elemento => elemento.user.trim() === usuario.trim())) {
            return;
        }

        // Guardar los datos a un formato JSON
        let newDatos = {
            user: usuario,
            puntuar: puntuacion,
            tiempo: time,
            victoria: Globals.esVictoria
        };

        this.guardarDatos.push(newDatos); // Hacer un push de los datos a la variable Global
        localStorage.setItem("lista", JSON.stringify(this.guardarDatos));
        this.crearTabla();
        
        window.scroll({
            top: 100000000 // Ajusta según sea necesario
        });

        Popups.ocultarModal();
    }

    // CREACION DE LA TABLA CON LOS DATOS A REGISTRAR
    crearTabla() {
        let body = document.querySelector(".hall-of-fame"); // Añadir la tabla en el body
        let recoger = JSON.parse(localStorage.getItem("lista")) || [];

        this.guardarDatos = recoger.sort((a, b) => b.puntuar - a.puntuar); // Guardar los datos a recoger en la variable global para no sobrescribir ningun dato
        Globals.tbody.innerHTML = '';

        // Si no hay datos, ocultar la sección y salir
        if (this.guardarDatos.length === 0 ) {
            body.style.display = "none";
            return;
        }

        body.style.display = "block";
        // Recorrer los datos guardados en la variable global
        this.guardarDatos.forEach((elemento, index) => {
            let row = Globals.tbody.insertRow(index); //Insertamos filas
            let userCell = row.insertCell(0); // En la columna 0 ("NOM")
            let puntuarCell = row.insertCell(1); // En la columna 1 ("Puntuacion")
            let tiempoCell = row.insertCell(2); // En la columna 2 ("Tiempo")
            let buttonCell = row.insertCell(3); // En la columna 3 (" Boton de eliminar")

            const resultadoVictoria = elemento.victoria ? "victoria" : "derrota";

            userCell.innerHTML = `<span class="rank">${index + 1}</span> <strong>${elemento.user}</strong>`; // Añademe el usuario en la columna 0
            puntuarCell.innerHTML = `<span class="points ${resultadoVictoria}">${elemento.puntuar}</span>`; // Añademe la puntuacion en la columna 1
            tiempoCell.innerHTML = `<span class="time">${elemento.tiempo}</span>`; // Añade el tiempo en la columna 2

            buttonCell.innerHTML = `<i class="fas fa-trash delete-icon" id="eliminarPuntuacion"></i>`;
            buttonCell.querySelector("#eliminarPuntuacion").addEventListener("click", () => this.eliminarPuntuacion(index));
            Globals.tbody.appendChild(row); // Añadir la fila en el tbody
        });
    }
    
    eliminarPuntuacion(index) {

        // Obtener los datos de la lista del localStorage, si no tenemos nada sera un array vacio
        let recogerDatos = JSON.parse(localStorage.getItem("lista")) || [];

        Globals.hallOfFame.style.display = "none";
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