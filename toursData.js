const toursData = [
    {
        id: 'roma',
        category: 'yurt-disi', // FİLTRELEME İÇİN EKLENDİ
        name: 'Klasik İtalya Turu',
        short_description: 'Kolezyum\'dan Venedik kanallarına unutulmaz bir deneyim.',
        long_description: 'Roma\'nın antik sokaklarında tarihe tanıklık edin, Floransa\'da sanatın büyüsüne kapılın ve Venedik\'in romantik kanallarında gezinin. Bu tur, İtalya\'nın en ikonik şehirlerini kapsayan, kültür ve lezzet dolu bir maceradır.',
        price: '€1,250',
        duration: '7 Gece / 8 Gün',
        main_image: 'https://picsum.photos/1200/500?random=5',
        gallery_images: [ 'https://picsum.photos/400/300?random=51', 'https://picsum.photos/400/300?random=52', 'https://picsum.photos/400/300?random=53' ],
        included: ['Uçak Biletleri', '5 Yıldızlı Otellerde Konaklama', 'Şehir Turları', 'Profesyonel Rehberlik'],
        not_included: ['Vize Ücretleri', 'Kişisel Harcamalar', 'Müze Giriş Ücretleri'],
        position: { lat: 41.9028, lng: 12.4964 },
        path: []
    },
    {
        id: 'kapadokya',
        category: 'yurt-ici', // FİLTRELEME İÇİN EKLENDİ
        name: 'Kapadokya Balon Turu',
        short_description: 'Peribacalarını gökyüzünden izleyin.',
        long_description: 'Güneşin doğuşuyla birlikte yüzlerce sıcak hava balonuyla gökyüzüne yükselirken Kapadokya\'nın eşsiz coğrafyasını kuş bakışı izleyin. Yeraltı şehirleri, vadileri ve otantik konaklama deneyimi sizi bekliyor.',
        price: '₺4,500',
        duration: '2 Gece / 3 Gün',
        main_image: 'https://picsum.photos/1200/500?random=6',
        gallery_images: [ 'https://picsum.photos/400/300?random=61', 'https://picsum.photos/400/300?random=62', 'https://picsum.photos/400/300?random=63' ],
        included: ['Balon Turu', 'Butik Otelde Konaklama', 'Tüm Kahvaltılar', 'Transfer Hizmetleri'],
        not_included: ['Öğle ve Akşam Yemekleri', 'Kişisel Harcamalar'],
        position: { lat: 38.6627, lng: 34.8556 },
        path: []
    },
    {
        id: 'balkanlar',
        category: 'yurt-disi', // FİLTRELEME İÇİN EKLENDİ
        name: 'Balkanlar Turu',
        short_description: 'Tarih ve doğanın iç içe geçtiği bir macera.',
        long_description: 'Belgrad\'ın hareketli sokaklarından Saraybosna\'nın tarihi atmosferine, Tiran\'ın renkli binalarına uzanan, farklı kültürleri bir arada yaşayacağınız kapsamlı bir Balkan keşfi.',
        price: '€800',
        duration: '6 Gece / 7 Gün',
        main_image: 'https://picsum.photos/1200/500?random=2',
        gallery_images: [ 'https://picsum.photos/400/300?random=21', 'https://picsum.photos/400/300?random=22', 'https://picsum.photos/400/300?random=23' ],
        included: ['Lüks Otobüs ile Ulaşım', 'Tüm Konaklamalar', 'Şehir Vergileri'],
        not_included: ['Vize Ücretleri', 'Yemekler', 'Ekstra Turlar'],
        position: { lat: 44.7866, lng: 20.4489 },
        path: [ { lat: 44.7866, lng: 20.4489 }, { lat: 43.8563, lng: 18.4131 }, { lat: 41.3275, lng: 19.8187 } ]
    },
    {
        id: 'ege-akdeniz',
        category: 'yurt-ici', // FİLTRELEME İÇİN EKLENDİ
        name: 'Ege & Akdeniz Sahil Turu',
        short_description: 'İzmir\'den Antalya\'ya masmavi bir yolculuk.',
        long_description: 'Türkiye\'nin en güzel sahillerini kapsayan bu turda, antik kentleri ziyaret edecek, masmavi koylarda yüzecek ve Ege mutfağının tadını çıkaracaksınız. Tam bir dinlenme ve kültür turu.',
        price: '₺9,800',
        duration: '5 Gece / 6 Gün',
        main_image: 'https://picsum.photos/1200/500?random=4',
        gallery_images: [ 'https://picsum.photos/400/300?random=41', 'https://picsum.photos/400/300?random=42', 'https://picsum.photos/400/300?random=43' ],
        included: ['Ulaşım', 'Tüm Konaklamalar', 'Sabah ve Akşam Yemekleri'],
        not_included: ['Öğle Yemekleri', 'Tekne Turları'],
        position: { lat: 38.4237, lng: 27.1428 },
        path: [ { lat: 38.4237, lng: 27.1428 }, { lat: 37.8380, lng: 27.2610 }, { lat: 37.0263, lng: 27.4323 }, { lat: 36.5458, lng: 29.1031 }, { lat: 36.8969, lng: 30.7133 } ]
    }
];
