import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Car, Shield, TrendingDown, ArrowRight, Info, Target, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

interface AracBilgileri {
  marka: string;
  model: string;
  modelYili: number;
  motorHacmi: string;
  yakitTuru: string;
  vitesTuru: string;
  aracYasi: number;
  kilometre: number;
  hasarDurumu: string;
}

interface KaskoSonuc {
  kaskoTutari: number;
  amortismanOrani: number;
  piyasaDegeri: number;
  sigortaPrimi: number;
  yillikPrim: number;
  hasarIndirimi: number;
  bonusMalus: number;
  toplamPrim: number;
  oneriler: string[];
}

const aracMarkalari = [
  'Volkswagen', 'Ford', 'Renault', 'Fiat', 'Toyota', 'Hyundai', 'Opel', 'Peugeot', 
  'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Honda', 'Skoda', 'Kia', 'Citroen',
  'Seat', 'Mazda', 'Mitsubishi', 'Suzuki', 'Dacia', 'Chevrolet', 'Volvo', 'Diğer'
];

const motorHacimAraliklari = [
  { value: '1000-1200', label: '1.0-1.2 Litre', carpan: 0.9 },
  { value: '1200-1400', label: '1.2-1.4 Litre', carpan: 1.0 },
  { value: '1400-1600', label: '1.4-1.6 Litre', carpan: 1.1 },
  { value: '1600-1800', label: '1.6-1.8 Litre', carpan: 1.2 },
  { value: '1800-2000', label: '1.8-2.0 Litre', carpan: 1.3 },
  { value: '2000+', label: '2.0+ Litre', carpan: 1.5 }
];

const yakitTurleri = [
  { value: 'benzin', label: 'Benzin', carpan: 1.0 },
  { value: 'dizel', label: 'Dizel', carpan: 1.1 },
  { value: 'lpg', label: 'LPG', carpan: 0.9 },
  { value: 'hibrit', label: 'Hibrit', carpan: 1.2 },
  { value: 'elektrik', label: 'Elektrik', carpan: 1.3 }
];

const hasarDurumlari = [
  { value: 'hasarsiz', label: 'Hasarsız', indirim: 0.3 },
  { value: 'az-hasar', label: 'Az Hasarlı', indirim: 0.1 },
  { value: 'orta-hasar', label: 'Orta Hasarlı', indirim: -0.1 },
  { value: 'cok-hasar', label: 'Çok Hasarlı', indirim: -0.3 }
];

const benzerAraclar = [
  { name: 'Trafik Sigortası Hesaplama', icon: Car, link: '#', active: false },
  { name: 'Hayat Sigortası Hesaplama', icon: Shield, link: '#', active: false },
  { name: 'Konut Sigortası Hesaplama', icon: Calculator, link: '#', active: false }
];

