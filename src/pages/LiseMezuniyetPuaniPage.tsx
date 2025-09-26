import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Award, BookOpen, TrendingUp, ArrowRight, Info, GraduationCap, Star } from 'lucide-react';

interface SinifNotu {
  sinif: string;
  not: number;
  agirlik: number;
}

interface HesaplamaSonuc {
  diplomaNotu: number;
  harfNotu: string;
  mezuniyetDurumu: boolean;
  takdirTesekkur: string;
  yuksekogretimPuani: number;
}

const benzerAraclar = [
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Ders Puanı', icon: Calculator, link: '/egitim/lise-ders-puani', active: true },
  { name: 'Lise Ortalama Hesaplama', icon: TrendingUp, link: '/egitim/lise-ortalama', active: true }
];

const LiseMezuniyetPuaniPage: React.FC = () => {
  const [sinifNotlari, setSinifNotlari] = useState<SinifNotu[]>([
    { sinif: '9. Sınıf', not: 0, agirlik: 20 },
    { sinif: '10. Sınıf', not: 0, agirlik: 25 },
    { sinif: '11. Sınıf', not: 0, agirlik: 25 },
    { sinif: '12. Sınıf', not: 0, agirlik: 30 }
  ]);
  
  const [sonuc, setSonuc] = useState<HesaplamaSonuc | null>(null);

  const hesapla = () => {
    const toplamAgirlik = sinifNotlari.reduce((sum, sinif) => sum + sinif.agirlik, 0);
    const agirlikliToplam = sinifNotlari.reduce((sum, sinif) => sum + (sinif.not * sinif.agirlik), 0);
    
    const diplomaNotu = toplamAgirlik > 0 ? agirlikliToplam / toplamAgirlik : 0;
    
    let harfNotu = '';
    if (diplomaNotu >= 85) harfNotu = 'AA (Pekiyi)';
    else if (diplomaNotu >= 70) harfNotu = 'BA (İyi)';
    else if (diplomaNotu >= 60) harfNotu = 'BB (Orta)';
    else if (diplomaNotu >= 50) harfNotu = 'CB (Geçer)';
    else if (diplomaNotu >= 40) harfNotu = 'CC (Koşullu)';
    else harfNotu = 'FF (Başarısız)';
    
    const mezuniyetDurumu = diplomaNotu >= 50;
    
    let takdirTesekkur = '';
    if (diplomaNotu >= 85) takdirTesekkur = 'Takdir Belgesi';
    else if (diplomaNotu >= 70) takdirTesekkur = 'Teşekkür Belgesi';
    else takdirTesekkur = 'Belge Yok';
    
    // YKS için yaklaşık hesaplama (gerçek formül daha karmaşık)
    const yuksekogretimPuani = diplomaNotu * 0.6; // Basitleştirilmiş hesaplama
    
    setSonuc({
      diplomaNotu,
      harfNotu,
      mezuniyetDurumu,
      takdirTesekkur,
      yuksekogretimPuani
    });
  };

  useEffect(() => {
    hesapla();
  }, [sinifNotlari]);

  const sinifNotuGuncelle = (sinif: string, not: number) => {
    setSinifNotlari(prev => prev.map(s => 
      s.sinif === sinif ? { ...s, not } : s
    ));
  };

  const agirlikGuncelle = (sinif: string, agirlik: number) => {
    setSinifNotlari(prev => prev.map(s => 
      s.sinif === sinif ? { ...s, agirlik } : s
    ));
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-purple-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Lise Mezuniyet Puanı Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lise Mezuniyet Puanı Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Diploma notunuzu, mezuniyet durumunuzu ve takdir-teşekkür belge durumunuzu hesaplayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-3 text-purple-600" />
                Sınıf Notları
              </h2>
              
              <div className="space-y-6">
                {sinifNotlari.map((sinif, index) => (
                  <div key={sinif.sinif} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {sinif.sinif}
                        </label>
                        <div className="text-lg font-bold text-purple-600">
                          Sınıf Ortalaması
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Not (0-100)
                        </label>
                        <input
                          type="number"
                          value={sinif.not}
                          onChange={(e) => sinifNotuGuncelle(sinif.sinif, Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ağırlık (%)
                        </label>
                        <input
                          type="number"
                          value={sinif.agirlik}
                          onChange={(e) => agirlikGuncelle(sinif.sinif, Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                          min="1"
                          max="50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center text-purple-800">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    Toplam Ağırlık: {sinifNotlari.reduce((sum, sinif) => sum + sinif.agirlik, 0)}%
                    {sinifNotlari.reduce((sum, sinif) => sum + sinif.agirlik, 0) !== 100 && 
                      <span className="text-red-600 ml-2">(100% olmalı)</span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="h-6 w-6 mr-3 text-purple-600" />
                  Mezuniyet Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Diploma Notu</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {sonuc.diplomaNotu.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.harfNotu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Mezuniyet Durumu</div>
                    <div className={`text-lg font-bold ${sonuc.mezuniyetDurumu ? 'text-green-600' : 'text-red-600'}`}>
                      {sonuc.mezuniyetDurumu ? 'MEZUNİYET HAKKı VAR' : 'MEZUNİYET HAKKı YOK'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Takdir/Teşekkür</div>
                    <div className={`text-lg font-bold ${
                      sonuc.takdirTesekkur === 'Takdir Belgesi' ? 'text-yellow-600' :
                      sonuc.takdirTesekkur === 'Teşekkür Belgesi' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {sonuc.takdirTesekkur}
                    </div>
                    {sonuc.takdirTesekkur !== 'Belge Yok' && (
                      <Star className="h-5 w-5 text-yellow-500 mt-1" />
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">YKS Katkı Puanı (Tahmini)</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.yuksekogretimPuani.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      *Yaklaşık hesaplama
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mezuniyet Kriterleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lise Mezuniyet Kriterleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mezuniyet Koşulları</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Diploma notu en az 50 olmalı</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Tüm zorunlu derslerden geçmiş olmalı</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Devamsızlık sınırını aşmamış olmalı</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Disiplin cezası bulunmamalı</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Takdir ve Teşekkür Belgeleri</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    Takdir Belgesi
                  </span>
                  <span className="font-bold">85-100</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium flex items-center">
                    <Star className="h-4 w-4 text-blue-500 mr-2" />
                    Teşekkür Belgesi
                  </span>
                  <span className="font-bold">70-84</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Belge Yok</span>
                  <span>0-69</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sınıf Ağırlıkları Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sınıf Ağırlıkları Sistemi</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Standart Ağırlık Dağılımı</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">9. Sınıf</span>
                  <span className="font-bold">%20</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">10. Sınıf</span>
                  <span className="font-bold">%25</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">11. Sınıf</span>
                  <span className="font-bold">%25</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">12. Sınıf</span>
                  <span className="font-bold">%30</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesaplama Formülü</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Diploma Notu Formülü:</strong>
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  DN = (9.Sınıf×0.20) + (10.Sınıf×0.25) + (11.Sınıf×0.25) + (12.Sınıf×0.30)
                </p>
                <p className="text-xs text-gray-600">
                  Ağırlık oranları okula göre değişebilir
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
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
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
              Lise Mezuniyet Puanı Nasıl Hesaplanır? Diploma Notu Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lise Mezuniyet Puanı Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise mezuniyet puanı, öğrencinin 4 yıllık lise eğitimi boyunca aldığı notların ağırlıklı ortalaması 
              olarak hesaplanan ve diploma notunu belirleyen puandır. Bu puan, mezuniyet hakkı kazanma, takdir-teşekkür 
              belgesi alma ve üniversite sınavlarında ek puan alma açısından kritik öneme sahiptir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Mezuniyet puanı hesaplaması, her sınıfın belirli bir ağırlığa sahip olduğu ağırlıklı ortalama 
              yöntemiyle yapılır. Genel olarak kullanılan ağırlık dağılımı şu şekildedir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>9. Sınıf:</strong> %20 ağırlık</li>
              <li><strong>10. Sınıf:</strong> %25 ağırlık</li>
              <li><strong>11. Sınıf:</strong> %25 ağırlık</li>
              <li><strong>12. Sınıf:</strong> %30 ağırlık</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Mezuniyet Koşulları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise mezuniyeti için aşağıdaki koşulların tamamının sağlanması gerekir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Diploma notunun en az 50 olması</li>
              <li>Tüm zorunlu derslerden başarılı olunması</li>
              <li>Devamsızlık sınırının aşılmaması (%20)</li>
              <li>Disiplin cezası bulunmaması</li>
              <li>Okul ücretlerinin ödenmiş olması (özel okullarda)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Takdir ve Teşekkür Belgeleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Akademik başarı düzeyine göre verilen belgeler:
            </p>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Takdir Belgesi:</strong> 85-100 puan arası (Pekiyi)</li>
                <li><strong>Teşekkür Belgesi:</strong> 70-84 puan arası (İyi)</li>
                <li><strong>Belge Yok:</strong> 50-69 puan arası</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">YKS'de Diploma Notunun Etkisi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise diploma notu, Yükseköğretim Kurumları Sınavı (YKS) puanınızın hesaplanmasında da rol oynar:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Diploma notu YKS puanının %12'sini oluşturur</li>
              <li>Yüksek diploma notu üniversite tercihlerinde avantaj sağlar</li>
              <li>Bazı bölümler için minimum diploma notu şartı bulunur</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bir öğrencinin sınıf notları şu şekilde olsun:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li>9. Sınıf: 75 puan (%20 ağırlık) = 75 × 0.20 = 15</li>
                <li>10. Sınıf: 80 puan (%25 ağırlık) = 80 × 0.25 = 20</li>
                <li>11. Sınıf: 85 puan (%25 ağırlık) = 85 × 0.25 = 21.25</li>
                <li>12. Sınıf: 90 puan (%30 ağırlık) = 90 × 0.30 = 27</li>
              </ul>
              <p className="mt-4 font-semibold">
                Diploma Notu: 15 + 20 + 21.25 + 27 = 83.25
              </p>
              <p className="text-green-600 font-bold">
                Sonuç: 83.25 - Teşekkür Belgesi Hakkı
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Önemli Notlar</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Ağırlık oranları okullara göre değişebilir</li>
              <li>Bazı okullar farklı hesaplama yöntemleri kullanabilir</li>
              <li>Nakil öğrencileri için özel hesaplama yapılır</li>
              <li>Sınıf tekrarı durumunda en yüksek not dikkate alınır</li>
            </ul>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">💡 İpucu</h4>
              <p className="text-purple-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı not senaryolarını deneyebilir ve 
                hangi sınıflarda daha fazla çalışmanız gerektiğini belirleyebilirsiniz. 12. sınıfın 
                ağırlığının yüksek olması nedeniyle son sınıfta alacağınız notlar özellikle önemlidir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Lise mezuniyet puanı, sadece diploma almak için değil, aynı zamanda üniversite hayatınızın 
              temelini oluşturmak için de kritik öneme sahiptir. Bu puanı yüksek tutmak için tüm sınıflarda 
              düzenli çalışmak, özellikle de son sınıfta maksimum performans göstermek gerekir. 
              Hesaplama aracımız sayesinde mevcut durumunuzu değerlendirebilir ve hedeflerinize ulaşmak 
              için gerekli stratejileri belirleyebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default LiseMezuniyetPuaniPage;