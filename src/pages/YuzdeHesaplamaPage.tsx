import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, Percent, TrendingUp, TrendingDown, ArrowRight, Info, Target, BarChart3, Plus, Minus } from 'lucide-react';

interface YuzdeInputs {
  hesaplamaTuru: string;
  degerA: number;
  degerB: number;
  yuzdeOrani: number;
}

interface YuzdeSonuc {
  sonuc: number;
  formul: string;
  aciklama: string;
  ornekHesaplama: string;
  birim: string;
}

const hesaplamaTurleri = [
  { 
    value: 'yuzde-al', 
    label: "A'nın %B'si", 
    aciklama: 'Bir sayının belirli yüzdesini hesaplar',
    formul: 'F = A × (B/100)',
    ornek: '200\'ün %15\'i = 200 × (15/100) = 30'
  },
  { 
    value: 'yuzde-oran', 
    label: "A, B'nin yüzde kaçı", 
    aciklama: 'Bir sayının diğerine oranını yüzde olarak hesaplar',
    formul: 'p(%) = (A/B) × 100',
    ornek: '50, 200\'ün yüzde kaçı = (50/200) × 100 = %25'
  },
  { 
    value: 'yuzde-degisim', 
    label: "A'dan B'ye yüzde değişim", 
    aciklama: 'İki değer arasındaki yüzde değişimi hesaplar',
    formul: 'p(%) = ((B-A)/A) × 100',
    ornek: '100\'den 120\'ye değişim = ((120-100)/100) × 100 = %20'
  },
  { 
    value: 'yuzde-artir', 
    label: "A'yı %B artır", 
    aciklama: 'Bir sayıyı belirli yüzde oranında artırır',
    formul: 'F = A × (1 + B/100)',
    ornek: '100\'ü %20 artır = 100 × (1 + 20/100) = 120'
  },
  { 
    value: 'yuzde-azalt', 
    label: "A'yı %B azalt", 
    aciklama: 'Bir sayıyı belirli yüzde oranında azaltır',
    formul: 'F = A × (1 - B/100)',
    ornek: '100\'ü %20 azalt = 100 × (1 - 20/100) = 80'
  }
];

const benzerAraclar = [
  { name: 'Alan Hesaplama', icon: Calculator, link: '/matematik/alan-hesaplama', active: true },
  { name: 'Hacim Hesaplama', icon: BarChart3, link: '#', active: false },
  { name: 'Çevre Hesaplama', icon: Target, link: '#', active: false }
];

const YuzdeHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<YuzdeInputs>({
    hesaplamaTuru: 'yuzde-al',
    degerA: 100,
    degerB: 20,
    yuzdeOrani: 15
  });
  
  const [sonuc, setSonuc] = useState<YuzdeSonuc | null>(null);

  const hesapla = () => {
    const { hesaplamaTuru, degerA, degerB, yuzdeOrani } = inputs;
    let sonucDeger = 0;
    let formul = '';
    let aciklama = '';
    let ornekHesaplama = '';
    let birim = '';

    const hesaplamaTipi = hesaplamaTurleri.find(h => h.value === hesaplamaTuru);
    
    switch (hesaplamaTuru) {
      case 'yuzde-al':
        // A'nın %B'si
        sonucDeger = degerA * (yuzdeOrani / 100);
        formul = `${degerA} × (${yuzdeOrani}/100) = ${sonucDeger}`;
        aciklama = `${degerA} sayısının %${yuzdeOrani}'si`;
        ornekHesaplama = `${degerA} × ${yuzdeOrani/100} = ${sonucDeger}`;
        birim = 'sayı';
        break;
      
      case 'yuzde-oran':
        // A, B'nin yüzde kaçı
        if (degerB === 0) {
          sonucDeger = 0;
          aciklama = 'Payda sıfır olamaz';
        } else {
          sonucDeger = (degerA / degerB) * 100;
          formul = `(${degerA}/${degerB}) × 100 = ${sonucDeger.toFixed(2)}`;
          aciklama = `${degerA}, ${degerB}'nin yüzde kaçı`;
          ornekHesaplama = `(${degerA} ÷ ${degerB}) × 100 = %${sonucDeger.toFixed(2)}`;
        }
        birim = '%';
        break;
      
      case 'yuzde-degisim':
        // A'dan B'ye yüzde değişim
        if (degerA === 0) {
          sonucDeger = 0;
          aciklama = 'Başlangıç değeri sıfır olamaz';
        } else {
          sonucDeger = ((degerB - degerA) / degerA) * 100;
          formul = `((${degerB}-${degerA})/${degerA}) × 100 = ${sonucDeger.toFixed(2)}`;
          aciklama = `${degerA}'dan ${degerB}'ye değişim`;
          ornekHesaplama = `((${degerB} - ${degerA}) ÷ ${degerA}) × 100 = %${sonucDeger.toFixed(2)}`;
        }
        birim = '%';
        break;
      
      case 'yuzde-artir':
        // A'yı %B artır
        sonucDeger = degerA * (1 + yuzdeOrani / 100);
        formul = `${degerA} × (1 + ${yuzdeOrani}/100) = ${sonucDeger}`;
        aciklama = `${degerA} sayısını %${yuzdeOrani} artırma`;
        ornekHesaplama = `${degerA} × (1 + ${yuzdeOrani/100}) = ${sonucDeger}`;
        birim = 'sayı';
        break;
      
      case 'yuzde-azalt':
        // A'yı %B azalt
        sonucDeger = degerA * (1 - yuzdeOrani / 100);
        formul = `${degerA} × (1 - ${yuzdeOrani}/100) = ${sonucDeger}`;
        aciklama = `${degerA} sayısını %${yuzdeOrani} azaltma`;
        ornekHesaplama = `${degerA} × (1 - ${yuzdeOrani/100}) = ${sonucDeger}`;
        birim = 'sayı';
        break;
    }

    setSonuc({
      sonuc: sonucDeger,
      formul,
      aciklama,
      ornekHesaplama,
      birim
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof YuzdeInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatSayi = (sayi: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(sayi);
  };

  const getSelectedHesaplama = () => {
    return hesaplamaTurleri.find(h => h.value === inputs.hesaplamaTuru);
  };

  const getInputLabels = () => {
    switch (inputs.hesaplamaTuru) {
      case 'yuzde-al':
        return { labelA: 'Sayı (A)', labelB: 'Yüzde Oranı (%)', showB: false, showYuzde: true };
      case 'yuzde-oran':
        return { labelA: 'Pay (A)', labelB: 'Payda (B)', showB: true, showYuzde: false };
      case 'yuzde-degisim':
        return { labelA: 'Başlangıç Değeri (A)', labelB: 'Bitiş Değeri (B)', showB: true, showYuzde: false };
      case 'yuzde-artir':
        return { labelA: 'Sayı (A)', labelB: 'Artış Oranı (%)', showB: false, showYuzde: true };
      case 'yuzde-azalt':
        return { labelA: 'Sayı (A)', labelB: 'Azalış Oranı (%)', showB: false, showYuzde: true };
      default:
        return { labelA: 'Değer A', labelB: 'Değer B', showB: true, showYuzde: false };
    }
  };

  const inputLabels = getInputLabels();

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/matematik" className="hover:text-yellow-600 transition-colors">Matematik</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Yüzde Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Yüzde Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temel yüzde işlemleri, yüzde artış-azalış ve oran hesaplamalarını kolayca yapın
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
                <Percent className="h-6 w-6 mr-3 text-yellow-600" />
                Yüzde Hesaplama Türü
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hesaplama Türü
                  </label>
                  <select
                    value={inputs.hesaplamaTuru}
                    onChange={(e) => handleInputChange('hesaplamaTuru', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                  >
                    {hesaplamaTurleri.map(tur => (
                      <option key={tur.value} value={tur.value}>
                        {tur.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedHesaplama()?.aciklama}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {inputLabels.labelA}
                    </label>
                    <input
                      type="number"
                      value={inputs.degerA}
                      onChange={(e) => handleInputChange('degerA', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      step="0.01"
                    />
                  </div>

                  {inputLabels.showB && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {inputLabels.labelB}
                      </label>
                      <input
                        type="number"
                        value={inputs.degerB}
                        onChange={(e) => handleInputChange('degerB', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                        step="0.01"
                      />
                    </div>
                  )}

                  {inputLabels.showYuzde && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {inputLabels.labelB}
                      </label>
                      <input
                        type="number"
                        value={inputs.yuzdeOrani}
                        onChange={(e) => handleInputChange('yuzdeOrani', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                        step="0.1"
                      />
                    </div>
                  )}
                </div>

                {/* Formül Gösterimi */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Kullanılan Formül</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <code className="text-lg font-mono text-yellow-800">
                      {getSelectedHesaplama()?.formul}
                    </code>
                  </div>
                  <div className="mt-3 text-sm text-yellow-700">
                    <strong>Örnek:</strong> {getSelectedHesaplama()?.ornek}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-yellow-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Sonuç</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {formatSayi(sonuc.sonuc)}
                      {sonuc.birim === '%' && '%'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.birim === '%' ? 'Yüzde' : 'Sayı'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Hesaplama</div>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {sonuc.formul}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Açıklama</div>
                    <div className="text-sm text-gray-700">
                      {sonuc.aciklama}
                    </div>
                  </div>

                  {(inputs.hesaplamaTuru === 'yuzde-degisim') && (
                    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                      sonuc.sonuc > 0 ? 'border-green-500' : sonuc.sonuc < 0 ? 'border-red-500' : 'border-gray-500'
                    }`}>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        {sonuc.sonuc > 0 ? (
                          <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        ) : sonuc.sonuc < 0 ? (
                          <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                        ) : (
                          <Target className="h-4 w-4 mr-2 text-gray-600" />
                        )}
                        Değişim Yönü
                      </div>
                      <div className={`text-lg font-bold ${
                        sonuc.sonuc > 0 ? 'text-green-600' : sonuc.sonuc < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {sonuc.sonuc > 0 ? 'ARTIŞ' : sonuc.sonuc < 0 ? 'AZALIŞ' : 'DEĞİŞİM YOK'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Yüzde Hesaplama Türleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yüzde Hesaplama Türleri</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hesaplamaTurleri.map(tur => {
              const IconComponent = tur.value.includes('artir') ? Plus :
                                  tur.value.includes('azalt') ? Minus :
                                  tur.value.includes('degisim') ? TrendingUp :
                                  tur.value.includes('oran') ? BarChart3 : Percent;
              
              return (
                <div key={tur.value} className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  inputs.hesaplamaTuru === tur.value ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'
                }`}
                onClick={() => handleInputChange('hesaplamaTuru', tur.value)}>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tur.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tur.aciklama}</p>
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
                    {tur.formul}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Yüzde Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yüzde Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Hayat Örnekleri</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">İndirim Hesaplama</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    500 TL'lik ürüne %20 indirim
                  </p>
                  <p className="text-sm text-blue-700">
                    İndirim: 500 × (20/100) = 100 TL<br />
                    Yeni Fiyat: 500 - 100 = 400 TL
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Zam Hesaplama</h4>
                  <p className="text-sm text-green-800 mb-2">
                    3000 TL maaşa %15 zam
                  </p>
                  <p className="text-sm text-green-700">
                    Zam: 3000 × (15/100) = 450 TL<br />
                    Yeni Maaş: 3000 + 450 = 3450 TL
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Başarı Oranı</h4>
                  <p className="text-sm text-purple-800 mb-2">
                    100 soruda 85 doğru
                  </p>
                  <p className="text-sm text-purple-700">
                    Başarı: (85/100) × 100 = %85
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İş Dünyası Örnekleri</h3>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Kar Marjı</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    100 TL maliyetli ürün 130 TL'ye satılıyor
                  </p>
                  <p className="text-sm text-orange-700">
                    Kar Oranı: ((130-100)/100) × 100 = %30
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Faiz Hesaplama</h4>
                  <p className="text-sm text-red-800 mb-2">
                    10.000 TL'ye %2 aylık faiz
                  </p>
                  <p className="text-sm text-red-700">
                    Faiz: 10.000 × (2/100) = 200 TL
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-medium text-teal-900 mb-2">Vergi Hesaplama</h4>
                  <p className="text-sm text-teal-800 mb-2">
                    1000 TL'ye %18 KDV
                  </p>
                  <p className="text-sm text-teal-700">
                    KDV: 1000 × (18/100) = 180 TL<br />
                    Toplam: 1000 + 180 = 1180 TL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yüzde Formülleri Rehberi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Temel Yüzde Formülleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel İşlemler</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">A'nın %B'si</h4>
                  <code className="text-sm text-gray-700">F = A × (B/100)</code>
                  <p className="text-xs text-gray-600 mt-1">Bir sayının belirli yüzdesini bulma</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">A, B'nin yüzde kaçı</h4>
                  <code className="text-sm text-gray-700">p(%) = (A/B) × 100</code>
                  <p className="text-xs text-gray-600 mt-1">Oran hesaplama</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Yüzde Değişim</h4>
                  <code className="text-sm text-gray-700">p(%) = ((B-A)/A) × 100</code>
                  <p className="text-xs text-gray-600 mt-1">Artış veya azalış oranı</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Artış ve Azalış</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Yüzde Artırma</h4>
                  <code className="text-sm text-green-700">F = A × (1 + B/100)</code>
                  <p className="text-xs text-green-600 mt-1">Sayıyı belirli yüzde artırma</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Yüzde Azaltma</h4>
                  <code className="text-sm text-red-700">F = A × (1 - B/100)</code>
                  <p className="text-xs text-red-600 mt-1">Sayıyı belirli yüzde azaltma</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Bileşik Yüzde</h4>
                  <code className="text-sm text-blue-700">F = A × (1 ± B/100)ⁿ</code>
                  <p className="text-xs text-blue-600 mt-1">Çoklu dönem hesaplama</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  {arac.active ? (
                    <Link to={arac.link} className="block">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                    </Link>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mb-4 opacity-75">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Yakında
                      </span>
                    </>
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
              Yüzde Hesaplama Nasıl Yapılır? Matematik Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yüzde Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yüzde, bir bütünün 100 eşit parçaya bölünmesi durumunda her bir parçanın temsil ettiği 
              orandır. "%" sembolü ile gösterilir ve "yüzde" kelimesi Latince "per centum" (yüz başına) 
              ifadesinden gelir. Yüzde hesaplamaları, günlük hayatta sıkça karşılaştığımız matematik 
              işlemlerinin başında gelir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Temel Yüzde Formülleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yüzde hesaplamalarında kullanılan temel formüller şunlardır:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Bir Sayının Yüzdesini Bulma</h4>
            <div className="bg-yellow-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-yellow-900 mb-2">Formül: F = A × (B/100)</p>
              <p className="text-yellow-800 mb-2">
                Burada A = ana sayı, B = yüzde oranı, F = sonuç
              </p>
              <p className="text-sm text-yellow-700">
                Örnek: 200'ün %15'i = 200 × (15/100) = 30
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Oran Hesaplama</h4>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Formül: p(%) = (A/B) × 100</p>
              <p className="text-blue-800 mb-2">
                A sayısının B sayısına oranını yüzde olarak bulur
              </p>
              <p className="text-sm text-blue-700">
                Örnek: 25, 200'ün yüzde kaçı = (25/200) × 100 = %12.5
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Yüzde Değişim</h4>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-green-900 mb-2">Formül: p(%) = ((B-A)/A) × 100</p>
              <p className="text-green-800 mb-2">
                A değerinden B değerine olan değişimi yüzde olarak hesaplar
              </p>
              <p className="text-sm text-green-700">
                Örnek: 100'den 120'ye değişim = ((120-100)/100) × 100 = %20 artış
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yüzde Hesaplamanın Kullanım Alanları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yüzde hesaplamaları günlük hayatta birçok alanda kullanılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Alışveriş:</strong> İndirim oranları, KDV hesaplama</li>
              <li><strong>Finans:</strong> Faiz oranları, yatırım getirisi</li>
              <li><strong>İstatistik:</strong> Anket sonuçları, başarı oranları</li>
              <li><strong>Eğitim:</strong> Sınav başarı yüzdesi, not ortalaması</li>
              <li><strong>İş Dünyası:</strong> Kar marjı, büyüme oranları</li>
              <li><strong>Sağlık:</strong> Vücut yağ oranı, başarı oranları</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yüzde Artış ve Azalış</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bir değeri belirli yüzde oranında artırmak veya azaltmak için:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-900 mb-2">Yüzde Artırma</h4>
                <p className="text-sm text-green-800 mb-2">
                  Formül: F = A × (1 + B/100)
                </p>
                <p className="text-xs text-green-700">
                  Örnek: 100'ü %20 artır = 100 × (1 + 20/100) = 120
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="font-semibold text-red-900 mb-2">Yüzde Azaltma</h4>
                <p className="text-sm text-red-800 mb-2">
                  Formül: F = A × (1 - B/100)
                </p>
                <p className="text-xs text-red-700">
                  Örnek: 100'ü %20 azalt = 100 × (1 - 20/100) = 80
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yüzde Hesaplama İpuçları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Ondalık dönüşüm:</strong> %25 = 0.25, %50 = 0.50</li>
              <li><strong>Kesir dönüşüm:</strong> %25 = 1/4, %50 = 1/2</li>
              <li><strong>Hızlı hesaplama:</strong> %10 için sayıyı 10'a bölün</li>
              <li><strong>Çarpma kuralı:</strong> %A × %B = %(A×B/100)</li>
              <li><strong>Kontrol yöntemi:</strong> Sonucu ters işlemle doğrulayın</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaygın Yüzde Hesaplama Hataları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Yanlış payda kullanma:</strong> Değişim hesaplamalarında başlangıç değerini payda yapmayı unutma</li>
              <li><strong>Yüzde ile ondalık karıştırma:</strong> %20'yi 20 olarak kullanma</li>
              <li><strong>Bileşik yüzde hatası:</strong> Ardışık yüzde işlemlerinde toplama yapma</li>
              <li><strong>Sıfıra bölme:</strong> Payda sıfır olan durumlarda hesaplama yapma</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pratik Hesaplama Yöntemleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Hızlı yüzde hesaplama için şu yöntemleri kullanabilirsiniz:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>%10:</strong> Sayıyı 10'a bölün</li>
                <li>• <strong>%1:</strong> Sayıyı 100'e bölün</li>
                <li>• <strong>%50:</strong> Sayıyı 2'ye bölün</li>
                <li>• <strong>%25:</strong> Sayıyı 4'e bölün</li>
                <li>• <strong>%20:</strong> Sayıyı 5'e bölün</li>
                <li>• <strong>%5:</strong> %10'un yarısını alın</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bileşik Yüzde İşlemleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ardışık yüzde işlemlerinde dikkat edilmesi gereken noktalar:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>%20 artış sonrası %20 azalış = %4 net azalış</li>
              <li>İki farklı yüzde işlemi toplamaya eşit değildir</li>
              <li>Her işlem bir önceki sonuç üzerinden yapılır</li>
              <li>Sıralama önemlidir: önce artış sonra azalış ≠ önce azalış sonra artış</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-yellow-900 mb-2">💡 İpucu</h4>
              <p className="text-yellow-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı yüzde işlemlerini kolayca yapabilir, 
                formülleri öğrenebilir ve günlük hayattaki yüzde hesaplamalarınızı hızlandırabilirsiniz. 
                Her hesaplama türü için detaylı açıklama ve örnek verilmektedir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Yüzde hesaplamaları, matematik ve günlük hayatın kesiştiği en önemli konulardan biridir. 
              Doğru formülleri kullanarak, alışverişten finansa, eğitimden iş dünyasına kadar birçok 
              alanda ihtiyaç duyduğunuz yüzde hesaplamalarını kolayca yapabilirsiniz. Yukarıdaki 
              hesaplama aracı sayesinde hızlı ve doğru sonuçlar elde edebilir, zaman kazanabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default YuzdeHesaplamaPage;