document.addEventListener('DOMContentLoaded', function () {

    // ===== Homepage "Click me" button =====
    const funButton = document.getElementById('fun-button');
    const funMessage = document.getElementById('fun-message');
    if (funButton) {
        funButton.addEventListener('click', function () {
            funMessage.textContent = "Thanks for clicking! Replace this with something fun.";
        });
    }

    // ===== Contact form feedback =====
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            formFeedback.textContent = "Thanks! (This is a placeholder — hook this up to a real backend or form service later.)";
        });
    }

    // ===== Experience carousel =====
    const track = document.querySelector('.experience-track');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');
    const cards = Array.from(document.querySelectorAll('.experience-card'));

    if (track && leftBtn && rightBtn && cards.length) {
        const middleIndex = Math.floor(cards.length / 2); // e.g. 3 cards -> index 1
        let currentIndex = middleIndex;

        function goToCard(index) {
            if (index < 0 || index >= cards.length) return;
            currentIndex = index;
            cards[currentIndex].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }

        leftBtn.addEventListener('click', () => goToCard(currentIndex - 1));
        rightBtn.addEventListener('click', () => goToCard(currentIndex + 1));

        // Focus/blur tracking — also keeps currentIndex in sync if user swipes/drags manually
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        cards.forEach((card) => card.classList.remove('is-active'));
                        entry.target.classList.add('is-active');
                        currentIndex = cards.indexOf(entry.target);
                    }
                });
            },
            {
                root: track,
                threshold: [0.6],
            }
        );

        cards.forEach((card) => observer.observe(card));
        cards[middleIndex].classList.add('is-active');

        // Scroll the middle card into center position on page load, without affecting page scroll
        window.addEventListener('load', () => {
            const card = cards[middleIndex];
            const targetScrollLeft =
                card.offsetLeft - (track.clientWidth / 2) + (card.clientWidth / 2);
            track.scrollLeft = targetScrollLeft;
        });
    }

    // ===== Timeline hover description swap =====
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineDescText = document.getElementById('timeline-description-text');

    if (timelineItems.length && timelineDescText) {
        timelineItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                timelineDescText.classList.add('fade-out');
                setTimeout(() => {
                    timelineDescText.textContent = item.dataset.description;
                    timelineDescText.classList.remove('fade-out');
                }, 200);
            });
        });
    }

    // ===== Mobile nav dropdown toggle =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('is-open');
        });
    }
});