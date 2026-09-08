const SUGGESTIONS_INITIALES = [
    "Liste des établissements",
    "Liste des dépôts",
    "Combien d'articles ?",
    "Aide"
];

function ouvrirChat() {
    document.getElementById("chat-window").classList.remove("chat-hidden");
}
function fermerChat() {
    document.getElementById("chat-window").classList.add("chat-hidden");
}
document.getElementById("chat-toggle-btn").addEventListener("click", ouvrirChat);
document.getElementById("chat-close-btn").addEventListener("click", fermerChat);

function ajouterMessage(texte, expediteur) {
    const container = document.getElementById("chat-messages");
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", expediteur);
    bubble.innerText = texte;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
}
function ajouterSuggestions(suggestions) {
    const container = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.classList.add("chat-suggestions");
    suggestions.forEach(s => {
        const btn = document.createElement("button");
        btn.classList.add("chat-suggestion-btn");
        btn.innerText = s;
        btn.addEventListener("click", () => traiterMessage(s));
        div.appendChild(btn);
    });
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// --- Moteur de reconnaissance d'intentions ---

function normaliser(texte) {
    return texte.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlève les accents
}

async function traiterMessage(texteUtilisateur) {
    ajouterMessage(texteUtilisateur, "user");
    document.getElementById("chat-input").value = "";

    const indicateurChargement = ajouterMessage("...", "bot");

    try {
        const response = await fetch("http://localhost:8080/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ message: texteUtilisateur })
        });

        if (!response.ok) {
            throw new Error("Erreur de communication avec l'assistant");
        }

        const data = await response.json();
        indicateurChargement.innerText = data.reponse;

    } catch (error) {
        console.error(error);
        indicateurChargement.innerText = "Désolé, une erreur est survenue.";
    }
}

document.getElementById("chat-send-btn").addEventListener("click", function () {
    const texte = document.getElementById("chat-input").value.trim();
    if (texte) traiterMessage(texte);
});

document.getElementById("chat-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        const texte = event.target.value.trim();
        if (texte) traiterMessage(texte);
    }
});

// Message d'accueil au premier chargement
window.addEventListener("DOMContentLoaded", function () {
    ajouterMessage("Bonjour ! Je suis votre assistant. Posez-moi une question sur vos établissements, articles, dépôts ou stocks.", "bot");
    ajouterSuggestions(SUGGESTIONS_INITIALES);
});