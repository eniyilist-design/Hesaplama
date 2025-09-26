import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, BookOpen, Award, ArrowRight, Info, Plus, Trash2, BarChart3 } from 'lucide-react';

interface Donem {
  id: string;
  ad: string;
  ortalama: number;
  kredi: number;
}

interface HesaplamaSonuc {
  genelOrtalama: number;
  toplamKredi: number;
  agirlikliOrtalama: number;
  basariDurumu: string;
  harfNotu: string;
  donemSayisi: number;
}

const benzerAraclar = [
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Ders Puanı', icon: Calculator, link: '/egitim/lise-ders-puani', active: true },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '/egitim/lise-mezuniyet-puani', active: true }
];

const LiseOrtalamaPage: React.FC = () => {
  const [donemler, setDonemler] = useState<Donem[]>([
    { id: '1', ad: '9. Sınıf 1. Dönem', ortalama: 0, kredi: 30 },
    { id: '2', ad: '9. Sınıf 2. Dönem', ortalama: 0, kredi: 30 },
    { id: '3', ad: '10. Sınıf 1. Dönem', ortalama: 0, kredi: 32 },
    { id: '4', ad: '10. Sınıf 2. Dönem', ortalama: 0, kredi: 32 },
    { id: '5', ad: '11. Sınıf 1. Dönem', ortalama: 0, kredi: 34 },
    { id: '6', ad: '11. Sınıf 2. Dönem', ortalama: 0, kredi: 34 },
    { id: '7', ad: '12. Sınıf 1. Dönem', ortalama: 0, kredi: 36 },
    { id: '8', ad: '12. Sınıf 2. Dönem', ortalama: 0, kredi: 36 }
  ]);
  
  const [sonuc, setSonuc] = useState<HesaplamaSonuc | null>(null);

  const hesapla = () => {
    const gecerliDonemler = donemler.filter(donem => donem.ortalama > 0);
    
    if (gecerliDonemler.length === 0) {
      setSonuc(null);
      return;
    }

    // Basit ortalama (tüm dönemlerin ortalaması)
    const genelOrtalama = gecerliDonemler.reduce((sum, donem) => sum + donem.ortalama, 0) / gecerliDonemler.length;
    
    // Ağırlıklı ortalama (kredi bazlı)
    const toplamKredi = gecerliDonemler.reduce((sum, donem) => sum + donem.kredi, 0);
    const agirlikliToplam = gecerliDonemler.reduce((sum, donem) => sum + (donem.ortalama * donem.kredi), 0);
    const agirlikliOrtalama = toplamKredi > 0 ? agirlikliToplam / toplamKredi : 0;
    
    let harfNotu = '';
    let basariDurumu = '';
    
    if (agirlikliOrtalama >= 85) {
      harfNotu = 'AA (Pekiyi)';
      basariDurumu = 'Çok Başarılı';
    } else if (agirlikliOrtalama >= 70) {
      harfNotu = 'BA (İyi)';
      basariDurumu = 'Başarılı';
    } else if (agirlikliOrtalama >= 60) {
      harfNotu = 'BB (Orta)';
      basariDurumu = 'Orta';
    } else if (agirlikliOrtalama >= 50) {
      harfNotu = 'CB (Geçer)';
      basariDurumu = 'Geçer';
    } else if (agirlikliOrtalama >= 40) {
      harfNotu = 'CC (Koşullu)';
      basariDurumu = 'Koşullu Geçer';
    } else {
      harfNotu = 'FF (Başarısız)';
      basariDurumu = 'Başarısız';
    }
    
    setSonuc({
      genelOrtalama,
      toplamKredi,
      agirlikliOrtalama,
      basariDurumu,
      harfNotu,
      donemSayisi: gecerliDonemler.length
    });
  };

  useEffect(() => {
    hesapla();
  }, [donemler]);

  const donemGuncelle = (id: string, field: keyof Donem, value: any) => {
    setDonemler(prev => prev.map(donem => 
      donem.id === id ? { ...donem, [field]: value } : donem
    ));
  };

  const donemEkle = () => {
    const yeniId = (donemler.length + 1).toString();
    setDonemler(prev => [...prev, {
      id: yeniId,
      ad: `Ek Dönem ${donemler.length - 7}`,
      ortalama: 0,
      kredi: 30
    }]);
  };

  const donemSil = (id: string) => {
    if (donemler.length > 1) {
      setDonemler(prev => prev.filter(donem => donem.id !== id));
    }
  };

  const performansAnalizi = () => {
    if (!sonuc) return null;
    
    const gecerliDonemler = donemler.filter(d => d.ortalama > 0);
    if (gecerliDonemler.length < 2) return null;
    
    const ilkYari = gecerliDonemler.slice(0, Math.floor(gecerliDonemler.length / 2));
    const ikinciYari = gecerliDonemler.slice(Math.floor(gecerliDonemler.length / 2));
    
    const ilkYariOrt = ilkYari.reduce((sum, d) => sum + d.ortalama, 0) / ilkYari.length;
    const ikinciYariOrt = ikinciYari.reduce((sum, d) => sum + d.ortalama, 0) / ikinciYari.length;
    
    const trend = ikinciYariOrt - ilkYariOrt;
    
    return {
      trend,
      trendText: trend > 5 ? 'Yükseliş Trendi' : trend < -5 ? 'Düşüş Trendi' : 'Stabil Performans',
      trendColor: trend > 5 ? 'text-green-600' : trend < -5 ? 'text-red-600' : 'text-blue-600'
    };
  };

  const performans = performansAnalizi();

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-orange-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Lise Ortalama Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Lise Ortalama Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lise dönemlerinizin genel ortalamasını hesaplayın ve akademik performansınızı analiz edin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3 text-orange-600" />
                  Dönem Ortalamaları
                </h2>
                <button
                  onClick={donemEkle}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Dönem Ekle</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {donemler.map((donem, index) => (
                  <div key={donem.id} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dönem Adı
                        </label>
                        <input
                          type="text"
                          value={donem.ad}
                          onChange={(e) => donemGuncelle(donem.id, 'ad', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ortalama (0-100)
                        </label>
                        <input
                          type="number"
                          value={donem.ortalama}
                          onChange={(e) => donemGuncelle(donem.id, 'ortalama', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kredi
                        </label>
                        <input
                          type="number"
                          value={donem.kredi}
                          onChange={(e) => donemGuncelle(donem.id, 'kredi', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="1"
                          max="50"
                        />
                      </div>
                      <div className="flex justify-center">
                        {donemler.length > 1 && (
                          <button
                            onClick={() => donemSil(donem.id)}
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

              <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center text-orange-800">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    Ortalama 0 olan dönemler hesaplamaya dahil edilmez. Kredi değerleri dönem yoğunluğunu yansıtır.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-orange-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ağırlıklı Ortalama</div>
                    <div className="text-3xl font-bold text-orange-600">
                      {sonuc.agirlikliOrtalama.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.harfNotu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Basit Ortalama</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.genelOrtalama.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Başarı Durumu</div>
                    <div className={`text-lg font-bold ${
                      sonuc.basariDurumu === 'Çok Başarılı' ? 'text-green-600' :
                      sonuc.basariDurumu === 'Başarılı' ? 'text-blue-600' :
                      sonuc.basariDurumu === 'Orta' ? 'text-yellow-600' :
                      sonuc.basariDurumu === 'Geçer' ? 'text-orange-600' : 'text-red-600'
                    }`}>
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
                    <div className="text-sm text-gray-600 mb-1">Değerlendirilen Dönem</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.donemSayisi} dönem
                    </div>
                  </div>

                  {performans && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Performans Trendi</div>
                      <div className={`text-lg font-bold ${performans.trendColor}`}>
                        {performans.trendText}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {performans.trend > 0 ? '+' : ''}{performans.trend.toFixed(1)} puan
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ortalama Türleri Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ortalama Hesaplama Türleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basit Ortalama</h3>
              <div className="bg-blue-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Formül:</strong> Tüm dönem ortalamalarının toplamı ÷ Dönem sayısı
                </p>
                <p className="text-xs text-gray-600">
                  Her dönem eşit ağırlıkta değerlendirilir
                </p>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Kolay hesaplama</li>
                <li>• Hızlı değerlendirme</li>
                <li>• Genel performans göstergesi</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ağırlıklı Ortalama</h3>
              <div className="bg-orange-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Formül:</strong> Σ(Ortalama × Kredi) ÷ Σ(Kredi)
                </p>
                <p className="text-xs text-gray-600">
                  Kredi değerleri dönemlerin ağırlığını belirler
                </p>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Daha adil değerlendirme</li>
                <li>• Dönem yoğunluğunu dikkate alır</li>
                <li>• Üniversite sistemine uygun</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performans Analizi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Akademik Performans Rehberi</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Yükselen Performans</h3>
              <p className="text-sm text-gray-600">
                Dönemler arası 5+ puan artış. Çalışma stratejiniz başarılı, devam edin.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stabil Performans</h3>
              <p className="text-sm text-gray-600">
                -5 ile +5 puan arası değişim. Tutarlı çalışma, hedef belirleme zamanı.
              </p>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white transform rotate-180" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Düşen Performans</h3>
              <p className="text-sm text-gray-600">
                5+ puan düşüş. Çalışma yöntemini gözden geçirin, destek alın.
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
                <Link key={index} to={arac.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-4">
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
              Lise Ortalama Nasıl Hesaplanır? Akademik Başarı Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lise Ortalama Hesaplama Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise ortalama hesaplama, öğrencinin tüm lise dönemleri boyunca aldığı notların genel bir değerlendirmesini 
              yaparak akademik performansını ölçen bir sistemdir. Bu hesaplama, hem basit ortalama hem de ağırlıklı 
              ortalama yöntemleriyle yapılabilir ve öğrencinin genel başarı durumunu gösterir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Yöntemleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise ortalaması iki farklı yöntemle hesaplanabilir:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Basit Ortalama Yöntemi</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tüm dönem ortalamalarının toplanıp dönem sayısına bölünmesiyle elde edilir:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Basit Ortalama Formülü:</p>
              <p className="text-blue-800">Genel Ortalama = (Dönem1 + Dönem2 + ... + DönemN) ÷ N</p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Ağırlıklı Ortalama Yöntemi</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Her dönemin kredi değeri dikkate alınarak hesaplanır:
            </p>
            <div className="bg-orange-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-orange-900 mb-2">Ağırlıklı Ortalama Formülü:</p>
              <p className="text-orange-800">Ağırlıklı Ortalama = Σ(Dönem Ortalaması × Kredi) ÷ Σ(Kredi)</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dönem Kredi Değerleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise dönemlerinin genel kredi dağılımı şu şekildedir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>9. Sınıf Dönemleri:</strong> 30-32 kredi</li>
              <li><strong>10. Sınıf Dönemleri:</strong> 32-34 kredi</li>
              <li><strong>11. Sınıf Dönemleri:</strong> 34-36 kredi</li>
              <li><strong>12. Sınıf Dönemleri:</strong> 36-38 kredi</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bir öğrencinin dönem notları şu şekilde olsun:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold mb-3">Basit Ortalama Hesaplama:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>9/1: 75, 9/2: 80, 10/1: 85, 10/2: 78</li>
                <li>11/1: 82, 11/2: 88, 12/1: 90, 12/2: 85</li>
              </ul>
              <p className="font-semibold">
                Basit Ortalama: (75+80+85+78+82+88+90+85) ÷ 8 = 82.875
              </p>
              
              <h4 className="font-semibold mt-6 mb-3">Ağırlıklı Ortalama Hesaplama:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>9/1: 75×30=2250, 9/2: 80×30=2400</li>
                <li>10/1: 85×32=2720, 10/2: 78×32=2496</li>
                <li>11/1: 82×34=2788, 11/2: 88×34=2992</li>
                <li>12/1: 90×36=3240, 12/2: 85×36=3060</li>
              </ul>
              <p className="font-semibold">
                Toplam: 21946 ÷ 264 = 83.11
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Başarı Değerlendirme Kriterleri</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Ortalama Aralıkları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>85-100: Pekiyi (AA) - Çok Başarılı</li>
                  <li>70-84: İyi (BA) - Başarılı</li>
                  <li>60-69: Orta (BB) - Orta</li>
                  <li>50-59: Geçer (CB) - Geçer</li>
                  <li>40-49: Koşullu (CC) - Koşullu</li>
                  <li>0-39: Başarısız (FF) - Başarısız</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Performans Trendi</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• +5 puan: Yükseliş trendi</li>
                  <li>• ±5 puan: Stabil performans</li>
                  <li>• -5 puan: Düşüş trendi</li>
                  <li>• Trend analizi motivasyon sağlar</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ortalama Yükseltme Stratejileri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Zayıf dersleri tespit edin:</strong> Düşük notlu derslere odaklanın</li>
              <li><strong>Çalışma planı yapın:</strong> Düzenli ve sistematik çalışma</li>
              <li><strong>Öğretmenlerden destek alın:</strong> Anlamadığınız konuları sorun</li>
              <li><strong>Grup çalışması yapın:</strong> Arkadaşlarınızla birlikte çalışın</li>
              <li><strong>Sınav tekniklerini geliştirin:</strong> Etkili sınav stratejileri öğrenin</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Üniversite Başvurularında Önemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise ortalaması üniversite başvurularında önemli rol oynar:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>YKS puanının %12'sini oluşturur</li>
              <li>Burs başvurularında değerlendirilir</li>
              <li>Yurtdışı üniversite başvurularında gereklidir</li>
              <li>Bazı bölümler için minimum ortalama şartı vardır</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-orange-900 mb-2">💡 İpucu</h4>
              <p className="text-orange-800">
                Yukarıdaki hesaplama aracımızı kullanarak mevcut ortalamanızı hesaplayabilir, farklı 
                senaryolar deneyebilir ve hedef ortalamanıza ulaşmak için hangi dönemlerde ne kadar 
                çalışmanız gerektiğini planlayabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Lise ortalaması, akademik başarınızın en önemli göstergelerinden biridir. Hem basit hem de 
              ağırlıklı ortalama hesaplamalarını anlayarak, performansınızı doğru değerlendirebilir ve 
              gelecekteki hedefleriniz için stratejiler geliştirebilirsiniz. Düzenli takip ve doğru 
              planlama ile ortalamanızı sürekli iyileştirebilir, üniversite hedeflerinize daha kolay 
              ulaşabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default LiseOrtalamaPage;