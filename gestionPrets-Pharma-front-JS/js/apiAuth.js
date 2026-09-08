const AUTH_API_URL = "http://localhost:8080/api/auth";

async function login(username, password) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Identifiants incorrects");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    return data;
}
//---------------------------------------------
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}
//---------------------------------------------
function getToken() {
    return localStorage.getItem("token");
}

function isConnecte() {
    return getToken() !== null;
}

function protegerPage() {
    if (!isConnecte()) {
        window.location.href = "login.html";
    }
}