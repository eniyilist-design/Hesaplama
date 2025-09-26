import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Home, Car, Briefcase, ArrowRight, Info, CreditCard } from 'lucide-react';

interface HesaplamaInputs {
  krediTutari: number;
  faizOrani: number;
  vade: number;
  pesinOdeme: number;
}

interface HesaplamaSonuc {
  aylikOdeme: number;
  toplamGeriOdeme: number;
  toplamFaiz: number;
  krediTutari: number;
  ltv: number; // Loan to Value oranı
  aylikOdemeler: Array<{
    ay: number;
    anaParaOdeme: number;
    faizOdeme: number;
    aylikOdeme: number;
    kalanBorc: number;
  }>;
}

const benzerAraclar = [
  { name: 'İhtiyaç Kredisi Hesaplama', icon: CreditCard, link: '/kredi/ihtiyac-kredisi', active: true },
  { name: 'Taşıt Kredisi Hesaplama', icon: Car, link: '/kredi/tasit-kredisi', active: true },
  { name: 'İş Yeri Kredisi Hesaplama', icon: Briefcase, link: '/kredi/is-yeri-kredisi', active: true }
];

const KonutKredisiPage: React.FC = () => {
  const [inputs, setInputs] = useState<HesaplamaInputs>({
    krediTutari: 500000,
    faizOrani: 1.8,
    vade: 120,
    pesinOdeme: 100000
  });
  
  const [konutDegeri, setKonutDegeri] = useState<number>(600000);
  const [sonuc, setSonuc] = useState<HesaplamaSonuc | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const hesapla = () => {
    const { krediTutari, faizOrani, vade } = inputs;
    const aylikFaizOrani = faizOrani / 100;
    
    // Aylık ödeme hesaplama (eşit taksit)
    const aylikOdeme = (krediTutari * aylikFaizOrani * Math.pow(1 + aylikFaizOrani, vade)) / 
                       (Math.pow(1 + aylikFaizOrani, vade) - 1);
    
    const toplamGeriOdeme = aylikOdeme * vade;
    const toplamFaiz = toplamGeriOdeme - krediTutari;
    
    // LTV (Loan to Value) oranı
    const ltv = (krediTutari / konutDegeri) * 100;
    
    // Ödeme planı oluşturma
    const aylikOdemeler = [];
    let kalanBorc = krediTutari;
    
    for (let ay = 1; ay <= Math.min(vade, 60); ay++) { // İlk 5 yılı göster
      const faizOdeme = kalanBorc * aylikFaizOrani;
      const anaParaOdeme = aylikOdeme - faizOdeme;
      kalanBorc -= anaParaOdeme;
      
      aylikOdemeler.push({
        ay,
        anaParaOdeme,
        faizOdeme,
        aylikOdeme,
        kalanBorc: Math.max(0, kalanBorc)
      });
    }
    
    setSonuc({
      aylikOdeme,
      toplamGeriOdeme,
      toplamFaiz,
      krediTutari,
      ltv,
      aylikOdemeler
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs, konutDegeri]);

  const handleInputChange = (field: keyof HesaplamaInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/kredi" className="hover:text-green-600 transition-colors">Kredi</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Konut Kredisi Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Konut Kredisi Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ev kredinizin aylık ödeme tutarını, toplam maliyetini ve detaylı ödeme planını hesaplayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Home className="h-6 w-6 mr-3 text-green-600" />
                Konut Kredisi Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Konut Değeri (TL)
                    </label>
                    <input
                      type="number"
                      value={konutDegeri}
                      onChange={(e) => setKonutDegeri(Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="50000"
                      step="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Peşin Ödeme (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.pesinOdeme}
                      onChange={(e) => handleInputChange('pesinOdeme', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      step="5000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Kredi Tutarı (TL)
                  </label>
                  <input
                    type="number"
                    value={konutDegeri - inputs.pesinOdeme}
                    onChange={(e) => handleInputChange('krediTutari', Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium bg-gray-50"
                    readOnly
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Otomatik hesaplanır: Konut Değeri - Peşin Ödeme
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Aylık Faiz Oranı (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.faizOrani}
                      onChange={(e) => handleInputChange('faizOrani', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="0.5"
                      max="5"
                      step="0.1"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Konut kredisi faiz oranları genelde %1.2 - %2.5 arasında
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Vade (Ay)
                    </label>
                    <input
                      type="number"
                      value={inputs.vade}
                      onChange={(e) => handleInputChange('vade', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="12"
                      max="240"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Maksimum: 240 ay (20 yıl)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Aylık Ödeme</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(sonuc.aylikOdeme)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">LTV Oranı</div>
                    <div className="text-lg font-bold text-blue-600">
                      %{sonuc.ltv.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sonuc.ltv <= 75 ? 'İyi oran' : sonuc.ltv <= 85 ? 'Orta oran' : 'Yüksek oran'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Geri Ödeme</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sonuc.toplamGeriOdeme)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Faiz</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(sonuc.toplamFaiz)}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {showDetails ? 'Detayları Gizle' : 'Detaylı Ödeme Planı'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detaylı Ödeme Planı */}
        {sonuc && showDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaylı Ödeme Planı (İlk 5 Yıl)</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Taksit</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ana Para</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Faiz</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Aylık Ödeme</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Kalan Borç</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sonuc.aylikOdemeler.map((odeme) => (
                    <tr key={odeme.ay} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{odeme.ay}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                        {formatCurrency(odeme.anaParaOdeme)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                        {formatCurrency(odeme.faizOdeme)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-blue-600 font-bold">
                        {formatCurrency(odeme.aylikOdeme)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">
                        {formatCurrency(odeme.kalanBorc)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Benzer Araçlar */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benzer Hesaplama Araçları</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benzerAraclar.map((arac, index) => {
              const IconComponent = arac.icon;
              return (
                <Link key={index} to={arac.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SEO Makale */}
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <header className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Konut Kredisi Nedir ve Nasıl Hesaplanır?
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Konut Kredisi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Konut kredisi, ev satın almak isteyen kişilerin bankalardan aldığı uzun vadeli kredi türüdür. 
              Bu kredi türünde satın alınacak konut teminat olarak gösterilir ve genellikle 10-20 yıl 
              arasında değişen vadelerle kullanılır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Konut Kredisi Faiz Oranları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Konut kredisi faiz oranları, diğer kredi türlerine göre daha düşüktür. Bunun nedeni 
              kredinin teminatlı olmasıdır. Türkiye'de konut kredisi faiz oranları:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Aylık %1.2 - %2.5 arasında değişir</li>
              <li>Yıllık %15 - %30 arasında olabilir</li>
              <li>Merkez Bankası politika faizine bağlı olarak değişir</li>
              <li>Bankanın risk değerlendirmesine göre belirlenir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">LTV (Loan to Value) Oranı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              LTV oranı, kredi tutarının konut değerine oranıdır. Bu oran kredi riskini belirler:
            </p>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>%75 ve altı:</strong> Düşük risk, daha iyi faiz oranı</li>
                <li><strong>%75-85 arası:</strong> Orta risk, standart faiz oranı</li>
                <li><strong>%85 ve üzeri:</strong> Yüksek risk, yüksek faiz oranı</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Konut Kredisi Başvuru Şartları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>18-65 yaş arasında olmak</li>
              <li>Düzenli gelir sahibi olmak</li>
              <li>Kredi notu uygun olmak</li>
              <li>Konut değerinin en az %20'si peşin ödeme yapabilmek</li>
              <li>Aylık gelirin en az 3 katı kredi kullanabilmek</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Gerekli Belgeler</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Kimlik belgesi ve ikametgah belgesi</li>
              <li>Gelir belgesi (maaş bordrosu, SGK hizmet dökümü)</li>
              <li>Banka hesap ekstreleri</li>
              <li>Konut değerleme raporu</li>
              <li>Tapu senedi veya ön sözleşme</li>
              <li>Sigorta poliçesi</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-green-900 mb-2">💡 İpucu</h4>
              <p className="text-green-800">
                Konut kredisi başvurusu yapmadan önce yukarıdaki hesaplama aracımızı kullanarak 
                farklı vade ve faiz oranları ile aylık ödeme tutarlarınızı karşılaştırabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Konut kredisi, ev sahibi olmanın en yaygın yoludur. Doğru planlama ve hesaplama ile 
              bütçenize uygun kredi seçeneklerini değerlendirebilirsiniz. Yukarıdaki hesaplama 
              aracını kullanarak kredinizin toplam maliyetini öğrenebilir ve bilinçli kararlar alabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default KonutKredisiPage;