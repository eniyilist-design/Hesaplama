const fs = require('fs');
const path = require('path');

// Sayfa rotaları ve meta bilgileri
const pages = [
  {
    route: '/',
    title: 'Hesaplama Araçları - Kredi, Matematik, Sağlık ve Daha Fazlası | Ücretsiz Online Hesaplama',
    description: 'Türkiye\'nin en kapsamlı hesaplama araçları sitesi. Kredi, matematik, sağlık, vergi, muhasebe hesaplamalarını ücretsiz yapın. 2025 güncel verilerle doğru sonuçlar.',
    keywords: 'hesaplama araçları, kredi hesaplama, matematik hesaplama, sağlık hesaplama, vergi hesaplama, muhasebe, yaş hesaplama, alan hesaplama',
    filename: 'index.html'
  },
  {
    route: '/kredi',
    title: 'Kredi Hesaplama Araçları - İhtiyaç, Konut, Taşıt Kredisi Hesaplama',
    description: 'Kredi hesaplama araçları ile aylık ödeme, faiz ve toplam maliyet hesaplama. İhtiyaç, konut, taşıt ve iş yeri kredisi hesaplamaları.',
    keywords: 'kredi hesaplama, ihtiyaç kredisi, konut kredisi, taşıt kredisi, aylık ödeme hesaplama, faiz hesaplama',
    filename: 'kredi.html'
  },
  {
    route: '/kredi/ihtiyac-kredisi',
    title: 'İhtiyaç Kredisi Hesaplama - Aylık Ödeme ve Faiz Hesaplama',
    description: 'İhtiyaç kredisi aylık ödeme tutarı, toplam maliyet ve faiz hesaplama. Detaylı ödeme planı ve kredi analizi.',
    keywords: 'ihtiyaç kredisi hesaplama, aylık ödeme, faiz hesaplama, kredi maliyeti',
    filename: 'ihtiyac-kredisi.html'
  },
  {
    route: '/kredi/konut-kredisi',
    title: 'Konut Kredisi Hesaplama - Ev Kredisi Aylık Ödeme Hesaplama',
    description: 'Konut kredisi aylık ödeme, LTV oranı ve toplam maliyet hesaplama. Ev kredisi detaylı analizi.',
    keywords: 'konut kredisi hesaplama, ev kredisi, aylık ödeme, LTV oranı',
    filename: 'konut-kredisi.html'
  },
  {
    route: '/kredi/tasit-kredisi',
    title: 'Taşıt Kredisi Hesaplama - Araç Kredisi Aylık Ödeme',
    description: 'Taşıt kredisi aylık ödeme, toplam maliyet ve faiz hesaplama. Araç kredisi detaylı analizi.',
    keywords: 'taşıt kredisi hesaplama, araç kredisi, aylık ödeme, faiz hesaplama',
    filename: 'tasit-kredisi.html'
  },
  {
    route: '/kredi/is-yeri-kredisi',
    title: 'İş Yeri Kredisi Hesaplama - İşletme Kredisi Aylık Ödeme',
    description: 'İş yeri kredisi aylık ödeme, sektör bazlı faiz oranları ve toplam maliyet hesaplama.',
    keywords: 'iş yeri kredisi hesaplama, işletme kredisi, aylık ödeme, sektör faiz oranları',
    filename: 'is-yeri-kredisi.html'
  },
  {
    route: '/kredi/kredi-dosya-masrafi',
    title: 'Kredi Dosya Masrafı Hesaplama - Banka Masrafları ve BSMV',
    description: 'Kredi dosya masrafı, BSMV, sigorta ve diğer ek masrafları hesaplama. Banka türüne göre masraf analizi.',
    keywords: 'kredi dosya masrafı, BSMV hesaplama, banka masrafları, kredi ek ücretler',
    filename: 'kredi-dosya-masrafi.html'
  },
  {
    route: '/matematik',
    title: 'Matematik Hesaplama Araçları - Alan, Yüzde, Faiz Hesaplama',
    description: 'Matematik hesaplama araçları ile geometri, cebir ve istatistik hesaplamaları. Alan, yüzde, faiz hesaplama araçları.',
    keywords: 'matematik hesaplama, alan hesaplama, yüzde hesaplama, faiz hesaplama, geometri',
    filename: 'matematik.html'
  },
  {
    route: '/matematik/alan-hesaplama',
    title: 'Alan Hesaplama - Kare, Dikdörtgen, Üçgen, Daire Alanı',
    description: 'Geometrik şekillerin alanlarını hesaplama. Kare, dikdörtgen, üçgen ve daire alan hesaplama formülleri.',
    keywords: 'alan hesaplama, kare alanı, dikdörtgen alanı, üçgen alanı, daire alanı, geometri',
    filename: 'alan-hesaplama.html'
  },
  {
    route: '/matematik/yuzde-hesaplama',
    title: 'Yüzde Hesaplama - Yüzde Artış, Azalış ve Oran Hesaplama',
    description: 'Temel yüzde işlemleri, yüzde artış-azalış ve oran hesaplamaları. Günlük hayatta kullanılan yüzde hesaplama araçları.',
    keywords: 'yüzde hesaplama, yüzde artış, yüzde azalış, oran hesaplama, indirim hesaplama',
    filename: 'yuzde-hesaplama.html'
  },
  {
    route: '/matematik/faiz-hesaplama',
    title: 'Faiz Hesaplama - Basit Faiz, Bileşik Faiz ve Efektif Faiz',
    description: 'Basit faiz, bileşik faiz ve efektif faiz hesaplama araçları. Mevduat, kredi ve yatırım faiz hesaplamaları.',
    keywords: 'faiz hesaplama, basit faiz, bileşik faiz, efektif faiz, mevduat faizi',
    filename: 'faiz-hesaplama.html'
  },
  {
    route: '/saglik',
    title: 'Sağlık Hesaplama Araçları - Adet Günü, VKİ, Kalori Hesaplama',
    description: 'Sağlık hesaplama araçları ile adet döngüsü, VKİ, kalori ve diğer sağlık hesaplamalarınızı yapın.',
    keywords: 'sağlık hesaplama, adet günü hesaplama, VKİ hesaplama, kalori hesaplama',
    filename: 'saglik.html'
  },
  {
    route: '/saglik/adet-gunu-hesaplama',
    title: 'Adet Günü Hesaplama - Adet Döngüsü Takibi ve Yumurtlama Hesaplama',
    description: 'Adet döngüsü takibi, gelecek adet tarihleri ve yumurtlama günü hesaplama. Kadın sağlığı için detaylı analiz.',
    keywords: 'adet günü hesaplama, adet döngüsü, yumurtlama hesaplama, kadın sağlığı',
    filename: 'adet-gunu-hesaplama.html'
  },
  {
    route: '/zaman',
    title: 'Zaman Hesaplama Araçları - Yaş, Tarih Farkı, Çalışma Süresi',
    description: 'Zaman hesaplama araçları ile yaş, tarih farkı, çalışma süresi ve zaman dönüşüm hesaplamaları.',
    keywords: 'zaman hesaplama, yaş hesaplama, tarih farkı, çalışma süresi hesaplama',
    filename: 'zaman.html'
  },
  {
    route: '/zaman/yas-hesaplama',
    title: 'Yaş Hesaplama - Detaylı Yaş ve Doğum Günü Hesaplama',
    description: 'Doğum tarihinden itibaren detaylı yaş hesaplama, doğum günü takibi ve zaman analizi.',
    keywords: 'yaş hesaplama, doğum günü hesaplama, zaman analizi, yaş takibi',
    filename: 'yas-hesaplama.html'
  },
  {
    route: '/egitim',
    title: 'Eğitim Hesaplama Araçları - Not, Ortalama, Mezuniyet Hesaplama',
    description: 'Eğitim hesaplama araçları ile not ortalaması, mezuniyet puanı ve akademik başarı hesaplamaları.',
    keywords: 'eğitim hesaplama, not hesaplama, ortalama hesaplama, mezuniyet puanı',
    filename: 'egitim.html'
  },
  {
    route: '/egitim/ders-notu-hesaplama',
    title: 'Ders Notu Hesaplama - Sınav Notlarından Ders Geçme Notu',
    description: 'Sınav notlarından ders geçme notu ve yıllık başarı durumu hesaplama. Türkiye eğitim sistemine uygun.',
    keywords: 'ders notu hesaplama, sınav notu, geçme notu, yıllık not',
    filename: 'ders-notu-hesaplama.html'
  },
  {
    route: '/egitim/lise-ders-puani',
    title: 'Lise Ders Puanı Hesaplama - Kredi Sistemi ve GNO',
    description: 'Lise derslerinin kredi puanları ve genel not ortalaması (GNO) hesaplama.',
    keywords: 'lise ders puanı, kredi hesaplama, GNO hesaplama, lise not sistemi',
    filename: 'lise-ders-puani.html'
  },
  {
    route: '/egitim/lise-mezuniyet-puani',
    title: 'Lise Mezuniyet Puanı Hesaplama - Diploma Notu ve Takdir Belgesi',
    description: 'Lise mezuniyet puanı, diploma notu ve takdir-teşekkür belgesi hesaplama.',
    keywords: 'lise mezuniyet puanı, diploma notu, takdir belgesi, teşekkür belgesi',
    filename: 'lise-mezuniyet-puani.html'
  },
  {
    route: '/egitim/lise-ortalama',
    title: 'Lise Ortalama Hesaplama - Dönem Ortalaması ve Akademik Performans',
    description: 'Lise dönem ortalaması ve akademik performans analizi. Basit ve ağırlıklı ortalama hesaplama.',
    keywords: 'lise ortalama hesaplama, dönem ortalaması, akademik performans',
    filename: 'lise-ortalama.html'
  },
  {
    route: '/egitim/lise-sinif-gecme',
    title: 'Lise Sınıf Geçme Hesaplama - Geçme Koşulları ve Başarı Analizi',
    description: 'Lise sınıf geçme koşulları, ders başarı durumu ve geçme kriterleri hesaplama.',
    keywords: 'lise sınıf geçme, geçme koşulları, ders başarısı, sınıf tekrarı',
    filename: 'lise-sinif-gecme.html'
  },
  {
    route: '/egitim/lise-ybp',
    title: 'Lise Yılsonu Başarı Puanı (YBP) Hesaplama',
    description: 'Lise yılsonu başarı puanı (YBP) hesaplama ve dönem değerlendirmesi.',
    keywords: 'lise YBP, yılsonu başarı puanı, dönem değerlendirmesi',
    filename: 'lise-ybp.html'
  },
  {
    route: '/egitim/okula-baslama-yasi',
    title: 'Okula Başlama Yaşı Hesaplama - Çocuk Eğitim Yaş Kriterleri',
    description: 'Çocuğunuzun okula başlama yaşını hesaplama ve eğitim seviyesi belirleme.',
    keywords: 'okula başlama yaşı, çocuk eğitimi, yaş kriterleri, okul kayıt',
    filename: 'okula-baslama-yasi.html'
  },
  {
    route: '/egitim/universite-not-ortalamasi',
    title: 'Üniversite Not Ortalaması - GNO ve AGNO Hesaplama',
    description: 'Üniversite genel not ortalaması (GNO) ve ağırlıklı genel not ortalaması (AGNO) hesaplama.',
    keywords: 'üniversite not ortalaması, GNO hesaplama, AGNO hesaplama, harf notu',
    filename: 'universite-not-ortalamasi.html'
  },
  {
    route: '/egitim/vize-final-ortalama',
    title: 'Vize Final Ortalama Hesaplama - Üniversite Sınav Notu',
    description: 'Vize ve final notlarından ders ortalaması hesaplama. Hedef not belirleme ve bütünleme analizi.',
    keywords: 'vize final ortalama, üniversite sınav, ders ortalaması, hedef not',
    filename: 'vize-final-ortalama.html'
  },
  {
    route: '/sinav',
    title: 'Sınav Hesaplama Araçları - YKS, DGS, ALES, KPSS Puan Hesaplama',
    description: 'Sınav puan hesaplama araçları ile YKS, DGS, ALES, KPSS ve diğer sınavlar için puan hesaplama.',
    keywords: 'sınav hesaplama, YKS hesaplama, DGS hesaplama, ALES hesaplama, KPSS hesaplama',
    filename: 'sinav.html'
  },
  {
    route: '/sinav/dgs-hesaplama',
    title: 'DGS Hesaplama - Dikey Geçiş Sınavı Puan Hesaplama',
    description: 'DGS (Dikey Geçiş Sınavı) puan hesaplama, tercih analizi ve başarı değerlendirmesi.',
    keywords: 'DGS hesaplama, dikey geçiş sınavı, ön lisans, lisans geçiş',
    filename: 'dgs-hesaplama.html'
  },
  {
    route: '/finans',
    title: 'Finans Hesaplama Araçları - Altın, Döviz, Yatırım Hesaplama',
    description: 'Finans hesaplama araçları ile altın, döviz, yatırım ve birikim hesaplamaları.',
    keywords: 'finans hesaplama, altın hesaplama, döviz hesaplama, yatırım hesaplama',
    filename: 'finans.html'
  },
  {
    route: '/finans/altin-hesaplama',
    title: 'Altın Hesaplama - Altın Alım Satım Kar Zarar Hesaplama',
    description: 'Altın alım-satım kar-zarar hesaplama, yatırım getiri analizi ve komisyon hesaplama.',
    keywords: 'altın hesaplama, altın yatırım, kar zarar hesaplama, altın getiri',
    filename: 'altin-hesaplama.html'
  },
  {
    route: '/muhasebe',
    title: 'Muhasebe Hesaplama Araçları - Amortisman, Vergi, SGK Hesaplama',
    description: 'Muhasebe hesaplama araçları ile amortisman, vergi, SGK ve finansal analiz hesaplamaları.',
    keywords: 'muhasebe hesaplama, amortisman hesaplama, vergi hesaplama, SGK hesaplama',
    filename: 'muhasebe.html'
  },
  {
    route: '/muhasebe/amortisman-hesaplama',
    title: 'Amortisman Hesaplama - Duran Varlık Amortisman Hesaplama',
    description: 'Türkiye muhasebe standartlarına uygun amortisman hesaplama ve varlık değer kaybı analizi.',
    keywords: 'amortisman hesaplama, duran varlık, değer kaybı, muhasebe',
    filename: 'amortisman-hesaplama.html'
  },
  {
    route: '/vergi',
    title: 'Vergi Hesaplama Araçları - Damga Vergisi, KDV, Gelir Vergisi',
    description: '2025 güncel vergi oranları ile damga vergisi, KDV, gelir vergisi ve diğer vergi hesaplamaları.',
    keywords: 'vergi hesaplama, damga vergisi, KDV hesaplama, gelir vergisi',
    filename: 'vergi.html'
  },
  {
    route: '/vergi/damga-vergisi-hesaplama',
    title: 'Damga Vergisi Hesaplama - 2025 Güncel Oranlar ve Belge Türleri',
    description: '2025 yılı güncel damga vergisi oranları ile belge türlerine göre vergi hesaplama.',
    keywords: 'damga vergisi hesaplama, 2025 damga vergisi, belge türleri, vergi oranları',
    filename: 'damga-vergisi-hesaplama.html'
  },
  {
    route: '/ticaret',
    title: 'Ticaret Hesaplama Araçları - Arsa Payı, Emlak Değer Hesaplama',
    description: 'Ticaret hesaplama araçları ile arsa payı, emlak değer ve ticari hesaplamalar.',
    keywords: 'ticaret hesaplama, arsa payı hesaplama, emlak değer, ticari hesaplama',
    filename: 'ticaret.html'
  },
  {
    route: '/ticaret/arsa-payi-hesaplama',
    title: 'Arsa Payı Hesaplama - Gayrimenkul Hisse Oranı ve Yatırım Analizi',
    description: 'Gayrimenkul arsa payı hesaplama, hisse oranı analizi ve yatırım potansiyeli değerlendirmesi.',
    keywords: 'arsa payı hesaplama, gayrimenkul hisse, yatırım analizi, emlak',
    filename: 'arsa-payi-hesaplama.html'
  },
  {
    route: '/hukuk',
    title: 'Hukuk Hesaplama Araçları - Arabuluculuk, Avukat Ücreti Hesaplama',
    description: 'Hukuk hesaplama araçları ile arabuluculuk ücreti, avukat ücreti ve dava masrafı hesaplama.',
    keywords: 'hukuk hesaplama, arabuluculuk ücreti, avukat ücreti, dava masrafı',
    filename: 'hukuk.html'
  },
  {
    route: '/hukuk/arabuluculuk-ucreti-hesaplama',
    title: 'Arabuluculuk Ücreti Hesaplama - 2025 Güncel Ücret Tarifeleri',
    description: '2025 yılı güncel ücret tarifelerine göre arabuluculuk ücreti hesaplama ve maliyet analizi.',
    keywords: 'arabuluculuk ücreti hesaplama, 2025 arabuluculuk tarifeleri, uyuşmazlık çözümü',
    filename: 'arabuluculuk-ucreti-hesaplama.html'
  },
  {
    route: '/sigorta',
    title: 'Sigorta Hesaplama Araçları - Kasko, Trafik, Konut Sigortası',
    description: 'Sigorta hesaplama araçları ile kasko değeri, trafik sigortası ve konut sigortası hesaplama.',
    keywords: 'sigorta hesaplama, kasko değeri, trafik sigortası, konut sigortası',
    filename: 'sigorta.html'
  },
  {
    route: '/sigorta/arac-kasko-degeri-hesaplama',
    title: 'Araç Kasko Değeri Hesaplama - 2025 TSB Güncel Verileri',
    description: '2025 yılı TSB güncel verilerine göre araç kasko değeri ve sigorta primi hesaplama.',
    keywords: 'araç kasko değeri, TSB verileri, sigorta primi, araç değeri',
    filename: 'arac-kasko-degeri-hesaplama.html'
  },
  {
    route: '/seyahat',
    title: 'Seyahat Hesaplama Araçları - Mesafe, Maliyet, Süre Hesaplama',
    description: 'Seyahat hesaplama araçları ile şehirler arası mesafe, maliyet ve süre hesaplama.',
    keywords: 'seyahat hesaplama, mesafe hesaplama, seyahat maliyeti, şehirler arası',
    filename: 'seyahat.html'
  },
  {
    route: '/seyahat/iller-arasi-mesafe-hesaplama',
    title: 'İller Arası Mesafe Hesaplama - Türkiye Şehirleri Mesafe ve Süre',
    description: 'Türkiye şehirleri arası mesafe, seyahat süresi ve maliyet hesaplama araçları.',
    keywords: 'iller arası mesafe, şehirler arası mesafe, seyahat süresi, Türkiye mesafe',
    filename: 'iller-arasi-mesafe-hesaplama.html'
  },
  {
    route: '/diger',
    title: 'Diğer Hesaplama Araçları - Burç, Numeroloji, Renk Kodu',
    description: 'Diğer hesaplama araçları ile burç hesaplama, numeroloji ve çeşitli günlük hesaplamalar.',
    keywords: 'diğer hesaplama, burç hesaplama, numeroloji, renk kodu',
    filename: 'diger.html'
  },
  {
    route: '/diger/burc-hesaplama',
    title: 'Burç Hesaplama - Doğum Tarihi ile Burç Öğrenme ve Astroloji',
    description: 'Doğum tarihinize göre burcunuzu öğrenin, astrolojik özelliklerinizi keşfedin.',
    keywords: 'burç hesaplama, astroloji, doğum tarihi burç, 12 burç',
    filename: 'burc-hesaplama.html'
  },
  {
    route: '/iletisim',
    title: 'İletişim - Hesaplama Araçları İletişim Bilgileri',
    description: 'Hesaplama Araçları ile iletişime geçin. Sorularınız, önerileriniz için bizimle iletişim kurun.',
    keywords: 'iletişim, destek, öneri, geri bildirim',
    filename: 'iletisim.html'
  },
  {
    route: '/gizlilik',
    title: 'Gizlilik Politikası - Kişisel Verilerin Korunması (KVKK)',
    description: 'Hesaplama Araçları gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.',
    keywords: 'gizlilik politikası, KVKK, kişisel veri korunması',
    filename: 'gizlilik.html'
  },
  {
    route: '/kullanim-sartlari',
    title: 'Kullanım Şartları - Hesaplama Araçları Kullanım Koşulları',
    description: 'Hesaplama Araçları platformu kullanım şartları ve koşulları.',
    keywords: 'kullanım şartları, kullanım koşulları, şartlar',
    filename: 'kullanim-sartlari.html'
  },
  {
    route: '/sss',
    title: 'Sık Sorulan Sorular (SSS) - Hesaplama Araçları Hakkında',
    description: 'Hesaplama araçları hakkında sık sorulan sorular ve cevapları.',
    keywords: 'sık sorulan sorular, SSS, yardım, destek',
    filename: 'sss.html'
  }
];

