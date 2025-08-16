document.addEventListener('DOMContentLoaded', () => {
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langToggleButton && langDropdown) {
        // Butona tıklanınca açılır menüyü göster/gizle
        langToggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Sayfa tıklamasıyla kapanmaması için
            langDropdown.style.display = langDropdown.style.display === 'flex' ? 'none' : 'flex';
        });

        // Açılır menü dışındaki herhangi bir yere tıklanırsa menüyü kapat
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target) && langDropdown.style.display === 'flex') {
                langDropdown.style.display = 'none';
            }
        });
    }

    // Dil seçimine tıklanınca yapılacak işlemler (örnek)
    langDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = link.getAttribute('data-lang');
            
            // Burada, seçilen dile göre sayfa içeriğini değiştirecek kod yer almalı
            console.log(`Dil değiştirildi: ${selectedLang}`);
            alert(`Dil ${selectedLang} olarak değiştirildi. Bu aşamada sayfa içeriği güncellenebilir.`);
            
            // Örnek: Başlık metnini değiştirme
            const pageTitle = document.querySelector('h1');
            if (pageTitle) {
                switch(selectedLang) {
                    case 'en':
                        pageTitle.textContent = 'Our Tours';
                        break;
                    case 'es':
                        pageTitle.textContent = 'Nuestros Tours';
                        break;
                    case 'tr':
                    default:
                        pageTitle.textContent = 'Turlarımız';
                        break;
                }
            }

            // Menüyü kapat
            langDropdown.style.display = 'none';
        });
    });
});
