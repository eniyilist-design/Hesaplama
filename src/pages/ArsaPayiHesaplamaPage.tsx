import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Building, Home, MapPin, ArrowRight, Info, Target, BarChart3, AlertTriangle, FileText } from 'lucide-react';

interface ArsaPayiInputs {
  arsaAlani: number;
  hissePay: number;
  hissePayda: number;
  hesaplamaYontemi: string;
  rayicDeger: number;
  bagımsızBolumSayisi: number;
}

interface ArsaPayiSonuc {
  hisseOrani: number;
  arsaPayiM2: number;
  hisseDegeri: number;
  metreKareBasinaDeger: number;
  ortalamaPay: number;
  karsilastirma: string;
  yatirimPotansiyeli: string;
  tavsiyeMetni: string;
}

const hesaplamaYontemleri = [
  { value: 'hisse', label: 'Hisse Oranı ile Hesaplama', aciklama: 'Tapudaki hisse oranına göre' },
  { value: 'rayic', label: 'Rayiç Değer ile Hesaplama', aciklama: 'Bağımsız bölüm değerine göre' },
  { value: 'esit', label: 'Eşit Dağılım', aciklama: 'Tüm bağımsız bölümlere eşit pay' }
];

const benzerAraclar = [
  { name: 'Emlak Değer Hesaplama', icon: Home, link: '#', active: false },
  { name: 'Kira Getiri Hesaplama', icon: BarChart3, link: '#', active: false },
  { name: 'Emlak Vergisi Hesaplama', icon: Calculator, link: '#', active: false }
];

const ArsaPayiHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<ArsaPayiInputs>({
    arsaAlani: 1000,
    hissePay: 16,
    hissePayda: 100,
    hesaplamaYontemi: 'hisse',
    rayicDeger: 500000,
    bagımsızBolumSayisi: 8
  });
  
  const [toplamRayicDeger, setToplamRayicDeger] = useState<number>(4000000);
  const [sonuc, setSonuc] = useState<ArsaPayiSonuc | null>(null);

  const hesapla = () => {
    const { arsaAlani, hissePay, hissePayda, hesaplamaYontemi, rayicDeger, bagımsızBolumSayisi } = inputs;
    
    let hisseOrani = 0;
    let arsaPayiM2 = 0;
    
    switch (hesaplamaYontemi) {
      case 'hisse':
        // Tapudaki hisse oranına göre hesaplama
        hisseOrani = (hissePay / hissePayda) * 100;
        arsaPayiM2 = arsaAlani * (hissePay / hissePayda);
        break;
      case 'rayic':
        // Rayiç değer oranına göre hesaplama
        hisseOrani = (rayicDeger / toplamRayicDeger) * 100;
        arsaPayiM2 = arsaAlani * (rayicDeger / toplamRayicDeger);
        break;
      case 'esit':
        // Eşit dağılım
        hisseOrani = (1 / bagımsızBolumSayisi) * 100;
        arsaPayiM2 = arsaAlani / bagımsızBolumSayisi;
        break;
    }
    
    const metreKareBasinaDeger = toplamRayicDeger / arsaAlani;
    const hisseDegeri = arsaPayiM2 * metreKareBasinaDeger;
    const ortalamaPay = (1 / bagımsızBolumSayisi) * 100;
    
    // Karşılaştırma analizi
    let karsilastirma = '';
    if (hisseOrani > ortalamaPay * 1.2) {
      karsilastirma = 'Ortalamanın üzerinde yüksek pay';
    } else if (hisseOrani > ortalamaPay) {
      karsilastirma = 'Ortalama üzerinde pay';
    } else if (hisseOrani < ortalamaPay * 0.8) {
      karsilastirma = 'Ortalamanın altında düşük pay';
    } else {
      karsilastirma = 'Ortalama seviyede pay';
    }
    
    // Yatırım potansiyeli analizi
    let yatirimPotansiyeli = '';
    if (hisseOrani > 15) {
      yatirimPotansiyeli = 'Çok Yüksek - Mükemmel yatırım fırsatı';
    } else if (hisseOrani > 10) {
      yatirimPotansiyeli = 'Yüksek - İyi yatırım potansiyeli';
    } else if (hisseOrani > 7) {
      yatirimPotansiyeli = 'Orta - Dengeli yatırım';
    } else if (hisseOrani > 4) {
      yatirimPotansiyeli = 'Düşük - Sınırlı potansiyel';
    } else {
      yatirimPotansiyeli = 'Çok Düşük - Risk değerlendirin';
    }
    
    // Tavsiye metni
    let tavsiyeMetni = '';
    if (hisseOrani > ortalamaPay) {
      tavsiyeMetni = 'Bu gayrimenkul yüksek arsa payına sahip. Gelecekte değer artışı potansiyeli yüksek.';
    } else if (hisseOrani < ortalamaPay * 0.8) {
      tavsiyeMetni = 'Arsa payı düşük. Fiyat avantajı olabilir ancak değer artışı sınırlı olabilir.';
    } else {
      tavsiyeMetni = 'Dengeli arsa payı. Ortalama bir yatırım fırsatı sunuyor.';
    }
    
    setSonuc({
      hisseOrani,
      arsaPayiM2,
      hisseDegeri,
      metreKareBasinaDeger,
      ortalamaPay,
      karsilastirma,
      yatirimPotansiyeli,
      tavsiyeMetni
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs, toplamRayicDeger]);

  const handleInputChange = (field: keyof ArsaPayiInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatM2 = (alan: number) => {
    return `${alan.toFixed(2)} m²`;
  };

  const getSelectedYontem = () => {
    return hesaplamaYontemleri.find(y => y.value === inputs.hesaplamaYontemi);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Ticaret</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Arsa Payı Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Arsa Payı Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gayrimenkul yatırımında tapudaki hisse oranına göre arsa payınızı hesaplayın ve yatırım potansiyelini analiz edin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-emerald-600" />
                Arsa ve Hisse Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hesaplama Yöntemi
                  </label>
                  <select
                    value={inputs.hesaplamaYontemi}
                    onChange={(e) => handleInputChange('hesaplamaYontemi', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                  >
                    {hesaplamaYontemleri.map(yontem => (
                      <option key={yontem.value} value={yontem.value}>
                        {yontem.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedYontem()?.aciklama}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Toplam Arsa Alanı (m²)
                    </label>
                    <input
                      type="number"
                      value={inputs.arsaAlani}
                      onChange={(e) => handleInputChange('arsaAlani', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                      min="100"
                      step="1"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Parselin toplam yüzölçümü
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Toplam Bağımsız Bölüm Sayısı
                    </label>
                    <input
                      type="number"
                      value={inputs.bagımsızBolumSayisi}
                      onChange={(e) => handleInputChange('bagımsızBolumSayisi', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                      min="2"
                      max="200"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Sitedeki toplam daire/işyeri sayısı
                    </div>
                  </div>
                </div>

                {inputs.hesaplamaYontemi === 'hisse' && (
                  <div className="bg-emerald-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4">Tapudaki Hisse Bilgileri</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Hisse Pay (Üst Sayı)
                        </label>
                        <input
                          type="number"
                          value={inputs.hissePay}
                          onChange={(e) => handleInputChange('hissePay', Number(e.target.value))}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                          min="1"
                          max="1000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Hisse Payda (Alt Sayı)
                        </label>
                        <input
                          type="number"
                          value={inputs.hissePayda}
                          onChange={(e) => handleInputChange('hissePayda', Number(e.target.value))}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                          min="1"
                          max="1000"
                        />
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">Hisse Oranı:</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {inputs.hissePay}/{inputs.hissePayda} = %{((inputs.hissePay / inputs.hissePayda) * 100).toFixed(3)}
                      </div>
                    </div>
                  </div>
                )}

                {inputs.hesaplamaYontemi === 'rayic' && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Rayiç Değer Bilgileri</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Bağımsız Bölüm Rayiç Değeri (TL)
                        </label>
                        <input
                          type="number"
                          value={inputs.rayicDeger}
                          onChange={(e) => handleInputChange('rayicDeger', Number(e.target.value))}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                          min="50000"
                          step="10000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Toplam Rayiç Değer (TL)
                        </label>
                        <input
                          type="number"
                          value={toplamRayicDeger}
                          onChange={(e) => setToplamRayicDeger(Number(e.target.value))}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                          min="100000"
                          step="50000"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-emerald-600" />
                  Arsa Payı Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Arsa Payı</div>
                    <div className="text-3xl font-bold text-emerald-600">
                      {formatM2(sonuc.arsaPayiM2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      %{sonuc.hisseOrani.toFixed(3)} hisse oranı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Hisse Değeri</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(sonuc.hisseDegeri)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">m² Başına Değer</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(sonuc.metreKareBasinaDeger)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ortalama Pay</div>
                    <div className="text-lg font-bold text-gray-900">
                      %{sonuc.ortalamaPay.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({formatM2(inputs.arsaAlani / inputs.bagımsızBolumSayisi)} eşit dağılımda)
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Karşılaştırma</div>
                    <div className={`text-lg font-bold ${
                      sonuc.karsilastirma.includes('yüksek') ? 'text-green-600' :
                      sonuc.karsilastirma.includes('düşük') ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {sonuc.karsilastirma}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yatırım Potansiyeli</div>
                    <div className={`text-lg font-bold ${
                      sonuc.yatirimPotansiyeli.includes('Çok Yüksek') ? 'text-green-600' :
                      sonuc.yatirimPotansiyeli.includes('Yüksek') ? 'text-blue-600' :
                      sonuc.yatirimPotansiyeli.includes('Orta') ? 'text-yellow-600' :
                      sonuc.yatirimPotansiyeli.includes('Düşük') ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {sonuc.yatirimPotansiyeli.split(' - ')[0]}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sonuc.yatirimPotansiyeli.split(' - ')[1]}
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.hisseOrani > sonuc.ortalamaPay ? 'border-green-500 bg-green-50' : 
                    sonuc.hisseOrani < sonuc.ortalamaPay * 0.8 ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        sonuc.hisseOrani > sonuc.ortalamaPay ? 'text-green-600' : 
                        sonuc.hisseOrani < sonuc.ortalamaPay * 0.8 ? 'text-red-600' : 'text-blue-600'
                      }`} />
                      <div className={`text-sm ${
                        sonuc.hisseOrani > sonuc.ortalamaPay ? 'text-green-800' : 
                        sonuc.hisseOrani < sonuc.ortalamaPay * 0.8 ? 'text-red-800' : 'text-blue-800'
                      }`}>
                        {sonuc.tavsiyeMetni}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hesaplama Yöntemleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Arsa Payı Hesaplama Yöntemleri</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {hesaplamaYontemleri.map(yontem => (
              <div key={yontem.value} className={`p-6 rounded-xl border-2 ${
                inputs.hesaplamaYontemi === yontem.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{yontem.label}</h3>
                <p className="text-sm text-gray-600 mb-3">{yontem.aciklama}</p>
                
                {yontem.value === 'hisse' && (
                  <div className="text-xs text-gray-500">
                    <div>Formül: Arsa Alanı × (Pay/Payda)</div>
                    <div>Örnek: 1000 m² × (16/100) = 160 m²</div>
                  </div>
                )}
                {yontem.value === 'rayic' && (
                  <div className="text-xs text-gray-500">
                    <div>Formül: Arsa × (Bölüm Değeri/Toplam Değer)</div>
                    <div>Rayiç değer oranına göre</div>
                  </div>
                )}
                {yontem.value === 'esit' && (
                  <div className="text-xs text-gray-500">
                    <div>Formül: Arsa Alanı ÷ Bölüm Sayısı</div>
                    <div>Eşit dağılım prensibi</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arsa Payı Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Arsa Payı Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hisse Oranı ile Hesaplama</h3>
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-medium text-emerald-900 mb-2">Örnek 1</h4>
                  <p className="text-sm text-emerald-800 mb-2">
                    1000 m² arsa, 16/100 hisse oranı
                  </p>
                  <p className="text-sm text-emerald-700">
                    Arsa Payı: 1000 × (16÷100) = 160 m²
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Örnek 2</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    800 m² arsa, 25/1000 hisse oranı
                  </p>
                  <p className="text-sm text-blue-700">
                    Arsa Payı: 800 × (25÷1000) = 20 m²
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Örnek 3</h4>
                  <p className="text-sm text-purple-800 mb-2">
                    1500 m² arsa, 8/50 hisse oranı
                  </p>
                  <p className="text-sm text-purple-700">
                    Arsa Payı: 1500 × (8÷50) = 240 m²
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Arsa Payının Önemi</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Yatırım Değeri:</strong> Yüksek arsa payı daha değerli</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Gelecek Potansiyeli:</strong> Arsa değer artışından pay alma</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Hukuki Haklar:</strong> Arsadaki söz hakkı oranı</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Satış Değeri:</strong> Gayrimenkul değerini etkiler</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Yeniden Yapılanma:</strong> Kentsel dönüşümde önemli</span>
                </li>
              </ul>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center mb-4">
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
              Arsa Payı Nedir ve Nasıl Hesaplanır? Gayrimenkul Yatırım Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arsa Payı Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arsa payı, bir gayrimenkulün sahip olduğu arsadaki hisse oranını ifade eder. Bu pay, 
              bağımsız bölümün (daire, işyeri, vb.) toplam gayrimenkul projesi içindeki oransal 
              hakkını belirler ve tapuda hisse şeklinde kayıtlıdır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arsa Payı Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de arsa payı hesaplaması, Kat Mülkiyeti Kanunu'na göre yapılır. Temel hesaplama formülü şudur:
            </p>
            <div className="bg-emerald-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-emerald-900 mb-2">Temel Formül:</p>
              <p className="text-emerald-800 mb-2">
                Arsa Payı (m²) = Toplam Arsa Alanı × (Hisse Pay ÷ Hisse Payda)
              </p>
              <p className="text-sm text-emerald-700">
                Örnek: 1000 m² × (16 ÷ 100) = 160 m² arsa payı
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hisse Oranı Belirleme Kriterleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arsa payı hisse oranı, aşağıdaki kriterlere göre belirlenir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Bağımsız bölümün rayiç değeri:</strong> En yaygın kullanılan yöntem</li>
              <li><strong>Bağımsız bölümün alanı:</strong> Brüt veya net alan bazlı</li>
              <li><strong>Kat katsayıları:</strong> Zemin kat, ara kat, çatı katı farklılıkları</li>
              <li><strong>Cephe durumu:</strong> Ana cadde, yan sokak, arka cephe</li>
              <li><strong>Manzara ve konum:</strong> Deniz manzarası, park manzarası vb.</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rayiç Değer ile Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Hak sahiplerine, arsa üzerindeki bağımsız bölümlerin rayiç değerleri oranında pay verilir:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Rayiç Değer Formülü:</p>
              <p className="text-blue-800 mb-2">
                Arsa Payı = Toplam Arsa × (Bağımsız Bölüm Rayiç Değeri ÷ Toplam Rayiç Değer)
              </p>
              <p className="text-sm text-blue-700">
                Bu yöntem en adil dağılımı sağlar ve yasal olarak geçerlidir
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arsa Payının Önemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arsa payı, gayrimenkul yatırımında kritik öneme sahiptir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Yatırım Değeri:</strong> Yüksek arsa payı daha değerli gayrimenkul</li>
              <li><strong>Gelecek Potansiyeli:</strong> Arsa değer artışından daha fazla pay alma</li>
              <li><strong>Kentsel Dönüşüm:</strong> Yeniden yapılanmada daha fazla hak</li>
              <li><strong>Satış Değeri:</strong> Gayrimenkul satış fiyatını doğrudan etkiler</li>
              <li><strong>Kira Getirisi:</strong> Uzun vadede kira artış potansiyeli</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Detaylı arsa payı hesaplama örneği:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Senaryo:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>Toplam Arsa Alanı: 1000 m²</li>
                <li>Tapudaki Hisse: 16/100</li>
                <li>Bağımsız Bölüm: 120 m² daire</li>
                <li>Toplam Bağımsız Bölüm: 8 adet</li>
              </ul>
              
              <h4 className="font-semibold text-gray-900 mb-2">Hesaplama:</h4>
              <p className="text-gray-700 mb-2">
                Hisse Oranı: 16 ÷ 100 = %16
              </p>
              <p className="text-gray-700 mb-2">
                Arsa Payı: 1000 m² × %16 = 160 m²
              </p>
              <p className="text-gray-700 mb-2">
                Ortalama Pay: 1000 ÷ 8 = 125 m²
              </p>
              <p className="font-bold text-green-600 text-lg">
                Sonuç: 160 m² (Ortalamadan 35 m² fazla)
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arsa Payı Yatırım Analizi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arsa payı yatırım kararlarında şu faktörleri değerlendirin:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-900 mb-2">Yüksek Arsa Payı Avantajları</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Daha yüksek yatırım değeri</li>
                  <li>• Kentsel dönüşümde avantaj</li>
                  <li>• Uzun vadeli değer artışı</li>
                  <li>• Satış kolaylığı</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <h4 className="font-semibold text-orange-900 mb-2">Düşük Arsa Payı Riskleri</h4>
                <ul className="space-y-1 text-sm text-orange-800">
                  <li>• Sınırlı değer artış potansiyeli</li>
                  <li>• Kentsel dönüşümde dezavantaj</li>
                  <li>• Düşük yatırım getirisi</li>
                  <li>• Satış zorluğu</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arsa Payı Optimizasyonu</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Proje seçimi:</strong> Düşük katlı, az daireli projeler tercih edin</li>
              <li><strong>Konum analizi:</strong> Gelişme potansiyeli yüksek bölgeler seçin</li>
              <li><strong>Kat seçimi:</strong> Üst katlar genelde daha yüksek arsa payına sahip</li>
              <li><strong>Alan büyüklüğü:</strong> Büyük daireler daha fazla arsa payı alır</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hukuki Düzenlemeler</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arsa payı hesaplaması Türk hukukunda şu düzenlemelerle korunur:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>634 sayılı Kat Mülkiyeti Kanunu</li>
              <li>Tapu ve Kadastro Genel Müdürlüğü yönetmelikleri</li>
              <li>Belediye imar planları ve düzenlemeleri</li>
              <li>Kentsel Dönüşüm Kanunu hükümleri</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kentsel Dönüşümde Arsa Payı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kentsel dönüşüm projelerinde arsa payı kritik rol oynar:
            </p>
            <div className="bg-yellow-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-yellow-800">
                <li>• <strong>Yeni daire hakkı:</strong> Arsa payı oranında yeni daire alma</li>
                <li>• <strong>Ek ödeme:</strong> Düşük arsa payında ek ödeme gerekebilir</li>
                <li>• <strong>Takas imkanı:</strong> Yüksek arsa payında takas avantajı</li>
                <li>• <strong>Gelir paylaşımı:</strong> Satış gelirinden pay alma oranı</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arsa Payı Artırma Yöntemleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Komşu dairelerden hisse satın alma</li>
              <li>Ortak alan kullanım hakkı satın alma</li>
              <li>Kat karşılığı inşaat sözleşmelerinde dikkatli olma</li>
              <li>Proje aşamasında yüksek arsa payı olan daireleri tercih etme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yatırım Kararında Arsa Payı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Gayrimenkul yatırımında arsa payını değerlendirirken şu faktörleri göz önünde bulundurun:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Bölgenin gelişme potansiyeli ve imar planları</li>
              <li>Kentsel dönüşüm beklentileri</li>
              <li>Arsa değerlerindeki artış trendi</li>
              <li>Projedeki toplam daire sayısı ve yoğunluk</li>
              <li>Benzer projelerdeki arsa payı oranları</li>
            </ul>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-emerald-900 mb-2">💡 İpucu</h4>
              <p className="text-emerald-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı gayrimenkul seçeneklerinin arsa paylarını 
                karşılaştırabilir, yatırım potansiyelini değerlendirebilir ve en uygun seçeneği belirleyebilirsiniz. 
                Arsa payı yüksek olan gayrimenkuller uzun vadede daha karlı yatırımlardır.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Arsa payı, gayrimenkul yatırımının en önemli faktörlerinden biridir. Doğru hesaplama ve 
              analiz ile yatırım kararlarınızı destekleyebilir, gelecekteki değer artışından maksimum 
              pay alabilirsiniz. Özellikle kentsel dönüşüm beklentisi olan bölgelerde arsa payı yüksek 
              gayrimenkuller tercih edilmelidir. Yukarıdaki hesaplama aracını kullanarak yatırım 
              seçeneklerinizi objektif kriterlerle değerlendirebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ArsaPayiHesaplamaPage;