    // Функции для работы с модальным окном
        function openModal(title) {
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }

        // Закрытие модального окна при клике вне его
        window.onclick = function(event) {
            const modal = document.getElementById('modal');
            if (event.target == modal) {
                closeModal();
            }
        }