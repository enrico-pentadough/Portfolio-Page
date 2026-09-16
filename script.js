document.addEventListener('DOMContentLoaded', function () {

    // Rotating tagline
    const tagline = document.getElementById('rotating-tagline');
    const taglinePhrases = [
        "— Aspiring hybrid computer engineer —",
        "— Cheminformatics and Bioinformatics researcher —",
        "— AI/ML enthusiast —",
        "— Robotics & software builder —"
    ];

    if (tagline) {
        let taglineIndex = 0;

        setInterval(() => {
            tagline.style.opacity = 0;

            setTimeout(() => {
                taglineIndex = (taglineIndex + 1) % taglinePhrases.length;
                tagline.textContent = taglinePhrases[taglineIndex];
                tagline.style.opacity = 1;
            }, 400); // matches the CSS transition duration below
        }, 3000); // how long each phrase stays visible
    }

    // Homepage "Click me" button
    const funButton = document.getElementById('fun-button');
    const funMessage = document.getElementById('fun-message');
    if (funButton) {
        funButton.addEventListener('click', function () {
            funMessage.textContent = "Thanks for clicking! Replace this with something fun.";
        });
    }

    // Contact form feedback
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            formFeedback.textContent = "Thanks! (This is a placeholder — hook this up to a real backend or form service later.)";
        });
    }

    // Experience carousel
    const track = document.querySelector('.experience-track');
    const cards = Array.from(document.querySelectorAll('.experience-card'));


    if (track && cards.length) {
        const middleIndex = Math.floor(cards.length / 2);
        let currentIndex = middleIndex;

        function setActiveCard(card) {
            cards.forEach((item) => {
                item.classList.remove('is-active');
            });

            card.classList.add('is-active');
            currentIndex = cards.indexOf(card);
        }

        function updateActiveCard() {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;

            let closestCard = cards[0];
            let closestDistance = Infinity;

            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(cardCenter - trackCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCard = card;
                }
            });

            setActiveCard(closestCard);
        }

        setActiveCard(cards[middleIndex]);

        let scrollTimeout;

        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                updateActiveCard();
            }, 50);
        });

        window.addEventListener('load', () => {
            const card = cards[middleIndex];

            const targetScrollLeft =
                card.offsetLeft -
                (track.clientWidth / 2) +
                (card.clientWidth / 2);

            track.scrollTo({
                left: targetScrollLeft,
                behavior: 'auto'
            });

            setActiveCard(card);

            setTimeout(() => {
                updateActiveCard();
            }, 100);
        });

        window.addEventListener('resize', () => {
            updateActiveCard();
        });
    }

    // timeline: hover, click, and keyboard navigation
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

        // keyboard arrow navigation between dots
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

    // Projects gallery
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

                // gitHub link: only show if a URL was provided
                if (tile.dataset.github) {
                    modalGithub.href = tile.dataset.github;
                    modalGithub.style.display = 'inline-block';
                } else {
                    modalGithub.style.display = 'none';
                }

                // docs link: only show if a URL was provided
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

        // click outside the content box to close
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });

        // escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    // Mobile nav dropdown toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('is-open');
        });
    }

    // Organizations: logo carousel driving photo + text on the right
    const orgTrack = document.getElementById('org-logo-track');
    const orgItems = Array.from(document.querySelectorAll('.org-logo-item'));
    const orgLeftBtn = document.getElementById('org-logo-left');
    const orgRightBtn = document.getElementById('org-logo-right');
    const orgPhoto = document.getElementById('org-photo');
    const orgName = document.getElementById('org-name');
    const orgRole = document.getElementById('org-role');
    const orgDesc = document.getElementById('org-description');

    if (orgTrack && orgItems.length) {
        let currentOrgIndex = 0;

        function applyOrgData(item) {
            orgPhoto.style.opacity = 0;
            orgName.style.opacity = 0;
            orgRole.style.opacity = 0;
            orgDesc.style.opacity = 0;

            setTimeout(() => {
                orgPhoto.src = item.dataset.photo;
                orgName.textContent = item.dataset.name;
                orgRole.textContent = item.dataset.role;
                orgDesc.textContent = item.dataset.description;
                orgPhoto.style.opacity = 1;
                orgName.style.opacity = 1;
                orgRole.style.opacity = 1;
                orgDesc.style.opacity = 1;
            }, 150);
        }

        function updateActiveOrg() {
            const trackRect = orgTrack.getBoundingClientRect();
            const center = trackRect.left + trackRect.width / 2;

            let closestIndex = 0;
            let closestDist = Infinity;

            orgItems.forEach((item, i) => {
                const r = item.getBoundingClientRect();
                const c = r.left + r.width / 2;
                const dist = Math.abs(c - center);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIndex = i;
                }
            });

            if (closestIndex !== currentOrgIndex) {
                currentOrgIndex = closestIndex;
                applyOrgData(orgItems[closestIndex]);
            }

            orgItems.forEach((item, i) => item.classList.toggle('is-active', i === closestIndex));
        }

        let orgScrollTimeout;
        orgTrack.addEventListener('scroll', () => {
            clearTimeout(orgScrollTimeout);
            orgScrollTimeout = setTimeout(updateActiveOrg, 50);
        });

        orgItems.forEach((item, i) => {
            item.addEventListener('click', () => {
                item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
        });

        orgLeftBtn.addEventListener('click', () => {
            if (currentOrgIndex > 0) {
                orgItems[currentOrgIndex - 1].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });

        orgRightBtn.addEventListener('click', () => {
            if (currentOrgIndex < orgItems.length - 1) {
                orgItems[currentOrgIndex + 1].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });
    }
});