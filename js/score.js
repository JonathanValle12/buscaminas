import Globals from "./globals.js";
import Popups from "./popups.js";

class Score {
    constructor() {

        this.guardarDatos = [];

        this.comprobarExistTabla();

    }

    // Funcion para guardar los datos en localStorage y actualiza la tabla
    datosGlobales(usuario, puntuacion, time) {

        let datos = JSON.parse(localStorage.getItem("lista"));

        // Evita duplicados por nombre de usuario
        if (datos && datos.some(elemento => elemento.user.trim() === usuario.trim())) {
            return;
        }

        let newDatos = {
            user: usuario,
            puntuar: puntuacion,
            tiempo: time,
            victoria: Globals.esVictoria
        };

        this.guardarDatos.push(newDatos);
        localStorage.setItem("lista", JSON.stringify(this.guardarDatos));
        // Actualiza la tabla en pantalla
        this.crearTabla();
 
        // Hacer Scroll y mostrar tabla de puntuaciónes automaticamente
        document.getElementById('datos').scrollIntoView({ behavior: "smooth" });

        Popups.ocultarModal();
    }

    // Crea y muestra la tabla de puntuaciones desde localStorage
    crearTabla() {
        let body = document.querySelector(".hall-of-fame");
        let recoger = JSON.parse(localStorage.getItem("lista")) || [];

        this.guardarDatos = recoger.sort((a, b) => b.puntuar - a.puntuar);
        Globals.tbody.innerHTML = '';

        if (this.guardarDatos.length === 0 ) {
            body.style.display = "none";
            return;
        }

        body.style.display = "block";
        
        this.guardarDatos.forEach((elemento, index) => {
            let row = Globals.tbody.insertRow(index);
            let userCell = row.insertCell(0);
            let puntuarCell = row.insertCell(1);
            let tiempoCell = row.insertCell(2);
            let buttonCell = row.insertCell(3);

            const resultadoVictoria = elemento.victoria ? "victoria" : "derrota";

            userCell.innerHTML = `<span class="rank">${index + 1}</span> <strong>${elemento.user}</strong>`;
            puntuarCell.innerHTML = `<span class="points ${resultadoVictoria}">${elemento.puntuar}</span>`;
            tiempoCell.innerHTML = `<span class="time">${elemento.tiempo}</span>`;

            buttonCell.innerHTML = `<i class="fas fa-trash delete-icon" id="eliminarPuntuacion"></i>`;
            buttonCell.querySelector("#eliminarPuntuacion").addEventListener("click", () => this.eliminarPuntuacion(index));
            Globals.tbody.appendChild(row);
        });
    }
    
    eliminarPuntuacion(index) {

        let recogerDatos = JSON.parse(localStorage.getItem("lista")) || [];

        Globals.hallOfFame.style.display = "none";

        // Verificar que el indice no se salga del rango
        if (index >= 0 && index < recogerDatos.length) {
            recogerDatos.splice(index, 1);
            localStorage.setItem("lista", JSON.stringify(recogerDatos));

            this.crearTabla();
        } else {
            console.log("Indice fuera de rango");
        }
    }

    // Si hay datos en localStorage, crea la tabla
    comprobarExistTabla() {
        if (JSON.parse(localStorage.getItem("lista"))) {
            this.crearTabla();
        }
    }
}

export default new Score();