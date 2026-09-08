let tousLesArticles = [];


/* ========================================================= */
/*                    GESTION DE LA MODALE                   */
/* ========================================================= */

function ouvrirModaleArticle() {

    document.getElementById(
        "modal-overlay-article"
    ).style.display = "flex";
}


function fermerModaleArticle() {

    document.getElementById(
        "modal-overlay-article"
    ).style.display = "none";

    revenirEnModeCreationArticle();
}


document
    .getElementById("btn-ouvrir-modale-article")
    .addEventListener(
        "click",
        ouvrirModaleArticle
    );


document
    .getElementById("btn-fermer-modale-article")
    .addEventListener(
        "click",
        fermerModaleArticle
    );


document
    .getElementById("cancel-btn-article")
    .addEventListener(
        "click",
        fermerModaleArticle
    );


/* Fermer la modale en cliquant à l'extérieur */

document
    .getElementById("modal-overlay-article")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target.id ===
                "modal-overlay-article"
            ) {

                fermerModaleArticle();

            }

        }
    );


/* ========================================================= */
/*                    AFFICHAGE DES ARTICLES                  */
/* ========================================================= */

function afficherArticles(articles) {

    const tbody =
        document.getElementById("liste-articles");

    tbody.innerHTML = "";


    /* Mise à jour du badge nombre */

    const badge =
        document.getElementById(
            "badge-nombre-articles"
        );

    if (badge) {

        badge.innerText =
            `${articles.length} article(s)`;
    }


    /* Aucun article */

    if (articles.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">
                    <div class="empty-icon">📦</div>
                    <strong>Aucun article trouvé</strong>
                    <span>Essayez une autre recherche ou ajoutez un article.</span>
                </td>
            </tr>
        `;

        return;
    }


    /* Affichage des articles */

    articles.forEach(art => {

        const tr =
            document.createElement("tr");


        const prix =
            art.prixUnitaire !== null &&
            art.prixUnitaire !== undefined
                ? Number(art.prixUnitaire).toFixed(2) + " DT"
                : "Non défini";


        tr.innerHTML = `

            <td>
                <span class="code-badge">
                    ${art.codArt}
                </span>
            </td>


            <td>
                <div class="designation-cell">
                    
                    ${art.description}
                </div>
            </td>


            <td class="text-cell">
                ${prix}
            </td>


            <td class="actions-cell">

                <button
                    type="button"
                    class="table-btn btn-modifier"
                    data-code="${art.codArt}">
                    ✏️ Modifier
                </button>


                <button
                    type="button"
                    class="table-btn btn-supprimer"
                    data-code="${art.codArt}">
                    🗑️ Supprimer
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attacherEvenementsBoutonsArticles();
}
/* ========================================================= */
/*                  BOUTONS DU TABLEAU                       */
/* ========================================================= */
function attacherEvenementsBoutonsArticles() {
    document
        .querySelectorAll(
            "#liste-articles .btn-modifier"
        )
        .forEach(btn => {
            btn.addEventListener(
                "click",
                function () {
                    passerEnModeEditionArticle(
                        this.dataset.code
                    );
                }
            );
        });
    /* Boutons Supprimer */
    document
        .querySelectorAll(
            "#liste-articles .btn-supprimer"
        )
        .forEach(btn => {
            btn.addEventListener(
                "click",
                function () {
                    supprimerArticle(
                        this.dataset.code
                    );
                }
            );
        });
}
/* ========================================================= */
/*                    MODE EDITION                           */
/* ========================================================= */
async function passerEnModeEditionArticle(codArt) {
    try {
        const art =
            await getArticleById(codArt);
        document.getElementById(
            "mode-article"
        ).value = "edit";
        document.getElementById(
            "codArt"
        ).value = art.codArt;
        document.getElementById(
            "codArt"
        ).disabled = true;
        document.getElementById(
            "description"
        ).value = art.description;
        document.getElementById(
            "prixUnitaire"
        ).value =
            art.prixUnitaire ?? "";
        document.getElementById(
            "form-title-article"
        ).innerText =
            "Modifier l'article";
        document.getElementById(
            "submit-btn-article"
        ).innerText =
            "Enregistrer";


        ouvrirModaleArticle();


    } catch (error) {

        console.error(error);

        afficherErreur(
            error.message ||
            "Impossible de charger cet article."
        );

    }

}


/* ========================================================= */
/*                  RETOUR MODE CREATION                     */
/* ========================================================= */

function revenirEnModeCreationArticle() {

    document.getElementById(
        "mode-article"
    ).value = "create";


    document.getElementById(
        "codArt"
    ).disabled = false;


    document.getElementById(
        "form-article"
    ).reset();


    document.getElementById(
        "form-title-article"
    ).innerText =
        "Ajouter un article";


    document.getElementById(
        "submit-btn-article"
    ).innerText =
        "Créer";


    document.getElementById(
        "form-message-article"
    ).innerText = "";

}


/* ========================================================= */
/*                    SUPPRESSION                            */
/* ========================================================= */

function supprimerArticle(codArt) {

    const modal =
        document.getElementById(
            "modal-confirmation"
        );


    const message =
        document.getElementById(
            "message-confirmation"
        );


    message.innerText =
        `Voulez-vous vraiment supprimer l'article "${codArt}" ?`;


    modal.style.display = "flex";


    const btnAnnuler =
        document.getElementById(
            "btn-annuler-suppression"
        );


    const btnConfirmer =
        document.getElementById(
            "btn-confirmer-suppression"
        );


    /* Annuler */

    btnAnnuler.onclick = function () {

        modal.style.display = "none";

    };


    /* Confirmer */

    btnConfirmer.onclick =
        async function () {

            modal.style.display = "none";


            try {

                await deleteArticle(codArt);


                tousLesArticles =
                    await getAllArticles();


                afficherArticles(
                    tousLesArticles
                );


            } catch (error) {

                console.error(error);


                afficherErreur(
                    error.message ||
                    "Impossible de supprimer cet article."
                );

            }

        };

}
/* ========================================================= */
/*                  FORMULAIRE ARTICLE                       */
/* ========================================================= */

const formArticle =
    document.getElementById(
        "form-article"
    );


formArticle.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const mode =
            document.getElementById(
                "mode-article"
            ).value;


        const prixValue =
            document.getElementById(
                "prixUnitaire"
            ).value;


        const articleData = {

            codArt:
                document.getElementById(
                    "codArt"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value,
            prixUnitaire:
                prixValue === ""
                    ? null
                    : parseFloat(prixValue)
        };
        try {
            if (mode === "create") {
                await createArticle(
                    articleData
                );
            } else {
                await updateArticle(
                    articleData.codArt,
                    articleData
                );
            }
            /* Actualiser la liste */
            tousLesArticles =
                await getAllArticles();
            afficherArticles(
                tousLesArticles
            );
            fermerModaleArticle();
        } catch (error) {
            console.error(error);
            afficherErreur(
                error.message ||
                "Impossible d'effectuer l'opération."
            );
        }
    }
);
/* ========================================================= */
/*                     RECHERCHE                             */
/* ========================================================= */
function filtrerArticles(
    texteRecherche
) {
    const texte =
        texteRecherche
            .toLowerCase()
            .trim();
    if (texte === "") {
        return tousLesArticles;
    }
    return tousLesArticles.filter(
        art =>
            String(art.codArt)
                .toLowerCase()
                .includes(texte)
            ||
            String(art.description)
                .toLowerCase()
                .includes(texte)
    );
}
document
    .getElementById(
        "input-recherche-articles"
    )
    .addEventListener(
        "input",
        function (event) {
            const resultats =
                filtrerArticles(
                    event.target.value
                );
            afficherArticles(
                resultats
            );
        }
    );
/* ========================================================= */
/*                     MODALE ERREUR                         */
/* ========================================================= */

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
        message ||
        "Une erreur est survenue.";


    modal.style.display = "flex";

}


function fermerErreur() {

    const modal =
        document.getElementById(
            "modal-erreur"
        );


    modal.style.display = "none";

}


document
    .getElementById(
        "btn-fermer-erreur"
    )
    .addEventListener(
        "click",
        fermerErreur
    );


/* ========================================================= */
/*                    CHARGEMENT INITIAL                     */
/* ========================================================= */

async function initPageArticles() {

    try {

        tousLesArticles =
            await getAllArticles();


        afficherArticles(
            tousLesArticles
        );


    } catch (error) {

        console.error(error);


        document.getElementById(
            "liste-articles"
        ).innerHTML = `

            <tr>
                <td
                    colspan="4"
                    class="empty-table table-error">
                    <div class="empty-icon">⚠️</div>
                    <strong>Erreur lors du chargement</strong>
                    <span>Impossible de récupérer la liste des articles.</span>
                </td>
            </tr>
        `;
    }
}
document.addEventListener(
    "DOMContentLoaded",
    initPageArticles
);