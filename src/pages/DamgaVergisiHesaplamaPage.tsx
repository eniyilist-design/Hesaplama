import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, Receipt, FileText, Building, ArrowRight, Info, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface DamgaVergisiInputs {
  belgeTuru: string;
  belgeDeğeri: number;
  islemTarihi: string;
  ozelDurum: string;
}

interface DamgaVergisiSonuc {
  damgaVergisi: number;
  vergiOrani: number;
  minVergi: number;
  maxVergi: number;
  toplamOdeme: number;
  vergiMatrahi: number;
  muafiyetDurumu: boolean;
  aciklama: string;
  odemeTarihi: Date;
}

const belgeTurleri = [
  { 
    value: 'kira-sozlesmesi', 
    label: 'Kira Sözleşmesi', 
    oran: 0.948, 
    minVergi: 50, 
    maxVergi: 5000,
    aciklama: 'Konut ve işyeri kira sözleşmeleri'
  },
  { 
    value: 'is-sozlesmesi', 
    label: 'İş Sözleşmesi', 
    oran: 0.948, 
    minVergi: 25, 
    maxVergi: 2500,
    aciklama: 'İş akdi ve hizmet sözleşmeleri'
  },
  { 
    value: 'satis-sozlesmesi', 
    label: 'Satış Sözleşmesi', 
    oran: 0.948, 
    minVergi: 100, 
    maxVergi: 10000,
    aciklama: 'Mal ve hizmet satış sözleşmeleri'
  },
  { 
    value: 'kredi-sozlesmesi', 
    label: 'Kredi Sözleşmesi', 
    oran: 0.948, 
    minVergi: 200, 
    maxVergi: 15000,
    aciklama: 'Banka kredileri ve finansman sözleşmeleri'
  },
  { 
    value: 'sigorta-polices', 
    label: 'Sigorta Poliçesi', 
    oran: 0.948, 
    minVergi: 30, 
    maxVergi: 3000,
    aciklama: 'Hayat, kasko, konut sigortaları'
  },
  { 
    value: 'makbuz-fatura', 
    label: 'Makbuz ve Fatura', 
    oran: 0.948, 
    minVergi: 5, 
    maxVergi: 500,
    aciklama: 'Ticari makbuz ve faturalar'
  },
  { 
    value: 'vekaletname', 
    label: 'Vekaletname', 
    oran: 0.948, 
    minVergi: 75, 
    maxVergi: 1500,
    aciklama: 'Hukuki temsil belgeleri'
  },
  { 
    value: 'bono-cek', 
    label: 'Bono ve Çek', 
    oran: 0.948, 
    minVergi: 15, 
    maxVergi: 1000,
    aciklama: 'Kambiyo senetleri'
  }
];

const ozelDurumlar = [
  { value: 'normal', label: 'Normal İşlem', carpan: 1.0 },
  { value: 'kamu-kurumu', label: 'Kamu Kurumu', carpan: 0.5 },
  { value: 'kooperatif', label: 'Kooperatif', carpan: 0.75 },
  { value: 'vakif-dernek', label: 'Vakıf/Dernek', carpan: 0.5 },
  { value: 'muafiyet', label: 'Muafiyet Kapsamında', carpan: 0.0 }
];

const benzerAraclar = [
  { name: 'KDV Hesaplama', icon: Receipt, link: '#', active: false },
  { name: 'Gelir Vergisi Hesaplama', icon: DollarSign, link: '#', active: false },
  { name: 'Stopaj Hesaplama', icon: Calculator, link: '#', active: false }
];

const DamgaVergisiHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<DamgaVergisiInputs>({
    belgeTuru: 'kira-sozlesmesi',
    belgeDeğeri: 10000,
    islemTarihi: new Date().toISOString().split('T')[0],
    ozelDurum: 'normal'
  });
  
  const [sonuc, setSonuc] = useState<DamgaVergisiSonuc | null>(null);

  const hesapla = () => {
    const { belgeTuru, belgeDeğeri, islemTarihi, ozelDurum } = inputs;
    
    const belgeTipi = belgeTurleri.find(b => b.value === belgeTuru);
    const ozelDurumTipi = ozelDurumlar.find(o => o.value === ozelDurum);
    
    if (!belgeTipi || !ozelDurumTipi) return;
    
    // Vergi matrahı hesaplama
    const vergiMatrahi = belgeDeğeri;
    
    // Temel damga vergisi hesaplama (binde cinsinden)
    const temelDamgaVergisi = vergiMatrahi * (belgeTipi.oran / 100);
    
    // Özel durum çarpanı uygulama
    const damgaVergisiOncesi = temelDamgaVergisi * ozelDurumTipi.carpan;
    
    // Minimum ve maksimum vergi kontrolü
    let damgaVergisi = damgaVergisiOncesi;
    if (damgaVergisi < belgeTipi.minVergi && ozelDurumTipi.carpan > 0) {
      damgaVergisi = belgeTipi.minVergi * ozelDurumTipi.carpan;
    }
    if (damgaVergisi > belgeTipi.maxVergi) {
      damgaVergisi = belgeTipi.maxVergi;
    }
    
    const toplamOdeme = vergiMatrahi + damgaVergisi;
    const muafiyetDurumu = ozelDurumTipi.carpan === 0.0;
    
    // Ödeme tarihi (işlem tarihinden 1 ay sonra)
    const odemeTarihi = new Date(islemTarihi);
    odemeTarihi.setMonth(odemeTarihi.getMonth() + 1);
    
    let aciklama = '';
    if (muafiyetDurumu) {
      aciklama = 'Bu işlem damga vergisinden muaftır.';
    } else if (damgaVergisi === belgeTipi.minVergi * ozelDurumTipi.carpan) {
      aciklama = 'Minimum damga vergisi uygulanmıştır.';
    } else if (damgaVergisi === belgeTipi.maxVergi) {
      aciklama = 'Maksimum damga vergisi uygulanmıştır.';
    } else {
      aciklama = 'Normal damga vergisi hesaplaması yapılmıştır.';
    }
    
    setSonuc({
      damgaVergisi,
      vergiOrani: belgeTipi.oran,
      minVergi: belgeTipi.minVergi,
      maxVergi: belgeTipi.maxVergi,
      toplamOdeme,
      vergiMatrahi,
      muafiyetDurumu,
      aciklama,
      odemeTarihi
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof DamgaVergisiInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSelectedBelgeTuru = () => {
    return belgeTurleri.find(b => b.value === inputs.belgeTuru);
  };

  const getSelectedOzelDurum = () => {
    return ozelDurumlar.find(o => o.value === inputs.ozelDurum);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Vergi</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Damga Vergisi Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Damga Vergisi Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            2025 yılı güncel oranlarla damga vergisi hesaplama. Türkiye vergi mevzuatına uygun hesaplama araçları
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
                <FileText className="h-6 w-6 mr-3 text-yellow-600" />
                Belge ve İşlem Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Belge Türü
                  </label>
                  <select
                    value={inputs.belgeTuru}
                    onChange={(e) => handleInputChange('belgeTuru', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                  >
                    {belgeTurleri.map(tur => (
                      <option key={tur.value} value={tur.value}>
                        {tur.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedBelgeTuru()?.aciklama} - Oran: %{getSelectedBelgeTuru()?.oran}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Belge Değeri (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.belgeDeğeri}
                      onChange={(e) => handleInputChange('belgeDeğeri', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      min="1"
                      step="100"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Sözleşme tutarı veya belge değeri
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      İşlem Tarihi
                    </label>
                    <input
                      type="date"
                      value={inputs.islemTarihi}
                      onChange={(e) => handleInputChange('islemTarihi', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Özel Durum
                  </label>
                  <select
                    value={inputs.ozelDurum}
                    onChange={(e) => handleInputChange('ozelDurum', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                  >
                    {ozelDurumlar.map(durum => (
                      <option key={durum.value} value={durum.value}>
                        {durum.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedOzelDurum()?.carpan === 1.0 ? 'Standart vergi oranı' :
                     getSelectedOzelDurum()?.carpan === 0.0 ? 'Vergiden muaf' :
                     `%${((getSelectedOzelDurum()?.carpan || 1) * 100)} indirimli oran`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Receipt className="h-6 w-6 mr-3 text-yellow-600" />
                  Vergi Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Damga Vergisi</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {formatCurrency(sonuc.damgaVergisi)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      %{sonuc.vergiOrani} oran
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Vergi Matrahı</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sonuc.vergiMatrahi)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Ödeme</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(sonuc.toplamOdeme)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Belge değeri + Damga vergisi
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Vergi Aralığı</div>
                    <div className="text-sm text-gray-700">
                      Min: {formatCurrency(sonuc.minVergi)}
                    </div>
                    <div className="text-sm text-gray-700">
                      Max: {formatCurrency(sonuc.maxVergi)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ödeme Tarihi</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatTarih(sonuc.odemeTarihi)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      İşlem tarihinden 1 ay sonra
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.muafiyetDurumu ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {sonuc.muafiyetDurumu ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className={`text-sm ${
                        sonuc.muafiyetDurumu ? 'text-green-800' : 'text-blue-800'
                      }`}>
                        {sonuc.aciklama}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Belge Türleri ve Oranları */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2025 Yılı Damga Vergisi Oranları</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {belgeTurleri.map(tur => (
              <div key={tur.value} className={`p-4 rounded-xl border-2 ${
                inputs.belgeTuru === tur.value ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{tur.label}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {tur.aciklama}
                </div>
                <div className="text-sm font-medium text-yellow-700">
                  Oran: %{tur.oran}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Min: {formatCurrency(tur.minVergi)} | Max: {formatCurrency(tur.maxVergi)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Özel Durumlar */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Özel Durumlar ve İndirimler</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ozelDurumlar.map(durum => (
              <div key={durum.value} className={`p-4 rounded-xl border-2 ${
                inputs.ozelDurum === durum.value ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{durum.label}</h3>
                <div className={`text-sm font-medium ${
                  durum.carpan === 0.0 ? 'text-green-600' :
                  durum.carpan < 1.0 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {durum.carpan === 0.0 ? 'Muaf' :
                   durum.carpan === 1.0 ? 'Normal Oran' :
                   `%${(durum.carpan * 100)} İndirim`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Damga Vergisi Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pratik Örnekler</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Kira Sözleşmesi</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Aylık 5.000 TL kira, 12 aylık sözleşme
                  </p>
                  <p className="text-sm text-blue-700">
                    Matrah: 60.000 TL → Vergi: 56.88 TL
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Kredi Sözleşmesi</h4>
                  <p className="text-sm text-green-800 mb-2">
                    100.000 TL kredi sözleşmesi
                  </p>
                  <p className="text-sm text-green-700">
                    Matrah: 100.000 TL → Vergi: 200 TL (min.)
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Satış Sözleşmesi</h4>
                  <p className="text-sm text-purple-800 mb-2">
                    50.000 TL değerinde mal satışı
                  </p>
                  <p className="text-sm text-purple-700">
                    Matrah: 50.000 TL → Vergi: 100 TL (min.)
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesaplama Formülü</h3>
              <div className="bg-yellow-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Temel Formül:</strong>
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Damga Vergisi = (Belge Değeri × Oran) / 1000
                </p>
                <p className="text-xs text-gray-600">
                  Minimum ve maksimum vergi sınırları uygulanır
                </p>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">2025 Güncel Bilgiler</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Temel oran: %0.948</li>
                <li>• Kamu kurumları: %50 indirim</li>
                <li>• Vakıf/Dernekler: %50 indirim</li>
                <li>• Kooperatifler: %25 indirim</li>
                <li>• Ödeme süresi: 1 ay</li>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl flex items-center justify-center mb-4">
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
              Damga Vergisi Nedir ve 2025'te Nasıl Hesaplanır? Güncel Vergi Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Damga Vergisi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Damga vergisi, Türkiye'de çeşitli belge ve sözleşmeler üzerinden alınan dolaylı bir vergi türüdür. 
              488 sayılı Damga Vergisi Kanunu kapsamında düzenlenen bu vergi, sözleşmeler, makbuzlar, 
              poliçeler ve diğer ticari belgeler için ödenmesi zorunlu olan bir vergidir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı Güncel Damga Vergisi Oranları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              2025 yılında geçerli olan damga vergisi oranları şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Genel oran:</strong> %0.948</li>
              <li><strong>Kira sözleşmeleri:</strong> %0.948 (Min: 50 TL, Max: 5.000 TL)</li>
              <li><strong>Kredi sözleşmeleri:</strong> %0.948 (Min: 200 TL, Max: 15.000 TL)</li>
              <li><strong>İş sözleşmeleri:</strong> %0.948 (Min: 25 TL, Max: 2.500 TL)</li>
              <li><strong>Sigorta poliçeleri:</strong> %0.948 (Min: 30 TL, Max: 3.000 TL)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Damga Vergisi Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Damga vergisi hesaplaması şu formül ile yapılır:
            </p>
            <div className="bg-yellow-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-yellow-900 mb-2">Hesaplama Formülü:</p>
              <p className="text-yellow-800 mb-2">
                Damga Vergisi = Belge Değeri × %0.948
              </p>
              <p className="text-sm text-yellow-700">
                Örnek: 100.000 TL × %0.948 = 948 TL
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Minimum ve Maksimum Vergi Sınırları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Her belge türü için minimum ve maksimum damga vergisi tutarları belirlenmiştir:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Yüksek Tutarlı Belgeler</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>Kredi Sözleşmesi: 200-15.000 TL</li>
                    <li>Satış Sözleşmesi: 100-10.000 TL</li>
                    <li>Kira Sözleşmesi: 50-5.000 TL</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Düşük Tutarlı Belgeler</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>İş Sözleşmesi: 25-2.500 TL</li>
                    <li>Sigorta Poliçesi: 30-3.000 TL</li>
                    <li>Makbuz/Fatura: 5-500 TL</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İndirimli Oranlar ve Muafiyetler</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Belirli kurum ve durumlar için indirimli oranlar uygulanır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Kamu kurumları:</strong> %50 indirimli oran</li>
              <li><strong>Vakıf ve dernekler:</strong> %50 indirimli oran</li>
              <li><strong>Kooperatifler:</strong> %25 indirimli oran</li>
              <li><strong>Muaf işlemler:</strong> Belirli belgeler vergiden muaf</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Damga Vergisinden Muaf Belgeler</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Devlet dairelerinin resmi yazışmaları</li>
              <li>Mahkeme kararları ve icra işlemleri</li>
              <li>Eğitim kurumlarının diploma ve sertifikaları</li>
              <li>Sağlık kurumlarının raporları</li>
              <li>1.000 TL altındaki makbuzlar (bazı durumlar)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ödeme Süresi ve Cezalar</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Damga vergisi ödeme süreleri ve gecikme cezaları:
            </p>
            <div className="bg-red-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-red-800">
                <li>• <strong>Ödeme süresi:</strong> Belge düzenleme tarihinden 1 ay</li>
                <li>• <strong>Gecikme faizi:</strong> Aylık %2 (2025 oranı)</li>
                <li>• <strong>Vergi cezası:</strong> Verginin 1 katı</li>
                <li>• <strong>Pişmanlık indirimi:</strong> Cezanın %50'si</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Elektronik Damga Vergisi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              2025 yılında elektronik belgelerde damga vergisi uygulaması:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>E-faturalarda otomatik hesaplama</li>
              <li>Dijital sözleşmelerde online ödeme</li>
              <li>Blockchain tabanlı belgelerde vergi uygulaması</li>
              <li>Mobil uygulamalar üzerinden ödeme imkanı</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Detaylı damga vergisi hesaplama örneği:
            </p>
            <div className="bg-amber-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-amber-900 mb-3">Senaryo:</h4>
              <ul className="space-y-1 text-amber-800 mb-4">
                <li>Belge Türü: Kira Sözleşmesi</li>
                <li>Aylık Kira: 8.000 TL</li>
                <li>Sözleşme Süresi: 12 ay</li>
                <li>Toplam Değer: 96.000 TL</li>
              </ul>
              
              <h4 className="font-semibold text-amber-900 mb-2">Hesaplama:</h4>
              <p className="text-amber-800 mb-2">
                Temel Vergi: 96.000 × %0.948 = 909.6 TL
              </p>
              <p className="text-amber-800 mb-2">
                Minimum Kontrol: 50 TL (minimum uygulanmaz)
              </p>
              <p className="text-amber-800 mb-2">
                Maksimum Kontrol: 5.000 TL (maksimum uygulanır)
              </p>
              <p className="font-bold text-green-600 text-lg">
                Ödenecek Damga Vergisi: 909.6 TL
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı Değişiklikleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Dijital belgelerde damga vergisi uygulaması genişletildi</li>
              <li>Minimum vergi tutarları enflasyon oranında artırıldı</li>
              <li>E-ticaret sözleşmelerinde yeni düzenlemeler</li>
              <li>Kripto para işlemlerinde damga vergisi uygulaması</li>
              <li>Online ödeme sistemleri entegrasyonu</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vergi Planlaması İpuçları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Sözleşme tutarlarını vergi açısından optimize edin</li>
              <li>Muafiyet kapsamındaki durumları değerlendirin</li>
              <li>Ödeme sürelerini takip edin</li>
              <li>İndirimli oran fırsatlarını araştırın</li>
              <li>Elektronik belge seçeneklerini değerlendirin</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-yellow-900 mb-2">💡 İpucu</h4>
              <p className="text-yellow-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı belge türleri için damga vergisi 
                tutarlarını hesaplayabilir, vergi planlamanızı yapabilir ve ödeme sürelerinizi 
                takip edebilirsiniz. 2025 yılı güncel oranları kullanılmaktadır.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Damga vergisi, Türkiye vergi sisteminin önemli bir bileşenidir. 2025 yılı güncel 
              oranları ve düzenlemeleri ile doğru hesaplama yaparak, vergi yükümlülüklerinizi 
              zamanında yerine getirebilir ve olası cezalardan kaçınabilirsiniz. Yukarıdaki 
              hesaplama aracını kullanarak tüm belge türleri için damga vergisi hesaplama 
              yapabilir ve vergi planlamanızı destekleyebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default DamgaVergisiHesaplamaPage;