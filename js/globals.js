class Globals {

    constructor() {
        // Variables GLOBALES
        this.numBanderas = 0;        // => Número de banderas marcadas
        this.matrix = [];          // => Matriu con las casillas
        this.finPartida = false;     // => Marca de si se ha picado en una bomba
        this.statusPanel = document.querySelector('.status-bar');
        this.statusGame = document.querySelector('.game-status');
        this.boardSection = document.querySelector('.board-section');
        this.hallOfFame = document.querySelector('.hall-of-fame');
        this.minesVoltant = []; // => Contar minas que hay alrededor de la casilla
        this.mines = 0; // => Inicializar minas 
        this.contadorBanderas = document.getElementById('num-banderas'); // => Contar las banderas colocadas
        this.contadorBanderasRestantes = document.getElementById('banderas-restantes'); // => Contar las banderas que faltan por poner
        this.contadorTotalBanderas = document.getElementById('total-banderas'); // => Total de Banderas a colocar
        // Variables donde mostraremos el usuario y la puntuacion a guardar
        this.puntuarG = document.getElementById("punts"); // Mostrar los datos en la tabla de puntuaje
        this.punts = 0; // Incremetar +10 por cada casilla destapada
        // Variables donde añadiremos el usuario y la puntuacion en la tabla 
        this.tbody = document.querySelector("#datos tbody");
        this.taula = document.getElementById("datos");
        this.esVictoria = false; // Por defecto, hasta que gane
        // Contador de Tiempo de Juego
        this.timer = document.getElementById('timer');
        this.sec = 0;
        this.min = 0;
        this.hrs = 0;
        this.t = null;
        this.running = false; // Comprobar que no hace mas click para no buguear el tiempo

    }
}


export default new Globals();