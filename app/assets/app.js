import "./stimulus_bootstrap.js";
import "./styles/app.css";

// ── Custom cursor ──────────────────────────────────────────────
const cursor = document.createElement("div");
cursor.className = "cursor";
document.body.appendChild(cursor);

let cursorX = 0;
let cursorY = 0;
let rafId = null;

document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    if (!rafId) {
        rafId = requestAnimationFrame(() => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            rafId = null;
        });
    }
});

document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
});

document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
});

const hoverTargets = "a, button, .menu-item, .testimonial-card, .magnetic, input, label";

document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) {
        cursor.classList.add("expanded");
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) {
        cursor.classList.remove("expanded");
    }
});

// ── Magnetic buttons ───────────────────────────────────────────
document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
    });
});

// ── Header scroll + scroll progress + scroll-to-top ───────────
// Les listeners scroll sont attachés une seule fois sur window.
// Les références DOM sont relues à chaque événement (Turbo swap le body).

function onScroll() {
    const siteHeader = document.getElementById("site-header");
    const scrollProgress = document.getElementById("scrollProgress");
    const scrollTopBtn = document.getElementById("scrollTop");

    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", window.scrollY > 60);
    }

    if (scrollProgress) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
    }

    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
    }
}

window.addEventListener("scroll", onScroll, { passive: true });

// Appel immédiat à chaque navigation Turbo pour initialiser l'état
document.addEventListener("turbo:load", onScroll);

// Bouton scroll-to-top — délégation sur le document pour survivre aux swaps Turbo
document.addEventListener("click", (e) => {
    if (e.target.closest("#scrollTop")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});
