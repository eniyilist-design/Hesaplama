import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, Award, TrendingUp, ArrowRight, Info, Plus, Trash2 } from 'lucide-react';

interface SinavNotu {
  id: string;
  ad: string;
  not: number;
  agirlik: number;
}

interface HesaplamaSonuc {
  yillikNot: number;
  harfNotu: string;
  gecmeDurumu: boolean;
  eksikPuan: number;
}

const benzerAraclar = [
  { name: 'Lise Ders Puanı Hesaplama', icon: Calculator, link: '#', active: false },
  { name: 'Lise Ortalama Hesaplama', icon: TrendingUp, link: '#', active: false },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '#', active: false }
];

const DersNotuHesaplamaPage: React.FC = () => {
  const [sinavlar, setSinavlar] = useState<SinavNotu[]>([
    { id: '1', ad: '1. Yazılı', not: 0, agirlik: 25 },
    { id: '2', ad: '2. Yazılı', not: 0, agirlik: 25 },
    { id: '3', ad: 'Sözlü', not: 0, agirlik: 25 },
    { id: '4', ad: 'Performans', not: 0, agirlik: 25 }
  ]);
  
  const [sonuc, setSonuc] = useState<HesaplamaSonuc | null>(null);

  const hesapla = () => {
    const toplamAgirlik = sinavlar.reduce((sum, sinav) => sum + sinav.agirlik, 0);
    const agirlikliToplam = sinavlar.reduce((sum, sinav) => sum + (sinav.not * sinav.agirlik), 0);
    
    const yillikNot = toplamAgirlik > 0 ? agirlikliToplam / toplamAgirlik : 0;
    
    let harfNotu = '';
    if (yillikNot >= 85) harfNotu = 'AA (Pekiyi)';
    else if (yillikNot >= 70) harfNotu = 'BA (İyi)';
    else if (yillikNot >= 60) harfNotu = 'BB (Orta)';
    else if (yillikNot >= 50) harfNotu = 'CB (Geçer)';
    else if (yillikNot >= 40) harfNotu = 'CC (Koşullu Geçer)';
    else harfNotu = 'FF (Başarısız)';
    
    const gecmeDurumu = yillikNot >= 50;
    const eksikPuan = gecmeDurumu ? 0 : 50 - yillikNot;
    
    setSonuc({
      yillikNot,
      harfNotu,
      gecmeDurumu,
      eksikPuan
    });
  };

  useEffect(() => {
    hesapla();
  }, [sinavlar]);

  const sinavGuncelle = (id: string, field: 'not' | 'agirlik', value: number) => {
    setSinavlar(prev => prev.map(sinav => 
      sinav.id === id ? { ...sinav, [field]: value } : sinav
    ));
  };

  const sinavEkle = () => {
    const yeniId = (sinavlar.length + 1).toString();
    setSinavlar(prev => [...prev, {
      id: yeniId,
      ad: `${sinavlar.length + 1}. Sınav`,
      not: 0,
      agirlik: 20
    }]);
  };

  const sinavSil = (id: string) => {
    if (sinavlar.length > 1) {
      setSinavlar(prev => prev.filter(sinav => sinav.id !== id));
    }
  };

  const sinavAdGuncelle = (id: string, yeniAd: string) => {
    setSinavlar(prev => prev.map(sinav => 
      sinav.id === id ? { ...sinav, ad: yeniAd } : sinav
    ));
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
          <span className="text-gray-900 font-medium">Ders Notu Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ders Notu Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sınav notlarınızdan ders geçme notunuzu ve yıllık başarı durumunuzu hesaplayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-indigo-600" />
                  Sınav Notları
                </h2>
                <button
                  onClick={sinavEkle}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sınav Ekle</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {sinavlar.map((sinav, index) => (
                  <div key={sinav.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sınav Adı
                        </label>
                        <input
                          type="text"
                          value={sinav.ad}
                          onChange={(e) => sinavAdGuncelle(sinav.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Not (0-100)
                        </label>
                        <input
                          type="number"
                          value={sinav.not}
                          onChange={(e) => sinavGuncelle(sinav.id, 'not', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                          value={sinav.agirlik}
                          onChange={(e) => sinavGuncelle(sinav.id, 'agirlik', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="1"
                          max="100"
                        />
                      </div>
                      <div className="flex justify-center">
                        {sinavlar.length > 1 && (
                          <button
                            onClick={() => sinavSil(sinav.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center text-blue-800">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    Toplam Ağırlık: {sinavlar.reduce((sum, sinav) => sum + sinav.agirlik, 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-green-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yıllık Not</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {sonuc.yillikNot.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Harf Notu</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.harfNotu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Geçme Durumu</div>
                    <div className={`text-lg font-bold ${sonuc.gecmeDurumu ? 'text-green-600' : 'text-red-600'}`}>
                      {sonuc.gecmeDurumu ? 'GEÇTİ' : 'KALDI'}
                    </div>
                  </div>

                  {!sonuc.gecmeDurumu && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Eksik Puan</div>
                      <div className="text-lg font-bold text-red-600">
                        {sonuc.eksikPuan.toFixed(2)} puan
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Not Sistemi Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Türkiye Lise Not Sistemi</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Harf Notları</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span className="font-medium">AA (Pekiyi)</span>
                  <span>85-100</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">BA (İyi)</span>
                  <span>70-84</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="font-medium">BB (Orta)</span>
                  <span>60-69</span>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 rounded">
                  <span className="font-medium">CB (Geçer)</span>
                  <span>50-59</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded">
                  <span className="font-medium">CC (Koşullu)</span>
                  <span>40-49</span>
                </div>
                <div className="flex justify-between p-2 bg-red-100 rounded">
                  <span className="font-medium">FF (Başarısız)</span>
                  <span>0-39</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geçme Koşulları</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Yıllık not 50 ve üzeri olmalı
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tüm sınavlara katılım sağlanmalı
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Devamsızlık sınırı aşılmamalı
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Performans ödevleri tamamlanmalı
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
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
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
              Lise Ders Notu Nasıl Hesaplanır? Türkiye Eğitim Sistemi Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Türkiye Lise Not Sistemi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de lise eğitiminde kullanılan not sistemi, öğrencilerin akademik başarısını değerlendirmek için 
              kullanılan standart bir sistemdir. Bu sistem, Milli Eğitim Bakanlığı (MEB) tarafından belirlenen 
              kriterler doğrultusunda uygulanır ve tüm liselerde aynı şekilde kullanılır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ders Notu Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise ders notu hesaplaması, farklı sınav türlerinin ağırlıklı ortalaması alınarak yapılır. 
              Genel olarak şu bileşenler kullanılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Yazılı Sınavlar:</strong> Genellikle %50-60 ağırlığa sahiptir</li>
              <li><strong>Sözlü Notlar:</strong> %20-30 ağırlık oranında değerlendirilir</li>
              <li><strong>Performans Ödevleri:</strong> %10-20 ağırlık taşır</li>
              <li><strong>Proje Çalışmaları:</strong> Ders türüne göre değişken ağırlık</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Harf Notu Sistemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de lise eğitiminde kullanılan harf notu sistemi şu şekildedir:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>AA (Pekiyi):</strong> 85-100 puan arası</li>
                <li><strong>BA (İyi):</strong> 70-84 puan arası</li>
                <li><strong>BB (Orta):</strong> 60-69 puan arası</li>
                <li><strong>CB (Geçer):</strong> 50-59 puan arası</li>
                <li><strong>CC (Koşullu Geçer):</strong> 40-49 puan arası</li>
                <li><strong>FF (Başarısız):</strong> 0-39 puan arası</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Geçme ve Kalma Koşulları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bir dersten geçebilmek için aşağıdaki koşulların sağlanması gerekir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Yıllık not ortalamasının en az 50 olması</li>
              <li>Devamsızlık sınırını aşmamış olması</li>
              <li>Tüm zorunlu sınavlara katılmış olması</li>
              <li>Performans ödevlerini tamamlamış olması</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Matematik dersinden aldığınız notlar şu şekilde olsun:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li>1. Yazılı: 70 puan (%25 ağırlık)</li>
                <li>2. Yazılı: 80 puan (%25 ağırlık)</li>
                <li>Sözlü: 85 puan (%25 ağırlık)</li>
                <li>Performans: 90 puan (%25 ağırlık)</li>
              </ul>
              <p className="mt-4 font-semibold">
                Hesaplama: (70×0.25) + (80×0.25) + (85×0.25) + (90×0.25) = 81.25
              </p>
              <p className="text-green-600 font-bold">Sonuç: 81.25 - BA (İyi)</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Önemli Notlar</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Her okulun kendi değerlendirme kriterleri olabilir</li>
              <li>Ders türüne göre ağırlık oranları değişebilir</li>
              <li>Öğretmenler ek değerlendirme kriterleri ekleyebilir</li>
              <li>Sınav tarihleri ve sayıları okul yönetimi tarafından belirlenir</li>
            </ul>

            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-indigo-900 mb-2">💡 İpucu</h4>
              <p className="text-indigo-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı not kombinasyonlarını deneyebilir ve 
                hangi sınavlarda ne kadar puan almanız gerektiğini önceden planlayabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Lise ders notu hesaplama sistemi, öğrencilerin akademik başarısını adil bir şekilde değerlendirmek 
              için tasarlanmıştır. Bu sistemi doğru anlayarak, akademik hedeflerinizi belirleyebilir ve 
              başarınızı artırmak için gerekli stratejileri geliştirebilirsiniz. Hesaplama aracımız sayesinde 
              notlarınızı kolayca takip edebilir ve gelecekteki sınavlar için hedef belirleyebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default DersNotuHesaplamaPage;