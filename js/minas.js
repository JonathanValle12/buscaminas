import Globals from "./globals.js";
import Game2 from "./game.js";

class Minas {

    constructor() {

    }

    // FUNCION PARA GENERAR UNA MATRIZ DE 0 1 DE FORMA ALEATORIA
    inicialitzaMines(nMines, midaX, midaY) {
        let mines = [];
        let mines2 = nMines;

        // Inicializa la matriz con ceros
        for (var i = 0; i < midaX; i++) {
            let nueva = [];
            for (var j = 0; j < midaY; j++) {
                nueva.push(0);
            }
            mines.push(nueva);
        }

        // Insertar minas aleatoriamente
        while (mines2 != 0) {
            let a = parseInt(Math.random() * midaX);
            let b = parseInt(Math.random() * midaY);

            if (mines[a][b] != 1) {
                mines[a][b] = 1;
                mines2--;
            }
            if (isNaN(midaX) || isNaN(midaY)) {
                console.error("midaX o midaY no es un número válido.");
                return;
            }
        }
        return mines;
    }

    // FUNCION para contar las minas alrededor de cada casilla vacía
    contarMinas() {

        for (let fila = 0; fila < Globals.inputX; fila++) {
            for (let columna = 0; columna < Globals.inputY; columna++) {
                if (Globals.mines[fila][columna] != 1) {
                    Game2.contarMinasAlrededorCasilla(fila, columna);
                }
            }
        }
    }
}

export default new Minas();