const DEPOT_STOCK_API_URL ="http://localhost:8080/api/depot-stocks";

async function getAllDepotStocks() {
    const response =
        await fetch(
            DEPOT_STOCK_API_URL, { headers: {
            "Authorization": `Bearer ${getToken()}`
        }
        });
    if (!response.ok) {

        throw new Error(
            "Erreur lors de la récupération des stocks"
        );
    }
    return await response.json();
}
async function getStocksByDepot(
    codDepot
) {
    const response =
        await fetch(
                `${DEPOT_STOCK_API_URL}/depot/${codDepot}`
            , { headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
    if (!response.ok) {

        throw new Error(
            "Erreur lors de la récupération du stock du dépôt"
        );
    }
    return await response.json();
}
async function createStock(codDepot, codArt, quantite) {
    const response = await fetch(
        DEPOT_STOCK_API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                codDepot: codDepot,
                codArt: codArt,
                qteStock: quantite
            })
        }
    );
    if (!response.ok) {
        let message = "Erreur lors de la création du stock.";
        try {
            const text = await response.text();
            if (text) {
                const data = JSON.parse(text);
                if (data.message) message = data.message;
            }
        } catch (e) {
            console.error(e);
        }
        throw new Error(message);
    }
    return await response.json();
}
async function updateDepotStock(codDepot,codArt,qteStock) {

    const response =
        await fetch(
            `${DEPOT_STOCK_API_URL}/${codDepot}/${codArt}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":"application/json", "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    qteStock: qteStock
                })
            }
        );
    if (!response.ok) {
        throw new Error(
            "Erreur lors de la modification du stock"
        );
    }
    return await response.json();
}
async function deleteDepotStock(codDepot, codArt) {
    const response = await fetch(
        `${DEPOT_STOCK_API_URL}/${codDepot}/${codArt}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }
    );
    if (!response.ok) {
        let message = "Impossible de supprimer le stock.";
        try {
            const text = await response.text();
            if (text) {
                const data = JSON.parse(text);
                if (data.message) {
                    message = data.message;
                }
            }
        } catch (e) {
            console.error("Réponse non JSON :", e);
        }
        throw new Error(message);
    }
    // DELETE réussi : le backend peut ne rien retourner
    return true;
}