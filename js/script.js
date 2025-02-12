document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    });
});

const scrollElement = document.querySelector('[data-scroll]');
if (scrollElement) {
    scrollElement.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('contact');
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Находим все карточки этапов
    const cards = document.querySelectorAll('.step-card');

    // Опции для наблюдателя: срабатываем, когда хотя бы 10% элемента видно
    const observerOptions = {
        root: null, // наблюдаем за видимой областью окна браузера
        threshold: 0.1
    };

    // Создаём новый IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс, который запускает анимацию
                entry.target.classList.add('visible');
                // Если анимация нужна только один раз, можно прекратить наблюдение за этим элементом
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Запускаем наблюдение для каждой карточки
    cards.forEach(card => {
        observer.observe(card);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".project-button").forEach(button => {
        button.addEventListener("click", function () {
            window.location.href = "about.html#projects";
        });
    });
});

// Обработка формы
document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('_eTkVNmzmuw19EQAw');
    
    // Инициализация масок для всех телефонов
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        IMask(input, { mask: '+{7} (000) 000-00-00' });
    });

    // Обработчики модального окна
    document.querySelector('.order-button').addEventListener('click', () => {
        const modal = document.querySelector('.modal-overlay');
        modal.classList.add('active');
        
        // Блокировка скролла
        document.body.classList.add('modal-open');
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    });

    // Исправленный обработчик для кнопки закрытия
    document.querySelector('.modal-close').addEventListener('click', closeModal);

    // Обработчик для закрытия по клику вне модального окна
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
    
    function closeModal() {
        const modal = document.querySelector('.modal-overlay');
        modal.classList.remove('active');
        
        // Разблокировка скролла
        document.body.classList.remove('modal-open');
        document.documentElement.style.removeProperty('--scrollbar-width');
    }

    // Обработка всех форм
    document.querySelectorAll('.custom-form').forEach(form => {
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Отправка...';

            // Получаем элементы через текущую форму
            const formData = {
                name: form.querySelector('[name="name"]').value.trim(),
                phone: form.querySelector('[name="phone"]').value.trim(),
                comment: form.querySelector('[name="comment"]')?.value.trim() || ''
            };

            // Валидация
            let errorMessage = '';
            if (!formData.name || !formData.phone) {
                errorMessage = 'Пожалуйста, заполните обязательные поля';
            } else if (!validateName(formData.name)) {
                errorMessage = 'Имя должно быть одним словом и начинаться с заглавной буквы';
            }

            if (errorMessage) {
                showMessage(errorMessage, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }

            try {
                await emailjs.send('service_38kirq2', 'template_6s8vtby', formData);
                await sendToTelegram(formData);
                
                showMessage('Заявка отправлена! Мы свяжемся с вами в течение 15 минут', 'success');
                form.reset();
                if(form.closest('.modal-overlay')) closeModal();
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('Произошла ошибка при отправке. Попробуйте еще раз', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    });

    function validateName(name) {
        const nameRegex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/;
        return nameRegex.test(name);
    }

    async function sendToTelegram(data) {
        const botToken = '7506889056:AAFZbHuSiDC4tcdWMAxEgymeXxxhYFk4ZVs';
        const chatId = '-4667658515';
        const text = `Новая заявка!\nИмя: ${data.name}\nТелефон: ${data.phone}\nКомментарий: ${data.comment || 'нет комментария'}`;

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });

        if (!response.ok) throw new Error('Ошибка отправки в Telegram');
    }

    function showMessage(text, type) {
        const existingMsg = document.querySelector('.global-message');
        if (existingMsg) existingMsg.remove();

        const message = document.createElement('div');
        message.className = `global-message ${type}`;

        message.innerHTML = `
            <div class="message-body">
                <div class="message-icon"></div>
                <div class="message-text">
                    <h4>${type === 'success' ? 'Успешно!' : 'Ошибка!'}</h4>
                    <p>${text}</p>
                </div>
                <button class="message-close">&times;</button>
                <div class="progress-bar"></div>
            </div>
        `;

        document.body.appendChild(message);

        // Анимация прогресс-бара
        const progressBar = message.querySelector('.progress-bar');
        progressBar.style.animation = 'progress 5s linear forwards';

        // Закрытие по таймеру
        setTimeout(() => {
            message.classList.add('hide');
            setTimeout(() => message.remove(), 500);
        }, 4800);

        // Закрытие по клику
        message.querySelector('.message-close').addEventListener('click', () => {
            message.classList.add('hide');
            setTimeout(() => message.remove(), 500);
        });
    }
});

