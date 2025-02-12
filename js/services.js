document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceContents = document.querySelectorAll('.service-details');
    const ctaButtons = document.querySelectorAll('.cta-button');
    const mainNav = document.querySelector('nav.main-nav');
    const nav = document.querySelector('nav');
    const servicesNav = document.querySelector('.services-nav');

    let activeService = document.querySelector('.service-item.active');

    function switchService(targetService) {
        if (!targetService) return;

        const serviceId = targetService.dataset.service;
        const targetContent = document.getElementById(serviceId);
        if (!targetContent) return;

        gsap.to(serviceContents, {
            duration: 0.3,
            opacity: 0,
            y: 20,
            onComplete: () => {
                serviceItems.forEach(item => item.classList.remove('active'));
                serviceContents.forEach(content => content.classList.remove('active'));

                targetService.classList.add('active');
                targetContent.classList.add('active');

                gsap.fromTo(targetContent, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });

                const targetImage = targetContent.querySelector('.service-image');
                if (targetImage) {
                    gsap.fromTo(targetImage, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.2 });
                }

                activeService = targetService;

                if (loader) {
                    loader.style.display = 'none';
                }
            }
        });
    }

    if (loader) {
        loader.style.display = 'flex';
    }

    serviceItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            if (this === activeService) return;
            switchService(this);

            if (window.innerWidth < 768) {
                const serviceContent = document.querySelector('.service-content');
                if (serviceContent) {
                    window.scrollTo({ top: serviceContent.offsetTop - 100, behavior: 'smooth' });
                }
            }
        });
    });

    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.dataset.serviceType) {
                showModal(this.dataset.serviceType);
            }
        });
    });

    document.querySelectorAll('.service-image').forEach(img => {
        img.addEventListener('mousemove', (e) => {
            const rect = img.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * 10 - 5;
            const y = (e.clientY - rect.top) / rect.height * 10 - 5;
            img.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
        });

        img.addEventListener('mouseleave', () => {
            img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    const observerOptions = { threshold: 0.1, rootMargin: '0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-details').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        observer.observe(el);
    });

    if (mainNav) {
        window.addEventListener('scroll', () => {
            mainNav.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    function showModal(serviceType) {
        console.log(`Открыть модалку для: ${serviceType}`);
    }

    function updateServicesNavTop() {
        if (nav && servicesNav) {
            servicesNav.style.top = `${nav.offsetHeight + 32}px`;
        }
    }

    updateServicesNavTop();
    window.addEventListener('resize', updateServicesNavTop);

    setTimeout(() => {
        const urlHash = window.location.hash.slice(1);
        if (urlHash) {
            const targetServiceItem = document.querySelector(`.service-item[data-service="${urlHash}"]`);
            if (targetServiceItem) {
                switchService(targetServiceItem);

                setTimeout(() => {
                    const targetContent = document.getElementById(urlHash);
                    if (targetContent) {
                        const offset = window.innerHeight / 2 - targetContent.clientHeight / 2;
                        window.scrollTo({ top: targetContent.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
                    }
                }, 100);
            }
        } else {
            if (loader) {
                loader.style.display = 'none';
            }
        }
    }, 500);
});

document.addEventListener('scroll', function () {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const offset = rect.top - window.innerHeight;
        if (offset < 0) {
            const img = item.querySelector('img');
            if (img) {
                img.style.transform = `translateY(${offset * 0.2}px)`;
            }
        }
    });
});