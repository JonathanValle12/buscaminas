import Game2 from "./game.js";
import Globals from "./globals.js";

class Tablero {

    constructor() {

    }

    // FUNCION PARA AGREGAR LA TABLA
    inicialitzaJoc(inputX, inputY) {
        let tablaExistente = document.querySelector('#tablero table');

        if (tablaExistente) {
            tablaExistente.remove();
            Globals.finPartida = false;
            Game2.resetCount();
        }

        // Definir estructura table y tbody y empezar tabla desde el body
        let tablero = document.getElementById("tablero");
        const tabla = document.createElement("table");
        let tbody = document.createElement("tbody");

        // Empezar a crear la tabla con las dimensiones que pasare
        for (var x = 0; x < inputX; x++) {
            // Crear el elemento tr 
            let tr = document.createElement("tr");
            for (var y = 0; y < inputY; y++) {
                // Crear el elemento td
                let td = document.createElement("td");
                // Asignamos un id al td y le damos como valor las coordenada x e y de la posición 
                // donde este la celda 
                td.setAttribute("id", "x" + x + "_y" + y);
                td.dataset.fila = x;
                td.dataset.columna = y;
                td.width = 40;
                td.height = 40;
                td.innerHTML = "&nbsp";
                Globals.matrix.push(td);
                // Unir el elemento td dentro de los elementos tr que se creen
                tr.appendChild(td);
                // Añadimos función al hacer click
                td.addEventListener("click", (event) => Game2.destapar(event)); //evento con el botón izquierdo del raton
                // Añadimos función al hacer click derecho
                td.oncontextmenu = function (event) {
                    event.preventDefault();
                    Game2.anadirBandera(td, Globals.rellenarMinas);
                    Game2.actualizaNumBanderas(Globals.rellenarMinas);
                }
                // Añadimos función al hacer doble-click
                td.addEventListener('dblclick', (event) => {
                    Game2.dobleClick(event.target);
                });

            }
            // Unir el elemento tr dentro del tbody 
            tbody.appendChild(tr);
        }
        // Y unir todo el elemento tbody con sus hijos dentro del elemento tabla para crear la tabla
        tabla.appendChild(tbody);
        //Unir toda la tabla dentro del contenedor que seria el body
        tablero.appendChild(tabla);
        // Definir estilos a la tabla
        tabla.setAttribute("border", 1);
        tabla.setAttribute("id", "taula");
    };

    // FUNCION PARA CREAR LA TABLA CON DIFERENTES MEDIDAS
    midaTaula() {
        let midataula = document.getElementById("midataula").value;

        const inputX = document.getElementById('inputX');
        const inputY = document.getElementById('inputY');
        const inputMines = document.getElementById('minasC');

        // Hacer diferentes casos
        switch (midataula) {
            // En el caso numero 1
            case '1':
                inputX.value = 9;
                inputY.value = 9;
                inputMines.value = 10;
                break;
            case '2':
                inputX.value = 9;
                inputY.value = 9;
                inputMines.value = 35;
                break;
            case '3':
                inputX.value = 16;
                inputY.value = 16;
                inputMines.value = 99;
                break;
            case '4':
                inputX.value = 30;
                inputY.value = 16;
                inputMines.value = 99;
                break;
            case '5':
                inputX.value = 30;
                inputY.value = 16;
                inputMines.value = 170;
                break;
            default:
                // Si no se escoge ninguna de esas opciones, muestra una alerta
                alert("No se ha escogido ninguna opcion");
        }
    }

    // FUNCION PARA PINTAR LAS MINAS EN EL TABLERO
    pintarTablero(mines) {
        let rows = document.getElementsByTagName("tbody")[0].children;
        let matrix = [];
        // Recorrer toda la tabla para pintarla
        for (var i = 0; i < rows.length; i++) {
            matrix.push(rows[i].children);
            for (var j = 0; j < matrix[i].length; j++) {
                // Si en minas hay 1        
                if (mines[i][j] == 1) {
                    // pintame la matriz de rojo
                    matrix[i][j].style.backgroundColor = "red";
                }
            }
        }
    }
}

export default new Tablero();