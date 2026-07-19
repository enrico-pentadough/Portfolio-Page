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