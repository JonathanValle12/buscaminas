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
                const time = this.obtenerTiempoFormateado();

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

        let time = this.obtenerTiempoFormateado();
        PopUps.mostrarModal(Globals.punts, time);

    }

    renderTime() {
        Globals.timer.textContent =
            (Globals.hrs > 9 ? Globals.hrs : "0" + Globals.hrs) + ":" +
            (Globals.min > 9 ? Globals.min : "0" + Globals.min) + ":" +
            (Globals.sec > 9 ? Globals.sec : "0" + Globals.sec);
    }

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

    // Tiempo final
    obtenerTiempoFormateado() {
        return `${Globals.hrs}h ${Globals.min}m ${Globals.sec}s`;
    }

    
    // Funcion para contar las minas de alrededor
    contarMinasAlrededorCasilla(fila, columna) {
        
        let numeroMinasAlrededor = 0;

        // Inicialitza la matriz minesVoltant con ceros
        for (let a = 0; a < Globals.mines.length; a++) {
            let fila = [];
            for (let b = 0; b < Globals.mines[0].length; b++) {

                fila.push(0);
            }
            Globals.minesVoltant.push(fila);
        }

        for (let zFila = fila - 1; zFila <= fila + 1; zFila++) {
            for (let zColumna = columna - 1; zColumna <= columna + 1; zColumna++) {

                //si la casilla cae dentro del tablero
                if (zFila > -1 && zFila < Globals.inputX && zColumna > -1 && zColumna < Globals.inputY) {

                    if (Globals.mines[zFila][zColumna] == 1) {
                        numeroMinasAlrededor++;
                    }
                }
            }
        }

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

        this.destaparCasilla(fila, columna);

    }

    // FUNCION PARA DESTAPAR LA CASILLA DE ALREDEDOR
    destaparCasilla(fila, columna) {
        if (Globals.finPartida) return;

        //si la casilla esta dentro del tablero
        if (fila > -1 && fila < Globals.inputX &&
            columna > -1 && columna < Globals.inputY) {

            let td = document.querySelector("#x" + fila + "_y" + columna);

            if (!td.classList.contains("destapado")) {

                Globals.punts += 10;
                Globals.puntuarG.textContent = Globals.punts;
                
                if (!td.classList.contains("bandera")) {

                    td.classList.add("destapado");

                    let valor = Globals.minesVoltant[fila][columna];
                    td.innerHTML = valor > 0 ? valor : "";
                    td.classList.add("y" + Globals.minesVoltant[fila][columna])

                    // Si no hay minas en esta casilla
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

                        // Verifica si se ha ganado
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

                            let time = this.obtenerTiempoFormateado();

                            PopUps.mostrarModal(puntuacion, time);
                            console.log("Has ganado");

                        }

                    } else if (Globals.mines[fila][columna] == 1) {
                    
                        td.innerText = '💣';
                        td.classList.add("destapado", "bomba");
                        Globals.finPartida = true;
                        Globals.esVictoria = false;

                        // Revela todas las minas
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

                        Globals.t = clearInterval(Globals.t);

                        let puntuacion = Globals.punts;
                        Globals.puntuarG.textContent = puntuacion;

                        let time = this.obtenerTiempoFormateado();
                        PopUps.mostrarModal(puntuacion, time);
                    }
                }
            }
        }
    }

    // FUNCION PARA BORRAR EL TABLERO
    del() {
        // Reiniciar puntuación y tiempo
        Globals.punts = 0;
        Globals.puntuarG.textContent = Globals.punts;
        Globals.sec = 0;
        Globals.min = 0;
        Globals.hrs = 0;
        this.renderTime();

        // Ocultar elementos del tablero
        Globals.statusPanel.classList.add('hidden');
        Globals.statusGame.style.display = "flex";
        Globals.boardSection.classList.add('hidden');

        let tablaExistente = document.querySelector('#tablero table');
        if (tablaExistente) {
            tablaExistente.remove();
            this.resetCount(Globals.rellenarMinas);
        }

        Globals.finPartida = true;
        clearInterval(Globals.t);
    }

    // FUNCION para añadir o quitar una bandera en una casilla
    anadirBandera(td, rellenarMinas) {
        if (Globals.finPartida) return;

        const esMina = Globals.mines[td.dataset.fila][td.dataset.columna] === 1;

        // Si no esta marcada y aún quedan bandeas disponibles
        if (!td.classList.contains('marcada') && Globals.numBanderas < rellenarMinas) {
            if (td.classList.length == 0) {
                td.classList.add('bandera');
                td.innerHTML = '🚩';
                td.style.backgroundColor = 'green';
                Globals.numBanderas++;

                Globals.punts += esMina ? 5 : -5;

            } else if (td.classList.contains('bandera')) {
                td.classList.remove('bandera');
                td.innerHTML = '';
                td.style.backgroundColor = '';
                Globals.numBanderas--;

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

    // INICIAR una nueva partida del Buscaminas
    inicialitza() {

        Globals.inputX = document.getElementById("inputX").valueAsNumber;
        Globals.inputY = document.getElementById("inputY").valueAsNumber;
        Globals.rellenarMinas = document.getElementById("minasC").valueAsNumber;

        // Validar inputs
        if (isNaN(Globals.inputX) || Globals.inputX <= 0 || isNaN(Globals.inputY) || Globals.inputY <= 0 || isNaN(Globals.rellenarMinas) || Globals.rellenarMinas < 0) {
            return;
        }

        // Configurar estado iniciar del juego
        Globals.finPartida = false;
        Globals.statusPanel.classList.remove('hidden');
        Globals.statusGame.style.display = "none";
        Globals.boardSection.classList.remove('hidden');

        // Iniciar temporizador
        clearInterval(Globals.t);
        this.resetcontador();
        Globals.t = setInterval(() => this.add(), 1000);

        // Inicializar juego
        Globals.mines = Minas.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
        Tablero.inicialitzaJoc(Globals.inputX, Globals.inputY);
        Minas.contarMinas();
        this.actualizaNumBanderas(Globals.rellenarMinas);

        Globals.punts = 100;
        Globals.puntuarG.textContent = Globals.punts;

    }
}

export default new Game();