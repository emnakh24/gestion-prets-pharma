let compteurLignes = 0;
let articlesDuDepot = []; // remplace tousLesArticles, filtré par dépôt

// --- Chargement des listes déroulantes ---

async function chargerDepots() {
    const depots = await getAllDepots();
    const select = document.getElementById("depot");
    depots.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep.codDepot;
        option.textContent = dep.designation;
        select.appendChild(option);
    });
}

async function chargerEtablissements() {
    const etablissements = await getAllEtablissements();
    const select = document.getElementById("etablissement");
    etablissements.forEach(etab => {
        const option = document.createElement("option");
        option.value = etab.codEtab;
        option.textContent = etab.designation;
        select.appendChild(option);
    });
}
//-----------------------------------------------------------------

// --- Recharger les articles disponibles quand le dépôt change ---

async function chargerArticlesDuDepot(codDepot) {
    if (!codDepot) {
        articlesDuDepot = [];
        document.getElementById("lignes-container").innerHTML = "";
        return;
    }

    try {
        const stocks = await getStocksByDepot(codDepot);
        articlesDuDepot = stocks.map(stock => ({
            codArt: stock.article.codArt,
            description: stock.article.description,
            qteStock: stock.qteStock
        }));

        // On vide les lignes existantes, car elles référencent peut-être des articles d'un autre dépôt
        document.getElementById("lignes-container").innerHTML = "";
        ajouterLigne();

    } catch (error) {
        console.error(error);
        articlesDuDepot = [];
    }
}

document.getElementById("depot").addEventListener("change", function (event) {
    chargerArticlesDuDepot(event.target.value);
});

// --- Gestion dynamique des lignes ---
function getArticlesDejaChoisis() {
    const selects = document.querySelectorAll(".ligne-article");
    const choisis = [];
    selects.forEach(select => {
        if (select.value) {
            choisis.push(select.value);
        }
    });
    return choisis;
}

function construireOptionsArticles(codArtActuel) {
    const articlesChoisis = getArticlesDejaChoisis();

    let options = '<option value="">-- Choisir un article --</option>';
    articlesDuDepot.forEach(art => {
        // On garde l'option si : elle n'est pas déjà choisie ailleurs, OU c'est l'article actuellement sélectionné sur CETTE ligne
        if (!articlesChoisis.includes(art.codArt) || art.codArt === codArtActuel) {
            options += `<option value="${art.codArt}">${art.description} (stock: ${art.qteStock})</option>`;
        }
    });
    return options;
}

function rafraichirToutesLesOptions() {
    document.querySelectorAll(".ligne-article").forEach(select => {
        const valeurActuelle = select.value;
        select.innerHTML = construireOptionsArticles(valeurActuelle);
        select.value = valeurActuelle;
    });
}

function ajouterLigne() {
    if (articlesDuDepot.length === 0) {
        alert("Choisissez d'abord un dépôt qui contient des articles en stock.");
        return;
    }

    compteurLignes++;
    const ligneId = `ligne-${compteurLignes}`;

    const div = document.createElement("div");
    div.classList.add("ligne-bon");
    div.id = ligneId;

    const optionsArticles = construireOptionsArticles(null);

    div.innerHTML = `
        <select class="ligne-article" required>${optionsArticles}</select>
        <input type="number" class="ligne-quantite" min="1" placeholder="Quantité" required>
        <button type="button" class="btn-supprimer-ligne">Supprimer</button>
    `;

    document.getElementById("lignes-container").appendChild(div);

    const selectArticle = div.querySelector(".ligne-article");
    selectArticle.addEventListener("change", rafraichirToutesLesOptions);

    div.querySelector(".btn-supprimer-ligne").addEventListener("click", () => {
        div.remove();
        rafraichirToutesLesOptions();
    });
}

document.getElementById("btn-ajouter-ligne").addEventListener("click", ajouterLigne);

// --- Récupération des données du formulaire ---

function recupererLignesSaisies() {
    const lignesDiv =
        document.querySelectorAll(".ligne-bon");
    const lignes = [];
    lignesDiv.forEach(ligneDiv => {
        const codArt =
            ligneDiv.querySelector(".ligne-article").value;
        const quantite =
            ligneDiv.querySelector(".ligne-quantite").value;
        if (codArt && quantite) {
            lignes.push({
                article: {codArt: codArt},
                qtePrete: parseInt(
                    quantite,
                    10
                )
            });
        }
    });
    return lignes;
}
// --- Soumission du formulaire ---
document.getElementById("form-bon").addEventListener("submit", async function (event) {
    event.preventDefault();

    const messageEl = document.getElementById("form-message");
    const lignes = recupererLignesSaisies();

    if (lignes.length === 0) {
        messageEl.innerText = "Ajoutez au moins une ligne d'article.";
        messageEl.style.color = "red";
        return;
    }

    const bonDePret = {
            numBon:
                document.getElementById("numBon").value,
            dateBon:
                document.getElementById("dateBon").value,
            depot: {
                codDepot:
                    document.getElementById("depot").value
            },
            etablissement: {
                codEtab:
                    document.getElementById("etablissement").value
            },
            lignes: lignes
    };

    try {
        await createBonDePret(bonDePret);
        messageEl.innerText = "Bon de prêt créé avec succès !";
        messageEl.style.color = "green";
        document.getElementById("form-bon").reset();
        document.getElementById("lignes-container").innerHTML = "";
        articlesDuDepot = [];
        setTimeout(() => {
            window.location.href = "listBonDePret.html";
        }, 1000);
    } catch (error) {
        console.error("Erreur création bon de prêt :", error);
        // Afficher le message venant du backend
        afficherErreur(
            error.message || "Impossible de créer le bon de prêt."
        );
    }
});
// --- Initialisation ---
async function initFormulaire() {
    try {
        await chargerDepots();
        await chargerEtablissements();
        // Pas d'appel à ajouterLigne() ici — on attend que l'utilisateur choisisse un dépôt
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", initFormulaire);