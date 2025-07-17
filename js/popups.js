import Globals from "./globals.js";

class Popups {

    constructor() {
        
    }

    mostrarModal(puntuacion, tiempo) {
        const modal = document.getElementById("myModal");
        const usernameInput = document.getElementById("username");
        const submitBtn = document.getElementById("submitBtn");

        //Actualizar la puntuación y el tiempo
        const scoreSpan = modal.querySelector('.score');
        const timeSpan = modal.querySelector('.time');
        const modalTitle = modal.querySelector('#modal-title')
        const modalIcon = modal.querySelector('#modal-icon');

        if (scoreSpan) scoreSpan.textContent = puntuacion;
        if (timeSpan) timeSpan.textContent = tiempo;

        if (modalTitle) modalTitle.className = 'modal-title';
        if (modalIcon) modalIcon.className = 'modal-icon';
        
        if(modalTitle && modalIcon) {
            if(Globals.esVictoria) {
                modalIcon.textContent = "🏆";
                modalTitle.textContent = "¡VICTORIA!";
                modalTitle.classList.add("victoria");
                modalIcon.classList.add("iconVictory");
            } else {
                modalIcon.textContent = "⚠️";
                modalTitle.textContent = "FIN DEL JUEGO";
                modalTitle.classList.add("gameOver");
                modalIcon.classList.add("iconGame");
            }
        }

        // Limpiar input de nombre cada vez que se muestre
        if(usernameInput) {
            usernameInput.value = "";
            submitBtn.disabled = true;

            usernameInput.addEventListener("input", () => {
                const isValid = /^[a-zA-ZÀ-ÿ\s]{3,20}$/.test(usernameInput.value.trim());
                submitBtn.disabled = !isValid;
            })
        }

         modal.style.display = "flex";
    }

    ocultarModal() {
        const modal = document.getElementById("myModal");
        const usernameInput = document.getElementById("username");

        modal.style.display = "none";

        if (usernameInput) {
            usernameInput.value = "";
        }

    }

}

export default new Popups();
