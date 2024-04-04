import Globals from "./globals.js";

class Game {
    constructor() {
        this.guardarDatos = []; // => Guardar el usuario y la puntuacion en la tabla

        this.comprobarExistTabla();

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

    // FUNCION PARA AGREGAR LA TABLA
    inicialitzaJoc(inputX, inputY) {
        const contenedorJuego = document.querySelector('.contenedor-juego');

        if (contenedorGlobals.classList.contains('hidden')) {
            // Si tiene la clase 'hidden' es porque no hay ningún juego
            contenedorGlobals.classList.remove('hidden');
        }
        // En caso de que haya 1 tabla, eliminamelo y creame la siguiente para no duplicarse
        if (document.getElementsByTagName("table").length != 0) {
            document.getElementsByTagName("table")[0].remove();
            Globals.finPartida = false;
            Globals.resultado.innerHTML = '';
            Globals.resultado.classList.remove("perder");
            this.resetCount();
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
                td.addEventListener("click", (event) => this.destapar(event)); //evento con el botón izquierdo del raton
                // Añadimos función al hacer click derecho
                td.oncontextmenu = function (event) {
                    event.preventDefault();
                    anadirBandera(td, Globals.rellenarMinas);
                    actualizaNumBanderas(Globals.rellenarMinas);
                }
                // Añadimos función al hacer doble-click
                td.addEventListener('dblclick', (event) => {
                    this.dobleClick(event.target);
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
    // FUNCION PARA CONTAR LAS MINAS
    contarMinas() {
        //contamos cuantas minas hay alrededor de cada casilla
        for (let fila = 0; fila < Globals.inputX; fila++) {
            for (let columna = 0; columna < Globals.inputY; columna++) {
                //solo contamos si es distinto de 1
                if (Globals.mines[fila][columna] != 1) {
                    this.contarMinasAlrededorCasilla(fila, columna);
                }
            }
        }
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
                        this.mostrarModal("Lo siento, has perdido, Ingrese un usuario a guardar:");
                        let enviarDatos = document.getElementById("submitBtn");

                        enviarDatos.addEventListener("click", () => {
                            let usuario = document.getElementById("username").value;
                            this.datosGlobales(usuario, puntuacion, time); // Pasamos como parametros los 3 valores a guardar
                            let resultadoJuego = document.getElementById("resultado-juego");
                            resultadoGlobals.style.opacity = 1;
                        });
                    }
                }
            }
        }
    }

    // FUNCION PARA ALMACENAR LOS DATOS EN LA MATRIX GUARDARDATOS
    datosGlobales(usuario, puntuacion, time) {

        let datos = JSON.parse(localStorage.getItem("lista"));

        do {
            this.mostrarModal("Necesitas ingresar un usuario valido: ");
        } while (usuario == "");



        if (datos && datos.some(elemento => elemento.user.trim() === usuario.trim())) {
            this.mostrarModal("El nombre de usuario ya existe. Por favor, ingrese un nombre diferente:");
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

            this.ocultarModal();
        }
    }

    mostrarModal(mensaje) {
        const modal = document.getElementById("myModal");
        const modalMessage = document.getElementById("modalMessage");

        modalMessage.textContent = mensaje;

        modal.style.display = "block";
    }

    ocultarModal() {
        const modal = document.getElementById("myModal");

        modal.style.display = "none";
    }

    closeModal() {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
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

    // FUNCION PARA CREAR LA TABLA CON DIFERENTES MEDIDAS
    midaTaula() {
        let midataula = document.getElementById("midataula").value;
        // Si hemos perdido, resetea el contador y comenzar de nuevo
        if (Globals.finPartida) {
            this.resetcontador();
            this.t = setInterval(() => this.add(), 1000);
        }
        // Hacer diferentes casos
        switch (midataula) {
            // En el caso numero 1
            case '1':
                // Inicializame las minas y así en todos los casos y un break para parar el programa y que no se salga
                // al siguiente caso
                Globals.rellenarMinas = 10;
                Globals.inputX = 9;
                Globals.inputY = 9;
                Globals.mines = this.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
                break;
            case '2':
                Globals.rellenarMinas = 35;
                JuegoinputX = 9;
                Globals.inputY = 9;
                Globals.mines = this.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
                break;
            case '3':
                Globals.rellenarMinas = 99;
                Globals.inputX = 16;
                Globals.inputY = 16;
                Globals.mines = this.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
                break;
            case '4':
                Globals.rellenarMinas = 99;
                Globals.inputX = 30;
                Globals.inputY = 16;
                Globals.mines = this.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
                break;
            case '5':
                Globals.rellenarMinas = 170;
                Globals.inputX = 30;
                Globals.inputY = 16;
                Globals.mines = this.inicialitzaMines(170, Globals.inputX, Globals.inputY);
                break;
            default:
                // Si no se escoge ninguna de esas opciones, muestra una alerta
                alert("No se ha escogido ninguna opcion");
        }
        if (!Globals.running) {
            this.t = setInterval(() => this.add(), 1000);
        }
        // Llamar a las funciones ya definidas para que funcione la tabla
        this.inicialitzaJoc(Globals.inputX, Globals.inputY)
        //pintarTablero(mines); // Para visualizar de una forma mejor las minas
        this.coordCelda();
        this.contarMinas();
        this.actualizaNumBanderas(Globals.rellenarMinas);
        Globals.punts = 0;
        Globals.puntuarG.innerText = Globals.punts;
        Globals.registrar.style.display = "none";
    }

    // FUNCION PARA BORRAR EL TABLERO
    del() {
        // Reseteamos los puntos
        Globals.punts = 0;
        Globals.resultado.style.display = "none";
        puntuarG.innerText = punts;
        const contenedorJuego = document.querySelector('.contenedor-juego');
        if (!(contenedorGlobals.classList.contains('hidden'))) {
            // Si tiene la clase 'hidden' es porque no hay ningún juego
            contenedorGlobals.classList.add('hidden');
            Globals.resultado.innerHTML = '';
            Globals.resultado.classList.remove("perder");
        }
        if (document.getElementsByTagName("table").length != 0) {
            document.getElementsByTagName("table")[0].remove();
            this.resetCount(rellenarMinas);
        }
        // Cuando se pierde, y borres el tablero, parar el tiempo
        Globals.finPartida = true;
        clearInterval(this.t);
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
                let time = hrs + "h " + min + "m " + sec + "s"; // El tiempo que se ha tardado
                // Indicamos de que hemos ganado
                Globals.resultado.style.display = "block";
                Globals.resultado.innerHTML = "Felicidades, has ganado";
                Globals.resultado.classList.add("ganar");
                let usuario = prompt("Felicidades has ganado, Ingrese un usuario a guardar: ");
                // Pasamos como parametro el usuario, la puntuacion y el tiempo a guardar            
                this.datosGlobales(usuario, puntuacion, time);
                let resultadoJuego = document.getElementById("resultado-juego");
                resultadoGlobals.style.opacity = 1;
            }
        }
    }
    // FUNCION PARA ACTUALIZAR EL NUMERO DE BANDERAS
    actualizaNumBanderas(rellenarMinas) {
        Globals.contadorBanderas.textContent = Globals.numBanderas;
        Globals.contadorBanderasRestantes.textContent = (rellenarMinas - Globals.numBanderas);
    }
    // FUNCION PARA GENERAR UNA MATRIZ DE 0 1 DE FORMA ALEATORIA
    inicialitzaMines(nMines, midaX, midaY) {
        let mines = [];
        let mines2 = nMines;
        // Crear Matriz de midaX midaY llenas de 0
        for (var i = 0; i < midaX; i++) {
            // Crear matriz nueva
            let nueva = [];
            for (var j = 0; j < midaY; j++) {
                // Llenar la matriz nueva de midaX midaY de 0
                nueva.push(0);
            }
            // Llenar toda la matriz nueva de 0 en la matriz mines y tener las dimension
            // de midaX y midaY
            mines.push(nueva);
        }
        // En caso de que haya minas
        while (mines2 != 0) {
            // Generar numeros aleatorios
            let a = parseInt(Math.random() * midaX);
            let b = parseInt(Math.random() * midaY);
            // En caso de que no haya minas (1)
            if (mines[a][b] != 1) {
                // Pon 1 a las minas
                mines[a][b] = 1;
                mines2--;
            }
            if (isNaN(midaX) || isNaN(midaY)) {
                // Manejar el error o lanzar una excepción
                console.error("midaX o midaY no es un número válido.");
                return; // o lanza una excepción, o realiza alguna acción adecuada
            }
        }
        // Retornamos la matriz con las minas 1
        return mines;
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

        Globals.mines = this.inicialitzaMines(Globals.rellenarMinas, Globals.inputX, Globals.inputY);
        this.inicialitzaJoc(Globals.inputX, Globals.inputY);
        //pintarTablero(mines); // Para visualizar de una forma mejor las minas
        this.coordCelda();
        this.contarMinas();
        this.actualizaNumBanderas(Globals.rellenarMinas);
        // Cada vez que se generar nuevas minas y se crea otra tabla se resetean los puntos y se muestra por pantalla
        Globals.punts = 0;
        puntuarG.innerText = Globals.punts;

    }
}

export default Game;