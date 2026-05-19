import './stimulus_bootstrap.js';
import './styles/app.css';

const header = document.querySelector('.site-header');
const scrollProgressBar = document.getElementById('scrollProgress');

if (header) {
    const onScroll = () => {
        const isScrolled = window.scrollY > 60;
        header.classList.toggle('scrolled', isScrolled);
        if (scrollProgressBar) {
            scrollProgressBar.style.top = isScrolled ? '58px' : '80px';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

const scrollProgress = document.getElementById('scrollProgress');

if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    }, { passive: true });
}

const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
