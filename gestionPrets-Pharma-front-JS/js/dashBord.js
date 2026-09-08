const mobileMenu = document.querySelector(".mobile-menu");
const sidebar = document.querySelector(".sidebar");

mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});
/* ================= SEARCH ================= */
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
