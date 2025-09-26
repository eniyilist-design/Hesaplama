import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, FileText, CreditCard, ArrowRight, Info, Receipt, DollarSign, AlertCircle } from 'lucide-react';

interface MasrafInputs {
  krediTutari: number;
  krediTuru: string;
  bankaTuru: string;
  sigortaSecimi: boolean;
  ekspertizGerekli: boolean;
  noterdanTasdik: boolean;
}

interface MasrafSonuc {
  dosyaMasrafi: number;
  bsmv: number;
  sigorta: number;
  ekspertiz: number;
  noter: number;
  toplamMasraf: number;
  krediTutariIleMasraf: number;
  masrafOrani: number;
}

const krediTurleri = [
  { value: 'ihtiyac', label: 'İhtiyaç Kredisi', dosyaOrani: 0.5, sigortaOrani: 0.8 },
  { value: 'konut', label: 'Konut Kredisi', dosyaOrani: 0.3, sigortaOrani: 0.2 },
  { value: 'tasit', label: 'Taşıt Kredisi', dosyaOrani: 0.4, sigortaOrani: 0.6 },
  { value: 'isyeri', label: 'İş Yeri Kredisi', dosyaOrani: 0.6, sigortaOrani: 1.0 }
];

const bankaTurleri = [
  { value: 'kamu', label: 'Kamu Bankası', carpan: 0.8 },
  { value: 'ozel', label: 'Özel Banka', carpan: 1.0 },
  { value: 'yabanci', label: 'Yabancı Banka', carpan: 1.2 },
  { value: 'katilim', label: 'Katılım Bankası', carpan: 0.9 }
];

const benzerAraclar = [
  { name: 'İhtiyaç Kredisi Hesaplama', icon: CreditCard, link: '/kredi/ihtiyac-kredisi', active: true },
  { name: 'Konut Kredisi Hesaplama', icon: FileText, link: '/kredi/konut-kredisi', active: true },
  { name: 'Taşıt Kredisi Hesaplama', icon: Calculator, link: '/kredi/tasit-kredisi', active: true }
];

