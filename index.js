function openModal(cardId) {
    // Скрываем все тексты модальных окон
    const allModalTexts = document.querySelectorAll('.modal-text');
    allModalTexts.forEach(text => {
        text.style.display = 'none';
    });
    
    // Показываем нужный текст
    const modalText = document.getElementById(`modal-${cardId.replace(/\s+/g, '-').toLowerCase()}`);
    if (modalText) {
        modalText.style.display = 'block';
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