// Анимация при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .advantage-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

document.querySelectorAll('.hero-button').forEach(button => {
    button.addEventListener('click', () => {
        const form = document.querySelector('.consultation-form');
        if (form) {
            form.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // Вертикальное центрирование
                inline: 'center' // Горизонтальное центрирование (опционально)
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    initCarousels('.certificates-container');
    initCarousels('.contracts-container');

    const modal = document.querySelector('.certificates-modal');
    const modalImage = document.querySelector('.certificates-modal-image');
    const modalWrapper = document.querySelector('.modal-image-wrapper');
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0, scale = 1;

    document.querySelectorAll('.certificate-image, .contract-image').forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.src;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            resetImageTransform();
        });
    });

    modal.querySelector('.certificates-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.certificates-modal-overlay').addEventListener('click', closeModal);

    const zoomInBtn = modal.querySelector('.zoom-in');
    const zoomOutBtn = modal.querySelector('.zoom-out');

    zoomInBtn.addEventListener('click', () => updateZoom(0.2));
    zoomOutBtn.addEventListener('click', () => updateZoom(-0.2));

    modalWrapper.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', dragImage);
    document.addEventListener('mouseup', stopDragging);
    modalWrapper.addEventListener('wheel', handleWheel, { passive: false });

    function initCarousels(containerSelector) {
        const containers = document.querySelectorAll(containerSelector);
        
        containers.forEach(container => {
            const scroller = container.querySelector('.certificates-scroller, .contracts-scroller');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            const scrollProgress = container.querySelector('.scroll-progress');
            
            const itemWidth = scroller.querySelector('.certificate-item, .contract-item').offsetWidth;
            const scrollStep = itemWidth * 3;

            prevBtn.addEventListener('click', () => {
                scroller.scrollLeft -= scrollStep;
            });

            nextBtn.addEventListener('click', () => {
                scroller.scrollLeft += scrollStep;
            });

            let isScrolling;
            scroller.addEventListener('scroll', () => {
                clearTimeout(isScrolling);

                if (scroller.scrollLeft > 0) {
                    scrollProgress.style.display = 'block';
                } else {
                    scrollProgress.style.display = 'none';
                }

                const progress = scroller.scrollLeft / (scroller.scrollWidth - scroller.clientWidth);
                scrollProgress.style.width = `${progress * 100}%`;

                scroller.classList.add('scrolling');

                isScrolling = setTimeout(() => {
                    scroller.classList.remove('scrolling');
                }, 300);
            });
        });
    }

    function updateZoom(zoomDelta) {
        scale = Math.min(Math.max(1, scale + zoomDelta), 5);
        applyImageTransform();
        modalWrapper.style.cursor = scale > 1 ? 'grab' : 'default';
    }

    function startDragging(e) {
        if(scale <= 1) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalWrapper.style.cursor = 'grabbing';
    }

    function dragImage(e) {
        if(!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyImageTransform();
    }

    function stopDragging() {
        isDragging = false;
        modalWrapper.style.cursor = scale > 1 ? 'grab' : 'default';
    }

    function handleWheel(e) {
        if(e.ctrlKey) {
            e.preventDefault();
            updateZoom(e.deltaY * -0.01);
        }
    }

    function applyImageTransform() {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetImageTransform() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyImageTransform();
        modalWrapper.style.cursor = 'default';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetImageTransform();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const grid = document.querySelector('.services-grid');
    let isAnimating = false;

    function getActiveFilter() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('filter') || 'all';
    }

    function updateUrl(filter) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('filter', filter);
        window.history.replaceState({}, '', newUrl);
    }

    function filterCards(filter) {
        if (isAnimating) return;
        isAnimating = true;

        // Сохраняем позицию скролла
        const scrollY = window.scrollY;

        // Первый этап анимации - скрытие
        serviceCards.forEach((card, index) => {
            const categories = card.dataset.category.split(' ');
            const isVisible = filter === 'all' || categories.includes(filter);

            card.style.transitionDelay = `${index * 0.05}s`;
            card.classList.toggle('fade-out', !isVisible);
        });

        // Второй этап - обновление сетки
        setTimeout(() => {
            serviceCards.forEach(card => {
                card.classList.toggle('hidden', card.classList.contains('fade-out'));
                card.style.transitionDelay = '0s';
            });

            // Принудительный reflow для анимации
            grid.style.display = 'none';
            grid.offsetHeight;
            grid.style.display = 'grid';

            // Третий этап - появление
            setTimeout(() => {
                serviceCards.forEach(card => {
                    card.classList.remove('fade-out');
                    if (!card.classList.contains('hidden')) {
                        card.classList.add('fade-in');
                    }
                });

                // Восстанавливаем позицию скролла
                window.scrollTo(0, scrollY);
                isAnimating = false;
            }, 50);
        }, 500);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.classList.contains('active') || isAnimating) return;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            filterCards(filter);
            updateUrl(filter);
        });

        // Обработка клавиатуры
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                button.click();
            }
        });
    });

    // Инициализация фильтра из URL
    const initialFilter = getActiveFilter();
    document.querySelector(`.filter-btn[data-filter="${initialFilter}"]`)?.click();
});

