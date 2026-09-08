let tousLesStocks = [];

// ============================================================
// MODALE STOCK
// ============================================================

function ouvrirModaleStock() {
    document.getElementById("modal-overlay-stock").style.display = "flex";
}

function fermerModaleStock() {
    document.getElementById("modal-overlay-stock").style.display = "none";
    revenirEnModeCreationStock();
}

document.getElementById("btn-ouvrir-modale-stock")
    .addEventListener("click", ouvrirModaleStock);

document.getElementById("btn-fermer-modale-stock")
    .addEventListener("click", fermerModaleStock);

document.getElementById("cancel-btn-stock")
    .addEventListener("click", fermerModaleStock);

document.getElementById("modal-overlay-stock")
    .addEventListener("click", function (event) {

        if (event.target.id === "modal-overlay-stock") {
            fermerModaleStock();
        }

    });


// ============================================================
// CHARGER LES DÉPÔTS DANS LE SELECT
// ============================================================

async function chargerDepotsSelect() {

    const depots = await getAllDepots();

    const select = document.getElementById("stock-depot");

    select.innerHTML = `
        <option value="">
            -- Choisir un dépôt --
        </option>
    `;

    depots.forEach(dep => {

        const option = document.createElement("option");

        option.value = dep.codDepot;
        option.textContent = dep.designation;

        select.appendChild(option);

    });
}


// ============================================================
// CHARGER LES ARTICLES DANS LE SELECT
// ============================================================

async function chargerArticlesSelect() {

    const articles = await getAllArticles();

    const select = document.getElementById("stock-article");

    select.innerHTML = `
        <option value="">
            -- Choisir un article --
        </option>
    `;

    articles.forEach(art => {

        const option = document.createElement("option");

        option.value = art.codArt;
        option.textContent = art.description;

        select.appendChild(option);

    });
}


// ============================================================
// AFFICHER LES STOCKS
// ============================================================

function afficherStocks(stocks) {

    const tbody = document.getElementById("liste-stocks");

    tbody.innerHTML = "";


    const badge = document.getElementById("badge-nombre-stocks");

    if (badge) {

        badge.innerText = `${stocks.length} stock(s)`;
    }


    if (stocks.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">
                    <div class="empty-icon">📊</div>
                    <strong>Aucun stock trouvé</strong>
                    <span>Essayez une autre recherche ou ajoutez un stock.</span>
                </td>
            </tr>
        `;

        return;
    }

    stocks.forEach(stock => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>
                <div class="designation-cell">
                    ${stock.article.description}
                </div>
            </td>

            <td class="text-cell">
                ${stock.depot.designation}
            </td>

            <td>
                <span class="qte-badge">
                    ${stock.qteStock}
                </span>
            </td>

            <td class="actions-cell">

                <button
                    type="button"
                    class="table-btn btn-modifier"
                    data-depot="${stock.depot.codDepot}"
                    data-art="${stock.article.codArt}">
                    ✏️ Modifier
                </button>

                <button
                    type="button"
                    class="table-btn btn-supprimer"
                    data-depot="${stock.depot.codDepot}"
                    data-art="${stock.article.codArt}">
                    🗑️ Supprimer
                </button>

            </td>

        `;

        tbody.appendChild(tr);

    });

    attacherEvenementsBoutonsStock();
}


// ============================================================
// ATTACHER LES BOUTONS
// ============================================================

function attacherEvenementsBoutonsStock() {

    // -------------------------
    // MODIFIER
    // -------------------------

    document
        .querySelectorAll("#liste-stocks .btn-modifier")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                passerEnModeEditionStock(
                    btn.dataset.depot,
                    btn.dataset.art
                );

            });

        });


    // -------------------------
    // SUPPRIMER
    // -------------------------

    document
        .querySelectorAll("#liste-stocks .btn-supprimer")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                /*
                 * IMPORTANT :
                 * On n'appelle plus directement supprimerStock().
                 *
                 * On ouvre d'abord la modale de confirmation.
                 */

                ouvrirConfirmationSuppressionStock(
                    btn.dataset.depot,
                    btn.dataset.art
                );

            });

        });
}


// ============================================================
// MODE ÉDITION
// ============================================================

function passerEnModeEditionStock(codDepot, codArt) {

    const stock = tousLesStocks.find(
        s =>
            String(s.depot.codDepot) === String(codDepot) &&
            String(s.article.codArt) === String(codArt)
    );

    if (!stock) {
        return;
    }

    document.getElementById("mode-stock").value = "edit";

    document.getElementById("stock-depot").value = codDepot;
    document.getElementById("stock-depot").disabled = true;

    document.getElementById("stock-article").value = codArt;
    document.getElementById("stock-article").disabled = true;

    document.getElementById("stock-quantite").value =
        stock.qteStock;

    document.getElementById("form-title-stock").innerText =
        "Modifier le stock";

    document.getElementById("submit-btn-stock").innerText =
        "Enregistrer";

    ouvrirModaleStock();
}


// ============================================================
// REVENIR EN MODE CRÉATION
// ============================================================

function revenirEnModeCreationStock() {

    document.getElementById("mode-stock").value = "create";

    document.getElementById("stock-depot").disabled = false;

    document.getElementById("stock-article").disabled = false;

    document.getElementById("form-stock").reset();

    document.getElementById("form-title-stock").innerText =
        "Ajouter un stock";

    document.getElementById("submit-btn-stock").innerText =
        "Créer";

    document.getElementById("form-message-stock").innerText = "";
}


// ============================================================
// MODALE CONFIRMATION SUPPRESSION
// ============================================================

let stockASupprimer = null;


