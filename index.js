let activeTechModal = null;

function openModal(cardId) {
    if (activeTechModal) return; // Не открываем основное модальное окно, если уже открыто техническое
    
    const allModalTexts = document.querySelectorAll('.modal-text');
    allModalTexts.forEach(text => {
        text.style.display = 'none';
    });
    
    const modalId = `modal-${cardId}`;
    const modalText = document.getElementById(modalId);
    
    if (modalText) {
        modalText.style.display = 'block';
    }
    
    document.getElementById('modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function showTechInfo(id) {
    if (activeTechModal) return;
    
    activeTechModal = id;
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'tech-info-overlay';
    overlay.style.display = 'block';
    overlay.onclick = function() {
        hideTechInfo(id);
    };
    document.body.appendChild(overlay);
    
    // Показываем контент
    const content = document.getElementById(id);
    if (content) {
        content.style.display = 'block';
    }
    
    // Добавляем класс для body
    document.body.classList.add('modal-open');
}

function hideTechInfo(id) {
    if (!activeTechModal) return;
    
    // Скрываем контент
    const content = document.getElementById(id);
    if (content) {
        content.style.display = 'none';
    }
    
    // Удаляем overlay
    const overlay = document.querySelector('.tech-info-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Сбрасываем активное модальное окно
    activeTechModal = null;
    
    // Удаляем класс для body
    document.body.classList.remove('modal-open');
    
    // Останавливаем всплытие события
    if (event) event.stopPropagation();
}

// Закрытие по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (activeTechModal) {
            hideTechInfo(activeTechModal);
        } else {
            closeModal();
        }
    }
});

// Обработчик клика вне модального окна
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal && !activeTechModal) {
        closeModal();
    }
};

// Добавляем hover effect для смены изображений
document.querySelectorAll('.card-wrapper').forEach(wrapper => {
    const img = wrapper.querySelector('.card-screenshot');
    if (img && img.dataset.gif) {
        const originalSrc = img.src;
        const gifSrc = img.dataset.gif;
        
        wrapper.addEventListener('mouseenter', () => {
            img.src = gifSrc;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            img.src = originalSrc;
        });
    }
});

// Предотвращаем клик по карточке, если открыто техническое модальное окно
document.querySelectorAll('.card-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function(event) {
        if (activeTechModal) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
});