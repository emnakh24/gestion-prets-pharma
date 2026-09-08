let tousLesBons = [];


// =====================================================
// AFFICHAGE DES BONS DANS LE TABLEAU
// =====================================================
function afficherBons(bons) {

    const container = document.getElementById("liste-bons");

    let corpsHTML = "";

    if (bons.length === 0) {

        corpsHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    <div class="empty-icon">🗂️</div>
                    <strong>Aucun bon de prêt trouvé</strong>
                    <span>Essayez une autre recherche ou créez un nouveau bon.</span>
                </td>
            </tr>
        `;

    } else {

        corpsHTML = bons.map(bon => {

            const listeArticles = bon.lignes
                .map(ligne =>
                    `${ligne.article.description} (x${ligne.qtePrete})`
                )
                .join("<br>");

            return `

                <tr>

                    <td>
                        <span class="code-badge">${bon.numBon}</span>
                    </td>

                    <td class="text-cell">
                        ${bon.dateBon}
                    </td>

                    <td>
                        <div class="designation-cell">
                            ${bon.depot.designation}
                        </div>
                    </td>

                    <td>
                        <div class="designation-cell">
                            ${bon.etablissement.designation}
                        </div>
                    </td>

                    <td class="articles-cell">
                        ${listeArticles}
                    </td>

                    <td class="col-actions actions-cell">

                        <button
                            type="button"
                            class="table-btn btn-consulter"
                            data-code="${bon.numBon}">
                            👁 Consulter
                        </button>

                        <button
                            type="button"
                            class="table-btn btn-imprimer"
                            data-code="${bon.numBon}">
                            🖨 Imprimer
                        </button>

                    </td>
                </tr>

            `;

        }).join("");
    }

    container.innerHTML = `

        <div class="table-section">

            <div class="table-header">

                <div>
                    <h2>Liste des bons de prêt</h2>
                    <p class="table-subtitle">
                        Suivi des articles prêtés par dépôt et établissement
                    </p>
                </div>

                <span class="count-badge">
                    ${bons.length} bon${bons.length > 1 ? "s" : ""}
                </span>

            </div>

            <div class="table-container">

                <table class="data-table">

                    <thead>
                        <tr>
                            <th>N° Bon</th>
                            <th>Date</th>
                            <th>Dépôt</th>
                            <th>Établissement</th>
                            <th>Articles</th>
                            <th class="col-actions">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${corpsHTML}
                    </tbody>

                </table>

            </div>

        </div>

    `;

    attacherEvenementsBons();
}



// =====================================================
// EVENEMENTS DES BOUTONS
// =====================================================
function attacherEvenementsBons() {

    document
        .querySelectorAll(".btn-consulter")
        .forEach(btn => {

            btn.addEventListener("click", function () {

                const numBon = this.dataset.code;

                consulterBon(numBon);
            });

        });


    document
        .querySelectorAll(".btn-imprimer")
        .forEach(btn => {

            btn.addEventListener("click", function () {

                const numBon = this.dataset.code;

                imprimerBon(numBon);
            });

        });
}

// =====================================================
// CONSULTER UN BON
// =====================================================

function consulterBon(numBon) {

    const bon = tousLesBons.find(
        b => String(b.numBon) === String(numBon)
    );


    if (!bon) {

        console.error("Bon introuvable :", numBon);

        return;
    }


    const details = document.getElementById("details-bon");


    let lignesHTML = "";


    if (bon.lignes && bon.lignes.length > 0) {

        lignesHTML = `

            <h3>Articles prêtés</h3>

            <table class="details-table">

                <thead>

                    <tr>
                        <th>Article</th>
                        <th>Quantité</th>
                    </tr>

                </thead>

                <tbody>

                    ${bon.lignes.map(ligne => `

                        <tr>

                            <td>
                                ${ligne.article.description}
                            </td>

                            <td>
                                ${ligne.qtePrete}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        `;

    } else {

        lignesHTML = `
            <p>Aucun article dans ce bon.</p>
        `;
    }


    details.innerHTML = `

        <div class="bon-info">

            <p>
                <strong>Numéro du bon :</strong>
                ${bon.numBon}
            </p>

            <p>
                <strong>Date :</strong>
                ${bon.dateBon}
            </p>

            <p>
                <strong>Dépôt :</strong>
                ${bon.depot
                    ? bon.depot.designation
                    : "Non défini"}
            </p>

            <p>
                <strong>Établissement :</strong>
                ${bon.etablissement
                    ? bon.etablissement.designation
                    : "Non défini"}
            </p>

        </div>

        ${lignesHTML}

    `;


    document.getElementById(
        "modal-consultation"
    ).style.display = "flex";

}



// =====================================================
// FERMER LA MODALE DE CONSULTATION
// =====================================================

function fermerConsultation() {

    document.getElementById(
        "modal-consultation"
    ).style.display = "none";

}


document
    .getElementById("btn-fermer-consultation")
    .addEventListener(
        "click",
        fermerConsultation
    );



// Fermer en cliquant sur l'extérieur

document
    .getElementById("modal-consultation")
    .addEventListener("click", function(event) {

        if (event.target.id === "modal-consultation") {

            fermerConsultation();

        }

    });



// =====================================================
// IMPRIMER UN BON
// =====================================================

function imprimerBon(numBon) {

    const bon = tousLesBons.find(
        b => String(b.numBon) === String(numBon)
    );


    if (!bon) {

        console.error("Bon introuvable :", numBon);

        return;
    }


    let lignesHTML = "";


    if (bon.lignes && bon.lignes.length > 0) {

        lignesHTML = bon.lignes.map(ligne => `

            <tr>

                <td>
                    ${ligne.article.description}
                </td>

                <td>
                    ${ligne.article.codArt}
                </td>

                <td>
                    ${ligne.qtePrete}
                </td>

            </tr>

        `).join("");

    }


    const contenuImpression = `

<!DOCTYPE html>

<html lang="fr">

<head>

<meta charset="UTF-8">

<title>Bon de prêt ${bon.numBon}</title>

<style>

    body {

        font-family: Arial, sans-serif;

        margin: 40px;

        color: #222;

    }


    .header {

        text-align: center;

        margin-bottom: 35px;

    }


    .header h1 {

        margin-bottom: 5px;

        font-size: 24px;

    }


    .header p {

        color: #666;

    }


    .infos {

        border: 1px solid #ccc;

        padding: 20px;

        margin-bottom: 25px;

        border-radius: 8px;

    }


    .infos p {

        margin: 8px 0;

    }


    table {

        width: 100%;

        border-collapse: collapse;

        margin-top: 20px;

    }


    th,
    td {

        border: 1px solid #ccc;

        padding: 12px;

        text-align: left;

    }


    th {

        background: #f2f2f2;

    }


    .signatures {

        display: flex;

        justify-content: space-between;

        margin-top: 80px;

    }


    .signature {

        width: 40%;

        text-align: center;

    }


    .signature-line {

        margin-top: 60px;

        border-top: 1px solid #222;

    }


    @media print {

        body {

            margin: 20px;

        }

    }

</style>

</head>


<body>


<div class="header">

    <h1>BON DE PRÊT</h1>

    <p>Numéro : <strong>${bon.numBon}</strong></p>

</div>


<div class="infos">

    <p>
        <strong>Date :</strong>
        ${bon.dateBon}
    </p>

    <p>
        <strong>Dépôt :</strong>
        ${bon.depot
            ? bon.depot.designation
            : "Non défini"}
    </p>

    <p>
        <strong>Établissement bénéficiaire :</strong>
        ${bon.etablissement
            ? bon.etablissement.designation
            : "Non défini"}
    </p>

</div>
<h3>Articles prêtés</h3>
<table>

    <thead>

        <tr>

            <th>Article</th>

            <th>Code article</th>

            <th>Quantité prêtée</th>

        </tr>

    </thead>


    <tbody>

        ${lignesHTML}

    </tbody>

</table>


<div class="signatures">

    <div class="signature">

        <strong>Établissement prêteur</strong>

        <div class="signature-line"></div>

        Signature

    </div>


    <div class="signature">

        <strong>Établissement bénéficiaire</strong>

        <div class="signature-line"></div>

        Signature

    </div>

</div>
</body>

</html>

`;


    // Création d'une nouvelle fenêtre

    const fenetre = window.open(
        "",
        "_blank",
        "width=900,height=700"
    );


    fenetre.document.write(contenuImpression);

    fenetre.document.close();


    // Attendre le chargement puis imprimer

    fenetre.onload = function() {

        fenetre.focus();

        fenetre.print();

    };

}



// =====================================================
// RECHERCHE
// =====================================================

function filtrerBons(texteRecherche) {

    const texte =
        texteRecherche
            .toLowerCase()
            .trim();


    if (texte === "") {

        return tousLesBons;

    }


    return tousLesBons.filter(bon => {

        const numero =
            String(bon.numBon || "")
                .toLowerCase();


        const depot =
            bon.depot
                ? String(bon.depot.designation || "")
                    .toLowerCase()
                : "";


        const etablissement =
            bon.etablissement
                ? String(bon.etablissement.designation || "")
                    .toLowerCase()
                : "";


        return (

            numero.includes(texte) ||

            depot.includes(texte) ||

            etablissement.includes(texte)

        );

    });

}


document
    .getElementById("input-recherche-bons")
    .addEventListener("input", function(event) {

        const resultats =
            filtrerBons(event.target.value);

        afficherBons(resultats);

    });



// =====================================================
// CHARGEMENT INITIAL
// =====================================================

async function initPageListe() {

    try {

        tousLesBons =
            await getAllBonsDePret();

        afficherBons(tousLesBons);

    } catch (error) {

        console.error(error);

        document.getElementById("liste-bons").innerHTML = `

            <div class="table-section">

                <div class="table-container">

                    <table class="data-table">

                        <tbody>

                            <tr>
                                <td class="empty-table table-error">
                                    <div class="empty-icon">⚠️</div>
                                    <strong>Erreur lors du chargement</strong>
                                    <span>Impossible de récupérer les bons de prêt.</span>
                                </td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        `;

    }

}

document.addEventListener(
    "DOMContentLoaded",
    initPageListe
);