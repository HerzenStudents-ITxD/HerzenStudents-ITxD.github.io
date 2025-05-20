function openModal(cardId) {
    // Скрываем все тексты модальных окон
    const allModalTexts = document.querySelectorAll('.modal-text');
    allModalTexts.forEach(text => {
        text.style.display = 'none';
    });
    
    // Формируем ID модального окна
    const modalId = `modal-${cardId}`;
    
    // Показываем нужный текст
    const modalText = document.getElementById(modalId);
    if (modalText) {
        modalText.style.display = 'block';
    } else {
        console.error(`Модальное окно с ID ${modalId} не найдено`);
        // Можно добавить заглушку, если нужно
        // document.getElementById('modal-default').style.display = 'block';
    }
    
    // Показываем модальное окно
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Add hover effect for image swap
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

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});