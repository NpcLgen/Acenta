// Sayfa yüklendiğinde bu kod çalışır
document.addEventListener('DOMContentLoaded', () => {

    // Gerekli HTML elemanlarını seçiyoruz
    const filterButtons = document.querySelectorAll('.filter-btn');
    // DEĞİŞİKLİK: Tur kartları yerine aktivite kartlarını seçiyoruz
    const activityCards = document.querySelectorAll('.activity-card');

    // Her bir filtre butonuna tıklama olayı ekliyoruz
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Her bir aktivite kartını kontrol et
            activityCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});