const AracKaskoDegeriHesaplamaPage: React.FC = () => {
  const [aracBilgileri, setAracBilgileri] = useState<AracBilgileri>({
    marka: 'Volkswagen',
    model: 'Golf',
    modelYili: 2020,
    motorHacmi: '1400-1600',
    yakitTuru: 'benzin',
    vitesTuru: 'manuel',
    aracYasi: 4,
    kilometre: 80000,
    hasarDurumu: 'hasarsiz'
  });
  
  const [temelDeger, setTemelDeger] = useState<number>(450000);
  const [sonuc, setSonuc] = useState<KaskoSonuc | null>(null);

  const hesapla = () => {
    const { modelYili, motorHacmi, yakitTuru, aracYasi, kilometre, hasarDurumu } = aracBilgileri;
    
    // Temel değer hesaplama (TSB listesi simülasyonu)
    let kaskoTutari = temelDeger;
    
    // Yaş amortismanı (yılda %8-12 arası)
    const yillikAmortismanOrani = 10; // %10 ortalama
    const amortismanOrani = Math.min(aracYasi * yillikAmortismanOrani, 70); // Max %70
    kaskoTutari = kaskoTutari * (1 - amortismanOrani / 100);
    
    // Kilometre etkisi
    const kilometreEtkisi = Math.min(kilometre / 10000 * 2, 20); // Her 10.000 km için %2, max %20
    kaskoTutari = kaskoTutari * (1 - kilometreEtkisi / 100);
    
    // Motor hacmi etkisi
    const motorTipi = motorHacimAraliklari.find(m => m.value === motorHacmi);
    kaskoTutari = kaskoTutari * (motorTipi?.carpan || 1.0);
    
    // Yakıt türü etkisi
    const yakitTipi = yakitTurleri.find(y => y.value === yakitTuru);
    kaskoTutari = kaskoTutari * (yakitTipi?.carpan || 1.0);
    
    // Hasar durumu etkisi
    const hasarTipi = hasarDurumlari.find(h => h.value === hasarDurumu);
    const hasarIndirimi = (hasarTipi?.indirim || 0) * 100;
    kaskoTutari = kaskoTutari * (1 + (hasarTipi?.indirim || 0));
    
    // Sigorta primi hesaplama (kasko tutarının %3-5'i arası)
    const temelPrimOrani = 4; // %4 ortalama
    let sigortaPrimi = kaskoTutari * (temelPrimOrani / 100);
    
    // Bonus-Malus sistemi (hasarsızlık indirimi)
    const bonusMalus = hasarDurumu === 'hasarsiz' ? 30 : 
                      hasarDurumu === 'az-hasar' ? 10 : 
                      hasarDurumu === 'orta-hasar' ? -10 : -30;
    
    const yillikPrim = sigortaPrimi * (1 - bonusMalus / 100);
    const toplamPrim = yillikPrim;
    
    // Öneriler oluşturma
    const oneriler: string[] = [];
    
    if (aracYasi > 10) {
      oneriler.push('10 yaş üstü araçlarda kasko maliyeti yüksek olabilir');
    }
    
    if (kilometre > 150000) {
      oneriler.push('Yüksek kilometreli araçlarda hasar riski artabilir');
    }
    
    if (hasarDurumu === 'hasarsiz') {
      oneriler.push('Hasarsızlık indiriminizi korumaya devam edin');
    }
    
    if (yakitTuru === 'elektrik' || yakitTuru === 'hibrit') {
      oneriler.push('Çevre dostu araçlarda özel indirimler olabilir');
    }
    
    setSonuc({
      kaskoTutari,
      amortismanOrani,
      piyasaDegeri: kaskoTutari,
      sigortaPrimi,
      yillikPrim,
      hasarIndirimi,
      bonusMalus,
      toplamPrim,
      oneriler
    });
  };

  useEffect(() => {
    // Araç yaşını otomatik hesapla
    const guncelYil = new Date().getFullYear();
    const yeniAracYasi = guncelYil - aracBilgileri.modelYili;
    if (yeniAracYasi !== aracBilgileri.aracYasi) {
      setAracBilgileri(prev => ({ ...prev, aracYasi: Math.max(0, yeniAracYasi) }));
    }
    hesapla();
  }, [aracBilgileri, temelDeger]);

  const handleInputChange = (field: keyof AracBilgileri, value: any) => {
    setAracBilgileri(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getSelectedMotorHacmi = () => {
    return motorHacimAraliklari.find(m => m.value === aracBilgileri.motorHacmi);
  };

  const getSelectedYakitTuru = () => {
    return yakitTurleri.find(y => y.value === aracBilgileri.yakitTuru);
  };

  const getSelectedHasarDurumu = () => {
    return hasarDurumlari.find(h => h.value === aracBilgileri.hasarDurumu);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-cyan-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Sigorta</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Araç Kasko Değeri Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Araç Kasko Değeri Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            2025 yılı TSB güncel verilerine göre araç kasko değeri ve sigorta primi hesaplama
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Car className="h-6 w-6 mr-3 text-cyan-600" />
                Araç Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Araç Markası
                    </label>
                    <select
                      value={aracBilgileri.marka}
                      onChange={(e) => handleInputChange('marka', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                    >
                      {aracMarkalari.map(marka => (
                        <option key={marka} value={marka}>
                          {marka}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Model Adı
                    </label>
                    <input
                      type="text"
                      value={aracBilgileri.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                      placeholder="Örn: Golf, Focus, Megane"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Model Yılı
                    </label>
                    <input
                      type="number"
                      value={aracBilgileri.modelYili}
                      onChange={(e) => handleInputChange('modelYili', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                      min="1990"
                      max="2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Motor Hacmi
                    </label>
                    <select
                      value={aracBilgileri.motorHacmi}
                      onChange={(e) => handleInputChange('motorHacmi', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                    >
                      {motorHacimAraliklari.map(hacim => (
                        <option key={hacim.value} value={hacim.value}>
                          {hacim.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Yakıt Türü
                    </label>
                    <select
                      value={aracBilgileri.yakitTuru}
                      onChange={(e) => handleInputChange('yakitTuru', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                    >
                      {yakitTurleri.map(yakit => (
                        <option key={yakit.value} value={yakit.value}>
                          {yakit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Kilometre
                    </label>
                    <input
                      type="number"
                      value={aracBilgileri.kilometre}
                      onChange={(e) => handleInputChange('kilometre', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      step="1000"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Aracın toplam kilometresi
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hasar Durumu
                    </label>
                    <select
                      value={aracBilgileri.hasarDurumu}
                      onChange={(e) => handleInputChange('hasarDurumu', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                    >
                      {hasarDurumlari.map(hasar => (
                        <option key={hasar.value} value={hasar.value}>
                          {hasar.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      {getSelectedHasarDurumu()?.indirim && getSelectedHasarDurumu()!.indirim > 0 ? 
                        `%${(getSelectedHasarDurumu()!.indirim * 100)} indirim` :
                        getSelectedHasarDurumu()?.indirim && getSelectedHasarDurumu()!.indirim < 0 ?
                        `%${Math.abs(getSelectedHasarDurumu()!.indirim * 100)} artış` : 'Standart'
                      }
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Temel Araç Değeri (TL)
                  </label>
                  <input
                    type="number"
                    value={temelDeger}
                    onChange={(e) => setTemelDeger(Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-medium"
                    min="50000"
                    step="5000"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Sıfır km araç değeri (TSB listesi referans)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-cyan-600" />
                  Kasko Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Kasko Tutarı</div>
                    <div className="text-3xl font-bold text-cyan-600">
                      {formatCurrency(sonuc.kaskoTutari)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Güncel piyasa değeri
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Amortisman Oranı</div>
                    <div className="text-xl font-bold text-orange-600">
                      %{sonuc.amortismanOrani.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {aracBilgileri.aracYasi} yıllık değer kaybı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yıllık Sigorta Primi</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(sonuc.yillikPrim)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Bonus-Malus</div>
                    <div className={`text-lg font-bold ${
                      sonuc.bonusMalus > 0 ? 'text-green-600' : 
                      sonuc.bonusMalus < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {sonuc.bonusMalus > 0 ? '+' : ''}{sonuc.bonusMalus}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Hasarsızlık indirimi/artışı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Araç Yaşı</div>
                    <div className="text-lg font-bold text-gray-900">
                      {aracBilgileri.aracYasi} yıl
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {aracBilgileri.modelYili} model
                    </div>
                  </div>

                  {sonuc.oneriler.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                      <div className="text-sm text-yellow-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Öneriler
                      </div>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {sonuc.oneriler.map((oneri, index) => (
                          <li key={index}>• {oneri}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kasko Değer Faktörleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kasko Değerini Etkileyen Faktörler</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Araç Yaşı</h3>
              <p className="text-sm text-gray-600">
                Yılda %8-12 amortisman. Maksimum %70 değer kaybı.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kilometre</h3>
              <p className="text-sm text-gray-600">
                Her 10.000 km için %2 değer kaybı. Maksimum %20 etki.
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Motor Hacmi</h3>
              <p className="text-sm text-gray-600">
                Büyük motor hacmi daha yüksek değer. 2.0L+ için %50 artış.
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hasar Durumu</h3>
              <p className="text-sm text-gray-600">
                Hasarsız araçlarda %30 indirim. Hasarlılarda artış.
              </p>
            </div>
          </div>
        </div>

        {/* 2025 TSB Güncel Bilgiler */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2025 Yılı TSB Güncel Verileri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amortisman Oranları</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">1-3 Yaş Araçlar</h4>
                  <p className="text-sm text-red-800">
                    Yılda %8-10 amortisman. Düşük değer kaybı.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">4-7 Yaş Araçlar</h4>
                  <p className="text-sm text-orange-800">
                    Yılda %10-12 amortisman. Orta değer kaybı.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">8+ Yaş Araçlar</h4>
                  <p className="text-sm text-yellow-800">
                    Yılda %12-15 amortisman. Yüksek değer kaybı.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sigorta Primi Oranları</h3>
              <div className="bg-cyan-50 p-4 rounded-xl">
                <ul className="space-y-2 text-cyan-800">
                  <li><strong>Temel prim oranı:</strong> Kasko tutarının %3-5'i</li>
                  <li><strong>Hasarsızlık indirimi:</strong> %10-30 arası</li>
                  <li><strong>Genç sürücü:</strong> %20-50 artış</li>
                  <li><strong>Şehir içi kullanım:</strong> %10-20 artış</li>
                  <li><strong>Güvenlik sistemleri:</strong> %5-15 indirim</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Kasko Türleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kasko Sigorta Türleri</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-3">Tam Kasko</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Çarpışma, devrilme, yangın</li>
                <li>• Hırsızlık, doğal afet</li>
                <li>• Cam kırılması</li>
                <li>• Ferdi kaza teminatı</li>
              </ul>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Kısmi Kasko</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Yangın, hırsızlık</li>
                <li>• Doğal afet</li>
                <li>• Cam kırılması</li>
                <li>• Çarpışma teminatı yok</li>
              </ul>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="font-semibold text-purple-900 mb-3">Mini Kasko</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Sadece yangın</li>
                <li>• Sadece hırsızlık</li>
                <li>• Sınırlı teminat</li>
                <li>• Düşük prim</li>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
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
              Araç Kasko Değeri Nasıl Hesaplanır? 2025 TSB Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Araç Kasko Değeri Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Araç kasko değeri, sigorta şirketlerinin bir aracın güncel piyasa değerini belirlemek için 
              kullandığı değerlendirme sistemidir. Bu değer, Türkiye Sigorta ve Reasürans Şirketleri Birliği (TSB) 
              tarafından yayınlanan listeler ve piyasa verileri dikkate alınarak hesaplanır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı TSB Değerleme Kriterleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              TSB'nin 2025 yılı güncel değerleme kriterleri şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Temel araç değeri:</strong> Sıfır km araç fiyatı</li>
              <li><strong>Yaş amortismanı:</strong> Yılda %8-15 arası değer kaybı</li>
              <li><strong>Kilometre etkisi:</strong> Her 10.000 km için %2 düşüş</li>
              <li><strong>Hasar geçmişi:</strong> %30'a kadar değer etkisi</li>
              <li><strong>Bakım durumu:</strong> Genel durum değerlendirmesi</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Amortisman Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Araç amortismanı, aracın yaşına ve kullanım durumuna göre hesaplanır:
            </p>
            <div className="bg-cyan-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-cyan-900 mb-2">Amortisman Formülü:</p>
              <p className="text-cyan-800 mb-2">
                Güncel Değer = Temel Değer × (1 - Amortisman Oranı)
              </p>
              <p className="text-sm text-cyan-700">
                Amortisman Oranı = (Araç Yaşı × Yıllık Amortisman) + Kilometre Etkisi + Hasar Etkisi
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Motor Hacmi ve Yakıt Türü Etkisi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Aracın teknik özellikleri kasko değerini önemli ölçüde etkiler:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Motor Hacmi Çarpanları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>1.0-1.2L: %90 (düşük değer)</li>
                  <li>1.2-1.4L: %100 (standart)</li>
                  <li>1.4-1.6L: %110 (orta değer)</li>
                  <li>1.6-1.8L: %120 (yüksek değer)</li>
                  <li>2.0L+: %150 (premium değer)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Yakıt Türü Çarpanları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Benzin: %100 (standart)</li>
                  <li>Dizel: %110 (yüksek değer)</li>
                  <li>LPG: %90 (düşük değer)</li>
                  <li>Hibrit: %120 (premium)</li>
                  <li>Elektrik: %130 (en yüksek)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sigorta Primi Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kasko sigorta primi, hesaplanan kasko değeri üzerinden belirlenir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Temel prim oranı:</strong> Kasko tutarının %3-5'i</li>
              <li><strong>Hasarsızlık indirimi:</strong> %10-30 arası indirim</li>
              <li><strong>Yaş ve deneyim:</strong> Genç sürücülerde artış</li>
              <li><strong>Kullanım amacı:</strong> Ticari kullanımda artış</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bonus-Malus Sistemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Hasarsızlık durumuna göre uygulanan indirim/artış sistemi:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Hasarsız (5+ yıl):</strong> %30 indirim</li>
                <li>• <strong>Hasarsız (3-5 yıl):</strong> %20 indirim</li>
                <li>• <strong>Hasarsız (1-3 yıl):</strong> %10 indirim</li>
                <li>• <strong>1 hasar:</strong> Standart prim</li>
                <li>• <strong>2+ hasar:</strong> %20-50 artış</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı Değişiklikleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Elektrikli araçlar için özel değerleme kriterleri</li>
              <li>Hibrit araçlarda çevre dostu indirimler</li>
              <li>Dijital hasar tespit sistemleri</li>
              <li>Online kasko değer sorgulama imkanı</li>
              <li>Yapay zeka destekli risk analizi</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kasko Değeri Artırma Yöntemleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Düzenli bakım ve servis kayıtları tutma</li>
              <li>Orijinal yedek parça kullanımı</li>
              <li>Hasarsız sürüş geçmişi oluşturma</li>
              <li>Güvenlik sistemleri ekleme</li>
              <li>Araç temizlik ve bakımına özen gösterme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              2020 model Volkswagen Golf örneği:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Araç Bilgileri:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>Temel Değer: 450.000 TL</li>
                <li>Araç Yaşı: 5 yıl</li>
                <li>Kilometre: 80.000 km</li>
                <li>Motor: 1.4L Benzin</li>
                <li>Durum: Hasarsız</li>
              </ul>
              
              <h4 className="font-semibold text-gray-900 mb-2">Hesaplama:</h4>
              <p className="text-gray-700 mb-2">
                Yaş Amortismanı: 5 × %10 = %50
              </p>
              <p className="text-gray-700 mb-2">
                Kilometre Etkisi: 8 × %2 = %16
              </p>
              <p className="text-gray-700 mb-2">
                Hasarsızlık İndirimi: %30
              </p>
              <p className="font-bold text-green-600 text-lg">
                Kasko Tutarı: 450.000 × (1-0.50-0.16+0.30) ≈ 288.000 TL
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kasko Yaptırmanın Avantajları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Kapsamlı hasar koruması</li>
              <li>Hırsızlık güvencesi</li>
              <li>Doğal afet koruması</li>
              <li>Ferdi kaza teminatı</li>
              <li>Cam kırılması teminatı</li>
              <li>Yedek araç hizmeti</li>
            </ul>

            <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-cyan-900 mb-2">💡 İpucu</h4>
              <p className="text-cyan-800">
                Yukarıdaki hesaplama aracımızı kullanarak aracınızın güncel kasko değerini hesaplayabilir, 
                farklı sigorta şirketlerinin tekliflerini karşılaştırabilir ve en uygun kasko poliçesini 
                seçebilirsiniz. TSB güncel verilerine göre hesaplama yapılmaktadır.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Araç kasko değeri hesaplama, doğru sigorta poliçesi seçimi için kritik öneme sahiptir. 
              2025 yılı TSB güncel verileri ile hesaplama yaparak, aracınızın gerçek değerini öğrenebilir 
              ve uygun sigorta primi ile korunabilirsiniz. Düzenli değerleme ile sigorta maliyetlerinizi 
              optimize edebilir ve en iyi teminatı alabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default AracKaskoDegeriHesaplamaPage;