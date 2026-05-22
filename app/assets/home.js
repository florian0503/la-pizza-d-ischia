// ── Process sticky scroll ──────────────────────────────────────
let processInterval = null;

function initProcess() {
    if (processInterval) {
        clearInterval(processInterval);
        processInterval = null;
    }

    const panelsEl = document.getElementById("processPanels");
    const img = document.getElementById("processImg");
    const roman = document.getElementById("processRoman");

    if (!panelsEl || !img) return;

    const panelEls = panelsEl.querySelectorAll(".panel");
    const romans = ["<em>i</em>", "<em>ii</em>", "<em>iii</em>", "<em>iv</em>"];
    const images = [
        "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900&q=80",
        "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=900&q=80",
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=900&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
    ];

    let currentIdx = 0;

    processInterval = setInterval(function () {
        let activeIdx = 0;
        const threshold = window.innerHeight * 0.6;

        panelEls.forEach(function (p, i) {
            if (p.getBoundingClientRect().top <= threshold) {
                activeIdx = i;
            }
        });

        if (activeIdx !== currentIdx) {
            currentIdx = activeIdx;
            img.classList.add("process-img--fade");
            setTimeout(function () {
                img.src = images[activeIdx];
                if (roman) roman.innerHTML = romans[activeIdx];
                img.classList.remove("process-img--fade");
            }, 250);
        }
    }, 100);
}

// ── Scroll animations ──────────────────────────────────────────
let animEls = [];

function buildAnimEls() {
    animEls = Array.from(
        document.querySelectorAll(".fade-up, .reveal-clip, .reveal-lines, .stagger")
    );
}

function revealOnScroll() {
    const wh = window.innerHeight;

    animEls.forEach((el) => {
        if (el.classList.contains("in")) return;
        if (el.getBoundingClientRect().top < wh - 40) {
            el.classList.add("in");
        }
    });
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("resize", revealOnScroll, { passive: true });

// ── Counter animation ──────────────────────────────────────────
let counterObs = null;

function initCounters() {
    if (counterObs) {
        counterObs.disconnect();
        counterObs = null;
    }

    counterObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll("[data-count]").forEach((el) => counterObs.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (!target) return;

    const duration = 1800;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("fr-FR");
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// ── Init à chaque navigation Turbo ────────────────────────────
document.addEventListener("turbo:load", () => {
    initProcess();
    buildAnimEls();
    revealOnScroll();
    initCounters();
});

// Premier chargement
initProcess();
buildAnimEls();
revealOnScroll();
initCounters();
