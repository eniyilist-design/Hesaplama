import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Calendar, BookOpen, Award, ArrowRight, Info, Baby, School, AlertCircle } from 'lucide-react';

interface YasHesaplamaSonuc {
  dogumTarihi: Date;
  okulBaslamaTarihi: Date;
  yasYil: number;
  yasAy: number;
  yasGun: number;
  toplamGun: number;
  okulBaslayabilirMi: boolean;
  onerilenBaslamaTarihi: Date;
  uyariMesaji: string;
  sinifSeviyesi: string;
}

const benzerAraclar = [
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Ortalama Hesaplama', icon: Calculator, link: '/egitim/lise-ortalama', active: true },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '/egitim/lise-mezuniyet-puani', active: true }
];

const OkulaBaslamaYasiPage: React.FC = () => {
  const [dogumTarihi, setDogumTarihi] = useState<string>('');
  const [okulTuru, setOkulTuru] = useState<string>('ilkokul');
  const [okulBaslamaTarihi, setOkulBaslamaTarihi] = useState<string>('2024-09-16'); // Eylül ayının 3. pazartesi
  const [sonuc, setSonuc] = useState<YasHesaplamaSonuc | null>(null);

  const hesapla = () => {
    if (!dogumTarihi) {
      setSonuc(null);
      return;
    }

    const dogum = new Date(dogumTarihi);
    const okulBaslama = new Date(okulBaslamaTarihi);
    
    // Yaş hesaplama
    let yasYil = okulBaslama.getFullYear() - dogum.getFullYear();
    let yasAy = okulBaslama.getMonth() - dogum.getMonth();
    let yasGun = okulBaslama.getDate() - dogum.getDate();

    if (yasGun < 0) {
      yasAy--;
      const oncekiAyinSonGunu = new Date(okulBaslama.getFullYear(), okulBaslama.getMonth(), 0).getDate();
      yasGun += oncekiAyinSonGunu;
    }

    if (yasAy < 0) {
      yasYil--;
      yasAy += 12;
    }

    // Toplam gün hesaplama
    const toplamGun = Math.floor((okulBaslama.getTime() - dogum.getTime()) / (1000 * 60 * 60 * 24));

    // Okul türüne göre yaş kriterleri
    let minYasYil = 6;
    let maxYasYil = 7;
    let sinifSeviyesi = '1. Sınıf';
    
    switch (okulTuru) {
      case 'anaokulu':
        minYasYil = 3;
        maxYasYil = 6;
        sinifSeviyesi = 'Anaokulu';
        break;
      case 'anasınıfı':
        minYasYil = 5;
        maxYasYil = 6;
        sinifSeviyesi = 'Anasınıfı';
        break;
      case 'ilkokul':
        minYasYil = 6;
        maxYasYil = 7;
        sinifSeviyesi = '1. Sınıf';
        break;
      case 'ortaokul':
        minYasYil = 10;
        maxYasYil = 11;
        sinifSeviyesi = '5. Sınıf';
        break;
      case 'lise':
        minYasYil = 14;
        maxYasYil = 15;
        sinifSeviyesi = '9. Sınıf';
        break;
    }

    // Okula başlayabilir mi kontrolü
    let okulBaslayabilirMi = false;
    let uyariMesaji = '';
    let onerilenBaslamaTarihi = new Date(okulBaslama);

    if (yasYil < minYasYil || (yasYil === minYasYil && yasAy < 9)) {
      uyariMesaji = `Çocuğunuz henüz ${okulTuru} için uygun yaşta değil. En az ${minYasYil} yaşında olmalı.`;
      onerilenBaslamaTarihi = new Date(dogum.getFullYear() + minYasYil, 8, 15); // Eylül ayı
    } else if (yasYil > maxYasYil) {
      uyariMesaji = `Çocuğunuz ${okulTuru} için geç kalmış olabilir. Özel durumlar için okul yönetimi ile görüşün.`;
      okulBaslayabilirMi = true;
    } else {
      okulBaslayabilirMi = true;
      uyariMesaji = `Çocuğunuz ${okulTuru} için uygun yaşta. Okula başlayabilir.`;
    }

    setSonuc({
      dogumTarihi: dogum,
      okulBaslamaTarihi: okulBaslama,
      yasYil,
      yasAy,
      yasGun,
      toplamGun,
      okulBaslayabilirMi,
      onerilenBaslamaTarihi,
      uyariMesaji,
      sinifSeviyesi
    });
  };

  useEffect(() => {
    hesapla();
  }, [dogumTarihi, okulTuru, okulBaslamaTarihi]);

  const formatTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-teal-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-teal-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Okula Başlama Yaşı Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Okula Başlama Yaşı Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Çocuğunuzun doğum tarihine göre okula başlama yaşını hesaplayın ve uygun eğitim seviyesini belirleyin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Baby className="h-6 w-6 mr-3 text-teal-600" />
                Çocuk Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Çocuğunuzun Doğum Tarihi
                  </label>
                  <input
                    type="date"
                    value={dogumTarihi}
                    onChange={(e) => setDogumTarihi(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-medium"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Okul Türü
                  </label>
                  <select
                    value={okulTuru}
                    onChange={(e) => setOkulTuru(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-medium"
                  >
                    <option value="anaokulu">Anaokulu (3-6 yaş)</option>
                    <option value="anasınıfı">Anasınıfı (5-6 yaş)</option>
                    <option value="ilkokul">İlkokul 1. Sınıf (6-7 yaş)</option>
                    <option value="ortaokul">Ortaokul 5. Sınıf (10-11 yaş)</option>
                    <option value="lise">Lise 9. Sınıf (14-15 yaş)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Okula Başlama Tarihi
                  </label>
                  <input
                    type="date"
                    value={okulBaslamaTarihi}
                    onChange={(e) => setOkulBaslamaTarihi(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-medium"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Genellikle Eylül ayının 3. pazartesi günü
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <School className="h-6 w-6 mr-3 text-teal-600" />
                  Yaş Hesaplama Sonucu
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Çocuğunuzun Yaşı</div>
                    <div className="text-2xl font-bold text-teal-600">
                      {sonuc.yasYil} yıl {sonuc.yasAy} ay {sonuc.yasGun} gün
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Toplam {sonuc.toplamGun} gün
                    </div>
                  </div>

                  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.okulBaslayabilirMi ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="text-sm text-gray-600 mb-1">Okula Başlama Durumu</div>
                    <div className={`text-lg font-bold ${
                      sonuc.okulBaslayabilirMi ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sonuc.okulBaslayabilirMi ? 'BAŞLAYABİLİR' : 'HENÜZ ERKEN'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Hedef Sınıf</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.sinifSeviyesi}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Okul Başlama Tarihi</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatTarih(sonuc.okulBaslamaTarihi)}
                    </div>
                  </div>

                  {!sonuc.okulBaslayabilirMi && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-1">Önerilen Başlama Tarihi</div>
                      <div className="text-sm font-medium text-orange-600">
                        {formatTarih(sonuc.onerilenBaslamaTarihi)}
                      </div>
                    </div>
                  )}

                  <div className={`rounded-xl p-4 shadow-sm ${
                    sonuc.okulBaslayabilirMi ? 'bg-green-50' : 'bg-orange-50'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        sonuc.okulBaslayabilirMi ? 'text-green-600' : 'text-orange-600'
                      }`} />
                      <div className={`text-sm ${
                        sonuc.okulBaslayabilirMi ? 'text-green-800' : 'text-orange-800'
                      }`}>
                        {sonuc.uyariMesaji}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Yaş Kriterleri Tablosu */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Türkiye Eğitim Sistemi Yaş Kriterleri</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Eğitim Seviyesi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Yaş Aralığı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sınıf</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Anaokulu</td>
                  <td className="px-6 py-4 text-sm text-gray-700">3-6 yaş</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Küçük, Orta, Büyük Grup</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Zorunlu değil, gelişim odaklı</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Anasınıfı</td>
                  <td className="px-6 py-4 text-sm text-gray-700">5-6 yaş</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Anasınıfı</td>
                  <td className="px-6 py-4 text-sm text-gray-700">İlkokula hazırlık</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">İlkokul</td>
                  <td className="px-6 py-4 text-sm text-gray-700">6-10 yaş</td>
                  <td className="px-6 py-4 text-sm text-gray-700">1-4. Sınıf</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Zorunlu temel eğitim</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Ortaokul</td>
                  <td className="px-6 py-4 text-sm text-gray-700">10-14 yaş</td>
                  <td className="px-6 py-4 text-sm text-gray-700">5-8. Sınıf</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Zorunlu temel eğitim</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Lise</td>
                  <td className="px-6 py-4 text-sm text-gray-700">14-18 yaş</td>
                  <td className="px-6 py-4 text-sm text-gray-700">9-12. Sınıf</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Zorunlu ortaöğretim</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Önemli Bilgiler */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Okula Başlama ile İlgili Önemli Bilgiler</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yasal Düzenlemeler</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>İlkokula başlama yaşı 6-7 yaş arasındadır</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Eylül ayında 6 yaşını doldurmuş olmalı</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Özel durumlar için okul yönetimi ile görüşülmeli</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Gelişim raporu gerekebilir</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hazırlık Önerileri</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Sosyal beceriler geliştirilmeli</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Temel motor beceriler desteklenmeli</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Okul öncesi eğitim alması faydalı</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Çocuğun hazır olup olmadığı değerlendirilmeli</span>
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
                <Link key={index} to={arac.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
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
              Çocuğum Okula Başlamaya Hazır mı? Yaş Hesaplama Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Okula Başlama Yaşı Neden Önemli?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Çocuğunuzun okula başlama yaşı, akademik başarısı ve sosyal gelişimi açısından kritik öneme sahiptir. 
              Türkiye'de Milli Eğitim Bakanlığı tarafından belirlenen yaş kriterleri, çocukların gelişim seviyelerine 
              uygun eğitim almasını sağlamak için oluşturulmuştur.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Türkiye'de Okula Başlama Yaş Kriterleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye eğitim sisteminde her eğitim kademesi için belirli yaş aralıkları tanımlanmıştır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Anaokulu:</strong> 3-6 yaş arası (zorunlu değil)</li>
              <li><strong>Anasınıfı:</strong> 5-6 yaş arası (ilkokula hazırlık)</li>
              <li><strong>İlkokul:</strong> 6-7 yaş arası (zorunlu eğitim başlangıcı)</li>
              <li><strong>Ortaokul:</strong> 10-11 yaş arası (5. sınıf)</li>
              <li><strong>Lise:</strong> 14-15 yaş arası (9. sınıf)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">İlkokula Başlama Kriterleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İlkokul 1. sınıfa başlama için temel kriterler şunlardır:
            </p>
            <div className="bg-teal-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-teal-800">
                <li>• Eylül ayında 6 yaşını doldurmuş olmak</li>
                <li>• Fiziksel ve zihinsel gelişim açısından hazır olmak</li>
                <li>• Temel sosyal becerilere sahip olmak</li>
                <li>• Okul öncesi eğitim almış olmak (önerilen)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Çocuğunuz Okula Hazır mı? Kontrol Listesi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yaş kriterlerinin yanında, çocuğunuzun okula hazır olup olmadığını değerlendirmek için 
              aşağıdaki becerileri kontrol edebilirsiniz:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Fiziksel Hazırlık</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>Kalem tutabilme ve basit çizgiler çizebilme</li>
              <li>Makasla kağıt kesebilme</li>
              <li>Kendi başına tuvalete gidebilme</li>
              <li>6-8 saat boyunca uyanık kalabilme</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Sosyal ve Duygusal Hazırlık</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>Diğer çocuklarla oyun oynayabilme</li>
              <li>Yetişkinlerle iletişim kurabilme</li>
              <li>Basit kuralları anlayıp uygulayabilme</li>
              <li>Aileden ayrı kalabilme</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Bilişsel Hazırlık</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>10'a kadar sayabilme</li>
              <li>Temel renkleri bilme</li>
              <li>Kendi adını yazabilme</li>
              <li>Basit talimatları anlayıp uygulayabilme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Erken veya Geç Başlama Durumları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bazı özel durumlarda çocuklar standart yaş kriterlerinin dışında okula başlayabilir:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Erken Başlama (5.5-6 yaş)</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Çocuğun gelişim düzeyi yaşından ileri ise</li>
              <li>Uzman raporu ile desteklenirse</li>
              <li>Okul yönetimi onayı alınırsa</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Geç Başlama (7+ yaş)</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>Gelişimsel gecikme durumunda</li>
              <li>Sağlık sorunları nedeniyle</li>
              <li>Aile tercihi ile (sınırlı durumlarda)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Okula Başlama Süreci</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Çocuğunuzun okula başlama süreci şu adımları içerir:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>Yaş kontrolü:</strong> Doğum tarihi ile yaş hesaplaması</li>
                <li><strong>Okul seçimi:</strong> Bölgedeki okulları araştırma</li>
                <li><strong>Kayıt işlemleri:</strong> Gerekli belgelerin hazırlanması</li>
                <li><strong>Uyum süreci:</strong> Okula alışma dönemi</li>
                <li><strong>Takip:</strong> Çocuğun gelişiminin izlenmesi</li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Gerekli Belgeler</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Okul kaydı için genellikle şu belgeler gereklidir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Nüfus cüzdanı fotokopisi</li>
              <li>Doğum belgesi</li>
              <li>İkametgah belgesi</li>
              <li>Sağlık raporu</li>
              <li>Aşı kartı</li>
              <li>Fotoğraflar</li>
            </ul>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-teal-900 mb-2">💡 İpucu</h4>
              <p className="text-teal-800">
                Yukarıdaki hesaplama aracımızı kullanarak çocuğunuzun okula başlama yaşını hesaplayabilir 
                ve uygun eğitim seviyesini belirleyebilirsiniz. Çocuğunuzun bireysel gelişim özelliklerini 
                de dikkate alarak karar vermeniz önemlidir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Çocuğunuzun okula başlama yaşı, eğitim hayatının temelini oluşturan kritik bir karardır. 
              Yasal kriterler kadar çocuğunuzun bireysel gelişim özelliklerini de göz önünde bulundurarak, 
              en uygun zamanı belirlemeniz önemlidir. Uzman görüşü almaktan çekinmeyin ve çocuğunuzun 
              okula hazır olduğundan emin olduktan sonra bu önemli adımı atın.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default OkulaBaslamaYasiPage;