class Globals {

    constructor() {
        // Variables del Juego
        this.matrix = [];
        this.minesVoltant = [];
        this.mines = 0;
        this.numBanderas = 0;
        this.punts = 0;
        this.esVictoria = false;
        this.running = false; // Comprobar que no hace mas click para no buguear el tiempo
        this.finPartida = false;


        this.statusPanel = document.querySelector('.status-bar');
        this.statusGame = document.querySelector('.game-status');
        this.boardSection = document.querySelector('.board-section');
        this.hallOfFame = document.querySelector('.hall-of-fame');

        
        this.contadorBanderas = document.getElementById('num-banderas');
        this.contadorBanderasRestantes = document.getElementById('banderas-restantes');
        this.contadorTotalBanderas = document.getElementById('total-banderas');
        this.puntuarG = document.getElementById("punts");

        this.tbody = document.querySelector("#datos tbody");
        this.taula = document.getElementById("datos");

        // Temporizador
        this.timer = document.getElementById('timer');
        this.sec = 0;
        this.min = 0;
        this.hrs = 0;
        this.t = null;


    }
}


export default new Globals();