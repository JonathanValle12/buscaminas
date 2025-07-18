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

        const tablero = document.getElementById("tablero");
        const tabla = document.createElement("table");
        const tbody = document.createElement("tbody");

        // Empezar a crear la tabla con las dimensiones que pasare
        for (let x = 0; x < inputX; x++) {
            const tr = document.createElement("tr");

            for (let y = 0; y < inputY; y++) {
                const td = document.createElement("td");
    
                td.setAttribute("id", "x" + x + "_y" + y);
                td.dataset.fila = x;
                td.dataset.columna = y;
                td.width = 40;
                td.height = 40;
                td.innerHTML = "&nbsp";
                Globals.matrix.push(td);
                
                tr.appendChild(td);

                // Eventos del ratón
                td.addEventListener("click", (event) => Game2.destapar(event));
                td.oncontextmenu = function (event) {
                    event.preventDefault();
                    Game2.anadirBandera(td, Globals.rellenarMinas);
                    Game2.actualizaNumBanderas(Globals.rellenarMinas);
                }

                td.addEventListener('dblclick', (event) => {
                    Game2.dobleClick(event.target);
                });

            }

            tbody.appendChild(tr);
        }

        tabla.appendChild(tbody);
        tablero.appendChild(tabla);
        tabla.setAttribute("border", 1);
        tabla.setAttribute("id", "taula");
    };

    // FUNCION PARA CREAR LA TABLA CON DIFERENTES MEDIDAS
    midaTaula() {
        let midataula = document.getElementById("midataula").value;

        const inputX = document.getElementById('inputX');
        const inputY = document.getElementById('inputY');
        const inputMines = document.getElementById('minasC');

        switch (midataula) {
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
                alert("No se ha escogido ninguna opcion");
        }
    }

    // Funcion para pintar las minas en rojo en el tablero
    pintarTablero(mines) {
        let rows = document.getElementsByTagName("tbody")[0].children;
        let matrix = [];

        for (var i = 0; i < rows.length; i++) {
            matrix.push(rows[i].children);
            for (var j = 0; j < matrix[i].length; j++) { 
                if (mines[i][j] == 1) {
                    matrix[i][j].style.backgroundColor = "red";
                }
            }
        }
    }
}

export default new Tablero();