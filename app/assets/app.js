import "./stimulus_bootstrap.js";
import "./styles/app.css";

history.scrollRestoration = "manual";

// ── Custom cursor ──────────────────────────────────────────────
let cursorEl = null;
let cursorX = 0;
let cursorY = 0;
let rafId = null;

function initCursor() {
    const old = document.querySelector(".cursor");
    if (old) old.remove();

    cursorEl = document.createElement("div");
    cursorEl.className = "cursor";
    document.body.appendChild(cursorEl);
}

document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    if (!rafId) {
        rafId = requestAnimationFrame(() => {
            if (cursorEl) {
                cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            }
            rafId = null;
        });
    }
});

document.addEventListener("mouseenter", () => {
    if (cursorEl) cursorEl.style.opacity = "1";
});

document.addEventListener("mouseleave", () => {
    if (cursorEl) cursorEl.style.opacity = "0";
});

const hoverTargets = "a, button, .menu-item, .testimonial-card, .magnetic, input, label";

document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets) && cursorEl) {
        cursorEl.classList.add("expanded");
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets) && cursorEl) {
        cursorEl.classList.remove("expanded");
    }
});

// ── Magnetic buttons ───────────────────────────────────────────
function initMagnetic() {
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
}

// ── Détection de fond sombre ───────────────────────────────────
function getBgLuminance(el) {
    while (el && el !== document.documentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
            const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
            if (alpha > 0.05) {
                const [r, g, b] = [+m[1], +m[2], +m[3]].map((c) => {
                    c /= 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }
        }
        el = el.parentElement;
    }
    return 1; // fallback blanc
}

// ── Header scroll + scroll progress + scroll-to-top ───────────
function onScroll() {
    const siteHeader = document.getElementById("site-header");
    const scrollProgress = document.getElementById("scrollProgress");
    const scrollTopBtn = document.getElementById("scrollTop");

    if (siteHeader) {
        const isHome = document.body.classList.contains("page-home");
        siteHeader.classList.toggle("scrolled", !isHome || window.scrollY > 60);
    }

    if (scrollProgress) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
    }

    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 500);

        if (scrollTopBtn.classList.contains("visible")) {
            const rect = scrollTopBtn.getBoundingClientRect();
            const els = document.elementsFromPoint(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
            const behind = els.find((el) => el !== scrollTopBtn && !scrollTopBtn.contains(el));
            const luminance = behind ? getBgLuminance(behind) : 1;
            scrollTopBtn.classList.toggle("on-dark", luminance < 0.2);
        }
    }
}

window.addEventListener("scroll", onScroll, { passive: true });

// ── Mobile menu ───────────────────────────────────────────────
function toggleMobileMenu(open) {
    const burger = document.getElementById("header-burger");
    const menu = document.getElementById("header-mobile-menu");
    const header = document.getElementById("site-header");
    if (!burger || !menu) return;

    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    if (header) header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
}

function closeMobileMenu() {
    toggleMobileMenu(false);
}

function initMobileMenu() {
    const burger = document.getElementById("header-burger");
    const menu = document.getElementById("header-mobile-menu");
    if (!burger || !menu || burger.dataset.menuInit) return;
    burger.dataset.menuInit = "1";

    burger.addEventListener("click", () => {
        toggleMobileMenu(!menu.classList.contains("open"));
    });

    menu.querySelectorAll(".mobile-nav-link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    const closeBtn = document.getElementById("mobile-menu-close");
    if (closeBtn) closeBtn.addEventListener("click", closeMobileMenu);
}

// ── Initialisation à chaque navigation Turbo ──────────────────
function onTurboLoad() {
    window.scrollTo(0, 0);
    initCursor();
    initMagnetic();
    initMobileMenu();
    closeMobileMenu();
    onScroll();
}

document.addEventListener("turbo:load", onTurboLoad);

// Appel immédiat au premier chargement
onTurboLoad();

// ── Bouton scroll-to-top ───────────────────────────────────────
document.addEventListener("click", (e) => {
    if (e.target.closest("#scrollTop")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});
