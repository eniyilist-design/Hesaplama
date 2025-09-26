import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Home, Car, Briefcase, ArrowRight, Info, CreditCard, Building } from 'lucide-react';

interface HesaplamaInputs {
  krediTutari: number;
  faizOrani: number;
  vade: number;
  isletmeTuru: string;
}

interface HesaplamaSonuc {
  aylikOdeme: number;
  toplamGeriOdeme: number;
  toplamFaiz: number;
  aylikGelirOrani: number;
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
  { name: 'Konut Kredisi Hesaplama', icon: Home, link: '/kredi/konut-kredisi', active: true },
  { name: 'Taşıt Kredisi Hesaplama', icon: Car, link: '/kredi/tasit-kredisi', active: true }
];

const isletmeTurleri = [
  { value: 'perakende', label: 'Perakende Ticaret', faizCarpani: 1.0 },
  { value: 'imalat', label: 'İmalat Sanayi', faizCarpani: 0.9 },
  { value: 'hizmet', label: 'Hizmet Sektörü', faizCarpani: 1.1 },
  { value: 'teknoloji', label: 'Teknoloji', faizCarpani: 0.8 },
  { value: 'tarim', label: 'Tarım', faizCarpani: 0.7 },
  { value: 'turizm', label: 'Turizm', faizCarpani: 1.2 },
  { value: 'insaat', label: 'İnşaat', faizCarpani: 1.3 },
  { value: 'diger', label: 'Diğer', faizCarpani: 1.0 }
];

