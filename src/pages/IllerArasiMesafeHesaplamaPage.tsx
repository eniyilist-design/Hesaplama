import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, MapPin, Navigation, Plane, ArrowRight, Info, Target, Clock, Car, Fuel } from 'lucide-react';

interface MesafeInputs {
  cikisIli: string;
  varisIli: string;
  ulasimTuru: string;
}

interface MesafeSonuc {
  karayoluMesafesi: number;
  havayoluMesafesi: number;
  tahminiSure: number;
  yakitTuketimi: number;
  yakitMaliyeti: number;
  ucakSuresi: number;
  otobusUcreti: number;
  ucakUcreti: number;
  onerileriMetni: string;
}

const turkiyeIlleri = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
  'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
  'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
  'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
  'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

const ulasimTurleri = [
  { value: 'otomobil', label: 'Otomobil', icon: Car },
  { value: 'otobus', label: 'Otobüs', icon: Navigation },
  { value: 'ucak', label: 'Uçak', icon: Plane }
];

// Basitleştirilmiş mesafe matrisi (gerçek uygulamada API kullanılır)
const mesafeVerileri: { [key: string]: { [key: string]: number } } = {
  'İstanbul': {
    'Ankara': 454,
    'İzmir': 482,
    'Antalya': 729,
    'Bursa': 155,
    'Adana': 926,
    'Gaziantep': 1148,
    'Konya': 664,
    'Kayseri': 771,
    'Trabzon': 1069,
    'Erzurum': 1281,
    'Diyarbakır': 1482,
    'Van': 1783,
    'Samsun': 731
  },
  'Ankara': {
    'İstanbul': 454,
    'İzmir': 594,
    'Antalya': 548,
    'Bursa': 391,
    'Adana': 477,
    'Gaziantep': 701,
    'Konya': 261,
    'Kayseri': 335,
    'Trabzon': 648,
    'Erzurum': 860,
    'Diyarbakır': 931,
    'Van': 1232,
    'Samsun': 421
  },
  'İzmir': {
    'İstanbul': 482,
    'Ankara': 594,
    'Antalya': 518,
    'Bursa': 375,
    'Adana': 853,
    'Gaziantep': 1075,
    'Konya': 591,
    'Kayseri': 698,
    'Trabzon': 996,
    'Erzurum': 1208,
    'Diyarbakır': 1409,
    'Van': 1710,
    'Samsun': 658
  }
};

const benzerAraclar = [
  { name: 'Yakıt Tüketim Hesaplama', icon: Fuel, link: '#', active: false },
  { name: 'Seyahat Bütçe Hesaplama', icon: Calculator, link: '#', active: false },
  { name: 'Uçak Bileti Karşılaştırma', icon: Plane, link: '#', active: false }
];

const IllerArasiMesafeHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<MesafeInputs>({
    cikisIli: 'İstanbul',
    varisIli: 'Ankara',
    ulasimTuru: 'otomobil'
  });
  
  const [yakitFiyati, setYakitFiyati] = useState<number>(35);
  const [aracTuketimi, setAracTuketimi] = useState<number>(7);
  const [sonuc, setSonuc] = useState<MesafeSonuc | null>(null);

  const mesafeHesapla = (cikis: string, varis: string): number => {
    // Basit mesafe hesaplama - gerçek uygulamada harita API'si kullanılır
    if (cikis === varis) return 0;
    
    const cikisVerisi = mesafeVerileri[cikis];
    if (cikisVerisi && cikisVerisi[varis]) {
      return cikisVerisi[varis];
    }
    
    const varisVerisi = mesafeVerileri[varis];
    if (varisVerisi && varisVerisi[cikis]) {
      return varisVerisi[cikis];
    }
    
    // Yaklaşık hesaplama (alfabetik sıra farkına göre)
    const cikisIndex = turkiyeIlleri.indexOf(cikis);
    const varisIndex = turkiyeIlleri.indexOf(varis);
    const fark = Math.abs(cikisIndex - varisIndex);
    
    return Math.min(50 + (fark * 25), 2000); // 50-2000 km arası
  };

  const hesapla = () => {
    const { cikisIli, varisIli, ulasimTuru } = inputs;
    
    const karayoluMesafesi = mesafeHesapla(cikisIli, varisIli);
    const havayoluMesafesi = karayoluMesafesi * 0.8; // Havayolu genelde daha kısa
    
    // Tahmini süreler (saat)
    let tahminiSure = 0;
    let ucakSuresi = 0;
    
    switch (ulasimTuru) {
      case 'otomobil':
        tahminiSure = karayoluMesafesi / 80; // Ortalama 80 km/h
        break;
      case 'otobus':
        tahminiSure = karayoluMesafesi / 70; // Ortalama 70 km/h (molalar dahil)
        break;
      case 'ucak':
        ucakSuresi = Math.max(1, havayoluMesafesi / 800); // Ortalama 800 km/h
        tahminiSure = ucakSuresi + 2; // Havalimanı işlemleri dahil
        break;
    }
    
    // Yakıt hesaplamaları
    const yakitTuketimi = (karayoluMesafesi / 100) * aracTuketimi;
    const yakitMaliyeti = yakitTuketimi * yakitFiyati;
    
    // Tahmini ücretler
    const otobusUcreti = Math.min(karayoluMesafesi * 0.15, 500); // km başına 0.15 TL, max 500 TL
    const ucakUcreti = Math.max(300, Math.min(havayoluMesafesi * 0.5, 2000)); // 300-2000 TL arası
    
    // Öneriler
    let onerileriMetni = '';
    if (karayoluMesafesi < 300) {
      onerileriMetni = 'Kısa mesafe için otomobil veya otobüs tercih edilebilir. Yakıt maliyeti uygun.';
    } else if (karayoluMesafesi < 800) {
      onerileriMetni = 'Orta mesafe. Uçak ile zaman tasarrufu, otomobil ile maliyet avantajı sağlanabilir.';
    } else {
      onerileriMetni = 'Uzun mesafe için uçak önerilir. Zaman ve konfor açısından avantajlı.';
    }
    
    setSonuc({
      karayoluMesafesi,
      havayoluMesafesi,
      tahminiSure,
      yakitTuketimi,
      yakitMaliyeti,
      ucakSuresi,
      otobusUcreti,
      ucakUcreti,
      onerileriMetni
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs, yakitFiyati, aracTuketimi]);

  const handleInputChange = (field: keyof MesafeInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatSure = (saat: number) => {
    const saatKismi = Math.floor(saat);
    const dakikaKismi = Math.round((saat - saatKismi) * 60);
    return `${saatKismi} saat ${dakikaKismi} dakika`;
  };

  const getSelectedUlasim = () => {
    return ulasimTurleri.find(u => u.value === inputs.ulasimTuru);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Seyahat</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">İller Arası Mesafe Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              İller Arası Mesafe Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye'deki şehirler arası mesafe, süre ve seyahat maliyeti hesaplama araçları
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-blue-600" />
                Seyahat Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Çıkış İli
                    </label>
                    <select
                      value={inputs.cikisIli}
                      onChange={(e) => handleInputChange('cikisIli', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    >
                      {turkiyeIlleri.map(il => (
                        <option key={il} value={il}>
                          {il}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Varış İli
                    </label>
                    <select
                      value={inputs.varisIli}
                      onChange={(e) => handleInputChange('varisIli', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    >
                      {turkiyeIlleri.map(il => (
                        <option key={il} value={il}>
                          {il}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ulaşım Türü
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {ulasimTurleri.map(tur => {
                      const IconComponent = tur.icon;
                      return (
                        <div key={tur.value} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          inputs.ulasimTuru === tur.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleInputChange('ulasimTuru', tur.value)}>
                          <div className="text-center">
                            <IconComponent className={`h-8 w-8 mx-auto mb-2 ${
                              inputs.ulasimTuru === tur.value ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                            <div className={`font-medium ${
                              inputs.ulasimTuru === tur.value ? 'text-blue-900' : 'text-gray-700'
                            }`}>
                              {tur.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {inputs.ulasimTuru === 'otomobil' && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Otomobil Hesaplama Ayarları</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Yakıt Fiyatı (TL/Litre)
                        </label>
                        <input
                          type="number"
                          value={yakitFiyati}
                          onChange={(e) => setYakitFiyati(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="20"
                          max="60"
                          step="0.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Araç Tüketimi (L/100km)
                        </label>
                        <input
                          type="number"
                          value={aracTuketimi}
                          onChange={(e) => setAracTuketimi(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="4"
                          max="20"
                          step="0.1"
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Navigation className="h-6 w-6 mr-3 text-blue-600" />
                  Mesafe Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Karayolu Mesafesi</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {sonuc.karayoluMesafesi} km
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Havayolu Mesafesi</div>
                    <div className="text-xl font-bold text-gray-900">
                      {sonuc.havayoluMesafesi.toFixed(0)} km
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Tahmini Süre</div>
                    <div className="text-lg font-bold text-indigo-600">
                      {formatSure(sonuc.tahminiSure)}
                    </div>
                    {inputs.ulasimTuru === 'ucak' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Uçuş: {formatSure(sonuc.ucakSuresi)}
                      </div>
                    )}
                  </div>

                  {inputs.ulasimTuru === 'otomobil' && (
                    <>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">Yakıt Tüketimi</div>
                        <div className="text-lg font-bold text-green-600">
                          {sonuc.yakitTuketimi.toFixed(1)} L
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">Yakıt Maliyeti</div>
                        <div className="text-lg font-bold text-orange-600">
                          {formatCurrency(sonuc.yakitMaliyeti)}
                        </div>
                      </div>
                    </>
                  )}

                  {inputs.ulasimTuru === 'otobus' && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Tahmini Otobüs Ücreti</div>
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(sonuc.otobusUcreti)}
                      </div>
                    </div>
                  )}

                  {inputs.ulasimTuru === 'ucak' && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Tahmini Uçak Ücreti</div>
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(sonuc.ucakUcreti)}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-start space-x-2">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        {sonuc.onerileriMetni}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ulaşım Türleri Karşılaştırması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ulaşım Türleri Karşılaştırması</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Otomobil</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Esnek seyahat saatleri</li>
                <li>• Kapıdan kapıya ulaşım</li>
                <li>• Bagaj sınırı yok</li>
                <li>• Yakıt maliyeti var</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Otobüs</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ekonomik seçenek</li>
                <li>• Düzenli sefer saatleri</li>
                <li>• Dinlenme imkanı</li>
                <li>• Terminal ulaşımı gerekli</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Uçak</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• En hızlı ulaşım</li>
                <li>• Uzun mesafeler için ideal</li>
                <li>• Konforlu seyahat</li>
                <li>• Havalimanı işlemleri</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Türkiye Coğrafi Bölgeler */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Türkiye Coğrafi Bölgeleri</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-red-50 rounded-xl">
              <h3 className="font-semibold text-red-900 mb-2">Marmara Bölgesi</h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• İstanbul</li>
                <li>• Bursa</li>
                <li>• Kocaeli</li>
                <li>• Tekirdağ</li>
                <li>• Balıkesir</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">Ege Bölgesi</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• İzmir</li>
                <li>• Aydın</li>
                <li>• Muğla</li>
                <li>• Denizli</li>
                <li>• Manisa</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl">
              <h3 className="font-semibold text-orange-900 mb-2">Akdeniz Bölgesi</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Antalya</li>
                <li>• Adana</li>
                <li>• Mersin</li>
                <li>• Hatay</li>
                <li>• Isparta</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-2">İç Anadolu</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Ankara</li>
                <li>• Konya</li>
                <li>• Kayseri</li>
                <li>• Sivas</li>
                <li>• Eskişehir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mesafe Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popüler Güzergahlar</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kısa Mesafe Güzergahları</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">İstanbul - Bursa</h4>
                  <p className="text-sm text-green-800">155 km - 2 saat</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Ankara - Eskişehir</h4>
                  <p className="text-sm text-green-800">233 km - 2.5 saat</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">İzmir - Aydın</h4>
                  <p className="text-sm text-green-800">128 km - 1.5 saat</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uzun Mesafe Güzergahları</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-1">İstanbul - Van</h4>
                  <p className="text-sm text-red-800">1783 km - 22 saat</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-1">İzmir - Erzurum</h4>
                  <p className="text-sm text-red-800">1208 km - 15 saat</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-1">Ankara - Diyarbakır</h4>
                  <p className="text-sm text-red-800">931 km - 12 saat</p>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
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
              Türkiye İller Arası Mesafe Nasıl Hesaplanır? Seyahat Planlama Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İller Arası Mesafe Hesaplama Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İller arası mesafe hesaplama, Türkiye'deki şehirler arasındaki karayolu ve havayolu 
              mesafelerini, seyahat sürelerini ve maliyetlerini hesaplayan bir sistemdir. Bu hesaplama, 
              seyahat planlaması, lojistik operasyonları ve ulaşım bütçesi belirleme için kritik öneme sahiptir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Mesafe Hesaplama Yöntemleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de şehirler arası mesafe hesaplaması farklı yöntemlerle yapılabilir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Karayolu Mesafesi:</strong> Otoyol ve devlet yolları üzerinden</li>
              <li><strong>Havayolu Mesafesi:</strong> Kuş uçuşu doğrusal mesafe</li>
              <li><strong>GPS Navigasyon:</strong> Gerçek zamanlı trafik dahil</li>
              <li><strong>Alternatif Rotalar:</strong> Farklı güzergah seçenekleri</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ulaşım Türlerine Göre Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Her ulaşım türünün kendine özgü hesaplama kriterleri vardır:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Otomobil ile Seyahat</h4>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Ortalama hız:</strong> 80-90 km/h (otoyol)</li>
                <li>• <strong>Yakıt tüketimi:</strong> Araç tipine göre 5-15 L/100km</li>
                <li>• <strong>Ek maliyetler:</strong> Köprü, otoyol ücretleri</li>
                <li>• <strong>Mola süreleri:</strong> Her 2 saatte 15 dakika</li>
              </ul>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Otobüs ile Seyahat</h4>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-purple-800">
                <li>• <strong>Ortalama hız:</strong> 70-80 km/h (molalar dahil)</li>
                <li>• <strong>Ücret aralığı:</strong> km başına 0.10-0.20 TL</li>
                <li>• <strong>Konfor seviyesi:</strong> Şirket ve araç tipine göre</li>
                <li>• <strong>Bagaj sınırı:</strong> Genelde 30 kg</li>
              </ul>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Uçak ile Seyahat</h4>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Uçuş hızı:</strong> 800-900 km/h</li>
                <li>• <strong>Havalimanı işlemleri:</strong> +2 saat ek süre</li>
                <li>• <strong>Ücret aralığı:</strong> 300-2000 TL (mesafeye göre)</li>
                <li>• <strong>Bagaj sınırı:</strong> 15-23 kg (ücrete göre)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yakıt Maliyeti Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Otomobil ile seyahatte yakıt maliyeti şu formül ile hesaplanır:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-gray-900 mb-2">Yakıt Maliyeti Formülü:</p>
              <p className="text-gray-700 mb-2">
                Yakıt Maliyeti = (Mesafe ÷ 100) × Araç Tüketimi × Yakıt Fiyatı
              </p>
              <p className="text-sm text-gray-600">
                Örnek: (500 km ÷ 100) × 7 L × 35 TL = 1.225 TL
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Seyahat Planlama İpuçları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Mesafe analizi:</strong> 300 km altı otomobil, 800 km üstü uçak tercih edin</li>
              <li><strong>Maliyet karşılaştırması:</strong> Tüm ulaşım türlerini değerlendirin</li>
              <li><strong>Zaman faktörü:</strong> İş seyahatlerinde hız öncelikli olabilir</li>
              <li><strong>Konfor tercihi:</strong> Uzun mesafelerde konfor önemlidir</li>
              <li><strong>Bagaj durumu:</strong> Fazla bagajda otomobil avantajlı</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Türkiye'nin En Uzun Mesafeleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'deki en uzun şehirler arası mesafeler:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Doğu-Batı Ekseni</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Edirne - Van: ~1.800 km</li>
                  <li>İstanbul - Hakkari: ~1.850 km</li>
                  <li>Çanakkale - Ağrı: ~1.750 km</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Kuzey-Güney Ekseni</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Sinop - Hatay: ~1.200 km</li>
                  <li>Trabzon - Antalya: ~1.100 km</li>
                  <li>Samsun - Adana: ~800 km</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı Ulaşım Güncellemeleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Yeni otoyol projelerinin tamamlanması</li>
              <li>Hızlı tren hatlarının genişletilmesi</li>
              <li>Havalimanı sayısının artması</li>
              <li>Elektrikli araç şarj istasyonları</li>
              <li>Akıllı ulaşım sistemleri</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Seyahat Bütçe Planlama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Seyahat bütçenizi planlarken şu faktörleri göz önünde bulundurun:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Ulaşım maliyeti (yakıt, bilet ücreti)</li>
              <li>Konaklama giderleri</li>
              <li>Yemek ve içecek masrafları</li>
              <li>Ek aktivite ve gezilecek yer ücretleri</li>
              <li>Acil durum rezervi (%10-15)</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">💡 İpucu</h4>
              <p className="text-blue-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı ulaşım türlerinin maliyet ve süre 
                karşılaştırmasını yapabilir, en uygun seyahat seçeneğini belirleyebilirsiniz. 
                Özellikle uzun mesafelerde uçak, kısa mesafelerde otomobil tercih edilmelidir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              İller arası mesafe hesaplama, etkili seyahat planlamasının temelidir. Doğru hesaplama 
              ile hem zaman hem de maliyet tasarrufu sağlayabilir, en uygun ulaşım türünü seçebilirsiniz. 
              Türkiye'nin geniş coğrafyasında seyahat ederken, mesafe ve maliyet analizini önceden 
              yaparak daha konforlu ve ekonomik seyahatler gerçekleştirebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default IllerArasiMesafeHesaplamaPage;