// HTML şablonu
const generateHTML = (page) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="${page.keywords}">
    <meta name="author" content="Hesaplama Araçları">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://hesaplama-araclari.com${page.route}">
    <meta property="og:site_name" content="Hesaplama Araçları">
    <meta property="og:locale" content="tr_TR">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:site" content="@hesaplama_araclari">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://hesaplama-araclari.com${page.route}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg">
    
    <!-- Preconnect for Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${page.title}",
        "description": "${page.description}",
        "url": "https://hesaplama-araclari.com${page.route}",
        "inLanguage": "tr-TR",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Hesaplama Araçları",
            "url": "https://hesaplama-araclari.com",
            "description": "Türkiye'nin en kapsamlı hesaplama araçları sitesi",
            "publisher": {
                "@type": "Organization",
                "name": "Hesaplama Araçları",
                "url": "https://hesaplama-araclari.com"
            }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Ana Sayfa",
                    "item": "https://hesaplama-araclari.com"
                }${page.route !== '/' ? `,
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "${page.title.split(' - ')[0]}",
                    "item": "https://hesaplama-araclari.com${page.route}"
                }` : ''}
            ]
        }
    }
    </script>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
    
    <!-- Redirect to React App -->
    <script>
        // Immediately redirect to React app
        window.location.href = '${page.route}';
    </script>
    
    <!-- Fallback for no-JS users -->
    <noscript>
        <meta http-equiv="refresh" content="0; url=${page.route}">
    </noscript>
