const API_BASE_URL = "http://localhost:8080/api/etablissements";
//****************************Etablissement **************************************** */
// Récupérer tous les établissements
async function getAllEtablissements() {
    const response = await fetch(API_BASE_URL, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des établissements");
    }
    return await response.json();
}
// Récupérer un établissement par son code
async function getEtablissementById(codEtab) {
    const response = await fetch(`${API_BASE_URL}/${codEtab}`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) {
        throw new Error("Établissement non trouvé");
    }
    return await response.json();
}

// Créer un nouvel établissement
async function createEtablissement(etablissement) {

    const response = await fetch(
        API_BASE_URL
        ,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },

            body: JSON.stringify(etablissement)
        }
    );

    if (!response.ok) {

        let message =
            "Erreur lors de la création de l'établissement.";

        try {
            const data = await response.json();

            if (data.message) {
                message = data.message;
            }
        } catch (e) {
            console.error(e);
        }
        throw new Error(message);
    }
    return await response.json();
}

// Modifier un établissement existant
async function updateEtablissement(codEtab, etablissement) {
    const response = await fetch(`${API_BASE_URL}/${codEtab}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json","Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(etablissement)
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la modification de l'établissement");
    }
    return await response.json();
}

// Supprimer un établissement
async function deleteEtablissement(codEtab) {
    const response = await fetch(`${API_BASE_URL}/${codEtab}`, {
        method: "DELETE", headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'établissement");
    }
}