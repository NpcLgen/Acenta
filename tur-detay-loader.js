// Sayfa yüklendiğinde bu kod bloğu çalışır
document.addEventListener('DOMContentLoaded', () => {

    // URL'den tur ID'sini al (örn: tur-detay.html?id=roma -> 'roma' değerini alır)
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');

    // toursData.js dosyasından doğru turu bul
    const tour = toursData.find(t => t.id === tourId);

    // Ana içerik alanını seç
    const contentArea = document.getElementById('tour-detail-content');

    // Eğer ID'ye uygun bir tur bulunamazsa hata mesajı göster ve işlemi bitir
    if (!tour) {
        contentArea.innerHTML = '<h1>Tur Bulunamadı</h1><p>Aradığınız tur mevcut değil veya kaldırılmış olabilir.</p>';
        return;
    }

    // Sayfa başlığını turun adıyla güncelle
    document.title = `${tour.name} - Acenta Sitem`;

    // Sayfa içeriğini dinamik olarak oluştur
    const tourHTML = `
    <div class="tour-detail-hero" style="background-image: url('${tour.main_image}');">
        <div class="tour-detail-hero-content">
            <h1>${tour.name}</h1>
        </div>
    </div>
    <div class="tour-detail-body">
        <div class="tour-main-column">
            <h2>Tur Hakkında</h2>
            <p>${tour.long_description}</p>
            
            <h2>Fotoğraf Galerisi</h2>
            <div class="gallery-grid">
                ${tour.gallery_images.map(img => `<img src="${img}" alt="${tour.name} galerisinden bir fotoğraf">`).join('')}
            </div>
        </div>
        <div class="tour-sidebar">
            <div class="info-box">
                <h3>Tur Bilgileri</h3>
                <p><strong>Süre:</strong> ${tour.duration}</p>
                <p><strong>Fiyat:</strong> ${tour.price}</p>
                
                <!-- YENİ: "Haritada Göster" butonu eklendi -->
                <!-- Bu link, harita sayfasını doğru tur ID'si ile açacak -->
                <a href="harita.html?tur=${tour.id}" class="btn-show-on-map">Haritada Göster</a>

                <a href="rezervasyon.html?id=${tour.id}" class="btn-book-now">Hemen Rezervasyon Yap</a>
            </div>
            <div class="info-box">
                <h4>Fiyata Dahil Olanlar</h4>
                <ul>
                    ${tour.included.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="info-box">
                <h4>Fiyata Dahil Olmayanlar</h4>
<ul>
                    ${tour.not_included.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>
`;

    // Oluşturulan HTML'i sayfaya yerleştir
    contentArea.innerHTML = tourHTML;
});