const KrediDosyaMasrafiPage: React.FC = () => {
  const [inputs, setInputs] = useState<MasrafInputs>({
    krediTutari: 100000,
    krediTuru: 'ihtiyac',
    bankaTuru: 'ozel',
    sigortaSecimi: true,
    ekspertizGerekli: false,
    noterdanTasdik: false
  });
  
  const [sonuc, setSonuc] = useState<MasrafSonuc | null>(null);

  const hesapla = () => {
    const { krediTutari, krediTuru, bankaTuru, sigortaSecimi, ekspertizGerekli, noterdanTasdik } = inputs;
    
    const krediTipi = krediTurleri.find(k => k.value === krediTuru);
    const bankaTipi = bankaTurleri.find(b => b.value === bankaTuru);
    
    if (!krediTipi || !bankaTipi) return;
    
    // Dosya masrafı hesaplama
    const temelDosyaMasrafi = krediTutari * (krediTipi.dosyaOrani / 100);
    const dosyaMasrafi = temelDosyaMasrafi * bankaTipi.carpan;
    
    // BSMV (Banka ve Sigorta Muameleleri Vergisi) %5
    const bsmv = dosyaMasrafi * 0.05;
    
    // Sigorta masrafı
    const sigorta = sigortaSecimi ? krediTutari * (krediTipi.sigortaOrani / 100) : 0;
    
    // Ekspertiz masrafı (taşıt ve konut kredilerinde)
    const ekspertiz = ekspertizGerekli ? Math.min(krediTutari * 0.001, 2000) : 0;
    
    // Noter masrafı
    const noter = noterdanTasdik ? Math.min(krediTutari * 0.002, 1500) : 0;
    
    const toplamMasraf = dosyaMasrafi + bsmv + sigorta + ekspertiz + noter;
    const krediTutariIleMasraf = krediTutari + toplamMasraf;
    const masrafOrani = (toplamMasraf / krediTutari) * 100;
    
    setSonuc({
      dosyaMasrafi,
      bsmv,
      sigorta,
      ekspertiz,
      noter,
      toplamMasraf,
      krediTutariIleMasraf,
      masrafOrani
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof MasrafInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedKrediTuru = () => {
    return krediTurleri.find(k => k.value === inputs.krediTuru);
  };

  const getSelectedBankaTuru = () => {
    return bankaTurleri.find(b => b.value === inputs.bankaTuru);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/kredi" className="hover:text-indigo-600 transition-colors">Kredi</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Kredi Dosya Masrafı Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Kredi Dosya Masrafı Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kredi başvurunuzda ödeyeceğiniz tüm masrafları ve ek ücretleri hesaplayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Receipt className="h-6 w-6 mr-3 text-indigo-600" />
                Kredi ve Masraf Bilgileri
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
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                    min="1000"
                    step="1000"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Kredi Türü
                    </label>
                    <select
                      value={inputs.krediTuru}
                      onChange={(e) => handleInputChange('krediTuru', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                    >
                      {krediTurleri.map(tur => (
                        <option key={tur.value} value={tur.value}>
                          {tur.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      Dosya masrafı oranı: %{getSelectedKrediTuru()?.dosyaOrani}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Banka Türü
                    </label>
                    <select
                      value={inputs.bankaTuru}
                      onChange={(e) => handleInputChange('bankaTuru', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                    >
                      {bankaTurleri.map(banka => (
                        <option key={banka.value} value={banka.value}>
                          {banka.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      Masraf çarpanı: {getSelectedBankaTuru()?.carpan}x
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ek Masraflar</h3>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sigorta"
                      checked={inputs.sigortaSecimi}
                      onChange={(e) => handleInputChange('sigortaSecimi', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="sigorta" className="text-gray-700">
                      Hayat/İşsizlik Sigortası
                    </label>
                    <span className="text-sm text-gray-500">
                      (%{getSelectedKrediTuru()?.sigortaOrani} ek masraf)
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="ekspertiz"
                      checked={inputs.ekspertizGerekli}
                      onChange={(e) => handleInputChange('ekspertizGerekli', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="ekspertiz" className="text-gray-700">
                      Ekspertiz Raporu
                    </label>
                    <span className="text-sm text-gray-500">
                      (Taşıt/Konut kredilerinde gerekli)
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="noter"
                      checked={inputs.noterdanTasdik}
                      onChange={(e) => handleInputChange('noterdanTasdik', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="noter" className="text-gray-700">
                      Noter Tasdiki
                    </label>
                    <span className="text-sm text-gray-500">
                      (Yüksek tutarlı kredilerde)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="h-6 w-6 mr-3 text-indigo-600" />
                  Masraf Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Masraf</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {formatCurrency(sonuc.toplamMasraf)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Kredi tutarının %{sonuc.masrafOrani.toFixed(2)}'si
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Dosya Masrafı</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sonuc.dosyaMasrafi)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">BSMV (%5)</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(sonuc.bsmv)}
                    </div>
                  </div>

                  {sonuc.sigorta > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Sigorta Masrafı</div>
                      <div className="text-lg font-bold text-orange-600">
                        {formatCurrency(sonuc.sigorta)}
                      </div>
                    </div>
                  )}

                  {sonuc.ekspertiz > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Ekspertiz Masrafı</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(sonuc.ekspertiz)}
                      </div>
                    </div>
                  )}

                  {sonuc.noter > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Noter Masrafı</div>
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(sonuc.noter)}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
                    <div className="text-sm text-gray-600 mb-1">Toplam Ödeyeceğiniz</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(sonuc.krediTutariIleMasraf)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Kredi + Masraflar
                    </div>
                  </div>

                  {sonuc.masrafOrani > 3 && (
                    <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <strong>Uyarı:</strong> Masraf oranı yüksek. Farklı bankaları karşılaştırın.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Masraf Türleri Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kredi Masraf Türleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zorunlu Masraflar</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Dosya Masrafı</h4>
                  <p className="text-sm text-red-800">
                    Kredi başvuru işlemleri için alınan masraf. Kredi türüne göre %0.3-0.6 arasında değişir.
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">BSMV (%5)</h4>
                  <p className="text-sm text-red-800">
                    Banka ve Sigorta Muameleleri Vergisi. Dosya masrafının %5'i kadar ek vergi.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İsteğe Bağlı Masraflar</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Sigorta Masrafı</h4>
                  <p className="text-sm text-blue-800">
                    Hayat ve işsizlik sigortası. Kredi türüne göre %0.2-1.0 arasında değişir.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Ekspertiz/Noter</h4>
                  <p className="text-sm text-blue-800">
                    Taşıt/konut kredilerinde ekspertiz, yüksek tutarlarda noter masrafı.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banka Türleri Karşılaştırması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Banka Türlerine Göre Masraf Oranları</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {bankaTurleri.map(banka => (
              <div key={banka.value} className={`p-4 rounded-xl border-2 ${
                inputs.bankaTuru === banka.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{banka.label}</h3>
                <div className="text-sm text-gray-600">
                  Çarpan: {banka.carpan}x
                </div>
                <div className={`text-xs mt-1 ${
                  banka.carpan < 1.0 ? 'text-green-600' :
                  banka.carpan > 1.0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {banka.carpan < 1.0 ? 'Düşük Masraf' :
                   banka.carpan > 1.0 ? 'Yüksek Masraf' : 'Standart Masraf'}
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
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
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
              Kredi Dosya Masrafı Nedir ve Nasıl Hesaplanır?
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kredi Dosya Masrafı Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kredi dosya masrafı, bankalar tarafından kredi başvuru sürecinde yapılan işlemler karşılığında 
              alınan ücrettir. Bu masraf, kredi onay sürecindeki evrak işlemleri, değerlendirme maliyetleri 
              ve idari giderler için tahsil edilir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Masraf Türleri ve Oranları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kredi başvurusunda karşılaşabileceğiniz temel masraf türleri şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Dosya Masrafı:</strong> Kredi tutarının %0.3-0.6'sı arasında</li>
              <li><strong>BSMV:</strong> Dosya masrafının %5'i (zorunlu vergi)</li>
              <li><strong>Sigorta Masrafı:</strong> Kredi tutarının %0.2-1.0'ı arasında</li>
              <li><strong>Ekspertiz Masrafı:</strong> 500-2000 TL arası (taşıt/konut)</li>
              <li><strong>Noter Masrafı:</strong> 200-1500 TL arası (yüksek tutarlarda)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kredi Türüne Göre Masraf Oranları</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Düşük Masraflı Krediler</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Konut Kredisi: %0.3 dosya masrafı</li>
                  <li>Taşıt Kredisi: %0.4 dosya masrafı</li>
                  <li>Teminatlı krediler genelde daha uygun</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Yüksek Masraflı Krediler</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>İhtiyaç Kredisi: %0.5 dosya masrafı</li>
                  <li>İş Yeri Kredisi: %0.6 dosya masrafı</li>
                  <li>Teminatsız krediler daha pahalı</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Banka Türüne Göre Masraf Farkları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Kamu Bankaları:</strong> Genelde %20 daha düşük masraf</li>
              <li><strong>Özel Bankalar:</strong> Standart masraf oranları</li>
              <li><strong>Yabancı Bankalar:</strong> %20 daha yüksek masraf</li>
              <li><strong>Katılım Bankaları:</strong> %10 daha düşük masraf</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Masraf Tasarrufu İpuçları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Farklı bankaların masraf oranlarını karşılaştırın</li>
              <li>Mevcut müşteri avantajlarını araştırın</li>
              <li>Kampanya dönemlerini takip edin</li>
              <li>Sigorta seçeneklerini değerlendirin</li>
              <li>Gereksiz ek hizmetlerden kaçının</li>
            </ul>

            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-indigo-900 mb-2">💡 İpucu</h4>
              <p className="text-indigo-800">
                Kredi başvurusu yapmadan önce yukarıdaki hesaplama aracımızı kullanarak 
                farklı banka ve kredi türlerindeki masraf tutarlarını karşılaştırabilirsiniz. 
                Bu sayede en uygun seçeneği belirleyebilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Kredi dosya masrafları, kredi maliyetinin önemli bir bileşenidir. Bu masrafları 
              önceden hesaplayarak bütçenizi doğru planlayabilir ve en uygun kredi seçeneğini 
              belirleyebilirsiniz. Yukarıdaki hesaplama aracını kullanarak tüm masrafları 
              detaylı olarak görebilir ve bilinçli kararlar alabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default KrediDosyaMasrafiPage;