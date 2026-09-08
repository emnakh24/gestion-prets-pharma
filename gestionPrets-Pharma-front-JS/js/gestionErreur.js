function afficherErreur(message) {

    const modal = document.getElementById("modal-erreur");

    const messageEl =
        document.getElementById("message-erreur-modal");

    if (!modal || !messageEl) {
        console.error(message);
        return;
    }

    messageEl.innerText = message;
    modal.style.display = "flex";
}


function fermerErreur() {

    const modal =
        document.getElementById("modal-erreur");

    if (modal) {
        modal.style.display = "none";
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const bouton =
        document.getElementById("btn-fermer-erreur");

    if (bouton) {
        bouton.addEventListener("click", fermerErreur);
    }

});