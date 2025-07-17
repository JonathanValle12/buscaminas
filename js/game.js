import Globals from "./globals.js";
import Minas from "./minas.js";
import Tablero from "./tablero.js";
import PopUps from './popups.js';
import Score from './score.js';

class Game {
    constructor() {

        const enviarDatos = document.getElementById("submitBtn");
        if (enviarDatos) {
            enviarDatos.addEventListener("click", () => {
                const usuario = document.getElementById("username").value;
                const puntuacion = Globals.punts;
                const time = Globals.hrs + "h " + Globals.min + "m " + Globals.sec + "s";

                Score.datosGlobales(usuario, puntuacion, time);
            });
        }
    }

    // FUNCION PARA INCREMENTAR EL TIEMPO
    tick() {
        Globals.running = true;
        Globals.sec++;
        if (Globals.sec >= 60) {
            Globals.sec = 0;
            Globals.min++;
            if (Globals.min >= 60) {
                Globals.min = 0;
                Globals.hrs++;
            }
        }
    }
    // FUNCION PARA AGREGAR EL CONTADOR DEL TIEMPO
    add() {
        this.tick();
        this.renderTime();


        if (!Globals.finPartida && Globals.punts > 0) {
            Globals.punts = Math.max(0, Globals.punts - 2);
            Globals.puntuarG.textContent = Globals.punts;

            if (Globals.punts === 0) {
                this.perderPorPuntuacion();
            }
        }
    }

    perderPorPuntuacion() {
        Globals.finPartida = true;
        clearInterval(Globals.t);

        // Tiempo final (Formateado)
        let time = Globals.hrs + "h " + Globals.min + "m " + Globals.sec + "s";
        PopUps.mostrarModal(Globals.punts, time);

    }

    renderTime() {
        Globals.timer.textContent =
            (Globals.hrs > 9 ? Globals.hrs : "0" + Globals.hrs) + ":" +
            (Globals.min > 9 ? Globals.min : "0" + Globals.min) + ":" +
            (Globals.sec > 9 ? Globals.sec : "0" + Globals.sec);
    }

    // Funcion para resetear el contador de las banderas y las que le faltan
    // Reutilizable tanto al limpiar el tablero como al generar las bombas mortales nuevamente
    resetCount(rellenarMinas) {
        Globals.numBanderas = 0;
        Globals.contadorBanderas.textContent = 0;
        Globals.contadorBanderasRestantes.textContent = rellenarMinas;
    }
    resetcontador() {
        Globals.sec = 0;
        Globals.min = 0;
        Globals.hrs = 0;
        this.renderTime();
    }
    // Funcion para contar las minas de alrededor
    contarMinasAlrededorCasilla(fila, columna) {
        let numeroMinasAlrededor = 0;
        // Primero se crea una matriz de arras de 0
        // Recorremos las minas que hay
        for (let a = 0; a < Globals.mines.length; a++) {
            // Array donde se guardara los valores
            let fila = [];
            for (let b = 0; b < Globals.mines[0].length; b++) {
                // Hacemos un push de 0 a la matriz fila
                fila.push(0);
            }
            // Y nuevamente hacemos otro push a la variable global minesVoltant para que lo podamos utilizar y subir las minas
            // que hay alrededor
            Globals.minesVoltant.push(fila);
        }
        //de la fila anterior a la posterior
        for (let zFila = fila - 1; zFila <= fila + 1; zFila++) {

            //de la columna anterior a la posterior
            for (let zColumna = columna - 1; zColumna <= columna + 1; zColumna++) {

                //si la casilla cae dentro del tablero
                if (zFila > -1 && zFila < Globals.inputX && zColumna > -1 && zColumna < Globals.inputY) {

                    //miramos si en esa posición hay una mina
                    if (Globals.mines[zFila][zColumna] == 1) {

                        //y sumamos 1 al numero de minas que hay alrededor de esa casilla
                        numeroMinasAlrededor++;
                    }
                }
            }
        }

        //y guardamos cuantas minas hay en esa posicion en la variable global
        Globals.minesVoltant[fila][columna] = numeroMinasAlrededor;
    }

