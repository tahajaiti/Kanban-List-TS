import anime from './animejs/lib/anime.es.js';
export const display = (target, open, close) => {
    open.addEventListener('click', () => {
        if (target) {
            anime({
                targets: target,
                opacity: [0, 1],
                duration: 250,
                easing: 'linear',
                begin: () => {
                    target.style.display = 'flex';
                }
            });
        }
    });
    close.addEventListener('click', () => {
        anime({
            target: target,
            opacity: [0, 1],
            duration: 250,
            easing: 'linear',
            complete: () => {
                target.style.display = 'none';
            }
        });
    });
};
