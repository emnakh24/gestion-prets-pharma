const DEPOT_API_URL = "http://localhost:8080/api/depots";

async function getAllDepots() {
    const response = await fetch(DEPOT_API_URL, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des dépôts");
    }
    return await response.json();
}

async function getDepotById(codDepot) {
    const response = await fetch(`${DEPOT_API_URL}/${codDepot}`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    if (!response.ok) {
        throw new Error("Dépôt non trouvé");
    }
    return await response.json();
}

async function createDepot(depot) {
    const response = await fetch(
        DEPOT_API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(depot)
        }
    );
    if (!response.ok) {
        let message =
            "Erreur lors de la création du dépôt.";
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

async function updateDepot(codDepot, depot) {
    const response = await fetch(`${DEPOT_API_URL}/${codDepot}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${getToken()}`},
        body: JSON.stringify(depot)
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la modification du dépôt");
    }
    return await response.json();
}

async function deleteDepot(codDepot) {
    const response = await fetch(`${DEPOT_API_URL}/${codDepot}`, {
        method: "DELETE",headers: {"Authorization": `Bearer ${getToken()}`}
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression du dépôt");
    }
}