    // FUNCION DEL DOBLE CLICK (NO FUNCIONA CORRECTAMENTE)
    dobleClick(td) {
        // Comprobamos si la casilla no es clickeable
        if (!td.classList.contains('marcada') || Globals.finPartida) return;

        this.destapar(td);
    }
    // FUNCION PARA DESTAPAR LA CASILLA CLICKEADA
    destapar(miEvento) {
        let td = miEvento.currentTarget;
        let fila = parseInt(td.dataset.fila, 10);
        let columna = parseInt(td.dataset.columna, 10);
        // Se llama a la funcion para destapar la casilla pasandole como entrada la fila y la columna que es la casilla clickeada
        this.destaparCasilla(fila, columna);

    }
    // FUNCION PARA DESTAPAR LA CASILLA DE ALREDEDOR
    destaparCasilla(fila, columna) {
        if (Globals.finPartida) return;

        //si la casilla esta dentro del tablero
        if (fila > -1 && fila < Globals.inputX &&
            columna > -1 && columna < Globals.inputY) {

            //obtenermos la casilla con la fila y columna
            let td = document.querySelector("#x" + fila + "_y" + columna);
            //si la casilla no esta destapada
            if (!td.classList.contains("destapado")) {
                // Incrementamos 10 por cada casilla destapada
                Globals.punts += 10;
                Globals.puntuarG.textContent = Globals.punts; // Y actualizamos la puntuación
                // En caso de que no haya ninguna bandera
                if (!td.classList.contains("bandera")) {

                    td.classList.add("destapado");
                    //ponemos en la casilla el número de minas que tiene alrededor
                    let valor = Globals.minesVoltant[fila][columna];
                    td.innerHTML = valor > 0 ? valor : "";

                    //ponemos el estilo del numero de minas que tiene alrededor (cada uno es de un color)
                    td.classList.add("y" + Globals.minesVoltant[fila][columna])
                    // Si no hay minas
                    if (Globals.mines[fila][columna] !== 1) {
                        // y tiene 0 minas alrededor, destapamos las casillas contiguas
                        if (Globals.minesVoltant[fila][columna] == 0) {
                            if (valor === 0) {
                                this.destaparCasilla(fila - 1, columna - 1);
                                this.destaparCasilla(fila - 1, columna);
                                this.destaparCasilla(fila - 1, columna + 1);
                                this.destaparCasilla(fila, columna - 1);
                                this.destaparCasilla(fila, columna + 1);
                                this.destaparCasilla(fila + 1, columna - 1);
                                this.destaparCasilla(fila + 1, columna);
                            }
                        }

                        let totalCasillas = Globals.inputX * Globals.inputY;
                        let totalMinas = Globals.rellenarMinas;
                        let totalCasillasSinMinas = totalCasillas - totalMinas;
                        let casillasDestapadas = document.querySelectorAll(".destapado:not(.bomba)").length;

                        if (casillasDestapadas === totalCasillasSinMinas) {
                            Globals.finPartida = true;
                            Globals.esVictoria = true;
                            clearInterval(Globals.t);

                            let puntuacion = Globals.punts;
                            Globals.puntuarG.textContent = puntuacion;

                            let time = Globals.hrs + "h " + Globals.min + "m " + Globals.sec + "s";

                            // Llama a mostrarModal en caso de victoria
                            PopUps.mostrarModal(puntuacion, time);
                            console.log("Has ganado");

                        }

                        // En todo caso de que haya minas
                    } else if (Globals.mines[fila][columna] == 1) {
                        td.innerText = '💣';
                        td.classList.add("destapado", "bomba");
                        Globals.finPartida = true; // Indicamos true a la variable finPartida para terminar la partida
                        Globals.esVictoria = false;

                        for (let i = 0; i < Globals.inputX; i++) {
                            for (let j = 0; j < Globals.inputY; j++) {

                                // Saltar la casilla que ya explotó (la que se clicó)
                                if (i === fila && j === columna) continue;

                                if (Globals.mines[i][j] === 1) {
                                    let bombaId = document.querySelector(`#x${i}_y${j}`);

                                    if (!bombaId.classList.contains('destapado') && !bombaId.classList.contains('bandera')) {
                                        bombaId.classList.add("destapado", "bomba");
                                        bombaId.innerHTML = '💣';
                                    }
                                }
                            }
                        }

                        // Creamos las variable a almacenar para pasarlo como parametro a los datosGlobales
                        Globals.t = clearInterval(Globals.t);
                        // Restamos 10 al explotar una bomba ya que no queremos que se incremente,
                        // unicamente las casillas a contar
                        let puntuacion = Globals.punts;
                        Globals.puntuarG.textContent = puntuacion;

                        // Tiempo final (Formateado)
                        let time = Globals.hrs + "h " + Globals.min + "m " + Globals.sec + "s";

                        // Llama a mostrarModal en caso de derrota
                        PopUps.mostrarModal(puntuacion, time);
                    }
                }
            }
        }
    }

    // FUNCION PARA BORRAR EL TABLERO
    del() {
        // Reseteamos los puntos
        Globals.punts = 0;
        Globals.puntuarG.textContent = Globals.punts;
        Globals.sec = 0;
        Globals.min = 0;
        Globals.hrs = 0;
        this.renderTime();

        // Ocultar panel y mostrar estado Inicial
        Globals.statusPanel.classList.add('hidden');
        Globals.statusGame.style.display = "flex";
        Globals.boardSection.classList.add('hidden');

        // Eliminar solo la tabla del tablero si existe
        let tablaExistente = document.querySelector('#tablero table');
        if (tablaExistente) {
            tablaExistente.remove();
            this.resetCount(Globals.rellenarMinas);
        }

        // Detener el tiempo
        Globals.finPartida = true;
        clearInterval(Globals.t);
    }

