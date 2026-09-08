const BON_API_URL = "http://localhost:8080/api/ligneBon";
//---------------------------------------------------------
async function createLigneBonDePret(ligneBonDePret) {
    const response = await fetch(BON_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}`},
        body: JSON.stringify(ligneBonDePret)
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la création du ligne bon de prêt");
    }
    return await response.json();
}
//---------------------------------------------------------
async function getLignesBonByNumBon(numBon) {
    const response = await fetch(`${BON_API_URL}/${numBon}`, headers: {
            "Authorization": `Bearer ${getToken()}`
        });
    if (!response.ok) {
        throw new Error("les lignes Bon de prêt non trouvé");
    }
    return await response.json();
}
//---------------------------------------------------------
