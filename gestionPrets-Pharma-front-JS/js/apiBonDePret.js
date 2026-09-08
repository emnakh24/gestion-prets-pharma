const BON_API_URL = "http://localhost:8080/api/bonDePret";
//--------------------------------------------------------------------------------
async function getAllBonsDePret() {
    const response = await fetch(BON_API_URL, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des bons de prêt");
    }
    return await response.json();
}
//--------------------------------------------------------------------------------
async function getBonDePretById(numBon) {
    const response = await fetch(`${BON_API_URL}/${numBon}`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    if (!response.ok) {
        throw new Error("Bon de prêt non trouvé");
    }
    return await response.json();
}
//--------------------------------------------------------------------------------
async function createBonDePret(bonDePret) {
    const response = await fetch(
        BON_API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(bonDePret)
        }
    );
    if (!response.ok) {
        let message =
            "Erreur lors de la création du bon de prêt.";
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
//--------------------------------------------------------------------------------
