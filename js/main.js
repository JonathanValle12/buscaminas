import Game from './game.js';
import Tablero from './tablero.js';

document.getElementById("inicialitza").addEventListener("click", (e) => {
        
        e.preventDefault();
        Game.inicialitza()
});
document.getElementById("deleteTablero").addEventListener("click", () => Game.del());
document.getElementById("midataula").addEventListener("change", () => Tablero.midaTaula());