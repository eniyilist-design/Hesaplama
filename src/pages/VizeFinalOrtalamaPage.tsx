import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, BookOpen, Award, ArrowRight, Info, Target, TrendingUp } from 'lucide-react';

interface VizeFinalSonuc {
  vizeNotu: number;
  finalNotu: number;
  butunlemeNotu: number;
  vizeAgirlik: number;
  finalAgirlik: number;
  butunlemeAgirlik: number;
  dersOrtalamasi: number;
  butunlemeDersOrtalamasi: number;
  harfNotu: string;
  butunlemeHarfNotu: string;
  gecmeDurumu: boolean;
  butunlemeGecmeDurumu: boolean;
  hedefFinalNotu: number;
  hedefButunlemeNotu: number;
}

const benzerAraclar = [
  { name: 'Üniversite Not Ortalaması', icon: Calculator, link: '/egitim/universite-not-ortalamasi', active: true },
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Ortalama Hesaplama', icon: Award, link: '/egitim/lise-ortalama', active: true }
];

const VizeFinalOrtalamaPage: React.FC = () => {
  const [vizeNotu, setVizeNotu] = useState<number>(0);
  const [finalNotu, setFinalNotu] = useState<number>(0);
  const [butunlemeNotu, setButunlemeNotu] = useState<number>(0);
  const [vizeAgirlik, setVizeAgirlik] = useState<number>(40);
  const [finalAgirlik, setFinalAgirlik] = useState<number>(60);
  const [butunlemeAgirlik, setButunlemeAgirlik] = useState<number>(60);
  const [hedefNot, setHedefNot] = useState<number>(60);
  const [sonuc, setSonuc] = useState<VizeFinalSonuc | null>(null);

  const notToHarf = (not: number): string => {
    if (not >= 90) return 'AA (Pekiyi)';
    if (not >= 85) return 'BA (İyi)';
    if (not >= 75) return 'BB (Orta)';
    if (not >= 65) return 'CB (Geçer)';
    if (not >= 55) return 'CC (Şartlı Geçer)';
    if (not >= 50) return 'DC (Zayıf)';
    if (not >= 45) return 'DD (Çok Zayıf)';
    return 'FF (Başarısız)';
  };

  const hesapla = () => {
    // Ders ortalaması hesaplama
    const dersOrtalamasi = (vizeNotu * vizeAgirlik + finalNotu * finalAgirlik) / 100;
    
    // Bütünleme ile ders ortalaması
    const butunlemeDersOrtalamasi = (vizeNotu * vizeAgirlik + butunlemeNotu * butunlemeAgirlik) / 100;
    
    // Harf notları
    const harfNotu = notToHarf(dersOrtalamasi);
    const butunlemeHarfNotu = notToHarf(butunlemeDersOrtalamasi);
    
    // Geçme durumu (genellikle 60 ve üzeri geçer not)
    const gecmeDurumu = dersOrtalamasi >= 60;
    const butunlemeGecmeDurumu = butunlemeDersOrtalamasi >= 60;
    
    // Hedef final notu hesaplama
    const hedefFinalNotu = Math.max(0, (hedefNot * 100 - vizeNotu * vizeAgirlik) / finalAgirlik);
    
    // Hedef bütünleme notu hesaplama
    const hedefButunlemeNotu = Math.max(0, (hedefNot * 100 - vizeNotu * vizeAgirlik) / butunlemeAgirlik);
    
    setSonuc({
      vizeNotu,
      finalNotu,
      butunlemeNotu,
      vizeAgirlik,
      finalAgirlik,
      butunlemeAgirlik,
      dersOrtalamasi,
      butunlemeDersOrtalamasi,
      harfNotu,
      butunlemeHarfNotu,
      gecmeDurumu,
      butunlemeGecmeDurumu,
      hedefFinalNotu,
      hedefButunlemeNotu
    });
  };

  useEffect(() => {
    hesapla();
  }, [vizeNotu, finalNotu, butunlemeNotu, vizeAgirlik, finalAgirlik, butunlemeAgirlik, hedefNot]);

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-emerald-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Vize Final Ortalama Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Vize Final Ortalama Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vize ve final notlarınızdan ders ortalamanızı hesaplayın, hedef notlarınızı belirleyin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sınav Notları */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-emerald-600" />
                Sınav Notları
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Vize Notu (0-100)
                  </label>
                  <input
                    type="number"
                    value={vizeNotu}
                    onChange={(e) => setVizeNotu(Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Final Notu (0-100)
                  </label>
                  <input
                    type="number"
                    value={finalNotu}
                    onChange={(e) => setFinalNotu(Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bütünleme Notu (0-100)
                  </label>
                  <input
                    type="number"
                    value={butunlemeNotu}
                    onChange={(e) => setButunlemeNotu(Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                    min="0"
                    max="100"
                  />
                  <div className="mt-1 text-sm text-gray-600">
                    Final yerine bütünleme sınavı
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hedef Not (0-100)
                  </label>
                  <input
                    type="number"
                    value={hedefNot}
                    onChange={(e) => setHedefNot(Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                    min="0"
                    max="100"
                  />
                  <div className="mt-1 text-sm text-gray-600">
                    Ulaşmak istediğiniz ortalama
                  </div>
                </div>
              </div>
            </div>

            {/* Ağırlık Ayarları */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-emerald-600" />
                Ağırlık Oranları (%)
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vize Ağırlığı
                  </label>
                  <input
                    type="number"
                    value={vizeAgirlik}
                    onChange={(e) => setVizeAgirlik(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Final Ağırlığı
                  </label>
                  <input
                    type="number"
                    value={finalAgirlik}
                    onChange={(e) => setFinalAgirlik(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bütünleme Ağırlığı
                  </label>
                  <input
                    type="number"
                    value={butunlemeAgirlik}
                    onChange={(e) => setButunlemeAgirlik(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <div className="text-sm text-emerald-800">
                  Toplam Ağırlık (Vize + Final): {vizeAgirlik + finalAgirlik}%
                  {vizeAgirlik + finalAgirlik !== 100 && 
                    <span className="text-red-600 ml-2">(100% olmalı)</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-emerald-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ders Ortalaması</div>
                    <div className="text-3xl font-bold text-emerald-600">
                      {sonuc.dersOrtalamasi.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.harfNotu}
                    </div>
                  </div>

                  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.gecmeDurumu ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="text-sm text-gray-600 mb-1">Geçme Durumu</div>
                    <div className={`text-lg font-bold ${
                      sonuc.gecmeDurumu ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sonuc.gecmeDurumu ? 'GEÇTİ' : 'KALDI'}
                    </div>
                  </div>

                  {sonuc.butunlemeNotu > 0 && (
                    <>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">Bütünleme Ortalaması</div>
                        <div className="text-xl font-bold text-blue-600">
                          {sonuc.butunlemeDersOrtalamasi.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {sonuc.butunlemeHarfNotu}
                        </div>
                      </div>

                      <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                        sonuc.butunlemeGecmeDurumu ? 'border-green-500' : 'border-red-500'
                      }`}>
                        <div className="text-sm text-gray-600 mb-1">Bütünleme Durumu</div>
                        <div className={`text-lg font-bold ${
                          sonuc.butunlemeGecmeDurumu ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sonuc.butunlemeGecmeDurumu ? 'GEÇTİ' : 'KALDI'}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Hedef Notlar
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Final için gereken:</span>
                        <span className="font-bold text-orange-600">
                          {sonuc.hedefFinalNotu > 100 ? '100+' : sonuc.hedefFinalNotu.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bütünleme için gereken:</span>
                        <span className="font-bold text-blue-600">
                          {sonuc.hedefButunlemeNotu > 100 ? '100+' : sonuc.hedefButunlemeNotu.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Hesaplama Detayı</div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Vize: {sonuc.vizeNotu} × %{sonuc.vizeAgirlik} = {(sonuc.vizeNotu * sonuc.vizeAgirlik / 100).toFixed(1)}</div>
                      <div>Final: {sonuc.finalNotu} × %{sonuc.finalAgirlik} = {(sonuc.finalNotu * sonuc.finalAgirlik / 100).toFixed(1)}</div>
                      <div className="border-t pt-1 font-medium">
                        Toplam: {sonuc.dersOrtalamasi.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hesaplama Sistemi Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vize Final Hesaplama Sistemi</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Standart Ağırlık Dağılımları</h3>
              <div className="space-y-3">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <div className="font-medium text-emerald-900">Yaygın Dağılım</div>
                  <div className="text-sm text-emerald-700">Vize: %40 - Final: %60</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium text-blue-900">Eşit Dağılım</div>
                  <div className="text-sm text-blue-700">Vize: %50 - Final: %50</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-medium text-purple-900">Final Ağırlıklı</div>
                  <div className="text-sm text-purple-700">Vize: %30 - Final: %70</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesaplama Formülü</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Ders Ortalaması:</strong>
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  (Vize × Vize Ağırlığı + Final × Final Ağırlığı) ÷ 100
                </p>
                <p className="text-xs text-gray-600">
                  Örnek: (80×40 + 70×60) ÷ 100 = 74
                </p>
              </div>
              
              <h4 className="font-semibold text-gray-900 mt-4 mb-2">Geçme Kriterleri</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Genel geçme notu: 60 ve üzeri</li>
                <li>• Final sınavına girme şartı: Vize 30+</li>
                <li>• Bütünleme hakkı: Final 40+ veya ortalama 50+</li>
                <li>• Devamsızlık sınırı: %30</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sınav Stratejileri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sınav Başarı Stratejileri</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-emerald-50 rounded-xl">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vize Hazırlığı</h3>
              <p className="text-sm text-gray-600">
                Düzenli ders takibi, not tutma ve haftalık tekrar ile vize başarısını artırın.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Stratejisi</h3>
              <p className="text-sm text-gray-600">
                Vize sonrasında eksikleri belirleyin, final için hedef not hesaplayın ve odaklanın.
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bütünleme Planı</h3>
              <p className="text-sm text-gray-600">
                Bütünleme hakkınız varsa, tüm konuları gözden geçirin ve zayıf noktalarınızı güçlendirin.
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
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center mb-4">
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
              Vize Final Ortalaması Nasıl Hesaplanır? Üniversite Sınav Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vize Final Sistemi Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Vize final sistemi, Türkiye'deki üniversitelerde yaygın olarak kullanılan bir değerlendirme 
              yöntemidir. Bu sistemde öğrencilerin ders başarısı, dönem ortasında yapılan vize sınavı ve 
              dönem sonunda yapılan final sınavının ağırlıklı ortalaması ile belirlenir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Vize final ortalaması şu formül ile hesaplanır:
            </p>
            <div className="bg-emerald-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-emerald-900 mb-2">Temel Formül:</p>
              <p className="text-emerald-800 mb-2">
                Ders Ortalaması = (Vize Notu × Vize Ağırlığı + Final Notu × Final Ağırlığı) ÷ 100
              </p>
              <p className="text-sm text-emerald-700">
                Örnek: (80×40 + 70×60) ÷ 100 = (3200 + 4200) ÷ 100 = 74
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaygın Ağırlık Dağılımları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Üniversitelerde kullanılan standart ağırlık dağılımları şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>%40 Vize - %60 Final:</strong> En yaygın kullanılan dağılım</li>
              <li><strong>%50 Vize - %50 Final:</strong> Eşit ağırlık dağılımı</li>
              <li><strong>%30 Vize - %70 Final:</strong> Final ağırlıklı sistem</li>
              <li><strong>%35 Vize - %65 Final:</strong> Alternatif dağılım</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Geçme Koşulları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Üniversite derslerinden geçmek için genellikle şu koşullar aranır:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Genel geçme notu:</strong> 60 ve üzeri (bazı üniversitelerde 50)</li>
                <li>• <strong>Final sınavına girme şartı:</strong> Vize notunun en az 30 olması</li>
                <li>• <strong>Devamsızlık sınırı:</strong> Derslerin %70'ine katılım</li>
                <li>• <strong>Ödev ve proje teslimi:</strong> Gerekli ödevlerin tamamlanması</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bütünleme Sınavı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bütünleme sınavı, final sınavında başarısız olan öğrenciler için verilen ikinci şanstır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Final notunun 40 ve üzeri olması durumunda bütünleme hakkı kazanılır</li>
              <li>Bütünleme sınavı final sınavı yerine geçer</li>
              <li>Bütünleme ağırlığı genellikle final ağırlığı ile aynıdır</li>
              <li>Vize notu sabit kalır, sadece final yerine bütünleme notu kullanılır</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hedef Not Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Vize notunuzu aldıktan sonra, hedeflediğiniz ortalamaya ulaşmak için final sınavından 
              kaç puan almanız gerektiğini hesaplayabilirsiniz:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Hedef Final Notu Formülü:</p>
              <p className="text-blue-800 mb-2">
                Gerekli Final Notu = (Hedef Ortalama × 100 - Vize Notu × Vize Ağırlığı) ÷ Final Ağırlığı
              </p>
              <p className="text-sm text-blue-700">
                Örnek: 70 ortalama için, vize 60 ise → (70×100 - 60×40) ÷ 60 = 76.67
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Başarı Stratejileri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Vize final sisteminde başarılı olmak için şu stratejileri uygulayabilirsiniz:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Vize Öncesi Hazırlık</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Derslere düzenli katılım sağlayın</li>
              <li>Haftalık ders notlarını gözden geçirin</li>
              <li>Ödevleri zamanında tamamlayın</li>
              <li>Anlamadığınız konuları hemen sorun</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Final Hazırlığı</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>Vize sonuçlarına göre eksiklerinizi belirleyin</li>
              <li>Hedef final notunuzu hesaplayın</li>
              <li>Zayıf olduğunuz konulara odaklanın</li>
              <li>Geçmiş sınav sorularını çözün</li>
              <li>Grup çalışması yapın</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sınav Teknikleri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Zaman yönetimi:</strong> Sınav süresini sorulara eşit dağıtın</li>
              <li><strong>Kolay sorulardan başlayın:</strong> Önce bildiğiniz soruları çözün</li>
              <li><strong>Kontrol edin:</strong> Cevaplarınızı gözden geçirmeye zaman ayırın</li>
              <li><strong>Sakin kalın:</strong> Stres yapmayın, odaklanın</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Detaylı bir hesaplama örneği:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Senaryo:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>Vize Notu: 75</li>
                <li>Final Notu: 80</li>
                <li>Vize Ağırlığı: %40</li>
                <li>Final Ağırlığı: %60</li>
              </ul>
              
              <h4 className="font-semibold text-gray-900 mb-2">Hesaplama:</h4>
              <p className="text-gray-700 mb-2">
                Vize Katkısı: 75 × 40 = 3000
              </p>
              <p className="text-gray-700 mb-2">
                Final Katkısı: 80 × 60 = 4800
              </p>
              <p className="text-gray-700 mb-2">
                Toplam: 3000 + 4800 = 7800
              </p>
              <p className="font-bold text-green-600 text-lg">
                Ders Ortalaması: 7800 ÷ 100 = 78 (Geçti)
              </p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-emerald-900 mb-2">💡 İpucu</h4>
              <p className="text-emerald-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı not senaryolarını deneyebilir, 
                hedef notlarınızı belirleyebilir ve sınav stratejinizi planlayabilirsiniz. 
                Vize notunuzu aldıktan sonra final için ne kadar çalışmanız gerektiğini 
                hesaplayarak daha etkili bir hazırlık yapabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Vize final sistemi, üniversite eğitiminin temel değerlendirme yöntemlerinden biridir. 
              Bu sistemi doğru anlayarak, stratejik bir yaklaşım sergileyebilir ve akademik 
              başarınızı artırabilirsiniz. Düzenli çalışma, doğru planlama ve etkili sınav 
              teknikleri ile hedeflediğiniz notlara ulaşabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default VizeFinalOrtalamaPage;