import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, Search, ArrowRight, Info, Calculator, Shield, CreditCard } from 'lucide-react';

interface SSSSoru {
  id: string;
  kategori: string;
  soru: string;
  cevap: string;
  populer: boolean;
}

const sssVerileri: SSSSoru[] = [
  {
    id: '1',
    kategori: 'Genel',
    soru: 'Hesaplama araçları ücretsiz mi?',
    cevap: 'Evet, tüm hesaplama araçlarımız tamamen ücretsizdir. Herhangi bir kayıt veya ödeme gerektirmez.',
    populer: true
  },
  {
    id: '2',
    kategori: 'Genel',
    soru: 'Verilerim güvende mi?',
    cevap: 'Evet, girdiğiniz tüm veriler sadece tarayıcınızda işlenir ve sunucularımızda saklanmaz. Hesaplamalar tamamen yerel olarak yapılır.',
    populer: true
  },
  {
    id: '3',
    kategori: 'Kredi',
    soru: 'Kredi hesaplama sonuçları ne kadar doğru?',
    cevap: 'Hesaplama sonuçları genel bankacılık formüllerine göre yapılır ancak bankaların özel koşulları farklı olabilir. Kesin bilgi için bankanızla görüşün.',
    populer: true
  },
  {
    id: '4',
    kategori: 'Kredi',
    soru: 'Hangi kredi türleri için hesaplama yapabilirim?',
    cevap: 'İhtiyaç kredisi, konut kredisi, taşıt kredisi, iş yeri kredisi ve kredi dosya masrafı hesaplaması yapabilirsiniz.',
    populer: false
  },
  {
    id: '5',
    kategori: 'Matematik',
    soru: 'Geometrik şekillerin hangi alanlarını hesaplayabilirim?',
    cevap: 'Kare, dikdörtgen, üçgen ve daire alanlarını hesaplayabilirsiniz. Her şekil için uygun formüller kullanılır.',
    populer: false
  },
  {
    id: '6',
    kategori: 'Sağlık',
    soru: 'Adet döngüsü hesaplama ne kadar güvenilir?',
    cevap: 'Hesaplama genel tıbbi standartlara göre yapılır ancak her kadının döngüsü farklıdır. Düzensizlik durumunda doktora başvurun.',
    populer: true
  },
  {
    id: '7',
    kategori: 'Vergi',
    soru: 'Vergi hesaplamaları güncel mi?',
    cevap: '2025 yılı güncel vergi oranları kullanılır. Ancak mevzuat değişiklikleri olabileceği için resmi kaynaklardan doğrulama yapın.',
    populer: false
  },
  {
    id: '8',
    kategori: 'Eğitim',
    soru: 'Not hesaplama sistemleri hangi eğitim kademelerine uygun?',
    cevap: 'Lise ve üniversite not sistemleri için hesaplama araçları mevcuttur. MEB ve YÖK standartlarına uygun hesaplamalar yapılır.',
    populer: false
  },
  {
    id: '9',
    kategori: 'Teknik',
    soru: 'Mobil cihazlarda kullanabilir miyim?',
    cevap: 'Evet, tüm hesaplama araçları mobil cihazlarda mükemmel çalışır. Responsive tasarım ile tüm ekran boyutlarına uyumludur.',
    populer: false
  },
  {
    id: '10',
    kategori: 'Teknik',
    soru: 'Hesaplama sonuçlarını nasıl kaydedebilirim?',
    cevap: 'Sonuçları ekran görüntüsü alarak veya not ederek kaydedebilirsiniz. Gelecekte PDF indirme özelliği eklenecektir.',
    populer: false
  },
  {
    id: '11',
    kategori: 'Genel',
    soru: 'Yeni hesaplama araçları ne zaman eklenir?',
    cevap: 'Düzenli olarak yeni araçlar ekliyoruz. Öneri ve isteklerinizi iletişim formu ile bildirebilirsiniz.',
    populer: true
  },
  {
    id: '12',
    kategori: 'Hukuk',
    soru: 'Hukuki hesaplamalar mahkemede geçerli mi?',
    cevap: 'Hesaplamalar bilgilendirme amaçlıdır. Hukuki işlemler için mutlaka avukat veya hukuk müşaviri ile görüşün.',
    populer: false
  }
];

const kategoriler = ['Tümü', 'Genel', 'Kredi', 'Matematik', 'Sağlık', 'Vergi', 'Eğitim', 'Teknik', 'Hukuk'];

const SSS: React.FC = () => {
  const [selectedKategori, setSelectedKategori] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredSSS = sssVerileri.filter(item => {
    const kategoriMatch = selectedKategori === 'Tümü' || item.kategori === selectedKategori;
    const searchMatch = searchTerm === '' || 
      item.soru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cevap.toLowerCase().includes(searchTerm.toLowerCase());
    
    return kategoriMatch && searchMatch;
  });

  const populerSorular = sssVerileri.filter(item => item.populer);

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case 'Kredi': return CreditCard;
      case 'Matematik': return Calculator;
      case 'Sağlık': return Shield;
      default: return HelpCircle;
    }
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Sık Sorulan Sorular</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sık Sorulan Sorular
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hesaplama araçları hakkında merak ettiğiniz her şey
          </p>
        </div>

        {/* Arama ve Filtreler */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Soru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2">
              {kategoriler.map(kategori => (
                <button
                  key={kategori}
                  onClick={() => setSelectedKategori(kategori)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedKategori === kategori
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {kategori}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Popüler Sorular */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
                Popüler Sorular
              </h2>
              <div className="space-y-3">
                {populerSorular.map(soru => {
                  const IconComponent = getKategoriIcon(soru.kategori);
                  return (
                    <button
                      key={soru.id}
                      onClick={() => {
                        setSelectedKategori('Tümü');
                        setSearchTerm('');
                        if (!openItems.includes(soru.id)) {
                          setOpenItems(prev => [...prev, soru.id]);
                        }
                      }}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{soru.soru}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SSS Listesi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedKategori === 'Tümü' ? 'Tüm Sorular' : `${selectedKategori} Soruları`}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredSSS.length} soru)
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredSSS.length === 0 ? (
                  <div className="p-8 text-center">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aradığınız kriterlere uygun soru bulunamadı.</p>
                  </div>
                ) : (
                  filteredSSS.map(item => {
                    const isOpen = openItems.includes(item.id);
                    const IconComponent = getKategoriIcon(item.kategori);
                    
                    return (
                      <div key={item.id} className="p-6">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full text-left flex items-center justify-between group"
                        >
                          <div className="flex items-start space-x-3 flex-1">
                            <IconComponent className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.soru}
                              </h3>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                                {item.kategori}
                              </span>
                              {item.populer && (
                                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full mt-2 ml-2 inline-block">
                                  Popüler
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {isOpen && (
                          <div className="mt-4 pl-8">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-gray-700 leading-relaxed">{item.cevap}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Yardım Bölümü */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sorunuz Burada Yok mu?</h3>
              <p className="text-gray-700 mb-4">
                Aradığınız soruyu bulamadıysanız, bizimle iletişime geçmekten çekinmeyin. 
                Size yardımcı olmaktan memnuniyet duyarız.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/iletisim"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span>İletişime Geç</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    // Ana sayfadaki feedback modal'ı açmak için
                    window.location.href = '/#feedback';
                  }}
                  className="inline-flex items-center justify-center space-x-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <span>Öneri Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SSS;