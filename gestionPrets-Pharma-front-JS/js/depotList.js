let tousLesDepots = [];

// --- Gestion de la modale ---

function ouvrirModale() {
    document.getElementById("modal-overlay").style.display = "flex";
}

function fermerModale() {
    document.getElementById("modal-overlay").style.display = "none";
    revenirEnModeCreation();
}

document.getElementById("btn-ouvrir-modale").addEventListener("click", ouvrirModale);
document.getElementById("btn-fermer-modale").addEventListener("click", fermerModale);
document.getElementById("cancel-btn").addEventListener("click", fermerModale);

document.getElementById("modal-overlay").addEventListener("click", function (event) {
    if (event.target.id === "modal-overlay") {
        fermerModale();
    }
});

// --- Affichage de la liste ---

function afficherDepots(depots) {
    const tbody = document.getElementById("liste-depots");
    tbody.innerHTML = "";

    const badge = document.getElementById("badge-nombre-depots");
    if (badge) {
        badge.innerText = `${depots.length} dépôt(s)`;
    }

    if (depots.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">
                    
                    <strong>Aucun dépôt trouvé</strong>
                    <span>Essayez une autre recherche ou ajoutez un dépôt.</span>
                </td>
            </tr>
        `;
        return;
    }

    depots.forEach(dep => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <span class="code-badge">${dep.codDepot}</span>
            </td>

            <td>
                <div class="designation-cell">
                    
                    ${dep.designation}
                </div>
            </td>

            <td class="text-cell">
                ${dep.adresse}
            </td>

            <td class="actions-cell">
                <button type="button" class="table-btn btn-modifier" data-code="${dep.codDepot}">✏️ Modifier</button>
                <button type="button" class="table-btn btn-supprimer" data-code="${dep.codDepot}">🗑️ Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attacherEvenementsBoutons();
}
function attacherEvenementsBoutons() {
    document.querySelectorAll("#liste-depots .btn-modifier").forEach(btn => {
        btn.addEventListener("click", () => passerEnModeEdition(btn.dataset.code));
    });

    document.querySelectorAll("#liste-depots .btn-supprimer").forEach(btn => {
        btn.addEventListener("click", () => ouvrirConfirmationSuppressionDepot(btn.dataset.code));
    });
}

// --- Mode édition ---

async function passerEnModeEdition(codDepot) {
    try {
        const dep = await getDepotById(codDepot);

        document.getElementById("mode").value = "edit";
        document.getElementById("codDepot").value = dep.codDepot;
        document.getElementById("codDepot").disabled = true;
        document.getElementById("designation").value = dep.designation;
        document.getElementById("adresse").value = dep.adresse;

        document.getElementById("form-title").innerText = "Modifier le dépôt";
        document.getElementById("submit-btn").innerText = "Enregistrer";

        ouvrirModale();

    } catch (error) {
        console.error(error);
        alert("Impossible de charger ce dépôt.");
    }
}

function revenirEnModeCreation() {
    document.getElementById("mode").value = "create";
    document.getElementById("codDepot").disabled = false;
    document.getElementById("form-depot").reset();
    document.getElementById("form-title").innerText = "Ajouter un dépôt";
    document.getElementById("submit-btn").innerText = "Créer";
    document.getElementById("form-message").innerText = "";
}

/// ============================================================
// MODALE CONFIRMATION SUPPRESSION - DEPOT
// ============================================================

let depotASupprimer = null;

function ouvrirConfirmationSuppressionDepot(codDepot) {
    depotASupprimer = codDepot;

    const dep = tousLesDepots.find(d => String(d.codDepot) === String(codDepot));

    const message = dep
        ? `Voulez-vous vraiment supprimer le dépôt "${dep.designation}" ?`
        : "Voulez-vous vraiment supprimer ce dépôt ?";

    document.getElementById("message-confirmation-depot").innerText = message;
    document.getElementById("modal-confirmation-depot").style.display = "flex";
}

function fermerConfirmationSuppressionDepot() {
    document.getElementById("modal-confirmation-depot").style.display = "none";
    depotASupprimer = null;
}

document.getElementById("btn-annuler-suppression-depot")
    .addEventListener("click", fermerConfirmationSuppressionDepot);

document.getElementById("modal-confirmation-depot")
    .addEventListener("click", function (event) {
        if (event.target.id === "modal-confirmation-depot") {
            fermerConfirmationSuppressionDepot();
        }
    });

document.getElementById("btn-confirmer-suppression-depot")
    .addEventListener("click", async function () {
        if (!depotASupprimer) return;

        try {
            await deleteDepot(depotASupprimer);
            tousLesDepots = await getAllDepots();
            afficherDepots(tousLesDepots);
            fermerConfirmationSuppressionDepot();
        } catch (error) {
            console.error(error);
            fermerConfirmationSuppressionDepot();
            afficherErreur(error.message);   // ← ici
        }
    });

// --- Soumission du formulaire ---

const formDepot = document.getElementById("form-depot");

formDepot.addEventListener("submit", async function (event) {
    event.preventDefault();

    const messageEl = document.getElementById("form-message");
    const mode = document.getElementById("mode").value;

    const depotData = {
        codDepot: document.getElementById("codDepot").value,
        designation: document.getElementById("designation").value,
        adresse: document.getElementById("adresse").value
    };

    try {

    if (mode === "create") {

        await createDepot(depotData);

    } else {

        await updateDepot(
            depotData.codDepot,
            depotData
        );
    }
    tousLesDepots = await getAllDepots();
    afficherDepots(tousLesDepots);
    fermerModaleDepot();

    } catch (error) {

        console.error(error);

        afficherErreur(error.message);
    }
});

// --- Chargement initial ---

async function initPage() {
    try {
        tousLesDepots = await getAllDepots();
        afficherDepots(tousLesDepots);
    } catch (error) {
        console.error(error);
        document.getElementById("liste-depots").innerHTML = `
            <tr>
                <td colspan="4" class="empty-table table-error">
                    <div class="empty-icon">⚠️</div>
                    <strong>Erreur lors du chargement</strong>
                    <span>Impossible de récupérer la liste des dépôts.</span>
                </td>
            </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", initPage);

// --- Recherche ---

function filtrerDepots(texteRecherche) {
    const texte = texteRecherche.toLowerCase().trim();

    if (texte === "") {
        return tousLesDepots;
    }

    return tousLesDepots.filter(dep =>
        dep.codDepot.toLowerCase().includes(texte) ||
        dep.designation.toLowerCase().includes(texte) ||
        dep.adresse.toLowerCase().includes(texte)
    );
}

document.getElementById("input-recherche").addEventListener("input", function (event) {
    const resultats = filtrerDepots(event.target.value);
    afficherDepots(resultats);
});