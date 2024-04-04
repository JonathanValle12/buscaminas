import Game2 from './game2.js';
import Tablero from './tablero.js';

document.getElementById("inicialitza").addEventListener("click", () => Game2.inicialitza());
document.getElementById("deleteTablero").addEventListener("click", () => Game2.del());
document.getElementById("midataula").addEventListener("change", () => Tablero.midaTaula());
document.getElementById("close").addEventListener("click", () => Game2.closeModal());