// Ouvrir la modale
function ouvrirConfirmationSuppressionStock(codDepot, codArt) {

    stockASupprimer = {
        codDepot: codDepot,
        codArt: codArt
    };


    /*
     * On récupère le stock pour afficher
     * le nom du dépôt et de l'article.
     */

    const stock = tousLesStocks.find(
        s =>
            String(s.depot.codDepot) === String(codDepot) &&
            String(s.article.codArt) === String(codArt)
    );


    let message;


    if (stock) {

        message =
            `Voulez-vous vraiment supprimer le stock de l'article "${stock.article.description}" du dépôt "${stock.depot.designation}" ?`;

    } else {

        message =
            `Voulez-vous vraiment supprimer ce stock ?`;

    }


    document.getElementById(
        "message-confirmation-stock"
    ).innerText = message;


    document.getElementById(
        "modal-confirmation-stock"
    ).style.display = "flex";
}


// Fermer la modale
function fermerConfirmationSuppressionStock() {

    document.getElementById(
        "modal-confirmation-stock"
    ).style.display = "none";

    stockASupprimer = null;
}


// ============================================================
// BOUTON ANNULER DE LA MODALE
// ============================================================

document.getElementById(
    "btn-annuler-suppression-stock"
).addEventListener(
    "click",
    fermerConfirmationSuppressionStock
);

// ============================================================
// FERMER SI ON CLIQUE À L'EXTÉRIEUR
// ============================================================

document.getElementById(
    "modal-confirmation-stock"
).addEventListener(
    "click",
    function (event) {

        if (
            event.target.id ===
            "modal-confirmation-stock"
        ) {

            fermerConfirmationSuppressionStock();

        }

    }
);


// ============================================================
// CONFIRMER LA SUPPRESSION
// ============================================================

document.getElementById(
    "btn-confirmer-suppression-stock"
).addEventListener(
    "click",
    async function () {

        /*
         * Vérification de sécurité :
         * aucun stock sélectionné
         */

        if (!stockASupprimer) {
            return;
        }


        const codDepot = stockASupprimer.codDepot;
        const codArt = stockASupprimer.codArt;


        try {

            /*
             * Appel du backend
             */

            await deleteDepotStock(
                codDepot,
                codArt
            );


            /*
             * Actualiser la liste
             */

            tousLesStocks =
                await getAllDepotStocks();

            afficherStocks(
                tousLesStocks
            );


            /*
             * Fermer la modale
             */

            fermerConfirmationSuppressionStock();


        } catch (error) {

            console.error(error);


            /*
             * Fermer la modale de confirmation
             */

            fermerConfirmationSuppressionStock();


            /*
             * Afficher la modale d'erreur
             */

            afficherErreur(
                error.message
            );

        }

    }
);


// ============================================================
// FORMULAIRE : AJOUT / MODIFICATION
// ============================================================

document
    .getElementById("form-stock")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const mode =
                document.getElementById(
                    "mode-stock"
                ).value;


            const codDepot =
                document.getElementById(
                    "stock-depot"
                ).value;


            const codArt =
                document.getElementById(
                    "stock-article"
                ).value;


            const quantite =
                parseInt(
                    document.getElementById(
                        "stock-quantite"
                    ).value
                );


            try {

                if (mode === "create") {

                    await createStock(
                        codDepot,
                        codArt,
                        quantite
                    );

                } else {

                    await updateDepotStock(
                        codDepot,
                        codArt,
                        quantite
                    );

                }


                /*
                 * Actualiser la liste
                 */

                tousLesStocks =
                    await getAllDepotStocks();

                afficherStocks(
                    tousLesStocks
                );


                /*
                 * Fermer la modale
                 */

                fermerModaleStock();


            } catch (error) {

                console.error(error);

                afficherErreur(
                    error.message
                );

            }

        }
    );


// ============================================================
// RECHERCHE
// ============================================================

function filtrerStocks(texteRecherche) {

    const texte =
        texteRecherche
            .toLowerCase()
            .trim();


    if (texte === "") {

        return tousLesStocks;

    }


    return tousLesStocks.filter(
        stock =>

            stock.depot.designation
                .toLowerCase()
                .includes(texte)

            ||

            stock.article.description
                .toLowerCase()
                .includes(texte)
    );
}


document
    .getElementById(
        "input-recherche-stocks"
    )
    .addEventListener(
        "input",
        function (event) {

            const resultats =
                filtrerStocks(
                    event.target.value
                );

            afficherStocks(
                resultats
            );

        }
    );


// ============================================================
// MODALE D'ERREUR
// ============================================================
function afficherErreur(message) {
    const modal =
        document.getElementById(
            "modal-erreur"
        );
    const messageEl =
        document.getElementById(
            "message-erreur-modal"
        );
    messageEl.innerText =
        message;
    modal.style.display =
        "flex";
}
function fermerErreur() {
    const modal =
        document.getElementById(
            "modal-erreur"
        );
    modal.style.display =
        "none";
}
document
    .getElementById(
        "btn-fermer-erreur"
    )
    .addEventListener(
        "click",
        fermerErreur
    );
// ============================================================
// CHARGEMENT INITIAL
// ============================================================
async function initPageStocks() {
    try {

        await chargerDepotsSelect();

        await chargerArticlesSelect();

        tousLesStocks =
            await getAllDepotStocks();

        afficherStocks(
            tousLesStocks
        );

    } catch (error) {

        console.error(error);

        document.getElementById(
            "liste-stocks"
        ).innerHTML = `
            <tr>
                <td colspan="4" class="empty-table table-error">
                    <div class="empty-icon">⚠️</div>
                    <strong>Erreur lors du chargement</strong>
                    <span>Impossible de récupérer la liste des stocks.</span>
                </td>
            </tr>
        `;

    }

}
document.addEventListener(
    "DOMContentLoaded",
    initPageStocks
);