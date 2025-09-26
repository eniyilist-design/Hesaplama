import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calendar, Heart, Clock, TrendingUp, ArrowRight, Info, AlertCircle, CheckCircle, Baby, Activity } from 'lucide-react';

interface AdetDongusu {
  sonAdetTarihi: Date;
  donguSuresi: number;
  adetSuresi: number;
  ortalamaDongu: number;
}

interface AdetHesaplamaSonuc {
  gelecekAdetTarihi: Date;
  yumurtlamaGunu: Date;
  verimliDonem: { baslangic: Date; bitis: Date };
  donguGunu: number;
  kalanGun: number;
  fazAdi: string;
  hamilelikOlasiligi: string;
  onerileriMetin: string;
  gelecek3Ay: Date[];
}

const benzerAraclar = [
  { name: 'Hamilelik Hesaplama', icon: Baby, link: '#', active: false },
  { name: 'VKİ Hesaplama', icon: Activity, link: '#', active: false },
  { name: 'Kalori Hesaplama', icon: TrendingUp, link: '#', active: false }
];

const AdetGunuHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<AdetDongusu>({
    sonAdetTarihi: new Date(),
    donguSuresi: 28,
    adetSuresi: 5,
    ortalamaDongu: 28
  });
  
  const [sonuc, setSonuc] = useState<AdetHesaplamaSonuc | null>(null);

  const hesapla = () => {
    const { sonAdetTarihi, donguSuresi, adetSuresi, ortalamaDongu } = inputs;
    
    // Bugünün tarihi
    const bugun = new Date();
    
    // Son adet tarihinden bugüne kadar geçen gün sayısı
    const gecenGun = Math.floor((bugun.getTime() - sonAdetTarihi.getTime()) / (1000 * 60 * 60 * 24));
    
    // Döngüde hangi gündeyiz
    const donguGunu = (gecenGun % donguSuresi) + 1;
    
    // Gelecek adet tarihi
    const gelecekAdetTarihi = new Date(sonAdetTarihi);
    gelecekAdetTarihi.setDate(sonAdetTarihi.getDate() + donguSuresi);
    
    // Gelecek adet tarihine kalan gün
    const kalanGun = Math.ceil((gelecekAdetTarihi.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
    
    // Yumurtlama günü (döngünün 14. günü)
    const yumurtlamaGunu = new Date(sonAdetTarihi);
    yumurtlamaGunu.setDate(sonAdetTarihi.getDate() + 14);
    
    // Verimli dönem (yumurtlamadan 5 gün önce - 1 gün sonra)
    const verimliBaslangic = new Date(yumurtlamaGunu);
    verimliBaslangic.setDate(yumurtlamaGunu.getDate() - 5);
    const verimliBitis = new Date(yumurtlamaGunu);
    verimliBitis.setDate(yumurtlamaGunu.getDate() + 1);
    
    // Döngünün hangi fazında olduğunu belirleme
    let fazAdi = '';
    let hamilelikOlasiligi = '';
    let onerileriMetin = '';
    
    if (donguGunu <= adetSuresi) {
      fazAdi = 'Adet Dönemi';
      hamilelikOlasiligi = 'Çok Düşük';
      onerileriMetin = 'Adet döneminde hijyen kurallarına dikkat edin. Bol su için ve dinlenin.';
    } else if (donguGunu <= 13) {
      fazAdi = 'Foliküler Faz';
      hamilelikOlasiligi = 'Düşük';
      onerileriMetin = 'Vücut yumurtlamaya hazırlanıyor. Sağlıklı beslenmeye dikkat edin.';
    } else if (donguGunu >= 12 && donguGunu <= 16) {
      fazAdi = 'Yumurtlama Dönemi';
      hamilelikOlasiligi = 'Yüksek';
      onerileriMetin = 'En verimli dönem. Hamilelik planlıyorsanız en uygun zaman.';
    } else {
      fazAdi = 'Luteal Faz';
      hamilelikOlasiligi = 'Orta';
      onerileriMetin = 'Vücut adet dönemine hazırlanıyor. PMS belirtilerine dikkat edin.';
    }
    
    // Gelecek 3 ayın adet tarihleri
    const gelecek3Ay = [];
    for (let i = 1; i <= 3; i++) {
      const tarih = new Date(sonAdetTarihi);
      tarih.setDate(sonAdetTarihi.getDate() + (donguSuresi * i));
      gelecek3Ay.push(tarih);
    }
    
    setSonuc({
      gelecekAdetTarihi,
      yumurtlamaGunu,
      verimliDonem: { baslangic: verimliBaslangic, bitis: verimliBitis },
      donguGunu,
      kalanGun: Math.max(0, kalanGun),
      fazAdi,
      hamilelikOlasiligi,
      onerileriMetin,
      gelecek3Ay
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof AdetDongusu, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatKisaTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const bugunMu = (tarih: Date) => {
    const bugun = new Date();
    return tarih.toDateString() === bugun.toDateString();
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-pink-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/saglik" className="hover:text-pink-600 transition-colors">Sağlık</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Adet Günü Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Adet Günü Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Adet döngünüzü takip edin, gelecek adet tarihlerini hesaplayın ve verimli dönemlerinizi belirleyin
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
                <Calendar className="h-6 w-6 mr-3 text-pink-600" />
                Adet Döngüsü Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Son Adet Tarihi
                  </label>
                  <input
                    type="date"
                    value={inputs.sonAdetTarihi.toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('sonAdetTarihi', new Date(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg font-medium"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Son adet döneminin başladığı tarih
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Döngü Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      value={inputs.donguSuresi}
                      onChange={(e) => handleInputChange('donguSuresi', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg font-medium"
                      min="21"
                      max="35"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Normal aralık: 21-35 gün
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Adet Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      value={inputs.adetSuresi}
                      onChange={(e) => handleInputChange('adetSuresi', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg font-medium"
                      min="3"
                      max="8"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Normal aralık: 3-7 gün
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ortalama Döngü Süresi (Gün)
                  </label>
                  <input
                    type="number"
                    value={inputs.ortalamaDongu}
                    onChange={(e) => handleInputChange('ortalamaDongu', Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg font-medium"
                    min="21"
                    max="35"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Son 3-6 ayın ortalama döngü süresi
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Heart className="h-6 w-6 mr-3 text-pink-600" />
                  Döngü Analizi
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Döngü Günü</div>
                    <div className="text-3xl font-bold text-pink-600">
                      {sonuc.donguGunu}. Gün
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.fazAdi}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Gelecek Adet Tarihi</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatKisaTarih(sonuc.gelecekAdetTarihi)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.kalanGun} gün kaldı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yumurtlama Günü</div>
                    <div className="text-lg font-bold text-purple-600">
                      {formatKisaTarih(sonuc.yumurtlamaGunu)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {bugunMu(sonuc.yumurtlamaGunu) ? 'Bugün!' : 
                       sonuc.yumurtlamaGunu > new Date() ? 'Gelecek' : 'Geçmiş'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Verimli Dönem</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatKisaTarih(sonuc.verimliDonem.baslangic)} - {formatKisaTarih(sonuc.verimliDonem.bitis)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      6 günlük verimli pencere
                    </div>
                  </div>

                  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.hamilelikOlasiligi === 'Yüksek' ? 'border-red-500' :
                    sonuc.hamilelikOlasiligi === 'Orta' ? 'border-yellow-500' : 'border-green-500'
                  }`}>
                    <div className="text-sm text-gray-600 mb-1">Hamilelik Olasılığı</div>
                    <div className={`text-lg font-bold ${
                      sonuc.hamilelikOlasiligi === 'Yüksek' ? 'text-red-600' :
                      sonuc.hamilelikOlasiligi === 'Orta' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {sonuc.hamilelikOlasiligi}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Gelecek 3 Ay</div>
                    <div className="space-y-1">
                      {sonuc.gelecek3Ay.map((tarih, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{index + 1}. Ay:</span>
                          <span className="font-medium">{formatKisaTarih(tarih)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 shadow-sm ${
                    sonuc.hamilelikOlasiligi === 'Yüksek' ? 'bg-red-50' :
                    sonuc.hamilelikOlasiligi === 'Orta' ? 'bg-yellow-50' : 'bg-green-50'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        sonuc.hamilelikOlasiligi === 'Yüksek' ? 'text-red-600' :
                        sonuc.hamilelikOlasiligi === 'Orta' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div className={`text-sm ${
                        sonuc.hamilelikOlasiligi === 'Yüksek' ? 'text-red-800' :
                        sonuc.hamilelikOlasiligi === 'Orta' ? 'text-yellow-800' : 'text-green-800'
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

        {/* Adet Döngüsü Fazları */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Adet Döngüsü Fazları</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1-5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adet Dönemi</h3>
              <p className="text-sm text-gray-600">
                Rahim duvarının dökülmesi. Hamilelik olasılığı çok düşük.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">6-13</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Foliküler Faz</h3>
              <p className="text-sm text-gray-600">
                Yumurta hücresi olgunlaşıyor. Hamilelik olasılığı düşük.
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">12-16</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Yumurtlama</h3>
              <p className="text-sm text-gray-600">
                En verimli dönem. Hamilelik olasılığı en yüksek.
              </p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">17-28</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Luteal Faz</h3>
              <p className="text-sm text-gray-600">
                Adet öncesi dönem. PMS belirtileri görülebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Döngü Takip Takvimi */}
        {sonuc && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Döngü Takvimi</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Önemli Tarihler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <span className="font-medium">Son Adet</span>
                    <span className="text-pink-600 font-bold">
                      {formatKisaTarih(inputs.sonAdetTarihi)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Yumurtlama</span>
                    <span className="text-purple-600 font-bold">
                      {formatKisaTarih(sonuc.yumurtlamaGunu)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                    <span className="font-medium">Gelecek Adet</span>
                    <span className="text-rose-600 font-bold">
                      {formatKisaTarih(sonuc.gelecekAdetTarihi)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelecek Adet Tarihleri</h3>
                <div className="space-y-2">
                  {sonuc.gelecek3Ay.map((tarih, index) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{index + 1}. Ay</span>
                      <span className="text-gray-700">{formatKisaTarih(tarih)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Mid-content Ad */}
        <AdSenseInFeed />

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
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl flex items-center justify-center mb-4">
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
              Adet Döngüsü Nasıl Hesaplanır? Kadın Sağlığı Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adet Döngüsü Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Adet döngüsü, kadın vücudunun hamilelik için hazırlandığı doğal bir süreçtir. Bu döngü, 
              hormonların etkisiyle rahim duvarının kalınlaşması ve yumurtlama sürecini içerir. 
              Normal bir adet döngüsü 21-35 gün arasında değişir ve ortalama 28 gün sürer.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adet Döngüsü Fazları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Adet döngüsü dört ana fazdan oluşur:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Adet Dönemi (1-5. gün):</strong> Rahim duvarının dökülmesi</li>
              <li><strong>Foliküler Faz (6-13. gün):</strong> Yumurta hücresinin olgunlaşması</li>
              <li><strong>Yumurtlama (14. gün):</strong> Olgun yumurtanın salınması</li>
              <li><strong>Luteal Faz (15-28. gün):</strong> Rahim duvarının kalınlaşması</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yumurtlama ve Verimli Dönem</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yumurtlama genellikle döngünün ortasında, 14. gün civarında gerçekleşir. Verimli dönem 
              ise yumurtlamadan 5 gün önce başlar ve 1 gün sonra biter:
            </p>
            <div className="bg-pink-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Sperm yaşam süresi:</strong> 5 güne kadar</li>
                <li><strong>Yumurta yaşam süresi:</strong> 12-24 saat</li>
                <li><strong>Verimli pencere:</strong> Toplam 6 gün</li>
                <li><strong>En verimli günler:</strong> Yumurtlamadan 2 gün önce ve yumurtlama günü</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Döngü Takibinin Faydaları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Aile planlaması:</strong> Hamilelik planlama veya korunma</li>
              <li><strong>Sağlık takibi:</strong> Düzensizliklerin erken tespiti</li>
              <li><strong>Yaşam kalitesi:</strong> PMS ve adet öncesi belirtilere hazırlık</li>
              <li><strong>Doktor görüşmeleri:</strong> Detaylı bilgi sağlama</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Normal Döngü Özellikleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sağlıklı bir adet döngüsünün özellikleri şunlardır:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Döngü süresi:</strong> 21-35 gün arası</li>
                <li><strong>Adet süresi:</strong> 3-7 gün arası</li>
                <li><strong>Kan kaybı:</strong> 30-40 ml (normal)</li>
                <li><strong>Renk:</strong> Koyu kırmızıdan açık kırmızıya</li>
                <li><strong>Koku:</strong> Hafif metalik koku normal</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Doktora Başvuru Durumları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Aşağıdaki durumlarda mutlaka doktora başvurmalısınız:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Döngü süresinin 21 günden kısa veya 35 günden uzun olması</li>
              <li>Adet süresinin 7 günden fazla olması</li>
              <li>Çok ağır kanama (saatte 1 pedden fazla)</li>
              <li>Şiddetli ağrı ve kramplar</li>
              <li>3 aydan fazla adet görmeme</li>
              <li>Adet arası kanama</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Döngü Düzensizliğinin Nedenleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Stres:</strong> Fiziksel veya duygusal stres</li>
              <li><strong>Kilo değişimleri:</strong> Hızlı kilo alma veya verme</li>
              <li><strong>Egzersiz:</strong> Aşırı veya yetersiz fiziksel aktivite</li>
              <li><strong>Beslenme:</strong> Yetersiz beslenme veya diyet</li>
              <li><strong>Hastalıklar:</strong> PCOS, tiroid sorunları</li>
              <li><strong>İlaçlar:</strong> Bazı ilaçların yan etkileri</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sağlıklı Döngü İçin Öneriler</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Düzenli ve dengeli beslenin</li>
              <li>Yeterli su için (günde 8-10 bardak)</li>
              <li>Düzenli egzersiz yapın</li>
              <li>Stresi yönetin</li>
              <li>Yeterli uyku alın (7-8 saat)</li>
              <li>Sigara ve alkol tüketimini sınırlayın</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adet Döngüsü Takip Yöntemleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Döngünüzü takip etmek için şu yöntemleri kullanabilirsiniz:
            </p>
            <div className="bg-rose-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Takvim yöntemi:</strong> Adet tarihlerini not alma</li>
                <li><strong>Mobil uygulamalar:</strong> Otomatik takip ve hatırlatma</li>
                <li><strong>Bazal vücut ısısı:</strong> Yumurtlama tespiti</li>
                <li><strong>Servikal mukus gözlemi:</strong> Verimli dönem belirleme</li>
              </ul>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-pink-900 mb-2">💡 İpucu</h4>
              <p className="text-pink-800">
                Yukarıdaki hesaplama aracımızı kullanarak adet döngünüzü düzenli takip edebilir, 
                gelecek adet tarihlerinizi önceden planlayabilir ve verimli dönemlerinizi 
                belirleyebilirsiniz. Düzenli takip, sağlığınız için çok önemlidir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Adet döngüsü takibi, kadın sağlığının temel taşlarından biridir. Düzenli takip sayesinde 
              vücudunuzu daha iyi tanıyabilir, sağlık sorunlarını erken fark edebilir ve aile 
              planlamanızı daha etkili yapabilirsiniz. Yukarıdaki hesaplama aracını kullanarak 
              döngünüzü kolayca takip edebilir ve sağlıklı bir yaşam sürdürebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default AdetGunuHesaplamaPage;