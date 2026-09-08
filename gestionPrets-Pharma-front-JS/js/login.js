document.getElementById("form-login").addEventListener("submit", async function (event) {
    event.preventDefault();

    const messageEl = document.getElementById("login-message");
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        await login(username, password);
        window.location.href = "DashBoard.html";
    } catch (error) {
        messageEl.innerText = "Identifiants incorrects.";
        messageEl.style.color = "red";
    }
});