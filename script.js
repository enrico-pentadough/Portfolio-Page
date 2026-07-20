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

    // ===== Timeline: hover, click, and keyboard navigation =====
    const timelineDots = Array.from(document.querySelectorAll('.timeline-dot'));
    const panel = document.getElementById('timeline-panel');
    const panelTitle = document.getElementById('timeline-panel-title');
    const panelDate = document.getElementById('timeline-panel-date');
    const panelDesc = document.getElementById('timeline-panel-description');

    if (timelineDots.length && panel) {
        let activeIndex = null;

        function showDot(index) {
            timelineDots.forEach((d) => d.classList.remove('is-active'));
            const dot = timelineDots[index];
            dot.classList.add('is-active');
            activeIndex = index;

            panel.classList.add('fade-out');
            setTimeout(() => {
                panelTitle.textContent = dot.dataset.title;
                panelDate.textContent = dot.dataset.date;
                panelDesc.textContent = dot.dataset.description;
                panel.classList.remove('fade-out');
            }, 150);
        }

        timelineDots.forEach((dot, index) => {
            dot.addEventListener('mouseenter', () => showDot(index));
            dot.addEventListener('click', () => {
                showDot(index);
                dot.focus();
            });
            dot.addEventListener('focus', () => showDot(index));
        });

        // Keyboard arrow navigation between dots
        timelineDots.forEach((dot, index) => {
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' && index < timelineDots.length - 1) {
                    e.preventDefault();
                    timelineDots[index + 1].focus();
                } else if (e.key === 'ArrowLeft' && index > 0) {
                    e.preventDefault();
                    timelineDots[index - 1].focus();
                }
            });
        });
    }

    // ===== Projects gallery modal =====
    const projectTiles = document.querySelectorAll('.project-tile');
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('project-modal-close');
    const modalImg = document.getElementById('project-modal-img');
    const modalTitle = document.getElementById('project-modal-title');
    const modalDesc = document.getElementById('project-modal-description');
    const modalGithub = document.getElementById('project-modal-github');
    const modalDocs = document.getElementById('project-modal-docs');

    if (projectTiles.length && projectModal) {
        projectTiles.forEach((tile) => {
            tile.addEventListener('click', () => {
                const img = tile.querySelector('img');
                modalImg.src = img.src; // reuses the same thumbnail image
                modalImg.alt = img.alt;
                modalTitle.textContent = tile.dataset.title;
                modalDesc.textContent = tile.dataset.description;

                // GitHub link: only show if a URL was provided
                if (tile.dataset.github) {
                    modalGithub.href = tile.dataset.github;
                    modalGithub.style.display = 'inline-block';
                } else {
                    modalGithub.style.display = 'none';
                }

                // Docs link: only show if a URL was provided
                if (tile.dataset.docs) {
                    modalDocs.href = tile.dataset.docs;
                    modalDocs.style.display = 'inline-block';
                } else {
                    modalDocs.style.display = 'none';
                }

                projectModal.classList.add('is-open');
            });
        });

        function closeModal() {
            projectModal.classList.remove('is-open');
        }

        modalClose.addEventListener('click', closeModal);

        // Click outside the content box to close
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
                closeModal();
            }
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