    // FUNCION PARA AÑADIR BANDERAS
    anadirBandera(td, rellenarMinas) {
        // En caso de que la partida termine
        if (Globals.finPartida) return;

        const esMina = Globals.mines[td.dataset.fila][td.dataset.columna] === 1;

        // En caso de que no este marcada
        if (!td.classList.contains('marcada') && Globals.numBanderas < rellenarMinas) {
            if (td.classList.length == 0) {
                td.classList.add('bandera'); // Se añade una clase predefinida para la bandera
                td.innerHTML = '🚩'; // Se coloca la bandera
                td.style.backgroundColor = 'green'; // El fondo de la casilla donde se ha colocado la bandera
                Globals.numBanderas++; // Incrementamos banderas

                if (esMina) {
                    Globals.punts += 5;
                } else {
                    Globals.punts -= 5;
                }

                // En caso de que haya una bandera 
            } else if (td.classList.contains('bandera')) {
                td.classList.remove('bandera'); // Eliminamos la clase bandera
                td.innerHTML = ''; // Quitamos la bandera
                td.style.backgroundColor = ''; // Tambien el fondo
                Globals.numBanderas--; // Y restamos las banderas

                if (esMina) {
                    Globals.punts += 5;
                } else {
                    Globals.punts -= 5;
                }

            }

            Globals.puntuarG.textContent = Globals.punts;
        }
    }
    // FUNCION PARA ACTUALIZAR EL NUMERO DE BANDERAS
    actualizaNumBanderas(rellenarMinas) {
        Globals.contadorBanderas.textContent = Globals.numBanderas;
        Globals.contadorBanderasRestantes.textContent = (rellenarMinas - Globals.numBanderas);
        Globals.contadorTotalBanderas.textContent = rellenarMinas;
    }

    // FUNCION PARA OBTENER COORDENADAS DE UNA CELDA
    coordCelda() {
        // Obtenemos el id de mi tabla
        let celda = document.getElementById("taula");
        // Hacemos un evento de tipo click con una funcion callback donde le pasamos un 
        // parametro "event" y ejecutaremos esa funcion una vez que clickemos en una celda
        celda.addEventListener("click", function (event) {
            // Obtenemos el id de la celda y en caso de que sea roja se cumplira la condicion
            if (event.target.style.backgroundColor == "red") {
                // Obtenemos el id de la celda
                console.log("La fila y la columna tiene como posición " + event.target.id + "\n\ny es una bomba mortal");
                // En caso de que no sea roja
            } else {
                console.log("La fila y la columna tiene como posición " + event.target.id + "\n\ny no es una bomba mortal");
            }
        });
    }

    // INICIAR PROGRAMA BUSCAMINAS
    inicialitza() {

        // Obtener valores de los inputs
        let inputX = document.getElementById('inputX').valueAsNumber;
        let inputY = document.getElementById('inputY').valueAsNumber;
        let inputMines = document.getElementById('minasC').valueAsNumber;

        // Si alguno es 0 o no válido, salir sin hacer nada
        if (isNaN(inputX) || inputX <= 0 || isNaN(inputY) || inputY <= 0 || isNaN(inputMines) || inputMines < 0) {
            return;
        }

        // Codigo normal del Juego
        Globals.finPartida = false;

        Globals.statusPanel.classList.remove('hidden');
        Globals.statusGame.style.display = "none";
        Globals.boardSection.classList.remove('hidden');

        clearInterval(Globals.t); // Asegúrate de limpiar siempre
        this.resetcontador();
        Globals.t = setInterval(() => this.add(), 1000);

        // INICIALIZAMOS LAS MINAS y LLAMAMOS A LAS FUNCIONES YA CREADAS PARA EMPEZAR EL JUEGO
        Globals.inputX = document.getElementById("inputX").valueAsNumber;
        Globals.inputY = document.getElementById("inputY").valueAsNumber;
        Globals.rellenarMinas = document.getElementById("minasC").valueAsNumber;
        console.log("InputX ", Globals.inputX + "InputY: ", Globals.inputY + "Minas: ", Globals.rellenarMinas);
        // Check if the obtained values are valid numbers
        /* if (isNaN(inputX) || isNaN(inputY) || isNaN(rellenarMinas)) {
            console.error("Invalid input values. Please enter valid numbers.");
            return; // Exit the function if values are not valid
        } */

        Globals.mines = Minas.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
        Tablero.inicialitzaJoc(Globals.inputX, Globals.inputY);

        //Tablero.pintarTablero(mines); // Para visualizar de una forma mejor las minas
        this.coordCelda();
        Minas.contarMinas();
        this.actualizaNumBanderas(Globals.rellenarMinas);


        // Cada vez que se generar nuevas minas y se crea otra tabla se resetean los puntos y se muestra por pantalla
        Globals.punts = 100;
        Globals.puntuarG.textContent = Globals.punts;

    }
}

export default new Game();