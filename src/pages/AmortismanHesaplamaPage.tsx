import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, TrendingDown, Building, ArrowRight, Info, Truck, Laptop, Factory, Home } from 'lucide-react';

interface AmortismanInputs {
  varlıkTuru: string;
  alisTarihi: string;
  maliyet: number;
  hurda: number;
  amortismanYontemi: string;
  ozelOran: number;
}

interface AmortismanSonuc {
  yillikAmortisman: number;
  aylikAmortisman: number;
  gunlukAmortisman: number;
  amortismanOrani: number;
  faydaliOmur: number;
  amortismanaTabiDeger: number;
  birikmisMaliyet: number;
  netDegerDefteri: number;
  amortismanTablosu: Array<{
    yil: number;
    yillikAmortisman: number;
    birikmisMaliyet: number;
    netDeger: number;
  }>;
}

const varlıkTurleri = [
  { value: 'bina', label: 'Bina ve Yapılar', oran: 2, faydaliOmur: 50, aciklama: 'İş yeri binaları, fabrikalar' },
  { value: 'makine', label: 'Makine ve Teçhizat', oran: 10, faydaliOmur: 10, aciklama: 'Üretim makineleri, endüstriyel ekipman' },
  { value: 'tasit', label: 'Taşıt Araçları', oran: 20, faydaliOmur: 5, aciklama: 'Otomobil, kamyon, iş makineleri' },
  { value: 'mobilya', label: 'Mobilya ve Demirbaş', oran: 10, faydaliOmur: 10, aciklama: 'Ofis mobilyaları, ekipmanlar' },
  { value: 'bilgisayar', label: 'Bilgisayar ve Teknoloji', oran: 25, faydaliOmur: 4, aciklama: 'PC, laptop, sunucu, yazılım' },
  { value: 'arazi', label: 'Arazi Düzenlemesi', oran: 5, faydaliOmur: 20, aciklama: 'Peyzaj, yol, altyapı' }
];

const amortismanYontemleri = [
  { value: 'normal', label: 'Normal Amortisman', aciklama: 'Eşit tutarlarda yıllık amortisman' },
  { value: 'azalan', label: 'Azalan Bakiyeler', aciklama: 'İlk yıllarda daha fazla amortisman' },
  { value: 'artan', label: 'Artan Bakiyeler', aciklama: 'Son yıllarda daha fazla amortisman' },
  { value: 'ozel', label: 'Özel Oran', aciklama: 'Kullanıcı tanımlı amortisman oranı' }
];

const benzerAraclar = [
  { name: 'KDV Hesaplama', icon: Calculator, link: '#', active: false },
  { name: 'Gelir Vergisi Hesaplama', icon: FileText, link: '#', active: false },
  { name: 'SGK Prim Hesaplama', icon: Building, link: '#', active: false }
];

const AmortismanHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<AmortismanInputs>({
    varlıkTuru: 'makine',
    alisTarihi: new Date().toISOString().split('T')[0],
    maliyet: 100000,
    hurda: 5000,
    amortismanYontemi: 'normal',
    ozelOran: 10
  });
  
  const [sonuc, setSonuc] = useState<AmortismanSonuc | null>(null);

  const hesapla = () => {
    const { varlıkTuru, maliyet, hurda, amortismanYontemi, ozelOran } = inputs;
    
    const varlıkTipi = varlıkTurleri.find(v => v.value === varlıkTuru);
    if (!varlıkTipi) return;
    
    let amortismanOrani = varlıkTipi.oran;
    let faydaliOmur = varlıkTipi.faydaliOmur;
    
    // Özel oran seçilmişse
    if (amortismanYontemi === 'ozel') {
      amortismanOrani = ozelOran;
      faydaliOmur = 100 / ozelOran;
    }
    
    const amortismanaTabiDeger = maliyet - hurda;
    
    let yillikAmortisman = 0;
    
    switch (amortismanYontemi) {
      case 'normal':
        yillikAmortisman = amortismanaTabiDeger / faydaliOmur;
        break;
      case 'azalan':
        yillikAmortisman = maliyet * (amortismanOrani / 100) * 2; // İlk yıl için
        break;
      case 'artan':
        yillikAmortisman = amortismanaTabiDeger * (amortismanOrani / 100) * 0.5; // İlk yıl için
        break;
      case 'ozel':
        yillikAmortisman = maliyet * (amortismanOrani / 100);
        break;
    }
    
    const aylikAmortisman = yillikAmortisman / 12;
    const gunlukAmortisman = yillikAmortisman / 365;
    
    // Amortisman tablosu oluşturma (ilk 10 yıl)
    const amortismanTablosu = [];
    let birikmisMaliyet = 0;
    let kalanDeger = maliyet;
    
    for (let yil = 1; yil <= Math.min(faydaliOmur, 10); yil++) {
      let yillikAmortismanTutar = yillikAmortisman;
      
      if (amortismanYontemi === 'azalan') {
        yillikAmortismanTutar = kalanDeger * (amortismanOrani / 100);
      } else if (amortismanYontemi === 'artan') {
        yillikAmortismanTutar = amortismanaTabiDeger * (yil / faydaliOmur) * (amortismanOrani / 100);
      }
      
      // Hurda değerinin altına düşmemesi için kontrol
      if (kalanDeger - yillikAmortismanTutar < hurda) {
        yillikAmortismanTutar = kalanDeger - hurda;
      }
      
      birikmisMaliyet += yillikAmortismanTutar;
      kalanDeger -= yillikAmortismanTutar;
      
      amortismanTablosu.push({
        yil,
        yillikAmortisman: yillikAmortismanTutar,
        birikmisMaliyet,
        netDeger: kalanDeger
      });
      
      if (kalanDeger <= hurda) break;
    }
    
    const netDegerDefteri = maliyet - birikmisMaliyet;
    
    setSonuc({
      yillikAmortisman,
      aylikAmortisman,
      gunlukAmortisman,
      amortismanOrani,
      faydaliOmur,
      amortismanaTabiDeger,
      birikmisMaliyet,
      netDegerDefteri,
      amortismanTablosu
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof AmortismanInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedVarlık = () => {
    return varlıkTurleri.find(v => v.value === inputs.varlıkTuru);
  };

  const getSelectedYontem = () => {
    return amortismanYontemleri.find(y => y.value === inputs.amortismanYontemi);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-gray-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Muhasebe</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Amortisman Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Amortisman Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye muhasebe standartlarına uygun amortisman hesaplama, varlık değer kaybı analizi
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="h-6 w-6 mr-3 text-gray-600" />
                Varlık Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Varlık Türü
                  </label>
                  <select
                    value={inputs.varlıkTuru}
                    onChange={(e) => handleInputChange('varlıkTuru', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                  >
                    {varlıkTurleri.map(tur => (
                      <option key={tur.value} value={tur.value}>
                        {tur.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedVarlık()?.aciklama} - Standart oran: %{getSelectedVarlık()?.oran}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Alış Tarihi
                    </label>
                    <input
                      type="date"
                      value={inputs.alisTarihi}
                      onChange={(e) => handleInputChange('alisTarihi', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Maliyet (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.maliyet}
                      onChange={(e) => handleInputChange('maliyet', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                      min="1000"
                      step="1000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hurda Değeri (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.hurda}
                      onChange={(e) => handleInputChange('hurda', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      step="100"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Faydalı ömür sonundaki tahmini değer
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Amortisman Yöntemi
                    </label>
                    <select
                      value={inputs.amortismanYontemi}
                      onChange={(e) => handleInputChange('amortismanYontemi', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                    >
                      {amortismanYontemleri.map(yontem => (
                        <option key={yontem.value} value={yontem.value}>
                          {yontem.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      {getSelectedYontem()?.aciklama}
                    </div>
                  </div>
                </div>

                {inputs.amortismanYontemi === 'ozel' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Özel Amortisman Oranı (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.ozelOran}
                      onChange={(e) => handleInputChange('ozelOran', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                      min="1"
                      max="50"
                      step="0.5"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Özel durumlar için kullanıcı tanımlı oran
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingDown className="h-6 w-6 mr-3 text-gray-600" />
                  Amortisman Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yıllık Amortisman</div>
                    <div className="text-3xl font-bold text-gray-600">
                      {formatCurrency(sonuc.yillikAmortisman)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      %{sonuc.amortismanOrani} oran
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Aylık Amortisman</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sonuc.aylikAmortisman)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Günlük Amortisman</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(sonuc.gunlukAmortisman)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Faydalı Ömür</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.faydaliOmur.toFixed(1)} yıl
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Amortismana Tabi Değer</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(sonuc.amortismanaTabiDeger)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Maliyet - Hurda Değeri
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Net Defter Değeri</div>
                    <div className="text-lg font-bold text-purple-600">
                      {formatCurrency(sonuc.netDegerDefteri)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Güncel değer
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amortisman Tablosu */}
        {sonuc && sonuc.amortismanTablosu.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amortisman Tablosu (İlk 10 Yıl)</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Yıl</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Yıllık Amortisman</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Birikmiş Amortisman</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Net Defter Değeri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sonuc.amortismanTablosu.map((satir) => (
                    <tr key={satir.yil} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{satir.yil}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                        {formatCurrency(satir.yillikAmortisman)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-orange-600 font-medium">
                        {formatCurrency(satir.birikmisMaliyet)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-bold">
                        {formatCurrency(satir.netDeger)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Varlık Türleri ve Oranları */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Türkiye Amortisman Oranları (2024)</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {varlıkTurleri.map(tur => {
              const IconComponent = tur.value === 'bina' ? Building :
                                  tur.value === 'tasit' ? Truck :
                                  tur.value === 'bilgisayar' ? Laptop :
                                  tur.value === 'arazi' ? Home : Factory;
              
              return (
                <div key={tur.value} className={`p-6 rounded-xl border-2 ${
                  inputs.varlıkTuru === tur.value ? 'border-gray-500 bg-gray-50' : 'border-gray-200'
                }`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tur.label}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {tur.aciklama}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Oran: %{tur.oran} | Ömür: {tur.faydaliOmur} yıl
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amortisman Yöntemleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Amortisman Hesaplama Yöntemleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaygın Yöntemler</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Normal Amortisman</h4>
                  <p className="text-sm text-blue-800">
                    Eşit tutarlarda yıllık amortisman. En yaygın kullanılan yöntem.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Azalan Bakiyeler</h4>
                  <p className="text-sm text-green-800">
                    İlk yıllarda daha fazla amortisman. Teknoloji ürünleri için uygun.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Artan Bakiyeler</h4>
                  <p className="text-sm text-purple-800">
                    Son yıllarda daha fazla amortisman. Nadir kullanılan yöntem.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesaplama Formülleri</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Normal Amortisman:</strong><br />
                    (Maliyet - Hurda) ÷ Faydalı Ömür
                  </div>
                  <div>
                    <strong>Azalan Bakiyeler:</strong><br />
                    Net Defter Değeri × Oran × 2
                  </div>
                  <div>
                    <strong>Artan Bakiyeler:</strong><br />
                    Amortismana Tabi × (Yıl ÷ Ömür) × Oran
                  </div>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center mb-4">
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
              Amortisman Nedir ve Nasıl Hesaplanır? Türkiye Muhasebe Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Amortisman Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Amortisman, işletmelerin sahip olduğu duran varlıkların zaman içinde değer kaybetmesini 
              muhasebe kayıtlarına yansıtan sistematik bir süreçtir. Türkiye'de Vergi Usul Kanunu ve 
              Türkiye Muhasebe Standartları (TMS) çerçevesinde düzenlenir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2024 Yılı Amortisman Oranları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de geçerli olan güncel amortisman oranları şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Binalar:</strong> %2 (50 yıl faydalı ömür)</li>
              <li><strong>Makine ve Teçhizat:</strong> %10 (10 yıl faydalı ömür)</li>
              <li><strong>Taşıt Araçları:</strong> %20 (5 yıl faydalı ömür)</li>
              <li><strong>Mobilya ve Demirbaş:</strong> %10 (10 yıl faydalı ömür)</li>
              <li><strong>Bilgisayar ve Teknoloji:</strong> %25 (4 yıl faydalı ömür)</li>
              <li><strong>Arazi Düzenlemesi:</strong> %5 (20 yıl faydalı ömür)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Amortisman Hesaplama Yöntemleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de kullanılan temel amortisman hesaplama yöntemleri:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Normal Amortisman Yöntemi</h4>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Formül:</p>
              <p className="text-blue-800 mb-2">
                Yıllık Amortisman = (Maliyet - Hurda Değeri) ÷ Faydalı Ömür
              </p>
              <p className="text-sm text-blue-700">
                Örnek: (100.000 - 5.000) ÷ 10 = 9.500 TL/yıl
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Azalan Bakiyeler Yöntemi</h4>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-green-900 mb-2">Formül:</p>
              <p className="text-green-800 mb-2">
                Yıllık Amortisman = Net Defter Değeri × (Amortisman Oranı × 2)
              </p>
              <p className="text-sm text-green-700">
                İlk yıllarda daha fazla, sonraki yıllarda azalan amortisman
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Amortisman Hesaplamanın Önemi</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Vergi Avantajı:</strong> Amortisman gideri vergi matrahını düşürür</li>
              <li><strong>Gerçek Maliyet:</strong> Varlığın gerçek maliyetini dönemlere yayar</li>
              <li><strong>Finansal Planlama:</strong> Yenileme zamanını öngörür</li>
              <li><strong>Bilanço Doğruluğu:</strong> Varlıkların gerçek değerini gösterir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Muhasebe Kayıtları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Amortisman hesaplaması sonrası yapılacak muhasebe kaydı:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-gray-900 mb-2">Yevmiye Kaydı:</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-700">
                    <strong>Borç:</strong> 770 Genel Üretim Giderleri
                  </p>
                  <p className="text-gray-700">
                    <strong>Alacak:</strong> 257 Birikmiş Amortismanlar
                  </p>
                </div>
                <div className="text-gray-600">
                  <p>Amortisman tutarı kadar</p>
                  <p>Her dönem sonunda</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Özel Durumlar</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Kısmi Yıl Amortismanı:</strong> Yıl ortasında alınan varlıklar için orantılı hesaplama</li>
              <li><strong>İyileştirme Giderleri:</strong> Varlığın değerini artıran harcamalar</li>
              <li><strong>Yeniden Değerleme:</strong> Enflasyon düzeltmesi uygulaması</li>
              <li><strong>Erken Elden Çıkarma:</strong> Faydalı ömür bitmeden satış durumu</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              100.000 TL değerinde makine alımı örneği:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Varlık Bilgileri:</h4>
              <ul className="space-y-1 text-slate-800 mb-4">
                <li>Maliyet: 100.000 TL</li>
                <li>Hurda Değeri: 5.000 TL</li>
                <li>Amortisman Oranı: %10</li>
                <li>Faydalı Ömür: 10 yıl</li>
              </ul>
              
              <h4 className="font-semibold text-slate-900 mb-2">Hesaplama:</h4>
              <p className="text-slate-800 mb-2">
                Amortismana Tabi Değer: 100.000 - 5.000 = 95.000 TL
              </p>
              <p className="text-slate-800 mb-2">
                Yıllık Amortisman: 95.000 ÷ 10 = 9.500 TL
              </p>
              <p className="text-slate-800 mb-2">
                Aylık Amortisman: 9.500 ÷ 12 = 791.67 TL
              </p>
              <p className="font-bold text-green-600 text-lg">
                10 yıl sonunda net değer: 5.000 TL (hurda değeri)
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vergi Mevzuatı</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Vergi Usul Kanunu Madde 315-333 amortisman hükümlerini düzenler</li>
              <li>Amortisman oranları Maliye Bakanlığı tarafından belirlenir</li>
              <li>Asgari amortisman süresi uygulanır</li>
              <li>Fevkalade amortisman özel şartlarda uygulanabilir</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-gray-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">💡 İpucu</h4>
              <p className="text-gray-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı varlık türleri için amortisman 
                hesaplama yapabilir, vergi planlamanızı destekleyebilir ve muhasebe kayıtlarınızı 
                doğru şekilde tutabilirsiniz. Güncel oranları takip etmeyi unutmayın.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Amortisman hesaplama, işletme muhasebesinin temel konularından biridir. Doğru hesaplama 
              ile hem vergi avantajı sağlayabilir hem de varlıklarınızın gerçek değerini takip edebilirsiniz. 
              Yukarıdaki hesaplama aracını kullanarak Türkiye mevzuatına uygun amortisman hesaplama 
              yapabilir ve finansal planlamanızı destekleyebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default AmortismanHesaplamaPage;