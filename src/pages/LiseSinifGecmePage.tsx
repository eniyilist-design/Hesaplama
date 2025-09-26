import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Target, BookOpen, Award, ArrowRight, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DersNotu {
  id: string;
  ad: string;
  not: number;
  kredi: number;
  zorunlu: boolean;
}

interface SinifGecmeSonuc {
  gecenDersSayisi: number;
  kalanDersSayisi: number;
  toplamDers: number;
  agirlikliOrtalama: number;
  sinifGecmeDurumu: boolean;
  eksikKoşullar: string[];
  basariDurumu: string;
}

const benzerAraclar = [
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Ortalama Hesaplama', icon: Calculator, link: '/egitim/lise-ortalama', active: true },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '/egitim/lise-mezuniyet-puani', active: true }
];

const LiseSinifGecmePage: React.FC = () => {
  const [dersler, setDersler] = useState<DersNotu[]>([
    { id: '1', ad: 'Türk Dili ve Edebiyatı', not: 0, kredi: 4, zorunlu: true },
    { id: '2', ad: 'Matematik', not: 0, kredi: 4, zorunlu: true },
    { id: '3', ad: 'Fizik', not: 0, kredi: 3, zorunlu: true },
    { id: '4', ad: 'Kimya', not: 0, kredi: 3, zorunlu: true },
    { id: '5', ad: 'Biyoloji', not: 0, kredi: 3, zorunlu: true },
    { id: '6', ad: 'Tarih', not: 0, kredi: 2, zorunlu: true },
    { id: '7', ad: 'Coğrafya', not: 0, kredi: 2, zorunlu: true },
    { id: '8', ad: 'İngilizce', not: 0, kredi: 3, zorunlu: true }
  ]);
  
  const [devamsizlik, setDevamsizlik] = useState<number>(0);
  const [disiplinCezasi, setDisiplinCezasi] = useState<boolean>(false);
  const [sonuc, setSonuc] = useState<SinifGecmeSonuc | null>(null);

  const hesapla = () => {
    let gecenDersSayisi = 0;
    let kalanDersSayisi = 0;
    let toplamKredi = 0;
    let agirlikliToplam = 0;
    const eksikKoşullar: string[] = [];

    dersler.forEach(ders => {
      if (ders.not >= 50) {
        gecenDersSayisi++;
        toplamKredi += ders.kredi;
        agirlikliToplam += ders.not * ders.kredi;
      } else if (ders.not > 0) {
        kalanDersSayisi++;
        if (ders.zorunlu) {
          eksikKoşullar.push(`${ders.ad} dersinden geçmelisiniz (Not: ${ders.not})`);
        }
      }
    });

    const agirlikliOrtalama = toplamKredi > 0 ? agirlikliToplam / toplamKredi : 0;

    // Sınıf geçme koşulları kontrolü
    if (devamsizlik > 20) {
      eksikKoşullar.push('Devamsızlık %20\'yi aşmamalı');
    }
    
    if (disiplinCezasi) {
      eksikKoşullar.push('Disiplin cezası bulunmamalı');
    }

    // Zorunlu derslerin tamamından geçme kontrolü
    const zorunluDersler = dersler.filter(d => d.zorunlu);
    const gecenZorunluDersler = zorunluDersler.filter(d => d.not >= 50);
    
    if (gecenZorunluDersler.length < zorunluDersler.length) {
      eksikKoşullar.push('Tüm zorunlu derslerden geçmelisiniz');
    }

    // Genel ortalama kontrolü
    if (agirlikliOrtalama < 50) {
      eksikKoşullar.push('Genel ortalamanız en az 50 olmalı');
    }

    const sinifGecmeDurumu = eksikKoşullar.length === 0;
    
    let basariDurumu = '';
    if (sinifGecmeDurumu) {
      if (agirlikliOrtalama >= 85) basariDurumu = 'Pekiyi ile Geçti';
      else if (agirlikliOrtalama >= 70) basariDurumu = 'İyi ile Geçti';
      else if (agirlikliOrtalama >= 60) basariDurumu = 'Orta ile Geçti';
      else basariDurumu = 'Geçer Not ile Geçti';
    } else {
      basariDurumu = 'Sınıf Tekrarı';
    }

    setSonuc({
      gecenDersSayisi,
      kalanDersSayisi,
      toplamDers: dersler.length,
      agirlikliOrtalama,
      sinifGecmeDurumu,
      eksikKoşullar,
      basariDurumu
    });
  };

  useEffect(() => {
    hesapla();
  }, [dersler, devamsizlik, disiplinCezasi]);

  const dersGuncelle = (id: string, field: keyof DersNotu, value: any) => {
    setDersler(prev => prev.map(ders => 
      ders.id === id ? { ...ders, [field]: value } : ders
    ));
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-pink-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-pink-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Lise Sınıf Geçme Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Lise Sınıf Geçme Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ders notlarınız ve diğer kriterlere göre sınıf geçme durumunuzu kontrol edin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ders Notları */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-pink-600" />
                Ders Notları
              </h2>
              
              <div className="space-y-4">
                {dersler.map((ders) => (
                  <div key={ders.id} className="bg-pink-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {ders.ad}
                        </label>
                        {ders.zorunlu && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Zorunlu
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Not (0-100)
                        </label>
                        <input
                          type="number"
                          value={ders.not}
                          onChange={(e) => dersGuncelle(ders.id, 'not', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durum
                        </label>
                        <div className={`text-sm font-medium ${
                          ders.not >= 50 ? 'text-green-600' : ders.not > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          {ders.not >= 50 ? 'Geçti' : ders.not > 0 ? 'Kaldı' : 'Girilmedi'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diğer Kriterler */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-3 text-pink-600" />
                Diğer Kriterler
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devamsızlık Oranı (%)
                  </label>
                  <input
                    type="number"
                    value={devamsizlik}
                    onChange={(e) => setDevamsizlik(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Maksimum %20 olmalı
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disiplin Cezası
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="disiplin"
                        checked={!disiplinCezasi}
                        onChange={() => setDisiplinCezasi(false)}
                        className="mr-2"
                      />
                      Yok
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="disiplin"
                        checked={disiplinCezasi}
                        onChange={() => setDisiplinCezasi(true)}
                        className="mr-2"
                      />
                      Var
                    </label>
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
                  {sonuc.sinifGecmeDurumu ? (
                    <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 mr-3 text-red-600" />
                  )}
                  Sınıf Geçme Durumu
                </h2>
                
                <div className="space-y-4">
                  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.sinifGecmeDurumu ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="text-sm text-gray-600 mb-1">Genel Durum</div>
                    <div className={`text-2xl font-bold ${
                      sonuc.sinifGecmeDurumu ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sonuc.sinifGecmeDurumu ? 'SINIF GEÇTİ' : 'SINIF TEKRARI'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.basariDurumu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ağırlıklı Ortalama</div>
                    <div className="text-xl font-bold text-pink-600">
                      {sonuc.agirlikliOrtalama.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Ders Durumu</div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Geçen:</span>
                        <span className="font-bold text-green-600">{sonuc.gecenDersSayisi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kalan:</span>
                        <span className="font-bold text-red-600">{sonuc.kalanDersSayisi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Toplam:</span>
                        <span className="font-bold">{sonuc.toplamDers}</span>
                      </div>
                    </div>
                  </div>

                  {sonuc.eksikKoşullar.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-red-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Eksik Koşullar
                      </div>
                      <ul className="text-xs text-red-700 space-y-1">
                        {sonuc.eksikKoşullar.map((koşul, index) => (
                          <li key={index}>• {koşul}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sınıf Geçme Kriterleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lise Sınıf Geçme Kriterleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zorunlu Koşullar</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Tüm zorunlu derslerden en az 50 almak</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Genel ortalamanın en az 50 olması</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Devamsızlık oranının %20'yi geçmemesi</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Disiplin cezası bulunmaması</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Başarı Dereceleri</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span className="font-medium">Pekiyi</span>
                  <span>85-100</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">İyi</span>
                  <span>70-84</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="font-medium">Orta</span>
                  <span>60-69</span>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 rounded">
                  <span className="font-medium">Geçer</span>
                  <span>50-59</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded">
                  <span className="font-medium">Sınıf Tekrarı</span>
                  <span>0-49</span>
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
                <Link key={index} to={arac.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl flex items-center justify-center mb-4">
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
              Lise Sınıf Geçme Koşulları Nelerdir? Detaylı Rehber
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lise Sınıf Geçme Sistemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de lise eğitiminde sınıf geçme sistemi, öğrencilerin akademik başarısını ve diğer kriterleri 
              değerlendirerek bir üst sınıfa geçme hakkı kazanıp kazanmadığını belirleyen sistemdir. Bu sistem, 
              Milli Eğitim Bakanlığı tarafından belirlenen standartlara göre uygulanır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Temel Sınıf Geçme Koşulları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Lise öğrencilerinin sınıf geçebilmeleri için aşağıdaki koşulların tamamını sağlaması gerekir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Akademik Başarı:</strong> Tüm zorunlu derslerden en az 50 puan almak</li>
              <li><strong>Genel Ortalama:</strong> Yıllık genel ortalamanın en az 50 olması</li>
              <li><strong>Devamsızlık:</strong> Devamsızlık oranının %20'yi geçmemesi</li>
              <li><strong>Disiplin:</strong> Okul disiplin kurulundan ceza almamış olmak</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ders Başarı Değerlendirmesi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Her dersten geçme notu 50'dir. Ancak bazı dersler zorunlu kabul edilir ve bu derslerden 
              mutlaka geçmek gerekir:
            </p>
            <div className="bg-pink-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-pink-900 mb-3">Zorunlu Dersler:</h4>
              <ul className="space-y-1 text-pink-800">
                <li>• Türk Dili ve Edebiyatı</li>
                <li>• Matematik</li>
                <li>• Fen Bilimleri (Fizik, Kimya, Biyoloji)</li>
                <li>• Sosyal Bilimler (Tarih, Coğrafya)</li>
                <li>• Yabancı Dil</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Devamsızlık Kuralları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Devamsızlık hesaplaması, öğrencinin toplam ders saatine göre yapılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Maksimum devamsızlık oranı %20'dir</li>
              <li>Bu oranı aşan öğrenciler sınıf tekrarı yapar</li>
              <li>Mazeret devamsızlığı ayrı değerlendirilir</li>
              <li>Sağlık raporu ile mazeret gösterilebilir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sınıf Tekrarı Durumları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Aşağıdaki durumlardan herhangi biri gerçekleşirse öğrenci sınıf tekrarı yapar:
            </p>
            <div className="bg-red-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-red-800">
                <li>• Zorunlu derslerden birinden kalma</li>
                <li>• Genel ortalamanın 50'nin altında olması</li>
                <li>• Devamsızlık oranının %20'yi aşması</li>
                <li>• Disiplin cezası alma</li>
                <li>• Sınav katılım şartlarını sağlayamama</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Başarı Dereceleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sınıf geçen öğrencilerin başarı dereceleri şu şekilde belirlenir:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Başarı Seviyeleri</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>85-100: Pekiyi ile geçti</li>
                  <li>70-84: İyi ile geçti</li>
                  <li>60-69: Orta ile geçti</li>
                  <li>50-59: Geçer not ile geçti</li>
                  <li>0-49: Sınıf tekrarı</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Ek Değerlendirmeler</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Takdir belgesi: 85+ ortalama</li>
                  <li>• Teşekkür belgesi: 70+ ortalama</li>
                  <li>• Devamsızlık uyarısı</li>
                  <li>• Akademik destek önerisi</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Özel Durumlar</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Nakil öğrencileri:</strong> Önceki okul notları dikkate alınır</li>
              <li><strong>Yurtdışından gelenler:</strong> Denklik işlemleri yapılır</li>
              <li><strong>Sağlık sorunları:</strong> Özel değerlendirme yapılabilir</li>
              <li><strong>Spor ve sanat:</strong> Ek kriterler uygulanabilir</li>
            </ul>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-pink-900 mb-2">💡 İpucu</h4>
              <p className="text-pink-800">
                Yukarıdaki hesaplama aracımızı kullanarak mevcut durumunuzu değerlendirebilir ve 
                sınıf geçmek için hangi derslerde daha fazla çalışmanız gerektiğini belirleyebilirsiniz. 
                Erken tespit, başarı için çok önemlidir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Lise sınıf geçme sistemi, öğrencilerin hem akademik hem de sosyal gelişimini destekleyen 
              kapsamlı bir değerlendirme sistemidir. Bu kriterleri anlayarak, akademik hedeflerinizi 
              belirleyebilir ve başarılı bir lise hayatı geçirebilirsiniz. Düzenli çalışma, devam 
              ve disiplin ile tüm koşulları sağlamak mümkündür.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default LiseSinifGecmePage;