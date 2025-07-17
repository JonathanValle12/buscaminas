import Globals from "./globals.js";
import Game2 from "./game.js";

class Minas {

    constructor() {

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

    // FUNCION PARA CONTAR LAS MINAS
    contarMinas() {
        //contamos cuantas minas hay alrededor de cada casilla
        for (let fila = 0; fila < Globals.inputX; fila++) {
            for (let columna = 0; columna < Globals.inputY; columna++) {
                //solo contamos si es distinto de 1
                if (Globals.mines[fila][columna] != 1) {
                    Game2.contarMinasAlrededorCasilla(fila, columna);
                }
            }
        }
    }
}

export default new Minas();