document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector('.back-to-top');
    const footer = document.querySelector('footer');

    if (!backToTopButton || !footer) return;

    const checkFooterPosition = () => {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const footerTop = footerRect.top + window.pageYOffset;

        if (window.pageYOffset + viewportHeight >= footerTop) {
            backToTopButton.classList.add('footer-position');
            backToTopButton.style.top = `${footerTop - 80}px`;
        } else {
            backToTopButton.classList.remove('footer-position');
            backToTopButton.style.top = 'auto';
        }
    };

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
            checkFooterPosition();
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    window.addEventListener('resize', checkFooterPosition);

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const statNumbers = document.querySelectorAll(".stat-number");

    const animateNumber = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(interval);
                current = target;
            }
            element.textContent = Math.floor(current);
        }, 10);
    };

    statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target"), 10);
        animateNumber(stat, target);
    });
});

// Конфигурация цен
const GAS_PRICES = {
    fullCycle: 200000,
    projecting: 50,
    documentation: 15000,
    montage: 800,
    heating: 1200,
    topography: 20000,
    equipment: 50000,
    drilling: 1500
};

// Функция анимации пересчета
function animatePriceChange(from, to, element) {
    let startTime;
    const duration = 1000; // Длительность анимации 1 секунда
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1); // Прогресс анимации от 0 до 1
        const currentPrice = Math.floor(from + (to - from) * progress);
        element.textContent = `${currentPrice.toLocaleString('ru-RU')} ₽`;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// Инициализация модального окна
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gasCalculatorModal');
    const btn = document.querySelector('[data-modal="calculator"]');
    const closeBtn = document.querySelector('.gas-modal-close');

    btn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.classList.add('gas-modal-open');
        document.body.style.overflow = 'hidden'; // Блокировка скролла
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('gas-modal-open');
        document.body.style.overflow = ''; // Восстановление скролла
    });
});

// Логика расчета
function calculateGasCost() {
    const area = parseFloat(document.getElementById('gasArea').value) || 100;
    let total = 0;

    // Расчет по выбранным услугам
    if (document.getElementById('gasFullCycle').checked) {
        total += GAS_PRICES.fullCycle;
    }

    if (document.getElementById('gasProjecting').checked) {
        total += GAS_PRICES.projecting * area;
    }

    if (document.getElementById('gasDocumentation').checked) {
        total += GAS_PRICES.documentation;
    }

    if (document.getElementById('gasMontage').checked) {
        total += GAS_PRICES.montage * area;
    }

    if (document.getElementById('gasHeating').checked) {
        total += GAS_PRICES.heating * area;
    }

    if (document.getElementById('gasTopography').checked) {
        total += GAS_PRICES.topography;
    }

    if (document.getElementById('gasEquipment').checked) {
        total += GAS_PRICES.equipment;
    }

    if (document.getElementById('gasDrilling').checked) {
        total += GAS_PRICES.drilling * area;
    }

    // Анимированное обновление итоговой цены
    const priceElement = document.querySelector('.gas-total-price');
    const currentPrice = parseFloat(priceElement.textContent.replace(' ₽', '').replace(/\s/g, '')) || 0;
    animatePriceChange(currentPrice, total, priceElement);
}

// Кнопка пересчета
document.querySelector('.gas-calculate-button').addEventListener('click', calculateGasCost);

// Первоначальный расчет
calculateGasCost();