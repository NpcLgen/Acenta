// Sayfa yüklendiğinde bu kod çalışır
document.addEventListener('DOMContentLoaded', () => {

    // Gerekli HTML elemanlarını seçiyoruz
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');

    // Her bir filtre butonuna tıklama olayı ekliyoruz
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Aktif buton stilini ayarla
            // Önce hepsinden 'active' sınıfını kaldır
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Sonra sadece tıklanan butona ekle
            button.classList.add('active');

            // Tıklanan butonun filtre değerini al (örn: "yurt-ici")
            const filterValue = button.getAttribute('data-filter');

            // Her bir tur kartını kontrol et
            tourCards.forEach(card => {
                // Kartın kategori değerini al
                const cardCategory = card.getAttribute('data-category');

                // Filtreleme mantığı:
                // Eğer filtre "hepsi" ise VEYA kartın kategorisi filtre ile eşleşiyorsa
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block'; // Kartı göster
                } else {
                    card.style.display = 'none';  // Kartı gizle
                }
            });
        });
    });
});
