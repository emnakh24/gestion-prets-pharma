// Variable qui garde en mémoire la liste complète, pour permettre le filtrage local
let tousLesEtablissements = [];
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

// Fermer la modale si on clique en dehors de la boîte (sur l'overlay)
document.getElementById("modal-overlay").addEventListener("click", function (event) {
    if (event.target.id === "modal-overlay") {
        fermerModale();
    }
});

// --- Affichage de la liste ---
function afficherEtablissements(etablissements) {

    const container =
        document.getElementById("liste-etablissements");

    container.innerHTML = "";

    // Mise à jour du nombre
    const compteur =
        document.getElementById("nombre-etablissements");

    if (compteur) {

        if (etablissements.length === 1) {
            compteur.innerText = "1 établissement";
        } else {
            compteur.innerText =
                `${etablissements.length} établissements`;
        }
    }

    // Aucun établissement
    if (etablissements.length === 0) {

        container.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                   

                    <strong>Aucun établissement trouvé</strong>

                    <span>
                        Aucun établissement ne correspond à votre recherche.
                    </span>
                </td>
            </tr>
        `;

        return;
    }

    // Création des lignes
    etablissements.forEach(etab => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>
                <span class="code-badge">
                    ${etab.codEtab}
                </span>
            </td>

            <td>
                <div class="designation-cell">
                    
                    <span>
                        ${etab.designation}
                    </span>
                </div>
            </td>

            <td>
                <span class="text-cell">
                    ${etab.adresse || "Non renseignée"}
                </span>
            </td>

            <td>
                <span class="phone-cell">
                    ${etab.tel || "Non renseigné"}
                </span>
            </td>

            <td class="actions-cell">

                <button
                    class="table-btn btn-modifier"
                    data-code="${etab.codEtab}"
                    title="Modifier"
                >
                    ✏️ Modifier
                </button>

                <button
                    class="table-btn btn-supprimer"
                    data-code="${etab.codEtab}"
                    title="Supprimer"
                >
                    🗑️ Supprimer
                </button>

            </td>

        `;

        container.appendChild(tr);
    });

    attacherEvenementsBoutons();
}
function attacherEvenementsBoutons() {
    document
        .querySelectorAll("#liste-etablissements .btn-modifier")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                passerEnModeEdition(btn.dataset.code);
            });
        });
    document
        .querySelectorAll("#liste-etablissements .btn-supprimer")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                supprimerEtablissement(btn.dataset.code);
            });
        });
}

// --- Mode édition ---

async function passerEnModeEdition(codEtab) {
    try {
        const etab = await getEtablissementById(codEtab);

        document.getElementById("mode").value = "edit";
        document.getElementById("codEtab").value = etab.codEtab;
        document.getElementById("codEtab").disabled = true;
        document.getElementById("designation").value = etab.designation;
        document.getElementById("adresse").value = etab.adresse;
        document.getElementById("tel").value = etab.tel;

        document.getElementById("form-title").innerText = "Modifier l'établissement";
        document.getElementById("submit-btn").innerText = "Enregistrer";

        ouvrirModale();

    } catch (error) {
        console.error(error);
        alert("Impossible de charger cet établissement.");
    }
}

function revenirEnModeCreation() {
    document.getElementById("mode").value = "create";
    document.getElementById("codEtab").disabled = false;
    document.getElementById("form-etablissement").reset();
    document.getElementById("form-title").innerText = "Ajouter un établissement";
    document.getElementById("submit-btn").innerText = "Créer";
    document.getElementById("form-message").innerText = "";
}

// --- Suppression ---

async function supprimerEtablissement(codEtab) {
    const modal =
        document.getElementById("modal-confirmation");
    const message =
        document.getElementById("message-confirmation");
    message.innerText =
        `Voulez-vous vraiment supprimer l'etablissement "${codEtab}" ?`;
    modal.style.display = "flex";
    // Bouton Annuler
    const btnAnnuler =
        document.getElementById("btn-annuler-suppression");
    // Bouton Supprimer
    const btnConfirmer =
        document.getElementById("btn-confirmer-suppression");
    // Annuler
    btnAnnuler.onclick = function () {
        modal.style.display = "none";
    };
    // Confirmer
    btnConfirmer.onclick = async function () {
        modal.style.display = "none";
        try {
            await deleteEtablissement(codEtab);
            tousLesArticles =
                await getAllEtablissements();
            afficherEtablissements(
                tousLesArticles
            );
        } catch (error) {
            console.error(error);
            afficherErreur(
                error.message ||
                "Impossible de supprimer cet etablissement."
            );
        }
    };
}

// --- Soumission du formulaire ---

const formEtablissement = document.getElementById("form-etablissement");

formEtablissement.addEventListener("submit", async function (event) {
    event.preventDefault();

    const messageEl = document.getElementById("form-message");
    const mode = document.getElementById("mode").value;

    const etablissementData = {
        codEtab: document.getElementById("codEtab").value,
        designation: document.getElementById("designation").value,
        adresse: document.getElementById("adresse").value,
        tel: document.getElementById("tel").value
    };
    try {
        if (mode === "create") {
            await createEtablissement(etablissementData);
        } else {
            await updateEtablissement(
                etablissementData.codEtab,
                etablissementData
            );
        }
        tousLesEtablissements =
            await getAllEtablissements();

        afficherEtablissements(
            tousLesEtablissements
        );
        fermerModale();
    } catch (error) {
        console.error(error);
        afficherErreur(error.message);
    }
});

// --- Chargement initial ---
async function initPage() {
    try {
        tousLesEtablissements = await getAllEtablissements();
        afficherEtablissements(tousLesEtablissements);
    } catch (error) {
        console.error(error);
        document.getElementById("liste-etablissements").innerText = "Erreur lors du chargement des données.";
    }
}
document.addEventListener("DOMContentLoaded", initPage);
// --- Recherche ---

function filtrerEtablissements(texteRecherche) {
    const texte = texteRecherche.toLowerCase().trim();

    if (texte === "") {
        return tousLesEtablissements;
    }

    return tousLesEtablissements.filter(etab =>
        etab.codEtab.toLowerCase().includes(texte) ||
        etab.designation.toLowerCase().includes(texte) ||
        etab.adresse.toLowerCase().includes(texte)
    );
}

document.getElementById("input-recherche").addEventListener("input", function (event) {
    const resultats = filtrerEtablissements(event.target.value);
    afficherEtablissements(resultats);
});