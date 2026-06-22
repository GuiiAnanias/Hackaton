(function () {
    const key = "admin-theme";
    const root = document.documentElement;
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

    function getInitialTheme() {
        const savedTheme = localStorage.getItem(key);

        if (savedTheme === "dark" || savedTheme === "light") {
            return savedTheme;
        }

        if (media && media.matches) {
            return "dark";
        }

        return "light";
    }

    function applyTheme(theme) {
        const darkMode = theme === "dark";

        root.classList.toggle("dark-mode", darkMode);

        if (document.body) {
            document.body.classList.toggle("dark-mode", darkMode);
        }

        document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
            const label = button.querySelector("[data-theme-label]");
            const icon = button.querySelector("[data-theme-icon]");

            button.setAttribute("aria-pressed", darkMode ? "true" : "false");

            if (label) {
                label.textContent = darkMode ? "Modo claro" : "Modo escuro";
            }

            if (icon) {
                icon.textContent = darkMode ? "☀️" : "🌙";
            }
        });
    }

    applyTheme(getInitialTheme());

    document.addEventListener("DOMContentLoaded", function () {
        applyTheme(getInitialTheme());

        document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
            button.addEventListener("click", function () {
                const nextTheme = root.classList.contains("dark-mode") ? "light" : "dark";

                localStorage.setItem(key, nextTheme);
                applyTheme(nextTheme);
            });
        });
    });
}());
