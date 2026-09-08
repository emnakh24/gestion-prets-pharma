const ARTICLE_API_URL = "http://localhost:8080/api/articles";

// ===============================
// GET ALL
// ===============================
async function getAllArticles() {

    const response = await fetch(ARTICLE_API_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des articles");
    }

    return await response.json();
}

// ===============================
// GET BY ID
// ===============================

async function getArticleById(codArt) {

    const response = await fetch(`${ARTICLE_API_URL}/${codArt}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        throw new Error("Article non trouvé");
    }

    return await response.json();
}


// ===============================
// CREATE
// ===============================
async function createArticle(article) {

    const response = await fetch(ARTICLE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(article)
    });
//ici repnse.ok retourne false sile backend envoie une erreurde conflit 
//mil exception 
    if (!response.ok) {
//alors elle va recuperer l'objet json 
//{
    //"message": "Le code article ART001 existe déjà."
//}
        const erreur = await response.json();
//puis transforme le message backend en erreur js
        throw new Error(
            erreur.message || "Erreur lors de la création de l'article"
        );
    }
    return await response.json();
}
// ===============================
// UPDATE
// ===============================
async function updateArticle(codArt, article) {
    const response = await fetch(`${ARTICLE_API_URL}/${codArt}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(article)
    });

    if (!response.ok) {
        const erreur = await response.text();
        console.error("Erreur PUT :", response.status, erreur);
        throw new Error(erreur || "Erreur lors de la modification");
    }

    return await response.json();
}
// ===============================
// DELETE
// ===============================

async function deleteArticle(codArt) {
    const response = await fetch(`${ARTICLE_API_URL}/${codArt}`, {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) {
        const erreurTexte = await response.text();
        throw new Error(
            erreurTexte || "Erreur lors de la suppression de l'article"
        );
    }
}