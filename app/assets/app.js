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

// ── Header scroll ─────────────────────────────────────────────
const siteHeader = document.getElementById("site-header");

if (siteHeader) {
    window.addEventListener(
        "scroll",
        () => {
            siteHeader.classList.toggle("scrolled", window.scrollY > 60);
        },
        { passive: true }
    );
}

// ── Scroll progress bar ────────────────────────────────────────
const scrollProgress = document.getElementById("scrollProgress");

if (scrollProgress) {
    window.addEventListener(
        "scroll",
        () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        },
        { passive: true }
    );
}

// ── Scroll to top ──────────────────────────────────────────────
const scrollTopBtn = document.getElementById("scrollTop");

if (scrollTopBtn) {
    window.addEventListener(
        "scroll",
        () => {
            scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
        },
        { passive: true }
    );

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
