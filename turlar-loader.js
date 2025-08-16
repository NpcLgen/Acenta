document.addEventListener('DOMContentLoaded', () => {

    const tourGrid = document.getElementById('tour-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 1. FONKSİYON: Verilen turları alıp HTML kartları oluşturur ve ekrana basar
    function displayTours(toursToDisplay) {
        // Önce mevcut kartları temizle
        tourGrid.innerHTML = '';

        // Verilen her tur için bir kart oluştur
        toursToDisplay.forEach(tour => {
            const tourCard = document.createElement('div');
            tourCard.classList.add('tour-card');
            tourCard.dataset.category = tour.category; // data-category'yi veriden al

            tourCard.innerHTML = `
                <img src="${tour.main_image.replace('/1200/500', '/400/250')}" alt="${tour.name}">
                <h3>${tour.name}</h3>
                <p>${tour.short_description}</p>
                <a href="tur-detay.html?id=${tour.id}" class="map-link">Detayları İncele</a>
            `;

            tourGrid.appendChild(tourCard);
        });
    }

    // 2. FONKSİYON: Filtreleme mantığı
    function filterTours(filterValue) {
        let filteredTours;

        if (filterValue === 'all') {
            filteredTours = toursData;
        } else {
            filteredTours = toursData.filter(tour => tour.category === filterValue);
        }
        
        displayTours(filteredTours);
    }
    
    // 3. Filtre butonlarına tıklama olaylarını ekle
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            filterTours(filterValue);
        });
    });

    // Sayfa ilk yüklendiğinde tüm turları göster
    displayTours(toursData);
});