</head>
<body>
    <!-- Fallback content for crawlers -->
    <div id="static-content" style="display: none;">
        <header>
            <h1>${page.title.split(' - ')[0]}</h1>
            <nav>
                <a href="/">Ana Sayfa</a>
                <a href="/kredi">Kredi</a>
                <a href="/matematik">Matematik</a>
                <a href="/saglik">Sağlık</a>
                <a href="/egitim">Eğitim</a>
                <a href="/zaman">Zaman</a>
                <a href="/finans">Finans</a>
                <a href="/muhasebe">Muhasebe</a>
                <a href="/vergi">Vergi</a>
                <a href="/ticaret">Ticaret</a>
                <a href="/hukuk">Hukuk</a>
                <a href="/sigorta">Sigorta</a>
                <a href="/seyahat">Seyahat</a>
                <a href="/diger">Diğer</a>
            </nav>
        </header>
        
        <main>
            <h1>${page.title.split(' - ')[0]}</h1>
            <p>${page.description}</p>
            
            <section>
                <h2>Hesaplama Araçları</h2>
                <p>Bu sayfada ${page.title.split(' - ')[0].toLowerCase()} ile ilgili hesaplama araçlarını bulabilirsiniz.</p>
                <p>Ücretsiz, hızlı ve güvenli hesaplama araçlarımızı kullanarak ihtiyacınız olan hesaplamaları kolayca yapabilirsiniz.</p>
            </section>
            
            <section>
                <h2>Özellikler</h2>
                <ul>
                    <li>Ücretsiz kullanım</li>
                    <li>Hızlı ve doğru sonuçlar</li>
                    <li>Güvenli hesaplama</li>
                    <li>Mobil uyumlu tasarım</li>
                    <li>2025 güncel verileri</li>
                </ul>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2025 Hesaplama Araçları. Tüm hakları saklıdır.</p>
            <nav>
                <a href="/iletisim">İletişim</a>
                <a href="/gizlilik">Gizlilik</a>
                <a href="/kullanim-sartlari">Kullanım Şartları</a>
                <a href="/sss">SSS</a>
            </nav>
        </footer>
    </div>
    
    <!-- Loading message -->
    <div id="loading" style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1>Hesaplama Araçları</h1>
        <p>Sayfa yükleniyor...</p>
        <p>JavaScript devre dışı ise <a href="${page.route}">buraya tıklayın</a>.</p>
    </div>
</body>
</html>`;
};

// HTML dosyalarını oluştur
pages.forEach(page => {
    const htmlContent = generateHTML(page);
    const filePath = path.join(__dirname, '..', 'public', 'pages', page.filename);
    
    // Dizin yoksa oluştur
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // HTML dosyasını yaz
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✓ ${page.filename} oluşturuldu`);
});

console.log(`\n🎉 Toplam ${pages.length} HTML sayfası oluşturuldu!`);
console.log('\nOluşturulan dosyalar:');
pages.forEach(page => {
    console.log(`- public/pages/${page.filename} → ${page.route}`);
});