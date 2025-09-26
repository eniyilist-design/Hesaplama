import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Scale, FileText, Users, ArrowRight, Info, Target, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

interface ArabuluculukInputs {
  uyusmazlikTuru: string;
  uyusmazlikTutari: number;
  tarafSayisi: number;
  arabulucuSayisi: number;
  ozelDurum: string;
}

interface ArabuluculukSonuc {
  temelUcret: number;
  toplamUcret: number;
  tarafBasinaUcret: number;
  arabulucuBasinaUcret: number;
  uygulanacakOran: number;
  ucretAraligi: string;
  odemeSekli: string;
  kdvDahilUcret: number;
  aciklama: string;
}

const uyusmazlikTurleri = [
  { value: 'aile', label: 'Aile Hukuku Uyuşmazlıkları', aciklama: 'Boşanma, velayet, nafaka vb.' },
  { value: 'ticari', label: 'Ticari Uyuşmazlıklar', aciklama: 'Sözleşme, alacak, ortaklık vb.' },
  { value: 'isci-veren', label: 'İşçi-İşveren Uyuşmazlıkları', aciklama: 'İş sözleşmesi, kıdem tazminatı vb.' },
  { value: 'tuketici', label: 'Tüketici Uyuşmazlıkları', aciklama: 'Mal/hizmet alımı, garanti vb.' },
  { value: 'kira', label: 'Kira Uyuşmazlıkları', aciklama: 'Kira artışı, tahliye vb.' },
  { value: 'ortaklik', label: 'Ortaklık Giderlerinin Uyuşmazlıkları', aciklama: 'Site yönetimi, ortak giderler' },
  { value: 'diger', label: 'Diğer Tür Uyuşmazlıklar', aciklama: 'Yukarıdakiler dışındaki uyuşmazlıklar' }
];

const ozelDurumlar = [
  { value: 'normal', label: 'Normal Süreç', carpan: 1.0 },
  { value: 'birden-fazla', label: 'Birden Fazla Arabulucu', carpan: 1.0 },
  { value: 'acil', label: 'Acil Durum', carpan: 1.2 },
  { value: 'karmasik', label: 'Karmaşık Uyuşmazlık', carpan: 1.3 }
];

const benzerAraclar = [
  { name: 'Avukat Ücret Hesaplama', icon: Scale, link: '#', active: false },
  { name: 'Dava Masrafı Hesaplama', icon: FileText, link: '#', active: false },
  { name: 'Noter Ücret Hesaplama', icon: Calculator, link: '#', active: false }
];

// 2025 Güncel Arabuluculuk Ücret Tarifeleri
const ucretTarifeleri = [
  // Birinci Kısım - Konusu Para Olmayan veya Para ile Değerlendirilemeyen Hukuki Uyuşmazlıklar
  {
    kategori: 'para-olmayan',
    tarifeler: [
      { tarafSayisi: 2, ucret: 785.00 },
      { tarafSayisi: '3-5', ucret: 1650.00 },
      { tarafSayisi: '6-10', ucret: 1750.00 },
      { tarafSayisi: '11+', ucret: 1850.00 }
    ]
  },
  // İkinci Kısım - Ticari Uyuşmazlıklar
  {
    kategori: 'ticari',
    tutarAraliklari: [
      { min: 0, max: 300000, tek: 6, birdenFazla: 9 },
      { min: 300000, max: 480000, tek: 5, birdenFazla: 7.5 },
      { min: 480000, max: 780000, tek: 4, birdenFazla: 6 },
      { min: 780000, max: 1560000, tek: 3, birdenFazla: 4.5 },
      { min: 1560000, max: 4680000, tek: 2, birdenFazla: 3 },
      { min: 4680000, max: 6240000, tek: 1.5, birdenFazla: 2.5 },
      { min: 6240000, max: 12480000, tek: 1, birdenFazla: 1.5 },
      { min: 12480000, max: Infinity, tek: 0.5, birdenFazla: 1 }
    ]
  }
];

const ArabuluculukUcretiHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<ArabuluculukInputs>({
    uyusmazlikTuru: 'ticari',
    uyusmazlikTutari: 100000,
    tarafSayisi: 2,
    arabulucuSayisi: 1,
    ozelDurum: 'normal'
  });
  
  const [sonuc, setSonuc] = useState<ArabuluculukSonuc | null>(null);

  const hesapla = () => {
    const { uyusmazlikTuru, uyusmazlikTutari, tarafSayisi, arabulucuSayisi, ozelDurum } = inputs;
    
    let temelUcret = 0;
    let uygulanacakOran = 0;
    let ucretAraligi = '';
    let odemeSekli = '';
    let aciklama = '';

    if (uyusmazlikTuru === 'aile' || uyusmazlikTuru === 'diger') {
      // Birinci Kısım - Para olmayan uyuşmazlıklar
      const paraOlmayanTarife = ucretTarifeleri[0];
      
      if (tarafSayisi === 2) {
        temelUcret = 785.00;
        ucretAraligi = '2 kişi';
      } else if (tarafSayisi >= 3 && tarafSayisi <= 5) {
        temelUcret = 1650.00;
        ucretAraligi = '3-5 kişi';
      } else if (tarafSayisi >= 6 && tarafSayisi <= 10) {
        temelUcret = 1750.00;
        ucretAraligi = '6-10 kişi';
      } else {
        temelUcret = 1850.00;
        ucretAraligi = '11+ kişi';
      }
      
      odemeSekli = 'Sabit ücret';
      aciklama = 'Konusu para olmayan uyuşmazlık için sabit ücret uygulanır.';
      
    } else {
      // İkinci Kısım - Ticari uyuşmazlıklar (Para ile değerlendirilebilen)
      const ticariTarife = ucretTarifeleri[1];
      
      // Uyuşmazlık tutarına göre oran belirleme
      const uygunAralik = ticariTarife.tutarAraliklari.find(aralik => 
        uyusmazlikTutari > aralik.min && uyusmazlikTutari <= aralik.max
      );
      
      if (uygunAralik) {
        uygulanacakOran = arabulucuSayisi === 1 ? uygunAralik.tek : uygunAralik.birdenFazla;
        temelUcret = (uyusmazlikTutari * uygulanacakOran) / 100;
        
        ucretAraligi = `${uygunAralik.min.toLocaleString('tr-TR')} - ${
          uygunAralik.max === Infinity ? '∞' : uygunAralik.max.toLocaleString('tr-TR')
        } TL`;
        
        odemeSekli = 'Uyuşmazlık tutarının yüzdesi';
        aciklama = `Uyuşmazlık tutarının %${uygulanacakOran} oranında ücret uygulanır.`;
      }
    }

    // Özel durum çarpanı uygulama
    const ozelDurumTipi = ozelDurumlar.find(d => d.value === ozelDurum);
    const toplamUcret = temelUcret * (ozelDurumTipi?.carpan || 1.0);
    
    const tarafBasinaUcret = toplamUcret / tarafSayisi;
    const arabulucuBasinaUcret = arabulucuSayisi > 1 ? toplamUcret / arabulucuSayisi : toplamUcret;
    
    // KDV dahil ücret (%20 KDV)
    const kdvDahilUcret = toplamUcret * 1.20;
    
    setSonuc({
      temelUcret,
      toplamUcret,
      tarafBasinaUcret,
      arabulucuBasinaUcret,
      uygulanacakOran,
      ucretAraligi,
      odemeSekli,
      kdvDahilUcret,
      aciklama
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof ArabuluculukInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedUyusmazlik = () => {
    return uyusmazlikTurleri.find(u => u.value === inputs.uyusmazlikTuru);
  };

  const getSelectedOzelDurum = () => {
    return ozelDurumlar.find(d => d.value === inputs.ozelDurum);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Hukuk</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Arabuluculuk Ücreti Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Arabuluculuk Ücreti Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            2025 yılı güncel ücret tarifelerine göre arabuluculuk ücreti hesaplama ve maliyet analizi
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Scale className="h-6 w-6 mr-3 text-amber-600" />
                Uyuşmazlık Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Uyuşmazlık Türü
                  </label>
                  <select
                    value={inputs.uyusmazlikTuru}
                    onChange={(e) => handleInputChange('uyusmazlikTuru', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium"
                  >
                    {uyusmazlikTurleri.map(tur => (
                      <option key={tur.value} value={tur.value}>
                        {tur.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedUyusmazlik()?.aciklama}
                  </div>
                </div>

                {(inputs.uyusmazlikTuru === 'ticari' || inputs.uyusmazlikTuru === 'isci-veren' || 
                  inputs.uyusmazlikTuru === 'tuketici' || inputs.uyusmazlikTuru === 'kira') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Uyuşmazlık Tutarı (TL)
                    </label>
                    <input
                      type="number"
                      value={inputs.uyusmazlikTutari}
                      onChange={(e) => handleInputChange('uyusmazlikTutari', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium"
                      min="1000"
                      step="1000"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Uyuşmazlığın parasal değeri
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Taraf Sayısı
                    </label>
                    <input
                      type="number"
                      value={inputs.tarafSayisi}
                      onChange={(e) => handleInputChange('tarafSayisi', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium"
                      min="2"
                      max="20"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Uyuşmazlığa taraf olan kişi/kurum sayısı
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Arabulucu Sayısı
                    </label>
                    <select
                      value={inputs.arabulucuSayisi}
                      onChange={(e) => handleInputChange('arabulucuSayisi', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium"
                    >
                      <option value={1}>1 Arabulucu</option>
                      <option value={2}>2 Arabulucu (Birden Fazla)</option>
                      <option value={3}>3 Arabulucu (Birden Fazla)</option>
                    </select>
                    <div className="mt-2 text-sm text-gray-600">
                      Görevlendirilecek arabulucu sayısı
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Özel Durum
                  </label>
                  <select
                    value={inputs.ozelDurum}
                    onChange={(e) => handleInputChange('ozelDurum', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium"
                  >
                    {ozelDurumlar.map(durum => (
                      <option key={durum.value} value={durum.value}>
                        {durum.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedOzelDurum()?.carpan === 1.0 ? 'Standart ücret' : 
                     `%${((getSelectedOzelDurum()?.carpan || 1) * 100)} ücret artışı`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-amber-600" />
                  Ücret Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Arabuluculuk Ücreti</div>
                    <div className="text-3xl font-bold text-amber-600">
                      {formatCurrency(sonuc.toplamUcret)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      KDV Hariç
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">KDV Dahil Toplam</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(sonuc.kdvDahilUcret)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      %20 KDV dahil
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Taraf Başına Ücret</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(sonuc.tarafBasinaUcret)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {inputs.tarafSayisi} taraf arasında bölünmüş
                    </div>
                  </div>

                  {inputs.arabulucuSayisi > 1 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Arabulucu Başına</div>
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(sonuc.arabulucuBasinaUcret)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {inputs.arabulucuSayisi} arabulucu arasında
                      </div>
                    </div>
                  )}

                  {sonuc.uygulanacakOran > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Uygulanan Oran</div>
                      <div className="text-lg font-bold text-green-600">
                        %{sonuc.uygulanacakOran}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Uyuşmazlık tutarı üzerinden
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ücret Aralığı</div>
                    <div className="text-sm font-medium text-gray-900">
                      {sonuc.ucretAraligi}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sonuc.odemeSekli}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
                    <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        {sonuc.aciklama}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2025 Ücret Tarifeleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2025 Yılı Arabuluculuk Ücret Tarifeleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Birinci Kısım - Para Olmayan Uyuşmazlıklar</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium">2 kişi taraf</span>
                  <span className="font-bold">785,00 TL</span>
                </div>
                <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium">3-5 kişi taraf</span>
                  <span className="font-bold">1.650,00 TL</span>
                </div>
                <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium">6-10 kişi taraf</span>
                  <span className="font-bold">1.750,00 TL</span>
                </div>
                <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium">11+ kişi taraf</span>
                  <span className="font-bold">1.850,00 TL</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İkinci Kısım - Ticari Uyuşmazlıklar (Oran Bazlı)</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 rounded font-semibold">
                  <span>Tutar Aralığı</span>
                  <span>Tek (%)</span>
                  <span>Birden Fazla (%)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 bg-orange-50 rounded">
                  <span>0-300.000 TL</span>
                  <span>%6</span>
                  <span>%9</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 bg-orange-50 rounded">
                  <span>300.000-480.000 TL</span>
                  <span>%5</span>
                  <span>%7,5</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 bg-orange-50 rounded">
                  <span>480.000-780.000 TL</span>
                  <span>%4</span>
                  <span>%6</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 bg-orange-50 rounded">
                  <span>780.000-1.560.000 TL</span>
                  <span>%3</span>
                  <span>%4,5</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 bg-orange-50 rounded">
                  <span>1.560.000+ TL</span>
                  <span>%2 ve altı</span>
                  <span>%3 ve altı</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arabuluculuk Süreci */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Arabuluculuk Süreci ve Ücret Ödeme</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-amber-50 rounded-xl">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Başvuru</h3>
              <p className="text-sm text-gray-600">
                Arabuluculuk merkezine başvuru yapılır ve ücret hesaplanır.
              </p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ücret Ödeme</h3>
              <p className="text-sm text-gray-600">
                Hesaplanan ücret taraflar arasında eşit olarak bölünür ve ödenir.
              </p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Süreç</h3>
              <p className="text-sm text-gray-600">
                Arabuluculuk süreci başlar ve anlaşma sağlanmaya çalışılır.
              </p>
            </div>
          </div>
        </div>

        {/* Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Arabuluculuk Ücreti Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sabit Ücret Örnekleri</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Aile Hukuku Uyuşmazlığı</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Boşanma davası, 2 taraf
                  </p>
                  <p className="text-sm text-blue-700">
                    Toplam Ücret: 785 TL | Taraf başına: 392,50 TL
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Ortaklık Giderleri</h4>
                  <p className="text-sm text-green-800 mb-2">
                    Site yönetimi uyuşmazlığı, 8 taraf
                  </p>
                  <p className="text-sm text-green-700">
                    Toplam Ücret: 1.750 TL | Taraf başına: 218,75 TL
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Oran Bazlı Örnekler</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Ticari Uyuşmazlık</h4>
                  <p className="text-sm text-purple-800 mb-2">
                    100.000 TL alacak, 1 arabulucu
                  </p>
                  <p className="text-sm text-purple-700">
                    Ücret: 100.000 × %6 = 6.000 TL
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-pink-900 mb-2">Kira Uyuşmazlığı</h4>
                  <p className="text-sm text-pink-800 mb-2">
                    500.000 TL değerli taşınmaz, 2 arabulucu
                  </p>
                  <p className="text-sm text-pink-700">
                    Ücret: 500.000 × %6 = 30.000 TL
                  </p>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
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
              Arabuluculuk Nedir ve 2025 Ücret Tarifeleri Nelerdir?
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arabuluculuk Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arabuluculuk, uyuşmazlık yaşayan tarafların, arabulucu adı verilen tarafsız üçüncü kişinin 
              yardımıyla kendi aralarında çözüm bulmalarını sağlayan alternatif uyuşmazlık çözüm yöntemidir. 
              Bu yöntem, mahkeme sürecine göre daha hızlı, ekonomik ve gizli bir çözüm sunar.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı Güncel Ücret Tarifeleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Arabuluculuk ücretleri, Adalet Bakanlığı tarafından belirlenen tarifelere göre hesaplanır. 
              2025 yılı için güncellenmiş tarifeler şu şekildedir:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Birinci Kısım: Para Olmayan Uyuşmazlıklar</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>2 kişi taraf:</strong> 785,00 TL</li>
              <li><strong>3-5 kişi taraf:</strong> 1.650,00 TL</li>
              <li><strong>6-10 kişi taraf:</strong> 1.750,00 TL</li>
              <li><strong>11 ve daha fazla kişi taraf:</strong> 1.850,00 TL</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">İkinci Kısım: Ticari Uyuşmazlıklar</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para ile değerlendirilebilen uyuşmazlıklarda, uyuşmazlık tutarının belirli oranları ücret olarak alınır:
            </p>
            <div className="bg-amber-50 p-6 rounded-xl mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-amber-900 mb-2">Tek Arabulucu</h5>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>0-300.000 TL: %6</li>
                    <li>300.000-480.000 TL: %5</li>
                    <li>480.000-780.000 TL: %4</li>
                    <li>780.000-1.560.000 TL: %3</li>
                    <li>1.560.000+ TL: %2 ve altı</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-amber-900 mb-2">Birden Fazla Arabulucu</h5>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>0-300.000 TL: %9</li>
                    <li>300.000-480.000 TL: %7,5</li>
                    <li>480.000-780.000 TL: %6</li>
                    <li>780.000-1.560.000 TL: %4,5</li>
                    <li>1.560.000+ TL: %3 ve altı</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arabuluculuk Uygulanabilir Alanlar</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              2025 yılında arabuluculuk zorunlu veya isteğe bağlı olarak şu alanlarda uygulanmaktadır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Ticari Uyuşmazlıklar:</strong> Sözleşme, alacak, ortaklık</li>
              <li><strong>İş Hukuku:</strong> İşçi-işveren uyuşmazlıkları</li>
              <li><strong>Tüketici Hukuku:</strong> Mal ve hizmet alımı</li>
              <li><strong>Kira Uyuşmazlıkları:</strong> Kira artışı, tahliye</li>
              <li><strong>Aile Hukuku:</strong> Boşanma, velayet (isteğe bağlı)</li>
              <li><strong>Tazminat Davaları:</strong> Maddi-manevi tazminat</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ücret Ödeme Esasları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Ücret taraflar arasında eşit olarak bölünür</li>
              <li>Ödeme arabuluculuk sürecinin başında yapılır</li>
              <li>KDV %20 oranında ek olarak tahsil edilir</li>
              <li>Anlaşma sağlanamazsa ücret iade edilmez</li>
              <li>Birden fazla arabulucu durumunda ücret artışı vardır</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Arabuluculuğun Avantajları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Hız:</strong> Mahkeme sürecine göre çok daha hızlı</li>
              <li><strong>Maliyet:</strong> Dava masraflarına göre ekonomik</li>
              <li><strong>Gizlilik:</strong> Süreç tamamen gizli yürütülür</li>
              <li><strong>Esneklik:</strong> Taraflar kendi çözümlerini üretir</li>
              <li><strong>İlişki Koruma:</strong> Taraflar arasındaki ilişki korunur</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ticari alacak uyuşmazlığı örneği:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Senaryo:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>Uyuşmazlık Türü: Ticari Alacak</li>
                <li>Uyuşmazlık Tutarı: 250.000 TL</li>
                <li>Taraf Sayısı: 2 kişi</li>
                <li>Arabulucu Sayısı: 1 kişi</li>
              </ul>
              
              <h4 className="font-semibold text-gray-900 mb-2">Hesaplama:</h4>
              <p className="text-gray-700 mb-2">
                Uygulanacak Oran: %6 (0-300.000 TL aralığı, tek arabulucu)
              </p>
              <p className="text-gray-700 mb-2">
                Arabuluculuk Ücreti: 250.000 × %6 = 15.000 TL
              </p>
              <p className="text-gray-700 mb-2">
                KDV (%20): 15.000 × 0.20 = 3.000 TL
              </p>
              <p className="font-bold text-green-600 text-lg">
                Toplam Ödeme: 18.000 TL | Taraf Başına: 9.000 TL
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2025 Yılı Değişiklikleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Ücret tarifelerinde enflasyon ayarlaması yapıldı</li>
              <li>Dijital arabuluculuk süreçleri için özel düzenlemeler</li>
              <li>Online toplantı masrafları tarife kapsamına alındı</li>
              <li>Karmaşık uyuşmazlıklar için ek ücret düzenlemesi</li>
            </ul>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-amber-900 mb-2">💡 İpucu</h4>
              <p className="text-amber-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı uyuşmazlık türleri ve tutarları için 
                arabuluculuk ücretlerini hesaplayabilir, mahkeme masrafları ile karşılaştırabilir ve 
                en uygun çözüm yöntemini belirleyebilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Arabuluculuk, 2025 yılında Türkiye'de giderek yaygınlaşan alternatif uyuşmazlık çözüm 
              yöntemidir. Güncel ücret tarifeleri ile hesaplama yaparak, mahkeme sürecine göre hem 
              zaman hem de maliyet avantajı sağlayabilirsiniz. Yukarıdaki hesaplama aracını kullanarak 
              uyuşmazlığınız için arabuluculuk maliyetini önceden hesaplayabilir ve bilinçli karar 
              verebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ArabuluculukUcretiHesaplamaPage;