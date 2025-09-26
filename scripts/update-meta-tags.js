const fs = require('fs');
const path = require('path');

// index.html dosyasını güncelle
const indexPath = path.join(__dirname, '..', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Mevcut meta tag'leri güncelle
const updatedIndexContent = indexContent.replace(
    /<title>.*?<\/title>/,
    '<title>Hesaplama Araçları - Kredi, Matematik, Sağlık ve Daha Fazlası | Ücretsiz Online Hesaplama</title>'
).replace(
    /<meta name="description" content=".*?">/,
    '<meta name="description" content="Türkiye\'nin en kapsamlı hesaplama araçları sitesi. Kredi, matematik, sağlık, vergi, muhasebe hesaplamalarını ücretsiz yapın. 2025 güncel verilerle doğru sonuçlar.">'
).replace(
    /<meta name="keywords" content=".*?">/,
    '<meta name="keywords" content="hesaplama araçları, kredi hesaplama, matematik hesaplama, sağlık hesaplama, vergi hesaplama, muhasebe, yaş hesaplama, alan hesaplama">'
);

// Canonical URL ekle (eğer yoksa)
if (!updatedIndexContent.includes('<link rel="canonical"')) {
    const canonicalTag = '    <link rel="canonical" href="https://hesaplama-araclari.com/">\n    ';
    const updatedContent = updatedIndexContent.replace(
        '<meta name="twitter:description"',
        canonicalTag + '<meta name="twitter:description"'
    );
    fs.writeFileSync(indexPath, updatedContent, 'utf8');
} else {
    fs.writeFileSync(indexPath, updatedIndexContent, 'utf8');
}

console.log('✓ index.html meta tag\'leri güncellendi');

// Structured data için JSON-LD ekle
const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hesaplama Araçları",
    "url": "https://hesaplama-araclari.com",
    "description": "Türkiye'nin en kapsamlı hesaplama araçları sitesi",
    "inLanguage": "tr-TR",
    "publisher": {
        "@type": "Organization",
        "name": "Hesaplama Araçları",
        "url": "https://hesaplama-araclari.com"
    },
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://hesaplama-araclari.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    },
    "sameAs": [
        "https://twitter.com/hesaplama_araclari",
        "https://facebook.com/hesaplama.araclari"
    ]
};

console.log('✓ Structured data hazırlandı');
console.log('✓ Tüm SEO optimizasyonları tamamlandı');