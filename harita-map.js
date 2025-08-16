let map;
let infoWindow;
let placesService;
let activeMarkers = {
    tour: null,
    places: []
};

function initMap() {
    const initialLocation = { lat: 39.925533, lng: 32.866287 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 6,
    });

    infoWindow = new google.maps.InfoWindow();
    placesService = new google.maps.places.PlacesService(map);

    // --- ÖZELLİK #1 (İşaretçiler) ve #3 (Rotalar) ---
    toursData.forEach(tour => {
        // Her tur için bir işaretçi oluştur
        const marker = new google.maps.Marker({
            position: tour.position,
            map: map,
            title: tour.name,
            animation: google.maps.Animation.DROP,
        });

        // Tura ait bir rota varsa, onu haritaya çiz
        if (tour.path && tour.path.length > 0) {
            new google.maps.Polyline({
                path: tour.path,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                map: map,
            });
        }

        // --- ÖZELLİK #2 (Bilgi Pencereleri) ve #5 (Yakındaki Yerler) ---
        marker.addListener('click', () => {
            // Önceki yer işaretçilerini temizle
            clearPlaceMarkers();

            const content = `
                <div class="info-window-content">
                    <h3>${tour.name}</h3>
                    <p>${tour.description}</p>
                    <a href="turlar.html">Turu İncele</a>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
            map.panTo(marker.getPosition());
            map.setZoom(12);
            
            // Yakındaki restoranları bul ve haritaya ekle
            getNearbyPlaces(marker.getPosition());
        });
    });

    // --- ÖZELLİK #6 (URL'den Gelen Turu Odaklama) ---
    const urlParams = new URLSearchParams(window.location.search);
    const tourIdFromUrl = urlParams.get('tur');

    if (tourIdFromUrl) {
        const tourToFocus = toursData.find(tour => tour.id === tourIdFromUrl);
        if (tourToFocus) {
            map.setCenter(tourToFocus.position);
            map.setZoom(10);
        }
    }
}

// Yakındaki yerleri bulan ve işaretleyen fonksiyon (Özellik #5)
function getNearbyPlaces(position) {
    const request = {
        location: position,
        radius: '1500', // 1.5 km yarıçapındaki yerler
        type: ['restaurant', 'cafe'] // Restoran ve kafeleri ara
    };

    placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                createPlaceMarker(results[i]);
            }
        }
    });
}

// Yakındaki yerler için küçük işaretçiler oluşturan fonksiyon
function createPlaceMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const placeMarker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        // Daha küçük ve farklı bir ikon kullanmak daha iyi olur, şimdilik varsayılanı kullanıyoruz.
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
    });
    
    // Aktif yer işaretçileri listesine ekle ki sonra silebilelim
    activeMarkers.places.push(placeMarker);

    google.maps.event.addListener(placeMarker, "click", () => {
        infoWindow.setContent(place.name || "");
        infoWindow.open(map, placeMarker);
    });
}

// Haritadaki tüm yer işaretçilerini temizleyen fonksiyon
function clearPlaceMarkers() {
    for (let i = 0; i < activeMarkers.places.length; i++) {
        activeMarkers.places[i].setMap(null);
    }
    activeMarkers.places = [];
}