const IsYeriKredisiPage: React.FC = () => {
  const [inputs, setInputs] = useState<HesaplamaInputs>({
    krediTutari: 200000,
    faizOrani: 2.8,
    vade: 24,
    isletmeTuru: 'perakende'
  });
  
  const [aylikGelir, setAylikGelir] = useState<number>(50000);
  const [sonuc, setSonuc] = useState<HesaplamaSonuc | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const hesapla = () => {
    const { krediTutari, vade, isletmeTuru } = inputs;
    
    // İşletme türüne göre faiz oranı ayarlama
    const isletmeTipi = isletmeTurleri.find(t => t.value === isletmeTuru);
    const ayarlanmisFaizOrani = inputs.faizOrani * (isletmeTipi?.faizCarpani || 1.0);
    const aylikFaizOrani = ayarlanmisFaizOrani / 100;
    
    // Aylık ödeme hesaplama (eşit taksit)
    const aylikOdeme = (krediTutari * aylikFaizOrani * Math.pow(1 + aylikFaizOrani, vade)) / 
                       (Math.pow(1 + aylikFaizOrani, vade) - 1);
    
    const toplamGeriOdeme = aylikOdeme * vade;
    const toplamFaiz = toplamGeriOdeme - krediTutari;
    const aylikGelirOrani = (aylikOdeme / aylikGelir) * 100;
    
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
      aylikGelirOrani,
      aylikOdemeler
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs, aylikGelir]);

  const handleInputChange = (field: keyof HesaplamaInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedIsletme = () => {
    return isletmeTurleri.find(t => t.value === inputs.isletmeTuru);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/kredi" className="hover:text-orange-600 transition-colors">Kredi</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">İş Yeri Kredisi Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              İş Yeri Kredisi Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İşletme kredinizin aylık ödeme tutarını, toplam maliyetini ve detaylı ödeme planını hesaplayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-6 w-6 mr-3 text-orange-600" />
                İş Yeri Kredisi Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Kredi Tutarı (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.krediTutari}
                      onChange={(e) => handleInputChange('krediTutari', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                      min="10000"
                      step="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Aylık İşletme Geliri (TL)
                    </label>
                    <input
                      type="number"
                      value={aylikGelir}
                      onChange={(e) => setAylikGelir(Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                      min="5000"
                      step="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    İşletme Türü
                  </label>
                  <select
                    value={inputs.isletmeTuru}
                    onChange={(e) => handleInputChange('isletmeTuru', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                  >
                    {isletmeTurleri.map(tur => (
                      <option key={tur.value} value={tur.value}>
                        {tur.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    Faiz çarpanı: {getSelectedIsletme()?.faizCarpani}x 
                    {getSelectedIsletme()?.faizCarpani !== 1.0 && (
                      <span className={getSelectedIsletme()!.faizCarpani < 1.0 ? 'text-green-600' : 'text-red-600'}>
                        {getSelectedIsletme()!.faizCarpani < 1.0 ? ' (Avantajlı)' : ' (Riskli)'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Temel Aylık Faiz Oranı (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.faizOrani}
                      onChange={(e) => handleInputChange('faizOrani', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                      min="1.5"
                      max="5.0"
                      step="0.1"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      İşletme kredisi faiz oranları genelde %2.5 - %4.5 arasında
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
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                      min="6"
                      max="60"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Maksimum: 60 ay (5 yıl)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building className="h-6 w-6 mr-3 text-orange-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Aylık Ödeme</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(sonuc.aylikOdeme)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Gelir/Ödeme Oranı</div>
                    <div className={`text-lg font-bold ${
                      sonuc.aylikGelirOrani <= 30 ? 'text-green-600' :
                      sonuc.aylikGelirOrani <= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      %{sonuc.aylikGelirOrani.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sonuc.aylikGelirOrani <= 30 ? 'Güvenli oran' :
                       sonuc.aylikGelirOrani <= 50 ? 'Orta risk' : 'Yüksek risk'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Uygulanan Faiz Oranı</div>
                    <div className="text-lg font-bold text-blue-600">
                      %{(inputs.faizOrani * (getSelectedIsletme()?.faizCarpani || 1.0)).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sektör ayarlaması yapılmış
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
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
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

        {/* Sektör Analizi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sektör Bazlı Faiz Oranları</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isletmeTurleri.map(tur => (
              <div key={tur.value} className={`p-4 rounded-xl border-2 ${
                inputs.isletmeTuru === tur.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{tur.label}</h3>
                <div className="text-sm text-gray-600">
                  Çarpan: {tur.faizCarpani}x
                </div>
                <div className={`text-xs mt-1 ${
                  tur.faizCarpani < 1.0 ? 'text-green-600' :
                  tur.faizCarpani > 1.0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {tur.faizCarpani < 1.0 ? 'Düşük Risk' :
                   tur.faizCarpani > 1.0 ? 'Yüksek Risk' : 'Standart Risk'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benzer Araçlar */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benzer Hesaplama Araçları</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benzerAraclar.map((arac, index) => {
              const IconComponent = arac.icon;
              return (
                <Link key={index} to={arac.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-4">
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
              İş Yeri Kredisi Nedir ve Nasıl Hesaplanır?
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İş Yeri Kredisi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İş yeri kredisi, işletmelerin çalışma sermayesi ihtiyaçlarını karşılamak, yatırım yapmak 
              veya operasyonel giderlerini finanse etmek için bankalardan aldığı kredi türüdür. 
              Bu krediler genellikle işletmenin gelir durumu ve sektör riskine göre değerlendirilir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İş Yeri Kredisi Faiz Oranları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İş yeri kredisi faiz oranları, sektör riski ve işletmenin finansal durumuna göre değişir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Aylık %2.5 - %4.5 arasında değişir</li>
              <li>Düşük riskli sektörler için daha uygun oranlar</li>
              <li>Yüksek riskli sektörler için daha yüksek oranlar</li>
              <li>İşletmenin kredi geçmişi ve gelir durumu etkilidir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sektör Bazlı Risk Değerlendirmesi</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-900 mb-2">Düşük Risk Sektörleri</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Tarım (%0.7 çarpan)</li>
                  <li>• Teknoloji (%0.8 çarpan)</li>
                  <li>• İmalat (%0.9 çarpan)</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h4 className="font-semibold text-yellow-900 mb-2">Orta Risk Sektörleri</h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• Perakende (%1.0 çarpan)</li>
                  <li>• Hizmet (%1.1 çarpan)</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="font-semibold text-red-900 mb-2">Yüksek Risk Sektörleri</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  <li>• Turizm (%1.2 çarpan)</li>
                  <li>• İnşaat (%1.3 çarpan)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İş Yeri Kredisi Başvuru Şartları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>En az 1 yıl faaliyet geçmişi</li>
              <li>Düzenli gelir ve ciro belgesi</li>
              <li>Vergi borcu bulunmaması</li>
              <li>SGK prim borcu bulunmaması</li>
              <li>Kredi notu uygun olması</li>
              <li>Teminat gösterebilme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Gerekli Belgeler</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Ticaret sicil gazetesi</li>
              <li>Vergi levhası ve imza sirküleri</li>
              <li>Son 6 ay banka hesap ekstreleri</li>
              <li>Gelir tablosu ve bilanço</li>
              <li>Vergi borcu yokluk belgesi</li>
              <li>SGK prim borcu yokluk belgesi</li>
              <li>Teminat belgeleri</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kredi Kullanım Alanları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Çalışma sermayesi finansmanı</li>
              <li>Makine ve ekipman alımı</li>
              <li>İşyeri kira ödemeleri</li>
              <li>Personel maaş ödemeleri</li>
              <li>Stok alımları</li>
              <li>İşletme genişletme yatırımları</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-orange-900 mb-2">💡 İpucu</h4>
              <p className="text-orange-800">
                İş yeri kredisi başvurusu yapmadan önce yukarıdaki hesaplama aracımızı kullanarak 
                sektörünüze özel faiz oranları ile aylık ödeme tutarlarınızı hesaplayabilirsiniz. 
                Aylık ödemenin gelirinizin %30'unu geçmemesi önerilir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              İş yeri kredisi, işletmelerin büyümesi ve sürdürülebilirliği için önemli bir finansman 
              aracıdır. Sektör riskini dikkate alan hesaplama yöntemleri ile doğru kredi tutarı ve 
              vade seçimi yapabilirsiniz. Yukarıdaki hesaplama aracını kullanarak işletmenizin 
              finansal durumuna uygun kredi seçeneklerini değerlendirebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default IsYeriKredisiPage;