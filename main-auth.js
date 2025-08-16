/* main-auth.js — LG Turizm (localStorage tabanlı basit auth, PROFİL ile uyumlu) */

/* ================== Yardımcılar ================== */
const LS_KEYS = {
  USERS: 'lg_users',        // [{email,name,surname,password, ...}]
  SESSION: 'lg_session',    // {email,name,surname}
  PROFILE_COMPAT: 'loggedInUser' // profile.html’in baktığı anahtar (uyumluluk için)
};

function readUsers(){
  try { return JSON.parse(localStorage.getItem(LS_KEYS.USERS)) || []; }
  catch(_) { return []; }
}
function writeUsers(list){
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(list||[]));
}
function findUser(email){
  const em = (email||'').trim().toLowerCase();
  return readUsers().find(u => (u.email||'').toLowerCase() === em);
}
function setSession(userObj){
  if (userObj) {
    localStorage.setItem(LS_KEYS.SESSION, JSON.stringify(userObj));
    // PROFİL uyumluluğu için aynı anda loggedInUser’a da yaz
    localStorage.setItem(LS_KEYS.PROFILE_COMPAT, JSON.stringify(userObj));
  } else {
    localStorage.removeItem(LS_KEYS.SESSION);
    localStorage.removeItem(LS_KEYS.PROFILE_COMPAT);
  }
}
function getSession(){
  try { return JSON.parse(localStorage.getItem(LS_KEYS.SESSION)); }
  catch(_) { return null; }
}
function isEmailValidSimple(v){
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/* ================== Header UI (hamburger) ================== */
function renderHeaderAuth(){
  const sess = getSession();
  const menu = document.getElementById('hamburger-menu-content');
  const authBtns = document.getElementById('auth-buttons'); // bazı sayfalarda olabilir
  if (!menu) return;

  if (sess){
    // Oturum açık: Profilim + Çıkış yap
    menu.innerHTML = `
      <a href="profile.html" class="btn-profile">Profilim</a>
      <a href="#" id="logout-link">Çıkış Yap</a>
    `;
    if (authBtns) authBtns.style.display = 'none';
    const logout = document.getElementById('logout-link');
    if (logout){
      logout.addEventListener('click', (e)=>{
        e.preventDefault();
        setSession(null);
        // Menüleri eski haline döndür
        menu.innerHTML = `
          <a href="giris.html" class="btn-login" data-i18n="auth-login">Giriş Yap</a>
          <a href="kayit.html" class="btn-register" data-i18n="auth-register">Kayıt Ol</a>
        `;
        if (authBtns) authBtns.style.display = '';
        // Ana sayfaya geç
        window.location.href = 'index.html';
      });
    }
  } else {
    // Oturum kapalı: Giriş / Kayıt
    menu.innerHTML = `
      <a href="giris.html" class="btn-login" data-i18n="auth-login">Giriş Yap</a>
      <a href="kayit.html" class="btn-register" data-i18n="auth-register">Kayıt Ol</a>
    `;
    if (authBtns) authBtns.style.display = '';
  }
}

/* ================== Kayıt Başarı Modalı (inject) ================== */
function ensureRegisterSuccessModal(){
  if (document.getElementById('success-modal')) return;

  const styleId = 'auth-inline-modal-style';
  if (!document.getElementById(styleId)){
    const css = `
      .inline-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);z-index:10000}
      .inline-modal.is-open{display:flex}
      .inline-modal .card{width:min(420px,90vw);background:#fff;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2);padding:20px;text-align:center}
      .inline-modal h3{margin:0 0 8px 0;font-size:20px}
      .inline-modal p{margin:0 0 16px 0;color:#4b5563}
      .inline-modal .actions{display:flex;gap:10px;justify-content:center}
      .inline-modal .btn{padding:10px 14px;border-radius:10px;border:1px solid #e5e7eb;background:#f9fafb;cursor:pointer}
      .inline-modal .btn-primary{background:#007BFF;border-color:#007BFF;color:#fff}
    `.trim();
    const st = document.createElement('style');
    st.id = styleId;
    st.textContent = css;
    document.head.appendChild(st);
  }

  const wrap = document.createElement('div');
  wrap.id = 'success-modal';
  wrap.className = 'inline-modal';
  wrap.innerHTML = `
    <div class="card" role="dialog" aria-labelledby="reg-ok-title">
      <h3 id="reg-ok-title">Kayıt Başarılı</h3>
      <p>Hesabınız oluşturuldu. Giriş sayfasına geçebilirsiniz.</p>
      <div class="actions">
        <button class="btn btn-primary" id="success-ok">Giriş sayfasına git</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  document.getElementById('success-ok').addEventListener('click', ()=>{
    closeInline('#success-modal');
    window.location.href = 'giris.html';
  });
}

/* ================== Giriş Başarı Modalı (inject) ================== */
function ensureLoginSuccessModal(){
  if (document.getElementById('login-success-modal')) return;

  const styleId = 'auth-inline-modal-style';
  if (!document.getElementById(styleId)){
    const css = `
      .inline-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);z-index:10000}
      .inline-modal.is-open{display:flex}
      .inline-modal .card{width:min(420px,90vw);background:#fff;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2);padding:20px;text-align:center}
      .inline-modal h3{margin:0 0 8px 0;font-size:20px}
      .inline-modal p{margin:0 0 16px 0;color:#4b5563}
      .inline-modal .actions{display:flex;gap:10px;justify-content:center}
      .inline-modal .btn{padding:10px 14px;border-radius:10px;border:1px solid #e5e7eb;background:#f9fafb;cursor:pointer}
      .inline-modal .btn-primary{background:#007BFF;border-color:#007BFF;color:#fff}
    `.trim();
    const st = document.createElement('style');
    st.id = styleId;
    st.textContent = css;
    document.head.appendChild(st);
  }

  const wrap = document.createElement('div');
  wrap.id = 'login-success-modal';
  wrap.className = 'inline-modal';
  wrap.innerHTML = `
    <div class="card" role="dialog" aria-labelledby="login-ok-title">
      <h3 id="login-ok-title">Giriş Başarılı</h3>
      <p>Hesabınıza giriş yaptınız.</p>
      <div class="actions">
        <button class="btn btn-primary" id="go-home">Ana sayfaya dön</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  document.getElementById('go-home').addEventListener('click', ()=>{
    closeInline('#login-success-modal');
    window.location.href = 'index.html';
  });
}

/* ================== Basit inline modal helper’ları ================== */
function openInline(sel){
  const m = document.querySelector(sel);
  if (m){ m.classList.add('is-open'); return true; }
  return false;
}
function closeInline(sel){
  const m = document.querySelector(sel);
  if (m){ m.classList.remove('is-open'); return true; }
  return false;
}

/* ================== Kayıt İşlemi (kayit.html) ================== */
function bindRegister(){
  const form = document.getElementById('register-form');
  if (!form) return;

  const name    = document.getElementById('reg-name');
  const surname = document.getElementById('reg-surname');
  const email   = document.getElementById('reg-email');
  const pass    = document.getElementById('reg-password');
  const pass2   = document.getElementById('reg-password2');
  const consent = document.getElementById('reg-consent');
  const submit  = document.getElementById('reg-submit');

  const bar = document.getElementById('reg-pass-bar');
  const msg = document.getElementById('reg-pass-msg');

  function scorePassword(p){
    let s = 0;
    if (!p) return 0;
    const uniq = new Set(p).size; s += Math.min(uniq, 10);
    if (p.length >= 6) s += 10;
    if (/[a-z]/.test(p)) s += 5;
    if (/[A-Z]/.test(p)) s += 5;
    if (/\d/.test(p))   s += 5;
    if (/[^A-Za-z0-9]/.test(p)) s += 7;
    if (p.length >= 10) s += 5;
    return Math.min(s, 40);
  }
  function updateStrength(){
    if (!bar || !msg || !pass) return;
    const s = scorePassword(pass.value);
    const pct = (s/40)*100;
    bar.style.width = pct + '%';
    // Renk (zayıf=kırmızı / orta=sarı / güçlü=yeşil)
    if (pct <= 35){
      bar.style.backgroundColor = '#ef4444';
      msg.textContent = 'Şifre gücü: Zayıf';
    } else if (pct <= 70){
      bar.style.backgroundColor = '#f59e0b';
      msg.textContent = 'Şifre gücü: Orta';
    } else {
      bar.style.backgroundColor = '#10b981';
      msg.textContent = 'Şifre gücü: Güçlü';
    }
  }
  pass && pass.addEventListener('input', updateStrength);
  updateStrength();

  function formValid(){
    const okName = name && name.value.trim().length > 0;
    const okSur  = surname && surname.value.trim().length > 0;
    const okMail = email && isEmailValidSimple(email.value);
    const okPwd  = pass && pass.value.length >= 6;
    const okEq   = pass && pass2 && pass.value === pass2.value;
    const okCns  = consent && consent.checked;
    return okName && okSur && okMail && okPwd && okEq && okCns;
  }
  function updateSubmitState(){
    if (submit) submit.disabled = !formValid();
  }
  ['input','change','blur'].forEach(evt=> form.addEventListener(evt, updateSubmitState));
  updateSubmitState();

  form.addEventListener('submit', (e)=>{
    if (!formValid()){
      e.preventDefault();
      updateSubmitState();
      return;
    }
    e.preventDefault(); // sayfa yenilemeyi durdur

    const users = readUsers();
    const em = (email.value||'').trim().toLowerCase();

    if (users.some(u => (u.email||'').toLowerCase() === em)){
      // ZATEN VAR → sadece uyar, devam etme
      alert('Bu e‑posta ile zaten bir hesap var. Lütfen farklı bir e‑posta deneyin.');
      return;
    }

    // Yeni kullanıcıyı kaydet (otomatik login YAPMIYORUZ)
    const newUser = {
      name: (name.value||'').trim(),
      surname: (surname.value||'').trim(),
      email: em,
      password: pass.value
    };
    users.push(newUser);
    writeUsers(users);

    ensureRegisterSuccessModal();
    openInline('#success-modal');
  });
}

/* ================== Giriş İşlemi (giris.html) ================== */
function bindLogin(){
  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = form.querySelector('#login-email') || form.querySelector('input[type="email"]');
  const passInput  = form.querySelector('#login-password') || form.querySelector('input[type="password"]');

  ensureLoginSuccessModal();

  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const em = (emailInput?.value||'').trim().toLowerCase();
    const pw = (passInput?.value||'');

    if (!isEmailValidSimple(em)){
      alert('Lütfen geçerli bir e‑posta girin.');
      return;
    }
    const user = findUser(em);
    if (!user || user.password !== pw){
      alert('E‑posta veya şifre hatalı.');
      return;
    }

    // Oturumu kur (HER İKİ anahtara da yazılır)
    const userData = { name:user.name, surname:user.surname, email:user.email };
    setSession(userData);

    // Header’ı güncelle (varsa)
    renderHeaderAuth();

    // Başarı modalini göster
    openInline('#login-success-modal');
  });
}

/* ================== Şifre Göster/Gizle (ikonlu) ================== */
function bindPasswordToggles(){
  document.querySelectorAll('.pw-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const sel = btn.getAttribute('data-target');
      const input = document.querySelector(sel);
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon){
        icon.classList.toggle('fa-eye-slash', !isPwd);
        icon.classList.toggle('fa-eye', isPwd);
      }
    });
  });
}

/* ================== DOM Hazır ================== */
document.addEventListener('DOMContentLoaded', ()=>{
  renderHeaderAuth();   // header’ı oturum durumuna göre ayarla
  bindRegister();       // kayit.html ise bağlanır
  bindLogin();          // giris.html ise bağlanır
  bindPasswordToggles();// ikonlu şifre toggleri
});