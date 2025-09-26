import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, TrendingUp, Home, Car, Briefcase, ArrowRight, Info } from 'lucide-react';

interface HesaplamaInputs {
  krediTutari: number;
  faizOrani: number;
  vade: number;
}

interface HesaplamaSonuc {
  aylikOdeme: number;
  toplamGeriOdeme: number;
  toplamFaiz: number;
  aylikOdemeler: Array<{
    ay: number;
    anaParaOdeme: number;
    faizOdeme: number;
    aylikOdeme: number;
    kalanBorc: number;
  }>;
}

const benzerAraclar = [
  { name: 'Konut Kredisi Hesaplama', icon: Home, link: '#', active: false },
  { name: 'Taşıt Kredisi Hesaplama', icon: Car, link: '#', active: false },
  { name: 'Ticari Kredi Hesaplama', icon: Briefcase, link: '#', active: false }
];

const IhtiyacKredisiPage: React.FC = () => {
  const [inputs, setInputs] = useState<HesaplamaInputs>({
    krediTutari: 100000,
    faizOrani: 2.5,
    vade: 12
  });
  
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
    
    // Ödeme planı oluşturma
    const aylikOdemeler = [];
    let kalanBorc = krediTutari;
    
    for (let ay = 1; ay <= vade; ay++) {
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
      aylikOdemeler
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

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
          <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/kredi" className="hover:text-blue-600 transition-colors">Kredi</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">İhtiyaç Kredisi Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              İhtiyaç Kredisi Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İhtiyaç kredinizin aylık ödeme tutarını, toplam maliyetini ve detaylı ödeme planını hesaplayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Top Ad */}
          <div className="lg:col-span-3">
            <AdSenseDisplay size="large" />
          </div>
          
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="h-6 w-6 mr-3 text-blue-600" />
                Kredi Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Kredi Tutarı (TL)
                  </label>
                  <input
                    type="number"
                    value={inputs.krediTutari}
                    onChange={(e) => handleInputChange('krediTutari', Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    min="1000"
                    step="1000"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Minimum: 1.000 TL - Maksimum: 1.000.000 TL
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Aylık Faiz Oranı (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.faizOrani}
                    onChange={(e) => handleInputChange('faizOrani', Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    min="0.1"
                    max="10"
                    step="0.1"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Genelde %1.5 - %4.5 arasında değişir
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
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    min="3"
                    max="60"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Minimum: 3 ay - Maksimum: 60 ay
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Aylık Ödeme</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(sonuc.aylikOdeme)}
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaylı Ödeme Planı</h2>
            
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

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Benzer Araçlar */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benzer Hesaplama Araçları</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benzerAraclar.map((arac, index) => {
              const IconComponent = arac.icon;
              return (
                <div key={index} className={`
                  bg-white rounded-2xl p-6 shadow-lg border border-gray-100
                  ${arac.active ? 'hover:shadow-xl cursor-pointer' : 'opacity-75'}
                  transition-all duration-300
                `}>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                  {!arac.active && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Yakında
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SEO Makale */}
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <header className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              İhtiyaç Kredisi Nedir ve Nasıl Hesaplanır?
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İhtiyaç Kredisi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İhtiyaç kredisi, herhangi bir teminat göstermeden, sadece kişinin gelir durumu ve kredi geçmişine bakılarak verilen 
              kredi türüdür. Bu kredi türü, ani nakit ihtiyaçlarını karşılamak, borçları konsolide etmek veya beklenmedik 
              harcamalar için kullanılabilir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İhtiyaç Kredisi Faiz Oranları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İhtiyaç kredisi faiz oranları, bankanın belirlediği aylık faiz oranı üzerinden hesaplanır. Bu oran genellikle 
              aylık %1.5 ile %4.5 arasında değişir. Faiz oranı, kişinin:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Kredi skoruna</li>
              <li>Gelir durumuna</li>
              <li>Mevcut borçlarına</li>
              <li>Kredi vadesine göre belirlenir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İhtiyaç kredisi hesaplaması, eşit taksitli ödeme planı sistemine göre yapılır. Bu sistemde her ay aynı tutarda 
              ödeme yapılır, ancak ödemenin içindeki ana para ve faiz oranı her ay değişir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kredi Başvurusu İçin Gerekli Belgeler</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Nüfus cüzdanı fotokopisi</li>
              <li>Gelir belgesi (maaş bordrosu, SGK hizmet dökümü)</li>
              <li>İkametgah belgesi</li>
              <li>Banka hesap ekstreleri</li>
              <li>Varsa diğer gelir belgeleri</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dikkat Edilmesi Gereken Noktalar</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İhtiyaç kredisi alırken dikkat edilmesi gereken en önemli noktalar şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Aylık ödeme kapasitesini aşmamak</li>
              <li>Farklı bankaların faiz oranlarını karşılaştırmak</li>
              <li>Erken ödeme imkanı ve komisyon oranlarını öğrenmek</li>
              <li>Toplam maliyeti hesaplamak</li>
              <li>Gizli masraf ve komisyonları öğrenmek</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">💡 İpucu</h4>
              <p className="text-blue-800">
                Kredi başvurusu yapmadan önce yukarıdaki hesaplama aracımızı kullanarak farklı vade ve 
                faiz oranları ile aylık ödeme tutarlarınızı karşılaştırabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              İhtiyaç kredisi, doğru kullanıldığında faydalı bir finansal araçtır. Ancak kredi alırken dikkatli olmak ve 
              ödeme planınızı önceden hesaplamak çok önemlidir. Yukarıdaki hesaplama aracını kullanarak kredinizin 
              toplam maliyetini öğrenebilir ve bütçenize uygun kararlar alabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default IhtiyacKredisiPage;