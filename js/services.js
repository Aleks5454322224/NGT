document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceContents = document.querySelectorAll('.service-details');
    const ctaButtons = document.querySelectorAll('.cta-button');
    const mainNav = document.querySelector('nav.main-nav');

    // Инициализация первого активного элемента
    let activeService = document.querySelector('.service-item.active');

    // Функция переключения услуг
    function switchService(targetService) {
        const serviceId = targetService.dataset.service;

        // Анимация перехода
        gsap.to(serviceContents, {
            duration: 0.3,
            opacity: 0,
            y: 20,
            onComplete: () => {
                // Удаляем активные классы
                serviceItems.forEach(item => item.classList.remove('active'));
                serviceContents.forEach(content => content.classList.remove('active'));

                // Добавляем активные классы
                targetService.classList.add('active');
                document.getElementById(serviceId).classList.add('active');

                // Анимация появления нового контента
                gsap.fromTo(`#${serviceId}`,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4 }
                );

                // Анимация изображения
                gsap.fromTo(`#${serviceId} .service-image`,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.5, delay: 0.2 }
                );
            }
        });
    }

    // Обработчики событий для навигации
    serviceItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            if (this === activeService) return;
            activeService = this;
            switchService(this);

            // Плавный скролл для мобильных устройств
            if (window.innerWidth < 768) {
                window.scrollTo({
                    top: document.querySelector('.service-content').offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Обработчики для CTA-кнопок
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            // Логика открытия модального окна
            showModal(this.dataset.serviceType);
        });
    });

    // Параллакс-эффект для изображений
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

    // Плавное появление элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    function showModal(serviceType) {
        console.log(`Открыть модалку для: ${serviceType}`);
    }

    const urlHash = window.location.hash.slice(1);
    if (urlHash) {
        const targetServiceItem = document.querySelector(`.service-item[data-service="${urlHash}"]`);
        if (targetServiceItem) {
            switchService(targetServiceItem);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const servicesNav = document.querySelector('.services-nav');
    
    function updateServicesNavTop() {
        const navHeight = nav.offsetHeight;
        servicesNav.style.top = `${navHeight + 32}px`;
    }

    updateServicesNavTop();

    window.addEventListener('resize', updateServicesNavTop);
});

document.addEventListener('scroll', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const offset = rect.top - window.innerHeight;
        if (offset < 0) {
            const img = item.querySelector('img');
            img.style.transform = `translateY(${offset * 0.2}px)`;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const urlHash = window.location.hash.slice(1);
        if (urlHash) {
            const targetService = document.getElementById(urlHash);
            if (targetService) {
                const offset = window.innerHeight / 2 - targetService.clientHeight / 2;
                window.scrollTo({
                    top: targetService.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: "smooth"
                });
            }
        }
    }, 300); // Увеличил задержку до 300 мс, чтобы браузер успел обработать переход
});
