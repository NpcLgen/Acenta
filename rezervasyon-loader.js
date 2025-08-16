document.addEventListener('DOMContentLoaded', () => {
  // URL'den tur id al
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('id');

  // Tur verisini bul
  const tour = Array.isArray(toursData) ? toursData.find(t => String(t.id) === String(tourId)) : null;

  const summaryBox = document.getElementById('tour-summary-box');
  const bookingForm = document.getElementById('booking-form');

  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');

  const nextBtn = document.getElementById('next-to-payment-btn');
  const prevBtn = document.getElementById('prev-to-info-btn');
  const confirmationDetails = document.getElementById('confirmation-details');

  let reservationData = {};

  // Oturumdan geçerli e‑posta (main-auth ile uyumlu, profille de uyumlu)
  function getCurrentEmail(){
    // main-auth.js
    try{
      const s = JSON.parse(localStorage.getItem('lg_session') || 'null');
      if (s && s.email) return String(s.email);
    }catch(e){}
    // profile.html eski anahtar
    try{
      const u = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (u && u.email) return String(u.email);
    }catch(e){}
    // login-logic.js (alternatif)
    const e2 = localStorage.getItem('lg_current_user');
    if (e2) return String(e2);
    return null;
  }

  // Belirli kullanıcı için rezervasyon listesi oku/kaydet
  function readUserReservations(email){
    if (!email) return [];
    try{
      return JSON.parse(localStorage.getItem(`reservations:${email}`) || '[]');
    }catch(e){ return []; }
  }
  function writeUserReservations(email, list){
    if (!email) return;
    localStorage.setItem(`reservations:${email}`, JSON.stringify(list || []));
  }

  if (!tour) {
    if (summaryBox) summaryBox.innerHTML = '<h3>Tur Bilgisi Bulunamadı</h3>';
    if (bookingForm) bookingForm.innerHTML = '';
    return;
  }

  // Fiyatı sayısal bir değere çevir
  const pricePerPerson = parseFloat(String(tour.price || '').replace(/[^0-9.-]+/g,"")) || 0;
  const currencySymbol = String(tour.price || '').includes('€') ? '€' : '₺';

  // Sağ özet kutusu
  if (summaryBox){
    const img = (tour.main_image||'').replace('/1200/500','/400/250');
    summaryBox.innerHTML = `
      <h3>Rezervasyon Özeti</h3>
      ${img ? `<img src="${img}" alt="${tour.name}" style="width:100%;height:auto;border-radius:10px;margin-bottom:10px">` : ''}
      <h4>${tour.name}</h4>
      <p><strong>Süre:</strong> ${tour.duration||'-'}</p>
      <p><strong>Fiyat:</strong> ${tour.price} / kişi</p>
    `;
  }

  // Adım 1 -> Adım 2
  if (nextBtn){
    nextBtn.addEventListener('click', () => {
      reservationData.fullName = (document.getElementById('fullName').value || '').trim();
      reservationData.email    = (document.getElementById('email').value || '').trim();
      reservationData.phone    = (document.getElementById('phone').value || '').trim();
      reservationData.pax      = parseInt(document.getElementById('pax').value, 10) || 1;
      reservationData.tourDate = document.getElementById('tourDate').value;

      if (!reservationData.fullName || !reservationData.email || !reservationData.tourDate) {
        alert('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      const totalPrice = pricePerPerson * reservationData.pax;
      reservationData.totalPrice = totalPrice;
      reservationData.currency = currencySymbol;

      const paymentStepHeader = step2.querySelector('h3');
      if (paymentStepHeader){
        if (!document.getElementById('total-price-display')) {
          paymentStepHeader.insertAdjacentHTML('afterend', `
            <div class="total-price-display" id="total-price-display">
              Ödenecek Toplam Tutar: <strong>${currencySymbol}${totalPrice.toLocaleString('tr-TR')}</strong>
            </div>
          `);
        } else {
          document.querySelector('#total-price-display strong').textContent = `${currencySymbol}${totalPrice.toLocaleString('tr-TR')}`;
        }
      }

      step1.classList.remove('active');
      step2.classList.add('active');
    });
  }

  // Geri
  if (prevBtn){
    prevBtn.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
    });
  }

  // Tamamlama
  if (bookingForm){
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Basit referans numarası
      const referenceNumber = 'LG' + Date.now().toString().slice(-6);

      // LocalStorage’a yaz (profil sayfası “Rezervasyonlarım” ile aynı format)
      const sessionEmail = getCurrentEmail();
      if (sessionEmail){
        const list = readUserReservations(sessionEmail);
        list.push({
          ref: referenceNumber,
          id: String(tour.id),
          title: tour.name,
          date: reservationData.tourDate,
          pax: reservationData.pax,
          totalPrice: reservationData.totalPrice || 0,
          currency: reservationData.currency || currencySymbol,
          createdAt: new Date().toISOString(),
          thumb: (tour.main_image||'').replace('/1200/500','/400/250')
        });
        writeUserReservations(sessionEmail, list);
      }

      // Onay ekranı
      const formattedTotal = `${reservationData.currency || currencySymbol}${(reservationData.totalPrice || 0).toLocaleString('tr-TR')}`;
      confirmationDetails.innerHTML = `
        <p><strong>Referans Numaranız: ${referenceNumber}</strong></p>
        <p>Sayın <strong>${escapeHtml(reservationData.fullName)}</strong>, rezervasyonunuz başarıyla alınmıştır. Detaylar aşağıdadır:</p>
        <ul>
          <li><strong>Tur Adı:</strong> ${escapeHtml(tour.name)}</li>
          <li><strong>Tarih:</strong> ${escapeHtml(reservationData.tourDate)}</li>
          <li><strong>Kişi Sayısı:</strong> ${reservationData.pax}</li>
          <li><strong>Toplam Fiyat:</strong> ${formattedTotal}</li>
        </ul>
        <p>Rezervasyon detayları <strong>${escapeHtml(reservationData.email)}</strong> adresinize gönderildi (prototip).</p>
      `;

      step2.classList.remove('active');
      step3.classList.add('active');
      if (summaryBox) summaryBox.style.display = 'none';
    });
  }

  // ufak yardımcı
  function escapeHtml(s=''){
    return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
});