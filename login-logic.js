// ------------------------------
// login-logic.js  (FINAL / TEMİZ)
// ------------------------------

(() => {
  "use strict";

  // ---------------- Helpers ----------------
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const byId = (id) => document.getElementById(id);
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').toLowerCase());

  // ---------------- LS Keys ----------------
  // Kullanıcı listesi: [{email,name,surname,password}]
  const USERS_KEY         = 'lg_users';
  // main-auth.js ile tam uyumlu OTURUM OBJESİ anahtarı:
  // { email, name, surname }
  const LG_SESSION_KEY    = 'lg_session';

  // (İsteğe bağlı geriye dönük uyumluluk anahtarları)
  const SESSION_FLAG_KEY  = 'isLoggedIn';
  const CURRENT_USER_KEY  = 'lg_current_user';

  // ------------- Users read/write ----------
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (_) { return []; }
  }
  function saveUsers(arr) {
    localStorage.setItem(USERS_KEY, JSON.stringify(arr || []));
  }

  // ------------- Session helpers -----------
  function setSessionObject(user) {
    // main-auth.js'in beklediği oturum objesini yaz
    const sessionObj = {
      email:   user?.email || '',
      name:    user?.name || '',
      surname: user?.surname || ''
    };
    localStorage.setItem(LG_SESSION_KEY, JSON.stringify(sessionObj));

    // (Opsiyonel) Eski anahtarları da set et – istersen kaldır
    localStorage.setItem(SESSION_FLAG_KEY, 'true');
    localStorage.setItem(CURRENT_USER_KEY, String(user?.email || ''));
  }
  function clearSession() {
    localStorage.removeItem(LG_SESSION_KEY);
    localStorage.removeItem(SESSION_FLAG_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // ------------- Modal helpers -------------
  function openModal(sel) {
    const m = document.querySelector(sel);
    if (m) m.classList.add('is-open');
  }
  function closeModal(sel) {
    const m = document.querySelector(sel);
    if (m) m.classList.remove('is-open');
  }

  // ------------- Password toggle -----------
  function bindPasswordToggle() {
    // giris.html'deki butonlar: <button class="password-toggle" data-toggle="#login-password">Göster</button>
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = btn.getAttribute('data-toggle');
        const inp = document.querySelector(sel);
        if (!inp) return;
        const toType = (inp.type === 'password') ? 'text' : 'password';
        inp.type = toType;
        // Buton yazısı basitçe değişsin (istersen ikon da kullanabilirsin)
        btn.textContent = (toType === 'password') ? 'Göster' : 'Gizle';
      });
    });
  }

  // ------------- Login flow ----------------
  function bindLoginForm() {
    const form     = byId('login-form');
    if (!form) return;

    const emailInp = byId('login-email');
    const passInp  = byId('login-password');
    const emailErr = byId('login-email-error'); // <div class="auth-error" id="login-email-error">
    const passErr  = byId('login-pass-error');  // <div class="auth-error" id="login-pass-error">

    // Hataları gizleme
    const hideErrors = () => {
      emailErr && emailErr.classList.remove('is-visible');
      passErr  && passErr.classList.remove('is-visible');
      emailInp && emailInp.classList.remove('is-invalid');
      passInp  && passInp.classList.remove('is-invalid');
    };

    [emailInp, passInp].forEach(inp => {
      inp && inp.addEventListener('input', hideErrors);
    });

    form.addEventListener('submit', (ev) => {
      ev.preventDefault(); // modal için sayfa yenilemeyi durdur

      hideErrors();

      const email = (emailInp?.value || '').trim();
      const pass  = passInp?.value || '';

      let ok = true;
      if (!emailOk(email)) {
        emailErr && emailErr.classList.add('is-visible');
        emailInp && emailInp.classList.add('is-invalid');
        ok = false;
      }
      if (!pass || pass.length < 6) {
        passErr && passErr.classList.add('is-visible');
        passInp && passInp.classList.add('is-invalid');
        ok = false;
      }
      if (!ok) return;

      // Kullanıcıyı bul
      const users = getUsers();
      const found = users.find(u => String(u.email).toLowerCase() === email.toLowerCase());

      if (!found) {
        if (emailErr) {
          emailErr.textContent = 'Bu e‑posta ile kayıtlı hesap bulunamadı.';
          emailErr.classList.add('is-visible');
        }
        emailInp && emailInp.classList.add('is-invalid');
        return;
      }
      if (String(found.password) !== pass) {
        if (passErr) {
          passErr.textContent = 'Şifre hatalı. Lütfen tekrar deneyin.';
          passErr.classList.add('is-visible');
        }
        passInp && passInp.classList.add('is-invalid');
        return;
      }

      // Başarılı giriş → main-auth.js ile UYUMLU oturum yaz
      setSessionObject(found);

      // Header menüsünü güncelle (main-auth.js yüklüyse)
      if (typeof window.renderHeaderAuth === 'function') {
        try { window.renderHeaderAuth(); } catch (_) {}
      }

      // Başarı modalı varsa aç; yoksa index'e git
      const successModal = byId('login-success-modal');
      if (successModal) {
        openModal('#login-success-modal');
      } else {
        alert('Başarıyla giriş yapıldı!');
        window.location.href = 'index.html';
      }
    });

    // Modal butonu: ana sayfaya git
    const goHomeBtn = byId('login-success-home');
    if (goHomeBtn) {
      goHomeBtn.addEventListener('click', () => {
        closeModal('#login-success-modal');
        window.location.href = 'index.html';
      });
    }
  }

  // ------------- Back button (opsiyonel) ---
  function bindBackButton() {
    const backButton = byId('back-button');
    if (!backButton) return;
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.back();
    });
  }

  // ------------- Init ----------------------
  document.addEventListener('DOMContentLoaded', () => {
    bindBackButton();
    bindPasswordToggle();
    bindLoginForm();
  });
})();