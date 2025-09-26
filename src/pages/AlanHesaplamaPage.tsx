import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, Square, Circle, Triangle, ArrowRight, Info, Ruler, Target, BookOpen } from 'lucide-react';

interface AlanInputs {
  sekil: string;
  kenar1: number;
  kenar2: number;
  yaricap: number;
  taban: number;
  yukseklik: number;
}

interface AlanSonuc {
  alan: number;
  cevre: number;
  formul: string;
  aciklama: string;
  birim: string;
}

const geometrikSekiller = [
  { value: 'kare', label: 'Kare', icon: Square, aciklama: 'Dört kenarı eşit dörtgen' },
  { value: 'dikdortgen', label: 'Dikdörtgen', icon: Square, aciklama: 'Karşılıklı kenarları eşit dörtgen' },
  { value: 'ucgen', label: 'Üçgen', icon: Triangle, aciklama: 'Üç kenarlı geometrik şekil' },
  { value: 'daire', label: 'Daire', icon: Circle, aciklama: 'Merkeze eşit uzaklıktaki noktalar' }
];

const benzerAraclar = [
  { name: 'Hacim Hesaplama', icon: Calculator, link: '#', active: false },
  { name: 'Çevre Hesaplama', icon: Ruler, link: '#', active: false },
  { name: 'Açı Hesaplama', icon: Target, link: '#', active: false }
];

const AlanHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<AlanInputs>({
    sekil: 'kare',
    kenar1: 0,
    kenar2: 0,
    yaricap: 0,
    taban: 0,
    yukseklik: 0
  });
  
  const [sonuc, setSonuc] = useState<AlanSonuc | null>(null);

  const hesapla = () => {
    const { sekil, kenar1, kenar2, yaricap, taban, yukseklik } = inputs;
    let alan = 0;
    let cevre = 0;
    let formul = '';
    let aciklama = '';
    const birim = 'birim kare';

    switch (sekil) {
      case 'kare':
        alan = kenar1 * kenar1;
        cevre = 4 * kenar1;
        formul = 'Alan = a²';
        aciklama = `Kenar uzunluğu ${kenar1} olan karenin alanı`;
        break;
      
      case 'dikdortgen':
        alan = kenar1 * kenar2;
        cevre = 2 * (kenar1 + kenar2);
        formul = 'Alan = a × b';
        aciklama = `${kenar1} × ${kenar2} dikdörtgenin alanı`;
        break;
      
      case 'ucgen':
        alan = (taban * yukseklik) / 2;
        cevre = 0; // Üçgenin çevresi için 3 kenar gerekli
        formul = 'Alan = (taban × yükseklik) ÷ 2';
        aciklama = `Tabanı ${taban}, yüksekliği ${yukseklik} olan üçgenin alanı`;
        break;
      
      case 'daire':
        alan = Math.PI * yaricap * yaricap;
        cevre = 2 * Math.PI * yaricap;
        formul = 'Alan = π × r²';
        aciklama = `Yarıçapı ${yaricap} olan dairenin alanı`;
        break;
    }

    setSonuc({
      alan,
      cevre,
      formul,
      aciklama,
      birim
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof AlanInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSekilChange = (yeniSekil: string) => {
    // Şekil değiştiğinde tüm değerleri sıfırla
    setInputs({
      sekil: yeniSekil,
      kenar1: 0,
      kenar2: 0,
      yaricap: 0,
      taban: 0,
      yukseklik: 0
    });
  };

  const getSelectedSekil = () => {
    return geometrikSekiller.find(s => s.value === inputs.sekil);
  };

  const formatSayi = (sayi: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(sayi);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Matematik</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Alan Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Alan Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Geometrik şekillerin alanlarını kolayca hesaplayın. Kare, dikdörtgen, üçgen ve daire alan hesaplama araçları
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
                <Square className="h-6 w-6 mr-3 text-orange-600" />
                Geometrik Şekil Seçimi
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Şekil Türü
                  </label>
                  <select
                    value={inputs.sekil}
                    onChange={(e) => handleSekilChange(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                  >
                    {geometrikSekiller.map(sekil => (
                      <option key={sekil.value} value={sekil.value}>
                        {sekil.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedSekil()?.aciklama}
                  </div>
                </div>

                {/* Dinamik Giriş Alanları */}
                {inputs.sekil === 'kare' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Kenar Uzunluğu
                    </label>
                    <input
                      type="number"
                      value={inputs.kenar1}
                      onChange={(e) => handleInputChange('kenar1', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      step="0.1"
                      placeholder="Kenar uzunluğunu girin"
                    />
                  </div>
                )}

                {inputs.sekil === 'dikdortgen' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Uzun Kenar
                      </label>
                      <input
                        type="number"
                        value={inputs.kenar1}
                        onChange={(e) => handleInputChange('kenar1', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                        min="0"
                        step="0.1"
                        placeholder="Uzun kenar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Kısa Kenar
                      </label>
                      <input
                        type="number"
                        value={inputs.kenar2}
                        onChange={(e) => handleInputChange('kenar2', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                        min="0"
                        step="0.1"
                        placeholder="Kısa kenar"
                      />
                    </div>
                  </div>
                )}

                {inputs.sekil === 'ucgen' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Taban Uzunluğu
                      </label>
                      <input
                        type="number"
                        value={inputs.taban}
                        onChange={(e) => handleInputChange('taban', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                        min="0"
                        step="0.1"
                        placeholder="Taban uzunluğu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Yükseklik
                      </label>
                      <input
                        type="number"
                        value={inputs.yukseklik}
                        onChange={(e) => handleInputChange('yukseklik', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                        min="0"
                        step="0.1"
                        placeholder="Yükseklik"
                      />
                    </div>
                  </div>
                )}

                {inputs.sekil === 'daire' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Yarıçap
                    </label>
                    <input
                      type="number"
                      value={inputs.yaricap}
                      onChange={(e) => handleInputChange('yaricap', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      step="0.1"
                      placeholder="Yarıçap uzunluğu"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Dairenin merkezinden kenarına olan uzaklık
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && sonuc.alan > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-orange-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Alan</div>
                    <div className="text-3xl font-bold text-orange-600">
                      {formatSayi(sonuc.alan)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.birim}
                    </div>
                  </div>

                  {sonuc.cevre > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Çevre</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatSayi(sonuc.cevre)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        birim
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Kullanılan Formül</div>
                    <div className="text-lg font-bold text-blue-600">
                      {sonuc.formul}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Açıklama</div>
                    <div className="text-sm text-gray-700">
                      {sonuc.aciklama}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Geometrik Şekiller Rehberi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Geometrik Şekiller ve Formülleri</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {geometrikSekiller.map(sekil => {
              const IconComponent = sekil.icon;
              return (
                <div key={sekil.value} className={`p-6 rounded-xl border-2 text-center ${
                  inputs.sekil === sekil.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{sekil.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{sekil.aciklama}</p>
                  
                  {sekil.value === 'kare' && (
                    <div className="text-xs text-gray-500">
                      <div>Alan: a²</div>
                      <div>Çevre: 4a</div>
                    </div>
                  )}
                  {sekil.value === 'dikdortgen' && (
                    <div className="text-xs text-gray-500">
                      <div>Alan: a × b</div>
                      <div>Çevre: 2(a + b)</div>
                    </div>
                  )}
                  {sekil.value === 'ucgen' && (
                    <div className="text-xs text-gray-500">
                      <div>Alan: (t × h) ÷ 2</div>
                      <div>Çevre: a + b + c</div>
                    </div>
                  )}
                  {sekil.value === 'daire' && (
                    <div className="text-xs text-gray-500">
                      <div>Alan: π × r²</div>
                      <div>Çevre: 2π × r</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Alan Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alan Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pratik Örnekler</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Kare Bahçe</h4>
                  <p className="text-sm text-blue-800">
                    Kenar uzunluğu 10 metre olan kare bahçenin alanı: 10² = 100 m²
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Dikdörtgen Oda</h4>
                  <p className="text-sm text-green-800">
                    4×6 metre odanın alanı: 4 × 6 = 24 m²
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Üçgen Arsa</h4>
                  <p className="text-sm text-purple-800">
                    Tabanı 8m, yüksekliği 6m olan üçgen arsa: (8×6)÷2 = 24 m²
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-pink-900 mb-2">Dairesel Havuz</h4>
                  <p className="text-sm text-pink-800">
                    Yarıçapı 3m olan havuz: π × 3² ≈ 28.27 m²
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanım Alanları</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>İnşaat:</strong> Zemin alanı hesaplama</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Bahçıvanlık:</strong> Ekim alanı belirleme</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Boyama:</strong> Boya miktarı hesaplama</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Döşeme:</strong> Malzeme ihtiyacı</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Tarım:</strong> Tarla alanı ölçümü</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Eğitim:</strong> Matematik problemleri</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-4">
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
              Geometrik Şekillerin Alanı Nasıl Hesaplanır? Matematik Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Alan Hesaplama Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Alan hesaplama, geometrik şekillerin kapladığı yüzey alanını ölçme işlemidir. Bu hesaplama, 
              günlük hayatta inşaat, bahçıvanlık, boyama işleri ve birçok pratik uygulamada kullanılır. 
              Her geometrik şeklin kendine özgü alan hesaplama formülü vardır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Temel Geometrik Şekiller ve Formülleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              En yaygın kullanılan geometrik şekillerin alan formülleri şunlardır:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Kare</h4>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Formül: Alan = a²</p>
              <p className="text-blue-800 mb-2">
                Burada 'a' karenin kenar uzunluğudur.
              </p>
              <p className="text-sm text-blue-700">
                Örnek: Kenar uzunluğu 5 cm olan karenin alanı = 5² = 25 cm²
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Dikdörtgen</h4>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-green-900 mb-2">Formül: Alan = a × b</p>
              <p className="text-green-800 mb-2">
                Burada 'a' uzun kenar, 'b' kısa kenar uzunluğudur.
              </p>
              <p className="text-sm text-green-700">
                Örnek: 8×5 cm dikdörtgenin alanı = 8 × 5 = 40 cm²
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Üçgen</h4>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-purple-900 mb-2">Formül: Alan = (taban × yükseklik) ÷ 2</p>
              <p className="text-purple-800 mb-2">
                Taban herhangi bir kenar, yükseklik o kenara dik olan mesafedir.
              </p>
              <p className="text-sm text-purple-700">
                Örnek: Tabanı 6 cm, yüksekliği 4 cm olan üçgen = (6×4)÷2 = 12 cm²
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">4. Daire</h4>
            <div className="bg-pink-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-pink-900 mb-2">Formül: Alan = π × r²</p>
              <p className="text-pink-800 mb-2">
                Burada 'r' dairenin yarıçapı, π ≈ 3.14159 değeridir.
              </p>
              <p className="text-sm text-pink-700">
                Örnek: Yarıçapı 3 cm olan daire = π × 3² ≈ 28.27 cm²
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Alan Hesaplamanın Pratik Kullanımları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Alan hesaplama günlük hayatta birçok alanda kullanılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>İnşaat ve Mimarlık:</strong> Zemin alanı, duvar yüzeyi hesaplama</li>
              <li><strong>Bahçıvanlık:</strong> Ekim alanı, çim ekimi için alan belirleme</li>
              <li><strong>Boyama İşleri:</strong> Gerekli boya miktarını hesaplama</li>
              <li><strong>Döşeme:</strong> Parke, fayans gibi malzeme ihtiyacı</li>
              <li><strong>Tarım:</strong> Tarla alanı ölçümü ve ekim planlaması</li>
              <li><strong>Tekstil:</strong> Kumaş miktarı hesaplama</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Birim Dönüşümleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Alan hesaplamalarında yaygın kullanılan birim dönüşümleri:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Metrik Sistem</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>1 m² = 10.000 cm²</li>
                    <li>1 km² = 1.000.000 m²</li>
                    <li>1 hektar = 10.000 m²</li>
                    <li>1 dönüm = 1.000 m²</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pratik Dönüşümler</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>1 m² = 1.000.000 mm²</li>
                    <li>1 dönüm = 1.000 m²</li>
                    <li>1 hektar = 10 dönüm</li>
                    <li>1 km² = 100 hektar</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama İpuçları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Ölçü birimi tutarlılığı:</strong> Tüm ölçüleri aynı birimde girin</li>
              <li><strong>Doğruluk kontrolü:</strong> Sonuçları mantıklı olup olmadığını kontrol edin</li>
              <li><strong>Yuvarlama:</strong> Pratik kullanımda uygun ondalık basamak seçin</li>
              <li><strong>Güvenlik payı:</strong> Malzeme hesaplamalarında %10 pay ekleyin</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Karmaşık Şekiller</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Karmaşık şekillerin alanını hesaplamak için şu yöntemleri kullanabilirsiniz:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Parçalara ayırma:</strong> Karmaşık şekli basit şekillere bölün</li>
              <li><strong>Toplama yöntemi:</strong> Her parçanın alanını hesaplayıp toplayın</li>
              <li><strong>Çıkarma yöntemi:</strong> Büyük şekilden boş alanları çıkarın</li>
              <li><strong>Koordinat yöntemi:</strong> Koordinat sisteminde hesaplama</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-orange-900 mb-2">💡 İpucu</h4>
              <p className="text-orange-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı şekillerin alanlarını kolayca hesaplayabilir, 
                projeleriniz için gerekli malzeme miktarlarını belirleyebilirsiniz. Ölçü birimlerine dikkat 
                etmeyi unutmayın!
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Alan hesaplama, matematik ve günlük hayatın kesiştiği önemli bir konudur. Doğru formülleri 
              kullanarak, çeşitli projelerinizde ihtiyaç duyduğunuz alan hesaplamalarını kolayca yapabilirsiniz. 
              Yukarıdaki hesaplama aracı sayesinde hızlı ve doğru sonuçlar elde edebilir, zaman kazanabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default AlanHesaplamaPage;