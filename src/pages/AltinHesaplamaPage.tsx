import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Coins, DollarSign, ArrowRight, Info, Target, BarChart3, AlertTriangle } from 'lucide-react';

interface AltinInputs {
  alisMiktari: number;
  alisFiyati: number;
  satisFiyati: number;
  komisyonOrani: number;
  altinTuru: string;
  yatirimSuresi: number;
}

interface AltinSonuc {
  toplamAlisTutari: number;
  toplamSatisTutari: number;
  brutKarZarar: number;
  komisyonTutari: number;
  netKarZarar: number;
  getiriOrani: number;
  yillikGetiri: number;
  karZararDurumu: 'kar' | 'zarar' | 'basabaş';
  onerileriMetin: string;
}

const altinTurleri = [
  { value: 'gram', label: 'Gram Altın', komisyon: 0.5, aciklama: '24 ayar altın' },
  { value: 'ceyrek', label: 'Çeyrek Altın', komisyon: 0.3, aciklama: '22 ayar altın' },
  { value: 'yarim', label: 'Yarım Altın', komisyon: 0.3, aciklama: '22 ayar altın' },
  { value: 'tam', label: 'Tam Altın', komisyon: 0.3, aciklama: '22 ayar altın' },
  { value: 'cumhuriyet', label: 'Cumhuriyet Altını', komisyon: 0.4, aciklama: '22 ayar altın' },
  { value: 'ata', label: 'Ata Altın', komisyon: 0.4, aciklama: '22 ayar altın' }
];

const benzerAraclar = [
  { name: 'Döviz Hesaplama', icon: DollarSign, link: '/finans/doviz-hesaplama', active: false },
  { name: 'Yatırım Hesaplama', icon: TrendingUp, link: '/finans/yatirim-hesaplama', active: false },
  { name: 'Birikim Hesaplama', icon: Calculator, link: '/finans/birikim-hesaplama', active: false }
];

const AltinHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<AltinInputs>({
    alisMiktari: 10,
    alisFiyati: 2500,
    satisFiyati: 2600,
    komisyonOrani: 0.5,
    altinTuru: 'gram',
    yatirimSuresi: 12
  });
  
  const [sonuc, setSonuc] = useState<AltinSonuc | null>(null);

  const hesapla = () => {
    const { alisMiktari, alisFiyati, satisFiyati, komisyonOrani, yatirimSuresi } = inputs;
    
    const toplamAlisTutari = alisMiktari * alisFiyati;
    const toplamSatisTutari = alisMiktari * satisFiyati;
    const brutKarZarar = toplamSatisTutari - toplamAlisTutari;
    
    // Komisyon hesaplama (alış ve satışta)
    const komisyonTutari = (toplamAlisTutari + toplamSatisTutari) * (komisyonOrani / 100);
    const netKarZarar = brutKarZarar - komisyonTutari;
    
    // Getiri oranı hesaplama
    const getiriOrani = toplamAlisTutari > 0 ? (netKarZarar / toplamAlisTutari) * 100 : 0;
    
    // Yıllık getiri hesaplama
    const yillikGetiri = yatirimSuresi > 0 ? (getiriOrani * 12) / yatirimSuresi : 0;
    
    let karZararDurumu: 'kar' | 'zarar' | 'basabaş' = 'basabaş';
    if (netKarZarar > 0) karZararDurumu = 'kar';
    else if (netKarZarar < 0) karZararDurumu = 'zarar';
    
    // Öneriler
    let onerileriMetin = '';
    if (karZararDurumu === 'kar') {
      onerileriMetin = 'Karlı bir yatırım. Piyasa koşullarını takip ederek satış zamanlaması yapabilirsiniz.';
    } else if (karZararDurumu === 'zarar') {
      onerileriMetin = 'Zarar durumunda. Piyasa analizi yaparak bekleme veya satış kararı verebilirsiniz.';
    } else {
      onerileriMetin = 'Başabaş durumunda. Komisyon maliyetlerini dikkate alarak karar verin.';
    }
    
    setSonuc({
      toplamAlisTutari,
      toplamSatisTutari,
      brutKarZarar,
      komisyonTutari,
      netKarZarar,
      getiriOrani,
      yillikGetiri,
      karZararDurumu,
      onerileriMetin
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof AltinInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    
    // Altın türü değiştiğinde komisyon oranını otomatik güncelle
    if (field === 'altinTuru') {
      const altinTipi = altinTurleri.find(a => a.value === value);
      if (altinTipi) {
        setInputs(prev => ({ ...prev, komisyonOrani: altinTipi.komisyon }));
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedAltinTuru = () => {
    return altinTurleri.find(a => a.value === inputs.altinTuru);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/finans" className="hover:text-yellow-600 transition-colors">Finans</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Altın Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Altın Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Altın alım-satım kar-zarar hesaplama, yatırım getiri analizi ve komisyon hesaplama araçları
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Coins className="h-6 w-6 mr-3 text-yellow-600" />
                Altın Yatırım Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Altın Türü
                    </label>
                    <select
                      value={inputs.altinTuru}
                      onChange={(e) => handleInputChange('altinTuru', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                    >
                      {altinTurleri.map(tur => (
                        <option key={tur.value} value={tur.value}>
                          {tur.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      {getSelectedAltinTuru()?.aciklama} - Komisyon: %{getSelectedAltinTuru()?.komisyon}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Alış Miktarı
                    </label>
                    <input
                      type="number"
                      value={inputs.alisMiktari}
                      onChange={(e) => handleInputChange('alisMiktari', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      min="0.1"
                      step="0.1"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      {inputs.altinTuru === 'gram' ? 'Gram' : 'Adet'} cinsinden
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Alış Fiyatı (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.alisFiyati}
                      onChange={(e) => handleInputChange('alisFiyati', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      min="1"
                      step="0.01"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      {inputs.altinTuru === 'gram' ? 'Gram başına' : 'Adet başına'} fiyat
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Satış Fiyatı (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.satisFiyati}
                      onChange={(e) => handleInputChange('satisFiyati', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      min="1"
                      step="0.01"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Güncel veya hedef satış fiyatı
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Komisyon Oranı (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.komisyonOrani}
                      onChange={(e) => handleInputChange('komisyonOrani', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Alış ve satış komisyonu toplamı
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Yatırım Süresi (Ay)
                    </label>
                    <input
                      type="number"
                      value={inputs.yatirimSuresi}
                      onChange={(e) => handleInputChange('yatirimSuresi', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-medium"
                      min="1"
                      max="120"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Yıllık getiri hesaplama için
                    </div>
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
                  <BarChart3 className="h-6 w-6 mr-3 text-yellow-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Net Kar/Zarar</div>
                    <div className={`text-3xl font-bold ${
                      sonuc.karZararDurumu === 'kar' ? 'text-green-600' :
                      sonuc.karZararDurumu === 'zarar' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {sonuc.netKarZarar >= 0 ? '+' : ''}{formatCurrency(sonuc.netKarZarar)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Komisyon düşülmüş
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Getiri Oranı</div>
                    <div className={`text-xl font-bold ${
                      sonuc.getiriOrani > 0 ? 'text-green-600' : 
                      sonuc.getiriOrani < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {sonuc.getiriOrani >= 0 ? '+' : ''}{sonuc.getiriOrani.toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yıllık Getiri (Tahmini)</div>
                    <div className={`text-lg font-bold ${
                      sonuc.yillikGetiri > 0 ? 'text-green-600' : 
                      sonuc.yillikGetiri < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {sonuc.yillikGetiri >= 0 ? '+' : ''}{sonuc.yillikGetiri.toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Alış Tutarı</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sonuc.toplamAlisTutari)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Satış Tutarı</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sonuc.toplamSatisTutari)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Komisyon Tutarı</div>
                    <div className="text-lg font-bold text-orange-600">
                      {formatCurrency(sonuc.komisyonTutari)}
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 shadow-sm ${
                    sonuc.karZararDurumu === 'kar' ? 'bg-green-50' :
                    sonuc.karZararDurumu === 'zarar' ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <Target className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        sonuc.karZararDurumu === 'kar' ? 'text-green-600' :
                        sonuc.karZararDurumu === 'zarar' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                      <div className={`text-sm ${
                        sonuc.karZararDurumu === 'kar' ? 'text-green-800' :
                        sonuc.karZararDurumu === 'zarar' ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        {sonuc.onerileriMetin}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Altın Türleri Karşılaştırması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Altın Türleri ve Komisyon Oranları</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {altinTurleri.map(tur => (
              <div key={tur.value} className={`p-4 rounded-xl border-2 ${
                inputs.altinTuru === tur.value ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{tur.label}</h3>
                <div className="text-sm text-gray-600 mb-1">
                  {tur.aciklama}
                </div>
                <div className="text-sm font-medium text-yellow-700">
                  Komisyon: %{tur.komisyon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Altın Yatırım Stratejileri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Altın Yatırım Stratejileri</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Uzun Vadeli Yatırım</h3>
              <p className="text-sm text-gray-600">
                Enflasyona karşı koruma ve uzun vadeli değer artışı için altın yatırımı yapın.
              </p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portföy Çeşitlendirme</h3>
              <p className="text-sm text-gray-600">
                Yatırım portföyünüzün %5-10'unu altında tutarak risk dağılımı yapın.
              </p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Yönetimi</h3>
              <p className="text-sm text-gray-600">
                Altın fiyatları volatil olabilir. Piyasa analizini takip edin ve zamanlamaya dikkat edin.
              </p>
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
              Altın Yatırımı Nasıl Hesaplanır? Kar-Zarar Analizi Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Yatırımı Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Altın yatırımı, enflasyona karşı korunma ve uzun vadeli değer saklama amacıyla yapılan 
              geleneksel yatırım türlerinden biridir. Türkiye'de gram altın, çeyrek altın, yarım altın 
              ve tam altın gibi farklı türlerde altın yatırımı yapılabilir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Türleri ve Özellikleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de yaygın olarak işlem gören altın türleri şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Gram Altın:</strong> 24 ayar, en saf altın türü</li>
              <li><strong>Çeyrek Altın:</strong> 22 ayar, 1.75 gram ağırlığında</li>
              <li><strong>Yarım Altın:</strong> 22 ayar, 3.5 gram ağırlığında</li>
              <li><strong>Tam Altın:</strong> 22 ayar, 7 gram ağırlığında</li>
              <li><strong>Cumhuriyet Altını:</strong> 22 ayar, 7.2 gram ağırlığında</li>
              <li><strong>Ata Altın:</strong> 22 ayar, 7.2 gram ağırlığında</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Yatırımında Komisyon ve Masraflar</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Altın alım-satımında karşılaşacağınız temel masraflar:
            </p>
            <div className="bg-yellow-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Alış Komisyonu:</strong> %0.2-0.3 arası</li>
                <li><strong>Satış Komisyonu:</strong> %0.2-0.3 arası</li>
                <li><strong>Saklama Ücreti:</strong> Fiziksel altında ek maliyet</li>
                <li><strong>Sigorta:</strong> Güvenlik için önerilen</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Yatırım Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Altın yatırımında kar-zarar hesaplaması şu şekilde yapılır:
            </p>
            <div className="bg-amber-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-amber-900 mb-2">Hesaplama Formülü:</p>
              <p className="text-amber-800 mb-2">
                Net Kar/Zarar = (Satış Tutarı - Alış Tutarı) - Komisyon Masrafları
              </p>
              <p className="text-sm text-amber-700">
                Getiri Oranı = (Net Kar/Zarar ÷ Alış Tutarı) × 100
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              10 gram altın yatırımı örneği:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li>Alış: 10 gram × 2.500 TL = 25.000 TL</li>
                <li>Satış: 10 gram × 2.600 TL = 26.000 TL</li>
                <li>Brüt Kar: 26.000 - 25.000 = 1.000 TL</li>
                <li>Komisyon: (25.000 + 26.000) × %0.5 = 255 TL</li>
                <li>Net Kar: 1.000 - 255 = 745 TL</li>
              </ul>
              <p className="mt-4 font-semibold text-green-600">
                Getiri Oranı: (745 ÷ 25.000) × 100 = %2.98
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Yatırımının Avantajları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Enflasyona karşı koruma sağlar</li>
              <li>Ekonomik krizlerde değer korur</li>
              <li>Likidite yüksektir, kolayca nakde çevrilebilir</li>
              <li>Portföy çeşitlendirmesi sağlar</li>
              <li>Fiziksel varlık güvenliği</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Yatırımının Riskleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Fiyat volatilitesi yüksektir</li>
              <li>Saklama ve sigorta maliyetleri</li>
              <li>Komisyon ve işlem masrafları</li>
              <li>Kısa vadede getiri garantisi yoktur</li>
              <li>Piyasa manipülasyonu riski</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Altın Yatırım Stratejileri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Düzenli Alım:</strong> Aylık belirli miktarda altın alımı</li>
              <li><strong>Düşüşte Alım:</strong> Fiyat düştüğünde alım yapma</li>
              <li><strong>Uzun Vadeli Tutma:</strong> En az 2-3 yıl elde tutma</li>
              <li><strong>Çeşitlendirme:</strong> Farklı altın türlerinde yatırım</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-yellow-900 mb-2">💡 İpucu</h4>
              <p className="text-yellow-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı alış-satış senaryolarını deneyebilir, 
                komisyon maliyetlerini hesaplayabilir ve yatırım kararlarınızı destekleyebilirsiniz. 
                Altın fiyatlarını düzenli takip etmeyi unutmayın.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Altın yatırımı, doğru zamanlama ve hesaplama ile karlı bir yatırım aracı olabilir. 
              Komisyon masraflarını dikkate alarak, uzun vadeli bir perspektifle yaklaşmak önemlidir. 
              Yukarıdaki hesaplama aracını kullanarak yatırım kararlarınızı destekleyebilir ve 
              potansiyel getirilerinizi önceden değerlendirebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default AltinHesaplamaPage;