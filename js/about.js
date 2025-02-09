document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash === "#projects") {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            setTimeout(() => {
                projectsSection.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100); // Небольшая задержка, чтобы браузер учел стандартное поведение якоря
        }
    }
});
