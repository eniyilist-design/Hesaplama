import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, Award, TrendingUp, ArrowRight, Info, Plus, Trash2, GraduationCap } from 'lucide-react';

interface Ders {
  id: string;
  ad: string;
  kredi: number;
  not: number;
  zorunlu: boolean;
}

interface HesaplamaSonuc {
  toplamKredi: number;
  agirlikliToplam: number;
  gno: number;
  toplamDers: number;
  gecenDers: number;
  kalanDers: number;
  basariDurumu: string;
}

const benzerAraclar = [
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '/egitim/lise-mezuniyet-puani', active: true },
  { name: 'Lise Ortalama Hesaplama', icon: TrendingUp, link: '/egitim/lise-ortalama', active: true }
];

const LiseDersPuaniPage: React.FC = () => {
  const [dersler, setDersler] = useState<Ders[]>([
    { id: '1', ad: 'Türk Dili ve Edebiyatı', kredi: 4, not: 0, zorunlu: true },
    { id: '2', ad: 'Matematik', kredi: 4, not: 0, zorunlu: true },
    { id: '3', ad: 'Fizik', kredi: 3, not: 0, zorunlu: true },
    { id: '4', ad: 'Kimya', kredi: 3, not: 0, zorunlu: true },
    { id: '5', ad: 'Biyoloji', kredi: 3, not: 0, zorunlu: true },
    { id: '6', ad: 'Tarih', kredi: 2, not: 0, zorunlu: true },
    { id: '7', ad: 'Coğrafya', kredi: 2, not: 0, zorunlu: true },
    { id: '8', ad: 'İngilizce', kredi: 3, not: 0, zorunlu: true }
  ]);
  
  const [sonuc, setSonuc] = useState<HesaplamaSonuc | null>(null);

  const hesapla = () => {
    let toplamKredi = 0;
    let agirlikliToplam = 0;
    let gecenDers = 0;
    let kalanDers = 0;

    dersler.forEach(ders => {
      if (ders.not >= 50) {
        toplamKredi += ders.kredi;
        agirlikliToplam += ders.not * ders.kredi;
        gecenDers++;
      } else if (ders.not > 0) {
        kalanDers++;
      }
    });

    const gno = toplamKredi > 0 ? agirlikliToplam / toplamKredi : 0;
    
    let basariDurumu = '';
    if (gno >= 85) basariDurumu = 'Pekiyi (AA)';
    else if (gno >= 70) basariDurumu = 'İyi (BA)';
    else if (gno >= 60) basariDurumu = 'Orta (BB)';
    else if (gno >= 50) basariDurumu = 'Geçer (CB)';
    else basariDurumu = 'Yetersiz';

    setSonuc({
      toplamKredi,
      agirlikliToplam,
      gno,
      toplamDers: dersler.length,
      gecenDers,
      kalanDers,
      basariDurumu
    });
  };

  useEffect(() => {
    hesapla();
  }, [dersler]);

  const dersGuncelle = (id: string, field: keyof Ders, value: any) => {
    setDersler(prev => prev.map(ders => 
      ders.id === id ? { ...ders, [field]: value } : ders
    ));
  };

  const dersEkle = () => {
    const yeniId = (dersler.length + 1).toString();
    setDersler(prev => [...prev, {
      id: yeniId,
      ad: `Yeni Ders ${dersler.length + 1}`,
      kredi: 2,
      not: 0,
      zorunlu: false
    }]);
  };

  const dersSil = (id: string) => {
    const ders = dersler.find(d => d.id === id);
    if (ders && !ders.zorunlu) {
      setDersler(prev => prev.filter(ders => ders.id !== id));
    }
  };

  const harfNotuGetir = (not: number) => {
    if (not >= 85) return 'AA';
    if (not >= 70) return 'BA';
    if (not >= 60) return 'BB';
    if (not >= 50) return 'CB';
    if (not >= 40) return 'CC';
    return 'FF';
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-indigo-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Lise Ders Puanı Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Lise Ders Puanı Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lise derslerinizin kredi puanlarını hesaplayın ve genel not ortalamanızı (GNO) öğrenin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-green-600" />
                  Ders Listesi
                </h2>
                <button
                  onClick={dersEkle}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ders Ekle</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {dersler.map((ders, index) => (
                  <div key={ders.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ders Adı
                        </label>
                        <input
                          type="text"
                          value={ders.ad}
                          onChange={(e) => dersGuncelle(ders.id, 'ad', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          disabled={ders.zorunlu}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kredi
                        </label>
                        <input
                          type="number"
                          value={ders.kredi}
                          onChange={(e) => dersGuncelle(ders.id, 'kredi', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="1"
                          max="6"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Not (0-100)
                        </label>
                        <input
                          type="number"
                          value={ders.not}
                          onChange={(e) => dersGuncelle(ders.id, 'not', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {ders.not > 0 && `Harf: ${harfNotuGetir(ders.not)}`}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        {!ders.zorunlu && (
                          <button
                            onClick={() => dersSil(ders.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {ders.zorunlu && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Zorunlu
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center text-green-800">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    Geçme notu: 50 ve üzeri. Kredi değerleri ders türüne göre 1-6 arasında değişir.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-green-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Genel Not Ortalaması (GNO)</div>
                    <div className="text-3xl font-bold text-green-600">
                      {sonuc.gno.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.basariDurumu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Kredi</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.toplamKredi}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Geçen Ders Sayısı</div>
                    <div className="text-lg font-bold text-green-600">
                      {sonuc.gecenDers} / {sonuc.toplamDers}
                    </div>
                  </div>

                  {sonuc.kalanDers > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Kalan Ders Sayısı</div>
                      <div className="text-lg font-bold text-red-600">
                        {sonuc.kalanDers}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kredi Sistemi Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lise Kredi Sistemi</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ders Kredileri</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">Temel Dersler</span>
                  <span>4 Kredi</span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span className="font-medium">Fen Dersleri</span>
                  <span>3 Kredi</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="font-medium">Sosyal Dersler</span>
                  <span>2-3 Kredi</span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded">
                  <span className="font-medium">Seçmeli Dersler</span>
                  <span>1-2 Kredi</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GNO Hesaplama</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Formül:</strong>
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  GNO = (Σ(Not × Kredi)) / (Σ Kredi)
                </p>
                <p className="text-xs text-gray-600">
                  Sadece geçilen dersler (50+) hesaplamaya dahil edilir
                </p>
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
                <Link key={index} to={arac.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SEO Makale */}
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <header className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lise Ders Puanı Nasıl Hesaplanır? Kredi Sistemi Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lise Kredi Sistemi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de lise eğitiminde kullanılan kredi sistemi, her dersin önem derecesini ve haftalık ders saatini 
              yansıtan bir değerlendirme sistemidir. Bu sistem sayesinde öğrencilerin genel akademik başarısı daha 
              adil bir şekilde hesaplanır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kredi Değerleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise derslerinin kredi değerleri, dersin haftalık ders saati ve önem derecesine göre belirlenir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Türk Dili ve Edebiyatı, Matematik:</strong> 4 kredi</li>
              <li><strong>Fizik, Kimya, Biyoloji:</strong> 3 kredi</li>
              <li><strong>Tarih, Coğrafya, İngilizce:</strong> 2-3 kredi</li>
              <li><strong>Seçmeli dersler:</strong> 1-2 kredi</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GNO Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Genel Not Ortalaması (GNO), ağırlıklı ortalama yöntemiyle hesaplanır:
            </p>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-green-900 mb-2">Hesaplama Formülü:</p>
              <p className="text-green-800 mb-2">GNO = (Σ(Ders Notu × Kredi)) / (Σ Kredi)</p>
              <p className="text-sm text-green-700">
                * Sadece geçilen dersler (50 ve üzeri notlar) hesaplamaya dahil edilir
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bir öğrencinin aldığı notlar şu şekilde olsun:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li>Matematik: 80 puan (4 kredi) = 80 × 4 = 320</li>
                <li>Fizik: 75 puan (3 kredi) = 75 × 3 = 225</li>
                <li>Tarih: 85 puan (2 kredi) = 85 × 2 = 170</li>
                <li>İngilizce: 90 puan (3 kredi) = 90 × 3 = 270</li>
              </ul>
              <p className="mt-4 font-semibold">
                Toplam Puan: 320 + 225 + 170 + 270 = 985
              </p>
              <p className="font-semibold">
                Toplam Kredi: 4 + 3 + 2 + 3 = 12
              </p>
              <p className="text-green-600 font-bold">
                GNO: 985 ÷ 12 = 82.08
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Başarı Dereceleri</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">GNO Aralıkları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>85-100: Pekiyi (AA)</li>
                  <li>70-84: İyi (BA)</li>
                  <li>60-69: Orta (BB)</li>
                  <li>50-59: Geçer (CB)</li>
                  <li>0-49: Yetersiz</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Önemli Notlar</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Geçme notu: 50</li>
                  <li>• Kalan dersler GNO'ya dahil edilmez</li>
                  <li>• Kredi değerleri okula göre değişebilir</li>
                  <li>• Seçmeli dersler de hesaba katılır</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Kredi Sisteminin Avantajları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Derslerin önem derecesini yansıtır</li>
              <li>Daha adil bir değerlendirme sağlar</li>
              <li>Üniversite hazırlığında rehberlik eder</li>
              <li>Akademik performansı detaylı gösterir</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-green-900 mb-2">💡 İpucu</h4>
              <p className="text-green-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı not senaryolarını deneyebilir ve 
                hangi derslerde daha fazla çalışmanız gerektiğini belirleyebilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Lise kredi sistemi, öğrencilerin akademik başarısını daha kapsamlı değerlendiren modern bir sistemdir. 
              Bu sistemi doğru anlayarak, ders çalışma stratejinizi geliştirebilir ve akademik hedeflerinize 
              daha etkili bir şekilde ulaşabilirsiniz. Hesaplama aracımız sayesinde GNO'nuzu kolayca takip edebilir 
              ve gelecekteki notlarınızı planlayabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default LiseDersPuaniPage;