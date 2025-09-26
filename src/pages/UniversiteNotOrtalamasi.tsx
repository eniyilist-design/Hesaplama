import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CaseSensitive as University, BookOpen, Award, ArrowRight, Info, Plus, Trash2, TrendingUp } from 'lucide-react';

interface Ders {
  id: string;
  ad: string;
  kredi: number;
  not: number;
  harfNotu: string;
  puanKatsayisi: number;
}

interface UniversiteSonuc {
  gno: number; // Genel Not Ortalaması
  agno: number; // Ağırlıklı Genel Not Ortalaması
  toplamKredi: number;
  alinanKredi: number;
  basariDurumu: string;
  mezuniyetDurumu: boolean;
  onurListesi: boolean;
}

const benzerAraclar = [
  { name: 'Vize Final Ortalama', icon: BookOpen, link: '/egitim/vize-final-ortalama', active: true },
  { name: 'Lise Ortalama Hesaplama', icon: Calculator, link: '/egitim/lise-ortalama', active: true },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '/egitim/lise-mezuniyet-puani', active: true }
];

const harfNotlari = [
  { harf: 'AA', puan: 4.0, aciklama: 'Pekiyi' },
  { harf: 'BA', puan: 3.5, aciklama: 'İyi' },
  { harf: 'BB', puan: 3.0, aciklama: 'Orta' },
  { harf: 'CB', puan: 2.5, aciklama: 'Geçer' },
  { harf: 'CC', puan: 2.0, aciklama: 'Şartlı Geçer' },
  { harf: 'DC', puan: 1.5, aciklama: 'Zayıf' },
  { harf: 'DD', puan: 1.0, aciklama: 'Çok Zayıf' },
  { harf: 'FF', puan: 0.0, aciklama: 'Başarısız' }
];

