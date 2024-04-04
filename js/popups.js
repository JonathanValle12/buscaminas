
class Popups {

    constructor() {
        
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

}

export default new Popups();
