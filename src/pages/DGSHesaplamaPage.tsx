import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, GraduationCap, Target, TrendingUp, ArrowRight, Info, BookOpen, Award, Users, AlertTriangle } from 'lucide-react';

interface DGSInputs {
  sayisalDogru: number;
  sayisalYanlis: number;
  sozelDogru: number;
  sozelYanlis: number;
  onlisansPuani: number;
  mezuniyetYili: number;
  hedefBolum: string;
}

interface DGSSonuc {
  sayisalNet: number;
  sozelNet: number;
  sayisalStandartPuan: number;
  sozelStandartPuan: number;
  dgsPuani: number;
  toplamPuan: number;
  mezuniyetKatsayisi: number;
  basariDurumu: string;
  tercihAnalizi: string;
  tahminiSiralama: string;
}

const benzerAraclar = [
  { name: 'YKS Hesaplama', icon: Target, link: '#', active: false },
  { name: 'ALES Hesaplama', icon: Award, link: '#', active: false },
  { name: 'KPSS Hesaplama', icon: Users, link: '#', active: false }
];

const hedefBolumler = [
  { value: 'muhendislik', label: 'Mühendislik', minPuan: 350 },
  { value: 'tip', label: 'Tıp', minPuan: 380 },
  { value: 'hukuk', label: 'Hukuk', minPuan: 340 },
  { value: 'isletme', label: 'İşletme', minPuan: 300 },
  { value: 'ekonomi', label: 'Ekonomi', minPuan: 290 },
  { value: 'egitim', label: 'Eğitim Fakültesi', minPuan: 250 },
  { value: 'fen-edebiyat', label: 'Fen-Edebiyat', minPuan: 260 },
  { value: 'iletisim', label: 'İletişim', minPuan: 280 },
  { value: 'diger', label: 'Diğer', minPuan: 200 }
];

const DGSHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<DGSInputs>({
    sayisalDogru: 0,
    sayisalYanlis: 0,
    sozelDogru: 0,
    sozelYanlis: 0,
    onlisansPuani: 60,
    mezuniyetYili: 2024,
    hedefBolum: 'isletme'
  });
  
  const [sonuc, setSonuc] = useState<DGSSonuc | null>(null);

  const hesapla = () => {
    const { sayisalDogru, sayisalYanlis, sozelDogru, sozelYanlis, onlisansPuani, mezuniyetYili, hedefBolum } = inputs;
    
    // Net hesaplama (Doğru - Yanlış/4)
    const sayisalNet = Math.max(0, sayisalDogru - (sayisalYanlis / 4));
    const sozelNet = Math.max(0, sozelDogru - (sozelYanlis / 4));
    
    // Standart puan hesaplama (basitleştirilmiş)
    // Gerçek ÖSYM hesaplaması daha karmaşık, bu tahmini hesaplama
    const sayisalStandartPuan = Math.min(500, sayisalNet * 10); // 50 soru max
    const sozelStandartPuan = Math.min(500, sozelNet * 10); // 50 soru max
    
    // DGS puanı hesaplama (%60 Sayısal + %40 Sözel)
    const dgsPuani = (sayisalStandartPuan * 0.6) + (sozelStandartPuan * 0.4);
    
    // Mezuniyet yılı katsayısı (her yıl %2 azalma)
    const guncelYil = new Date().getFullYear();
    const gecenYil = guncelYil - mezuniyetYili;
    const mezuniyetKatsayisi = Math.max(0.8, 1 - (gecenYil * 0.02));
    
    // Toplam puan (DGS + Önlisans puanı)
    const toplamPuan = (dgsPuani * mezuniyetKatsayisi) + (onlisansPuani * 0.5);
    
    // Başarı durumu analizi
    let basariDurumu = '';
    let tercihAnalizi = '';
    let tahminiSiralama = '';
    
    if (toplamPuan >= 350) {
      basariDurumu = 'Çok Başarılı';
      tercihAnalizi = 'Prestijli bölümleri tercih edebilirsiniz';
      tahminiSiralama = '1-5000 arası';
    } else if (toplamPuan >= 300) {
      basariDurumu = 'Başarılı';
      tercihAnalizi = 'İyi bölümleri tercih edebilirsiniz';
      tahminiSiralama = '5000-15000 arası';
    } else if (toplamPuan >= 250) {
      basariDurumu = 'Orta';
      tercihAnalizi = 'Standart bölümleri değerlendirin';
      tahminiSiralama = '15000-30000 arası';
    } else if (toplamPuan >= 200) {
      basariDurumu = 'Düşük';
      tercihAnalizi = 'Sınırlı seçenekler mevcut';
      tahminiSiralama = '30000+ arası';
    } else {
      basariDurumu = 'Yetersiz';
      tercihAnalizi = 'Tekrar denemeniz önerilir';
      tahminiSiralama = 'Yerleşme zor';
    }
    
    setSonuc({
      sayisalNet,
      sozelNet,
      sayisalStandartPuan,
      sozelStandartPuan,
      dgsPuani,
      toplamPuan,
      mezuniyetKatsayisi,
      basariDurumu,
      tercihAnalizi,
      tahminiSiralama
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof DGSInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getHedefBolum = () => {
    return hedefBolumler.find(b => b.value === inputs.hedefBolum);
  };

  const hedefBolumAnalizi = () => {
    const bolum = getHedefBolum();
    if (!bolum || !sonuc) return null;
    
    const puanFarki = sonuc.toplamPuan - bolum.minPuan;
    
    return {
      bolumAdi: bolum.label,
      minPuan: bolum.minPuan,
      puanFarki,
      durumu: puanFarki >= 0 ? 'Uygun' : 'Yetersiz',
      mesaj: puanFarki >= 0 
        ? `${bolum.label} bölümü için puanınız yeterli (+${puanFarki.toFixed(1)} puan)`
        : `${bolum.label} bölümü için ${Math.abs(puanFarki).toFixed(1)} puan daha gerekli`
    };
  };

  const hedefAnaliz = hedefBolumAnalizi();

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/sinav" className="hover:text-purple-600 transition-colors">Sınav</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">DGS Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              DGS (Dikey Geçiş Sınavı) Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ön lisanstan lisansa geçiş puanınızı hesaplayın ve tercih analizinizi yapın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Top Ad */}
          <div className="lg:col-span-3">
            <AdSenseDisplay size="large" />
          </div>
          
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sınav Sonuçları */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                DGS Sınav Sonuçları
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Sayısal Bölüm</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doğru Sayısı (0-40)
                      </label>
                      <input
                        type="number"
                        value={inputs.sayisalDogru}
                        onChange={(e) => handleInputChange('sayisalDogru', Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yanlış Sayısı (0-50)
                      </label>
                      <input
                        type="number"
                        value={inputs.sayisalYanlis}
                        onChange={(e) => handleInputChange('sayisalYanlis', Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="50"
                      />
                    </div>
                    {sonuc && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Net:</div>
                        <div className="text-xl font-bold text-blue-600">
                          {sonuc.sayisalNet.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-pink-900 mb-4">Sözel Bölüm</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doğru Sayısı (0-50)
                      </label>
                      <input
                        type="number"
                        value={inputs.sozelDogru}
                        onChange={(e) => handleInputChange('sozelDogru', Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yanlış Sayısı (0-50)
                      </label>
                      <input
                        type="number"
                        value={inputs.sozelYanlis}
                        onChange={(e) => handleInputChange('sozelYanlis', Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="50"
                      />
                    </div>
                    {sonuc && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Net:</div>
                        <div className="text-xl font-bold text-pink-600">
                          {sonuc.sozelNet.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ek Bilgiler */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-3 text-purple-600" />
                Ek Bilgiler
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Önlisans Puanı (0-100)
                  </label>
                  <input
                    type="number"
                    value={inputs.onlisansPuani}
                    onChange={(e) => handleInputChange('onlisansPuani', Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Diploma notunuz veya GNO
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mezuniyet Yılı
                  </label>
                  <input
                    type="number"
                    value={inputs.mezuniyetYili}
                    onChange={(e) => handleInputChange('mezuniyetYili', Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                    min="2020"
                    max="2025"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Önlisans mezuniyet yılınız
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hedef Bölüm
                  </label>
                  <select
                    value={inputs.hedefBolum}
                    onChange={(e) => handleInputChange('hedefBolum', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                  >
                    {hedefBolumler.map(bolum => (
                      <option key={bolum.value} value={bolum.value}>
                        {bolum.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    Min. puan: {getHedefBolum()?.minPuan}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-purple-600" />
                  DGS Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">DGS Puanı</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {sonuc.dgsPuani.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Puan</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {sonuc.toplamPuan.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      DGS + Önlisans puanı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Mezuniyet Katsayısı</div>
                    <div className="text-lg font-bold text-blue-600">
                      {sonuc.mezuniyetKatsayisi.toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {inputs.mezuniyetYili} mezunu
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Net Sonuçlar</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Sayısal Net:</span>
                        <span className="font-bold text-blue-600">{sonuc.sayisalNet.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sözel Net:</span>
                        <span className="font-bold text-pink-600">{sonuc.sozelNet.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Başarı Durumu</div>
                    <div className={`text-lg font-bold ${
                      sonuc.basariDurumu === 'Çok Başarılı' ? 'text-green-600' :
                      sonuc.basariDurumu === 'Başarılı' ? 'text-blue-600' :
                      sonuc.basariDurumu === 'Orta' ? 'text-yellow-600' :
                      sonuc.basariDurumu === 'Düşük' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {sonuc.basariDurumu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Tahmini Sıralama</div>
                    <div className="text-sm font-medium text-gray-900">
                      {sonuc.tahminiSiralama}
                    </div>
                  </div>

                  {hedefAnaliz && (
                    <div className={`rounded-xl p-4 shadow-sm border-l-4 ${
                      hedefAnaliz.durumu === 'Uygun' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                    }`}>
                      <div className="text-sm text-gray-600 mb-1">Hedef Bölüm Analizi</div>
                      <div className={`text-sm font-medium ${
                        hedefAnaliz.durumu === 'Uygun' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {hedefAnaliz.mesaj}
                      </div>
                    </div>
                  )}

                  <div className={`rounded-xl p-4 shadow-sm ${
                    sonuc.toplamPuan >= 250 ? 'bg-green-50' : 'bg-orange-50'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <Target className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        sonuc.toplamPuan >= 250 ? 'text-green-600' : 'text-orange-600'
                      }`} />
                      <div className={`text-sm ${
                        sonuc.toplamPuan >= 250 ? 'text-green-800' : 'text-orange-800'
                      }`}>
                        {sonuc.tercihAnalizi}
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

        {/* DGS Puan Türleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">DGS Puan Türleri ve Ağırlıkları</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Puan Türü Ağırlıkları</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium text-blue-900">Sayısal Ağırlık</div>
                  <div className="text-sm text-blue-700">%60 (Mühendislik, Fen bilimleri)</div>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="font-medium text-pink-900">Sözel Ağırlık</div>
                  <div className="text-sm text-pink-700">%40 (Sosyal bilimler, Edebiyat)</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Soru Dağılımı</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Sayısal:</strong> 40 soru (Matematik, Fen)</li>
                  <li><strong>Sözel:</strong> 40 soru (Türkçe, Sosyal)</li>
                  <li><strong>Toplam:</strong> 80 soru</li>
                  <li><strong>Süre:</strong> 150 dakika</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Bölüm Tercih Rehberi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bölüm Tercih Rehberi</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hedefBolumler.map(bolum => (
              <div key={bolum.value} className={`p-4 rounded-xl border-2 ${
                inputs.hedefBolum === bolum.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2">{bolum.label}</h3>
                <div className="text-sm text-gray-600 mb-1">
                  Min. Puan: {bolum.minPuan}
                </div>
                {sonuc && (
                  <div className={`text-xs ${
                    sonuc.toplamPuan >= bolum.minPuan ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sonuc.toplamPuan >= bolum.minPuan ? 'Uygun' : 'Yetersiz'}
                  </div>
                )}
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
                <div key={index} className={`
                  bg-white rounded-2xl p-6 shadow-lg border border-gray-100
                  ${arac.active ? 'hover:shadow-xl cursor-pointer' : 'opacity-75'}
                  transition-all duration-300
                `}>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
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
              DGS (Dikey Geçiş Sınavı) Nedir? Puan Hesaplama Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DGS (Dikey Geçiş Sınavı) Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Dikey Geçiş Sınavı (DGS), ön lisans (2 yıllık) programlarından mezun olan öğrencilerin 
              lisans (4 yıllık) programlarına geçiş yapabilmeleri için ÖSYM tarafından düzenlenen 
              merkezi bir sınavdır. Bu sınav sayesinde meslek yüksekokulu mezunları üniversitelerin 
              lisans programlarında eğitimlerine devam edebilirler.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DGS Sınav Yapısı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              DGS sınavı toplam 100 sorudan oluşur ve 150 dakika sürer:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Sayısal Bölüm:</strong> 50 soru (Matematik, Fen Bilimleri)</li>
              <li><strong>Sözel Bölüm:</strong> 50 soru (Türkçe, Sosyal Bilimler)</li>
              <li><strong>Toplam Süre:</strong> 150 dakika (2.5 saat)</li>
              <li><strong>Soru Tipi:</strong> Çoktan seçmeli (5 şık)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DGS Puan Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              DGS puanı hesaplaması şu adımlarla yapılır:
            </p>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
              <ol className="list-decimal list-inside space-y-2 text-purple-800">
                <li><strong>Net Hesaplama:</strong> Doğru - (Yanlış ÷ 4)</li>
                <li><strong>Standart Puan:</strong> Net sonuçların standart puana çevrilmesi</li>
                <li><strong>DGS Puanı:</strong> (Sayısal × 0.6) + (Sözel × 0.4)</li>
                <li><strong>Toplam Puan:</strong> DGS Puanı + (Önlisans Puanı × 0.5)</li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Önlisans Puanının Etkisi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              DGS'de önlisans başarı puanı da hesaplamaya dahil edilir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Önlisans diploma notu veya GNO kullanılır</li>
              <li>Bu puan 0.5 katsayısı ile çarpılır</li>
              <li>DGS puanına eklenerek toplam puan elde edilir</li>
              <li>Yüksek önlisans puanı avantaj sağlar</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Mezuniyet Yılı Katsayısı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Mezuniyet yılı, DGS puanınızı etkileyen önemli bir faktördür:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Sayısal:</strong> 50 soru (Matematik, Fen)</li>
                <li><strong>Sözel:</strong> 50 soru (Türkçe, Sosyal)</li>
                <li><strong>Toplam:</strong> 100 soru</li>
                <li>• <strong>3+ yıl önceki mezunlar:</strong> Katsayı 0.94 ve altı</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bölüm Seçimi ve Puan Türleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              DGS ile geçiş yapabileceğiniz bölümler ve gereken minimum puanlar:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Yüksek Puanlı Bölümler (350+)</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Mühendislik Fakülteleri</li>
                  <li>• Tıp Fakültesi</li>
                  <li>• Hukuk Fakültesi</li>
                  <li>• Diş Hekimliği</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-900 mb-2">Orta Puanlı Bölümler (250-350)</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• İşletme</li>
                  <li>• Ekonomi</li>
                  <li>• Eğitim Fakültesi</li>
                  <li>• Fen-Edebiyat Fakültesi</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DGS Başarı Stratejileri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Güçlü olduğunuz alana odaklanın:</strong> Sayısal veya sözel</li>
              <li><strong>Zayıf alanınızı ihmal etmeyin:</strong> Dengeli çalışma yapın</li>
              <li><strong>Önlisans puanınızı yükseltin:</strong> Diploma notunuz önemli</li>
              <li><strong>Deneme sınavları çözün:</strong> Sınav tekniği geliştirin</li>
              <li><strong>Zaman yönetimi yapın:</strong> 150 dakikayı etkili kullanın</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              DGS puan hesaplama örneği:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Örnek Sınav Sonucu:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>Sayısal: 35 doğru, 5 yanlış → Net: 35 - (5÷4) = 33.75</li>
                <li>Sözel: 40 doğru, 8 yanlış → Net: 40 - (8÷4) = 38</li>
                <li>Önlisans Puanı: 75</li>
                <li>Mezuniyet: 2024 (Katsayı: 1.0)</li>
              </ul>
              
              <h4 className="font-semibold text-gray-900 mb-2">Hesaplama:</h4>
              <p className="text-gray-700 mb-2">
                Sayısal Standart Puan: 33.75 × 10 = 337.5
              </p>
              <p className="text-gray-700 mb-2">
                Sözel Standart Puan: 38 × 10 = 380
              </p>
              <p className="text-gray-700 mb-2">
                DGS Puanı: (337.5 × 0.6) + (380 × 0.4) = 354.5
              </p>
              <p className="font-bold text-green-600 text-lg">
                Toplam Puan: 354.5 + (75 × 0.5) = 392
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DGS'nin Avantajları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Ön lisans mezunlarına lisans fırsatı sunar</li>
              <li>Kariyer gelişimi için önemli bir adımdır</li>
              <li>Daha iyi iş imkanları sağlar</li>
              <li>Akademik gelişimi destekler</li>
              <li>Maaş artışı potansiyeli yaratır</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Başvuru ve Yerleştirme Süreci</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>DGS sınavına başvuru (genellikle Mart ayı)</li>
              <li>Sınava katılım (genellikle Mayıs ayı)</li>
              <li>Sonuçların açıklanması (Haziran ayı)</li>
              <li>Tercih yapma süreci (Temmuz ayı)</li>
              <li>Yerleştirme sonuçları (Ağustos ayı)</li>
            </ul>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">💡 İpucu</h4>
              <p className="text-purple-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı sınav senaryolarını deneyebilir, 
                hedef puanınızı belirleyebilir ve hangi bölümlere başvurabileceğinizi görebilirsiniz. 
                DGS hazırlığınızı bu analizlere göre planlayabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              DGS, ön lisans mezunları için önemli bir fırsat kapısıdır. Doğru hesaplama ve 
              stratejik planlama ile hedeflediğiniz bölüme yerleşebilir, kariyer hedeflerinize 
              ulaşabilirsiniz. Düzenli çalışma, doğru strateji ve gerçekçi hedefler ile DGS'de 
              başarılı olabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default DGSHesaplamaPage;