const UniversiteNotOrtalamasi: React.FC = () => {
  const [dersler, setDersler] = useState<Ders[]>([
    { id: '1', ad: 'Matematik I', kredi: 4, not: 0, harfNotu: 'FF', puanKatsayisi: 0.0 },
    { id: '2', ad: 'Fizik I', kredi: 3, not: 0, harfNotu: 'FF', puanKatsayisi: 0.0 },
    { id: '3', ad: 'Türk Dili', kredi: 2, not: 0, harfNotu: 'FF', puanKatsayisi: 0.0 },
    { id: '4', ad: 'İngilizce', kredi: 3, not: 0, harfNotu: 'FF', puanKatsayisi: 0.0 }
  ]);
  
  const [sonuc, setSonuc] = useState<UniversiteSonuc | null>(null);

  const notToHarf = (not: number): { harf: string, puan: number } => {
    if (not >= 90) return { harf: 'AA', puan: 4.0 };
    if (not >= 85) return { harf: 'BA', puan: 3.5 };
    if (not >= 75) return { harf: 'BB', puan: 3.0 };
    if (not >= 65) return { harf: 'CB', puan: 2.5 };
    if (not >= 55) return { harf: 'CC', puan: 2.0 };
    if (not >= 50) return { harf: 'DC', puan: 1.5 };
    if (not >= 45) return { harf: 'DD', puan: 1.0 };
    return { harf: 'FF', puan: 0.0 };
  };

  const hesapla = () => {
    let toplamKredi = 0;
    let alinanKredi = 0;
    let toplamPuan = 0;
    let agirlikliToplam = 0;

    dersler.forEach(ders => {
      toplamKredi += ders.kredi;
      
      if (ders.puanKatsayisi >= 2.0) { // CC ve üzeri notlar
        alinanKredi += ders.kredi;
      }
      
      toplamPuan += ders.puanKatsayisi * ders.kredi;
      agirlikliToplam += ders.puanKatsayisi * ders.kredi;
    });

    const gno = toplamKredi > 0 ? toplamPuan / toplamKredi : 0;
    const agno = alinanKredi > 0 ? agirlikliToplam / alinanKredi : 0;

    let basariDurumu = '';
    if (gno >= 3.5) basariDurumu = 'Yüksek Onur';
    else if (gno >= 3.0) basariDurumu = 'Onur';
    else if (gno >= 2.5) basariDurumu = 'İyi';
    else if (gno >= 2.0) basariDurumu = 'Orta';
    else basariDurumu = 'Düşük';

    const mezuniyetDurumu = gno >= 2.0;
    const onurListesi = gno >= 3.0;

    setSonuc({
      gno,
      agno,
      toplamKredi,
      alinanKredi,
      basariDurumu,
      mezuniyetDurumu,
      onurListesi
    });
  };

  useEffect(() => {
    hesapla();
  }, [dersler]);

  const dersGuncelle = (id: string, field: keyof Ders, value: any) => {
    setDersler(prev => prev.map(ders => {
      if (ders.id === id) {
        const yeniDers = { ...ders, [field]: value };
        
        // Not değiştiğinde harf notunu otomatik güncelle
        if (field === 'not') {
          const harfBilgi = notToHarf(value);
          yeniDers.harfNotu = harfBilgi.harf;
          yeniDers.puanKatsayisi = harfBilgi.puan;
        }
        
        // Harf notu değiştiğinde puan katsayısını güncelle
        if (field === 'harfNotu') {
          const harfBilgi = harfNotlari.find(h => h.harf === value);
          if (harfBilgi) {
            yeniDers.puanKatsayisi = harfBilgi.puan;
          }
        }
        
        return yeniDers;
      }
      return ders;
    }));
  };

  const dersEkle = () => {
    const yeniId = (dersler.length + 1).toString();
    setDersler(prev => [...prev, {
      id: yeniId,
      ad: `Ders ${dersler.length + 1}`,
      kredi: 3,
      not: 0,
      harfNotu: 'FF',
      puanKatsayisi: 0.0
    }]);
  };

  const dersSil = (id: string) => {
    if (dersler.length > 1) {
      setDersler(prev => prev.filter(ders => ders.id !== id));
    }
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-cyan-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/egitim" className="hover:text-cyan-600 transition-colors">Eğitim</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Üniversite Not Ortalaması</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Üniversite Not Ortalaması Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Üniversite derslerinizin GNO (Genel Not Ortalaması) ve AGNO hesaplamasını yapın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-cyan-600" />
                  Ders Listesi
                </h2>
                <button
                  onClick={dersEkle}
                  className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ders Ekle</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {dersler.map((ders) => (
                  <div key={ders.id} className="bg-cyan-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ders Adı
                        </label>
                        <input
                          type="text"
                          value={ders.ad}
                          onChange={(e) => dersGuncelle(ders.id, 'ad', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          min="1"
                          max="8"
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harf Notu
                        </label>
                        <select
                          value={ders.harfNotu}
                          onChange={(e) => dersGuncelle(ders.id, 'harfNotu', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          {harfNotlari.map(harf => (
                            <option key={harf.harf} value={harf.harf}>
                              {harf.harf} ({harf.puan})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-center">
                        {dersler.length > 1 && (
                          <button
                            onClick={() => dersSil(ders.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Puan Katsayısı: {ders.puanKatsayisi.toFixed(1)} | 
                      Durum: {ders.puanKatsayisi >= 2.0 ? 
                        <span className="text-green-600 font-medium">Geçti</span> : 
                        <span className="text-red-600 font-medium">Kaldı</span>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-cyan-50 rounded-xl">
                <div className="flex items-center text-cyan-800">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    Geçme notu: CC (2.0) ve üzeri. Harf notları otomatik olarak sayısal nottan hesaplanır.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <University className="h-6 w-6 mr-3 text-cyan-600" />
                  Ortalama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">GNO (Genel Not Ortalaması)</div>
                    <div className="text-3xl font-bold text-cyan-600">
                      {sonuc.gno.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      4.0 üzerinden
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">AGNO (Ağırlıklı GNO)</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.agno.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Başarı Durumu</div>
                    <div className={`text-lg font-bold ${
                      sonuc.basariDurumu === 'Yüksek Onur' ? 'text-yellow-600' :
                      sonuc.basariDurumu === 'Onur' ? 'text-green-600' :
                      sonuc.basariDurumu === 'İyi' ? 'text-blue-600' :
                      sonuc.basariDurumu === 'Orta' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {sonuc.basariDurumu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Kredi Durumu</div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Alınan:</span>
                        <span className="font-bold text-green-600">{sonuc.alinanKredi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Toplam:</span>
                        <span className="font-bold">{sonuc.toplamKredi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Başarı:</span>
                        <span className="font-bold">
                          %{((sonuc.alinanKredi / sonuc.toplamKredi) * 100).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                    sonuc.mezuniyetDurumu ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="text-sm text-gray-600 mb-1">Mezuniyet Durumu</div>
                    <div className={`text-lg font-bold ${
                      sonuc.mezuniyetDurumu ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sonuc.mezuniyetDurumu ? 'MEZUNİYET HAKKı VAR' : 'MEZUNİYET HAKKı YOK'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Minimum GNO: 2.0
                    </div>
                  </div>

                  {sonuc.onurListesi && (
                    <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                      <div className="text-sm text-yellow-800 mb-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Onur Listesi
                      </div>
                      <div className="text-sm text-yellow-700">
                        {sonuc.gno >= 3.5 ? 'Yüksek Onur Listesi' : 'Onur Listesi'} için uygun
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Harf Notu Sistemi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Üniversite Harf Notu Sistemi</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Harf Notları ve Puan Karşılıkları</h3>
              <div className="space-y-2">
                {harfNotlari.map(harf => (
                  <div key={harf.harf} className={`flex justify-between items-center p-3 rounded-lg ${
                    harf.puan >= 3.5 ? 'bg-green-50' :
                    harf.puan >= 2.0 ? 'bg-blue-50' :
                    harf.puan >= 1.0 ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <span className="font-bold">{harf.harf}</span>
                    <span className="font-medium">{harf.puan.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">{harf.aciklama}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GNO Hesaplama</h3>
              <div className="bg-cyan-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>GNO Formülü:</strong>
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  GNO = Σ(Puan Katsayısı × Kredi) / Σ(Kredi)
                </p>
                <p className="text-xs text-gray-600">
                  Tüm dersler hesaplamaya dahil edilir
                </p>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">Başarı Kriterleri</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Geçme notu: CC (2.0) ve üzeri</li>
                <li>• Mezuniyet için minimum GNO: 2.0</li>
                <li>• Onur listesi için minimum GNO: 3.0</li>
                <li>• Yüksek onur için minimum GNO: 3.5</li>
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
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
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
              Üniversite GNO Nasıl Hesaplanır? Detaylı Rehber
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GNO (Genel Not Ortalaması) Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Genel Not Ortalaması (GNO), üniversite öğrencilerinin akademik başarısını ölçen temel göstergedir. 
              Türkiye'deki üniversitelerde 4.0 üzerinden hesaplanan bu sistem, öğrencinin aldığı tüm derslerin 
              harf notlarını ve kredi değerlerini dikkate alarak ağırlıklı bir ortalama hesaplar.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GNO Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              GNO hesaplaması şu formül ile yapılır:
            </p>
            <div className="bg-cyan-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-cyan-900 mb-2">GNO Formülü:</p>
              <p className="text-cyan-800 mb-2">GNO = Σ(Puan Katsayısı × Kredi) / Σ(Kredi)</p>
              <p className="text-sm text-cyan-700">
                Burada puan katsayısı, harf notunun sayısal karşılığıdır (AA=4.0, BA=3.5, vb.)
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Harf Notu Sistemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'deki üniversitelerde kullanılan standart harf notu sistemi şu şekildedir:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Başarılı Notlar</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>AA (4.0): 90-100 - Pekiyi</li>
                  <li>BA (3.5): 85-89 - İyi</li>
                  <li>BB (3.0): 75-84 - Orta</li>
                  <li>CB (2.5): 65-74 - Geçer</li>
                  <li>CC (2.0): 55-64 - Şartlı Geçer</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Başarısız Notlar</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>DC (1.5): 50-54 - Zayıf</li>
                  <li>DD (1.0): 45-49 - Çok Zayıf</li>
                  <li>FF (0.0): 0-44 - Başarısız</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GNO ve AGNO Arasındaki Fark</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Üniversitelerde iki farklı ortalama türü kullanılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>GNO (Genel Not Ortalaması):</strong> Tüm derslerin dahil edildiği ortalama</li>
              <li><strong>AGNO (Ağırlıklı Genel Not Ortalaması):</strong> Sadece geçilen derslerin dahil edildiği ortalama</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bir öğrencinin aldığı dersler şu şekilde olsun:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Ders Listesi:</h4>
              <ul className="space-y-1 text-blue-800 mb-4">
                <li>Matematik I: 4 kredi, BA (3.5 puan) = 4 × 3.5 = 14</li>
                <li>Fizik I: 3 kredi, BB (3.0 puan) = 3 × 3.0 = 9</li>
                <li>Türk Dili: 2 kredi, AA (4.0 puan) = 2 × 4.0 = 8</li>
                <li>İngilizce: 3 kredi, CB (2.5 puan) = 3 × 2.5 = 7.5</li>
              </ul>
              <p className="font-semibold text-blue-900">
                Toplam Puan: 14 + 9 + 8 + 7.5 = 38.5
              </p>
              <p className="font-semibold text-blue-900">
                Toplam Kredi: 4 + 3 + 2 + 3 = 12
              </p>
              <p className="font-bold text-green-600 text-lg">
                GNO: 38.5 ÷ 12 = 3.21
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GNO'nun Önemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              GNO, üniversite hayatında birçok açıdan kritik öneme sahiptir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Mezuniyet:</strong> Minimum 2.0 GNO gereklidir</li>
              <li><strong>Burs İmkanları:</strong> Yüksek GNO burs alma şansını artırır</li>
              <li><strong>Yüksek Lisans:</strong> Lisansüstü programlar için GNO şartı vardır</li>
              <li><strong>İş Başvuruları:</strong> İşverenler GNO'yu değerlendirme kriteri olarak kullanır</li>
              <li><strong>Onur Listesi:</strong> 3.0+ GNO ile onur listesine girebilirsiniz</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GNO Yükseltme Stratejileri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Düşük notlu dersleri tekrar alarak not yükseltme</li>
              <li>Seçmeli derslerde yüksek not alma odaklı seçim yapma</li>
              <li>Düzenli çalışma programı oluşturma</li>
              <li>Öğretim üyeleri ile iletişim kurma</li>
              <li>Grup çalışmaları ve ders arkadaşlığı</li>
              <li>Sınav tekniklerini geliştirme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Başarı Dereceleri</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">GNO Aralıkları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>3.5-4.0: Yüksek Onur</li>
                  <li>3.0-3.49: Onur</li>
                  <li>2.5-2.99: İyi</li>
                  <li>2.0-2.49: Orta</li>
                  <li>0.0-1.99: Düşük</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Özel Durumlar</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Mezuniyet için min. 2.0 GNO</li>
                  <li>• Onur listesi için min. 3.0 GNO</li>
                  <li>• Yüksek onur için min. 3.5 GNO</li>
                  <li>• Akademik uyarı: 2.0 altı GNO</li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-cyan-900 mb-2">💡 İpucu</h4>
              <p className="text-cyan-800">
                Yukarıdaki hesaplama aracımızı kullanarak mevcut GNO'nuzu hesaplayabilir, farklı 
                not senaryolarını deneyebilir ve hedef GNO'nuza ulaşmak için hangi derslerde 
                ne kadar çalışmanız gerektiğini planlayabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              GNO, üniversite hayatınızın en önemli göstergelerinden biridir. Doğru hesaplama ve 
              stratejik planlama ile GNO'nuzu sürekli iyileştirebilir, akademik hedeflerinize 
              ulaşabilirsiniz. Düzenli takip ve bilinçli ders seçimleri ile başarılı bir 
              üniversite kariyeri inşa edebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default UniversiteNotOrtalamasi;