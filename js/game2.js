import Globals from "./globals.js";
import Minas from "./minas.js";
import Tablero from "./tablero.js";
import PopUps from './popups.js';
import Score from './score.js';

class Game2 {
    constructor() {

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
        Globals.h2.textContent = (Globals.hrs > 9 ? Globals.hrs : "0" + Globals.hrs)
            + ":" + (Globals.min > 9 ? Globals.min : "0" + Globals.min)
            + ":" + (Globals.sec > 9 ? Globals.sec : "0" + Globals.sec)
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
        this.add();
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
                Globals.puntuarG.innerText = Globals.punts; // Y actualizamos la puntuación
                // En caso de que no haya ninguna bandera
                if (!td.classList.contains("🚩")) {

                    td.classList.add("destapado");
                    //ponemos en la casilla el número de minas que tiene alrededor
                    td.innerHTML = Globals.minesVoltant[fila][columna];

                    //ponemos el estilo del numero de minas que tiene alrededor (cada uno es de un color)
                    td.classList.add("y" + Globals.minesVoltant[fila][columna])
                    // Si no hay minas
                    if (Globals.mines[fila][columna] !== 1) {
                        // y tiene 0 minas alrededor, destapamos las casillas contiguas
                        if (Globals.minesVoltant[fila][columna] == 0) {
                            this.destaparCasilla(fila - 1, columna - 1);
                            this.destaparCasilla(fila - 1, columna);
                            this.destaparCasilla(fila - 1, columna + 1);
                            this.destaparCasilla(fila, columna - 1);
                            this.destaparCasilla(fila, columna + 1);
                            this.destaparCasilla(fila + 1, columna - 1);
                            this.destaparCasilla(fila + 1, columna);

                            // En todo caso si no queremos que se ponga 0 en las casillas que no hay minas,
                            // Ponemos una cadena vacia de tal forma que no se imprimira ningun numero.
                            //td.innerHTML  = "";
                        }
                        // En todo caso de que haya minas
                    } else if (Globals.mines[fila][columna] == 1) {
                        td.innerText = '💣';
                        td.classList.add("destapado");
                        td.style.backgroundColor = "red"; // Aplicar un fondo a la celda
                        // Cuando clickes en una bomba, se muestra un mensaje y se termina la partida
                        Globals.resultado.style.display = "block";
                        Globals.resultado.innerHTML = "Lo siento, has perdido";
                        Globals.resultado.classList.add("perder");
                        Globals.finPartida = true; // Indicamos true a la variable finPartida para terminar la partida
                        // Creamos las variable a almacenar para pasarlo como parametro a los datosGlobales
                        Globals.t = clearInterval(Globals.t);
                        // Restamos 10 al explotar una bomba ya que no queremos que se incremente,
                        // unicamente las casillas a contar
                        let puntuacion = Globals.punts - 10;
                        Globals.puntuarG.innerText = puntuacion;
                        // Formato del tiempo en hrs, min y sec para mostrar en la tabla y en el localStorage
                        let time = Globals.hrs + "h " + Globals.min + "m " + Globals.sec + "s";
                        // Preguntamos nombres de usuarios
                        //let usuario = prompt("Perdistes, Ingrese un usuario a guardar: ");
                        // Llama a mostrarModal en caso de derrota
                        PopUps.mostrarModal("Lo siento, has perdido, Ingrese un usuario a guardar:");
                        let enviarDatos = document.getElementById("submitBtn");

                        enviarDatos.addEventListener("click", () => {
                            let usuario = document.getElementById("username").value;
                            Score.datosGlobales(usuario, puntuacion, time); // Pasamos como parametros los 3 valores a guardar
                            let resultadoJuego = document.getElementById("resultado-juego");
                            resultadoJuego.style.opacity = 1;
                        });
                    }
                }
            }
        }
    }

    // FUNCION PARA BORRAR EL TABLERO
    del() {
        // Reseteamos los puntos
        Globals.punts = 0;
        Globals.resultado.style.display = "none";
        puntuarG.innerText = "Puntuación: " + Globals.punts;
        const contenedorJuego = document.querySelector('.contenedor-juego');
        if (!(contenedorGlobals.classList.contains('hidden'))) {
            // Si tiene la clase 'hidden' es porque no hay ningún juego
            contenedorGlobals.classList.add('hidden');
            Globals.resultado.innerHTML = '';
            Globals.resultado.classList.remove("perder");
        }
        if (document.getElementsByTagName("table").length != 0) {
            document.getElementsByTagName("table")[0].remove();
            this.resetCount(Globals.rellenarMinas);
        }
        // Cuando se pierde, y borres el tablero, parar el tiempo
        Globals.finPartida = true;
        clearInterval(Globals.t);
    }

    // FUNCION PARA AÑADIR BANDERAS
    anadirBandera(td, rellenarMinas) {
        // En caso de que la partida termine
        if (Globals.finPartida) return;
        // En caso de que no este marcada
        if (!td.classList.contains('marcada') && Globals.numBanderas < rellenarMinas) {
            if (td.classList.length == 0) {
                td.classList.add('bandera'); // Se añade una clase predefinida para la bandera
                td.innerHTML = '🚩'; // Se coloca la bandera
                td.style.backgroundColor = 'green'; // El fondo de la casilla donde se ha colocado la bandera
                Globals.numBanderas++; // Incrementamos banderas
                // En caso de que haya una bandera 
            } else if (td.classList.contains('bandera')) {
                td.classList.remove('bandera'); // Eliminamos la clase bandera
                td.innerHTML = ''; // Quitamos la bandera
                td.style.backgroundColor = ''; // Tambien el fondo
                Globals.numBanderas--; // Y restamos las banderas
            }
            // En caso de que sea igual a las minas colocadas
            if (Globals.numBanderas == rellenarMinas) {
                Globals.finPartida = true; // Terminar Juego
                clearInterval(this.t); // Parame el tiempo
                let puntuacion = Globals.punts; //Guardamos los puntos en puntuacion
                puntuarG.innerText = puntuacion; // Escribimos la puntuacion final
                let time = Globals.hrs + "h " + Globals.min + "m " + Globals.sec + "s"; // El tiempo que se ha tardado
                // Indicamos de que hemos ganado
                Globals.resultado.style.display = "block";
                Globals.resultado.innerHTML = "Felicidades, has ganado";
                Globals.resultado.classList.add("ganar");
                let usuario = prompt("Felicidades has ganado, Ingrese un usuario a guardar: ");
                // Pasamos como parametro el usuario, la puntuacion y el tiempo a guardar            
                PopUps.datosGlobales(usuario, puntuacion, time);
                let resultadoJuego = document.getElementById("resultado-juego");
                resultadoJuego.style.opacity = 1;
            }
        }
    }
    // FUNCION PARA ACTUALIZAR EL NUMERO DE BANDERAS
    actualizaNumBanderas(rellenarMinas) {
        Globals.contadorBanderas.textContent = Globals.numBanderas;
        Globals.contadorBanderasRestantes.textContent = (rellenarMinas - Globals.numBanderas);
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

    // INICIAR PROGRAMA PESCAMINES
    inicialitza() {
        registrar.style.display = "none";
        Globals.resultado.style.display = "none";
        if (!Globals.running) {
            Globals.t = setInterval(() => this.add(), 1000);
        }
        // Controlar cuando se pierde o gana y resetar el tiempo y comenzar de nuevo
        if (Globals.finPartida) {
            this.resetcontador();
            Globals.t = setInterval(() => this.add(), 1000);
        }
        
        // INICIALIZAMOS LAS MINAS y LLAMAMOS A LAS FUNCIONES YA CREADAS PARA EMPEZAR EL JUEGO
        Globals.inputX = document.getElementById("inputX").valueAsNumber;
        Globals.inputY = document.getElementById("inputY").valueAsNumber;
        Globals.rellenarMinas = document.getElementById("minasC").valueAsNumber;
        console.log("InputX ", Globals.inputX + "InputY: ", Globals.inputY + "Minas: ",Globals.rellenarMinas);
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
        Globals.punts = 0;
        puntuarG.innerText = "Puntuación: " + Globals.punts;

    }
}

export default new Game2();