import './stimulus_bootstrap.js';
import './styles/app.css';

const header = document.querySelector('.site-header');

if (header) {
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}
