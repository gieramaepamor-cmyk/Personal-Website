document.addEventListener('DOMContentLoaded', () => {

    const htmlElement = document.documentElement;
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle-btn');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.removeItem('theme');

    const introSplash = document.getElementById('intro-splash');
    const skipIntro = document.documentElement.classList.contains('skip-intro');

    if (skipIntro) {

        const savedScroll = sessionStorage.getItem('returnScrollY');
        sessionStorage.removeItem('returnScrollY');
        history.replaceState(null, '', window.location.pathname);
        if (savedScroll !== null) {
            window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        }

        document.body.classList.add('page-transition');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.classList.add('page-visible');
            });
        });
    } else if (introSplash) {

        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            introSplash.classList.add('hidden');
            document.body.style.overflow = '';
        }, 3500);
    }

    const isDetailsPage = document.body.classList.contains('project-details-page');

    const toggleMobileNav = () => {
        if (navMenu) navMenu.classList.toggle('open');
        if (mobileNavToggle) mobileNavToggle.classList.toggle('open');
    };

    const closeMobileNav = () => {
        if (navMenu) navMenu.classList.remove('open');
        if (mobileNavToggle) mobileNavToggle.classList.remove('open');
    };

    if (!isDetailsPage) {
        if (mobileNavToggle) mobileNavToggle.addEventListener('click', toggleMobileNav);

        // Removed link click and outside click listeners per user request
        // It will now only close when the mobileNavToggle (X) is clicked

        const handleScroll = () => {
            if (header) {
                if (window.scrollY > 20) {
                    header.classList.add('sticky');
                } else {
                    header.classList.remove('sticky');
                }
            }

            if (scrollToTopBtn) {
                if (window.scrollY > 500) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            }

            let currentSectionId = '';
            const sections = document.querySelectorAll('section, header');

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                if (header) {
                    if (currentSectionId === 'hero') {
                        header.classList.add('on-light-bg');
                    } else {
                        header.classList.remove('on-light-bg');
                    }
                }
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        const runHeroTypewriter = () => {
            const subtitleEl = document.getElementById('hero-subtitle');
            if (!subtitleEl) return;
            const text = "Software Engineer";
            subtitleEl.textContent = "";
            let index = 0;
            const type = () => {
                if (index < text.length) {
                    subtitleEl.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, 100);
                }
            };
            setTimeout(type, 500);
        };
        runHeroTypewriter();
    }

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                if (entry.target.classList.contains('scroll-reveal') || entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('reveal', 'appear');
                }

                if (entry.target.classList.contains('skill-card')) {
                    const fillBars = entry.target.querySelectorAll('.progress-fill');
                    fillBars.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-progress');
                        fill.style.width = targetWidth;
                    });
                }

                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of the element is visible
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal, .fade-in, .skill-card').forEach(el => {
        animationObserver.observe(el);
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterProjectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const categoryFilter = button.getAttribute('data-filter');
            
            filterProjectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                card.classList.remove('scale-in');
                
                if (categoryFilter === 'all' || cardCategory === categoryFilter) {

                    card.classList.remove('hidden');

                    void card.offsetWidth;
                    card.classList.add('scale-in');
                } else {

                    card.classList.add('hidden');
                }
            });
        });
    });

    const cards = document.querySelectorAll('.skill-card, .project-card, .cert-card, .timeline-card');
    
    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const skillTabs = document.querySelectorAll('.giera-tab');
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const panelId = 'tab-' + tab.getAttribute('data-tab');
            document.querySelectorAll('.giera-tab-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.classList.add('active');

                panel.querySelectorAll('.giera-skill-bar').forEach(bar => {
                    const pct = bar.getAttribute('data-progress');
                    bar.style.width = '0%';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            bar.style.width = pct + '%';
                        });
                    });
                });
            }
        });
    });

    const certSubtabs = document.querySelectorAll('.cert-subtab');
    certSubtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            certSubtabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-subtab');
            document.querySelectorAll('.cert-subpanel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(targetId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    const techSubtabs = document.querySelectorAll('.tech-subtab');
    techSubtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            techSubtabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-subtab');
            document.querySelectorAll('.tech-subpanel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(targetId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.giera-skill-bar').forEach(bar => {
                    const pct = bar.getAttribute('data-progress');
                    bar.style.width = pct + '%';
                });
                skillBarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.giera-tab-panel').forEach(panel => {
        skillBarObserver.observe(panel);
    });

    const initialPanel = document.querySelector('.giera-tab-panel.active');
    if (initialPanel) {
        initialPanel.querySelectorAll('.giera-skill-bar').forEach(bar => {
            setTimeout(() => { bar.style.width = bar.getAttribute('data-progress') + '%'; }, 600);
        });
    }

    const blobEls = [
        document.getElementById('aBlob1'),
        document.getElementById('aBlob2'),
        document.getElementById('aBlob3'),
        document.getElementById('aBlob4'),
    ];
    const blobBasePositions = [
        { x: -15, y: -15 },
        { x: -20, y: 10 },
        { x: 15,  y: -10 },
        { x: 10,  y: 20  },
    ];

    let rafPending = false;
    window.addEventListener('scroll', () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const scroll = window.pageYOffset;
            blobEls.forEach((blob, i) => {
                if (!blob) return;
                const base = blobBasePositions[i];
                const xOffset = Math.sin(scroll / 120 + i * 0.6) * 80;
                const yOffset = Math.cos(scroll / 120 + i * 0.6) * 40;
                blob.style.transform = `translate(${base.x + xOffset}px, ${base.y + yOffset}px) scale(1)`;
            });
            rafPending = false;
        });
    }, { passive: true });

    const agencyProjectCards = document.querySelectorAll('.agency-card');
    if (agencyProjectCards.length > 0 && !document.body.classList.contains('project-details-page')) {
        agencyProjectCards.forEach(card => {

            card.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => e.stopPropagation());
            });

            const navigateToDetails = (e) => {

                sessionStorage.setItem('returnScrollY', window.scrollY);
                document.body.classList.add('page-leaving-fast');
                setTimeout(() => {
                    window.location.href = `project-details.html?id=${card.id}`;
                }, 200); // Fast timeout
            };

            const detailsBtn = card.querySelector('.agency-card-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigateToDetails();
                });
            }
            card.addEventListener('click', navigateToDetails);
            card.style.cursor = 'pointer';
        });
    }

    const videoDemoModal = document.getElementById('video-demo-modal');
    const videoPlayer = document.getElementById('video-modal-player');
    const videoModalTitle = document.getElementById('video-modal-title');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoModalBackdrop = document.getElementById('video-modal-backdrop');

    const openVideoModal = (videoSrc, title) => {
        if (!videoDemoModal || !videoPlayer) return;
        videoModalTitle.textContent = title;
        videoPlayer.src = videoSrc;
        videoDemoModal.classList.add('active');
        videoDemoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        setTimeout(() => videoPlayer.play().catch(() => {}), 300);
    };

    const closeVideoModal = () => {
        if (!videoDemoModal || !videoPlayer) return;
        videoPlayer.pause();
        videoPlayer.src = '';
        videoDemoModal.classList.remove('active');
        videoDemoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.video-demo-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoSrc = btn.getAttribute('data-video');
            const title = btn.getAttribute('data-title');
            openVideoModal(videoSrc, title);
        });
    });

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoDemoModal && videoDemoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    const certModal = document.getElementById('certificate-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalCloseBtn = document.getElementById('cert-modal-close');
    const certModalBackdrop = certModal ? certModal.querySelector('.agency-modal-backdrop') : null;

    if (certModal) {
        document.querySelectorAll('.cert-modal-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const imgSrc = btn.getAttribute('data-img');
                if (imgSrc) {
                    certModalImg.src = imgSrc;
                    certModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeCertModal = () => {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertModal);
        if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) closeCertModal();
        });
    }

    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('form-name').value.trim();
            const email   = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();
            const submitBtn = document.getElementById('contact-submit-btn');
            
            if (submitBtn) {
                submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
            }

            // Using FormSubmit for direct email sending without backend
            fetch("https://formsubmit.co/ajax/gieramaegpamor@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _subject: subject,
                    message: message,
                    _template: "table"
                })
            })
            .then(response => response.json())
            .then(data => {
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>Sent Successfully!</span><i class="fa-solid fa-check"></i>';
                    submitBtn.style.background = 'var(--success-color, #4CAF50)';
                    submitBtn.style.borderColor = 'var(--success-color, #4CAF50)';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
                        submitBtn.style.background = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                }
            })
            .catch(error => {
                console.error("Error sending message:", error);
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>Failed to send</span><i class="fa-solid fa-xmark"></i>';
                    submitBtn.style.background = '#e74c3c';
                    submitBtn.style.borderColor = '#e74c3c';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
                        submitBtn.style.background = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        });
    }
});
