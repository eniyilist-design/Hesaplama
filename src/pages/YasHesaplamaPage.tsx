import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, Clock, Calendar, Baby, ArrowRight, Info, Heart, Cake, Star, Gift } from 'lucide-react';

interface YasHesaplamaSonuc {
  dogumTarihi: Date;
  hesaplamaTarihi: Date;
  yasYil: number;
  yasAy: number;
  yasGun: number;
  yasSaat: number;
  yasDakika: number;
  toplamGun: number;
  toplamSaat: number;
  toplamDakika: number;
  gelecekDogumGunu: Date;
  dogumGunuKalanGun: number;
  burcBilgisi: string;
  yasGrubu: string;
  gelecekYasGunleri: Date[];
}

const benzerAraclar = [
  { name: 'Tarih Farkı Hesaplama', icon: Calendar, link: '#', active: false },
  { name: 'Çalışma Süresi Hesaplama', icon: Clock, link: '#', active: false },
  { name: 'Emeklilik Yaşı Hesaplama', icon: Calculator, link: '#', active: false }
];

const burclar = [
  { ad: 'Koç', baslangic: '03-21', bitis: '04-19' },
  { ad: 'Boğa', baslangic: '04-20', bitis: '05-20' },
  { ad: 'İkizler', baslangic: '05-21', bitis: '06-20' },
  { ad: 'Yengeç', baslangic: '06-21', bitis: '07-22' },
  { ad: 'Aslan', baslangic: '07-23', bitis: '08-22' },
  { ad: 'Başak', baslangic: '08-23', bitis: '09-22' },
  { ad: 'Terazi', baslangic: '09-23', bitis: '10-22' },
  { ad: 'Akrep', baslangic: '10-23', bitis: '11-21' },
  { ad: 'Yay', baslangic: '11-22', bitis: '12-21' },
  { ad: 'Oğlak', baslangic: '12-22', bitis: '01-19' },
  { ad: 'Kova', baslangic: '01-20', bitis: '02-18' },
  { ad: 'Balık', baslangic: '02-19', bitis: '03-20' }
];

const YasHesaplamaPage: React.FC = () => {
  const [dogumTarihi, setDogumTarihi] = useState<string>('');
  const [dogumSaati, setDogumSaati] = useState<string>('12:00');
  const [hesaplamaTarihi, setHesaplamaTarihi] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hesaplamaSaati, setHesaplamaSaati] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [sonuc, setSonuc] = useState<YasHesaplamaSonuc | null>(null);

  const burcHesapla = (tarih: Date): string => {
    const ay = tarih.getMonth() + 1;
    const gun = tarih.getDate();
    const tarihStr = `${ay.toString().padStart(2, '0')}-${gun.toString().padStart(2, '0')}`;
    
    for (const burc of burclar) {
      const baslangic = burc.baslangic;
      const bitis = burc.bitis;
      
      if (baslangic <= bitis) {
        if (tarihStr >= baslangic && tarihStr <= bitis) {
          return burc.ad;
        }
      } else {
        // Yılbaşını geçen burçlar (Oğlak)
        if (tarihStr >= baslangic || tarihStr <= bitis) {
          return burc.ad;
        }
      }
    }
    return 'Bilinmiyor';
  };

  const yasGrubuBelirle = (yas: number): string => {
    if (yas < 1) return 'Bebek';
    if (yas < 3) return 'Küçük Çocuk';
    if (yas < 6) return 'Okul Öncesi';
    if (yas < 12) return 'Çocuk';
    if (yas < 18) return 'Ergen';
    if (yas < 25) return 'Genç Yetişkin';
    if (yas < 40) return 'Yetişkin';
    if (yas < 65) return 'Orta Yaş';
    return 'Yaşlı';
  };

  const hesapla = () => {
    if (!dogumTarihi) {
      setSonuc(null);
      return;
    }

    const dogum = new Date(`${dogumTarihi}T${dogumSaati}:00`);
    const hesaplama = new Date(`${hesaplamaTarihi}T${hesaplamaSaati}:00`);
    
    // Yaş hesaplama
    let yasYil = hesaplama.getFullYear() - dogum.getFullYear();
    let yasAy = hesaplama.getMonth() - dogum.getMonth();
    let yasGun = hesaplama.getDate() - dogum.getDate();
    let yasSaat = hesaplama.getHours() - dogum.getHours();
    let yasDakika = hesaplama.getMinutes() - dogum.getMinutes();

    // Negatif değerleri düzeltme
    if (yasDakika < 0) {
      yasSaat--;
      yasDakika += 60;
    }

    if (yasSaat < 0) {
      yasGun--;
      yasSaat += 24;
    }

    if (yasGun < 0) {
      yasAy--;
      const oncekiAyinSonGunu = new Date(hesaplama.getFullYear(), hesaplama.getMonth(), 0).getDate();
      yasGun += oncekiAyinSonGunu;
    }

    if (yasAy < 0) {
      yasYil--;
      yasAy += 12;
    }

    // Toplam hesaplamalar
    const toplamDakika = Math.floor((hesaplama.getTime() - dogum.getTime()) / (1000 * 60));
    const toplamSaat = Math.floor(toplamDakika / 60);
    const toplamGun = Math.floor(toplamSaat / 24);

    // Gelecek doğum günü
    const gelecekDogumGunu = new Date(dogum);
    gelecekDogumGunu.setFullYear(hesaplama.getFullYear());
    if (gelecekDogumGunu < hesaplama) {
      gelecekDogumGunu.setFullYear(hesaplama.getFullYear() + 1);
    }

    const dogumGunuKalanGun = Math.ceil((gelecekDogumGunu.getTime() - hesaplama.getTime()) / (1000 * 60 * 60 * 24));

    // Burç hesaplama
    const burcBilgisi = burcHesapla(dogum);

    // Yaş grubu
    const yasGrubu = yasGrubuBelirle(yasYil);

    // Gelecek 5 yılın doğum günleri
    const gelecekYasGunleri = [];
    for (let i = 1; i <= 5; i++) {
      const tarih = new Date(dogum);
      tarih.setFullYear(hesaplama.getFullYear() + i);
      gelecekYasGunleri.push(tarih);
    }

    setSonuc({
      dogumTarihi: dogum,
      hesaplamaTarihi: hesaplama,
      yasYil,
      yasAy,
      yasGun,
      yasSaat,
      yasDakika,
      toplamGun,
      toplamSaat,
      toplamDakika,
      gelecekDogumGunu,
      dogumGunuKalanGun,
      burcBilgisi,
      yasGrubu,
      gelecekYasGunleri
    });
  };

  useEffect(() => {
    hesapla();
  }, [dogumTarihi, dogumSaati, hesaplamaTarihi, hesaplamaSaati]);

  const formatTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatKisaTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatSayi = (sayi: number) => {
    return new Intl.NumberFormat('tr-TR').format(sayi);
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Zaman</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Yaş Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Yaş Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Doğum tarihinden itibaren detaylı yaş hesaplama, doğum günü takibi ve zaman analizi
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
                <Baby className="h-6 w-6 mr-3 text-blue-600" />
                Tarih ve Saat Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Doğum Tarihi
                    </label>
                    <input
                      type="date"
                      value={dogumTarihi}
                      onChange={(e) => setDogumTarihi(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Doğum Saati
                    </label>
                    <input
                      type="time"
                      value={dogumSaati}
                      onChange={(e) => setDogumSaati(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Daha hassas hesaplama için
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hesaplama Tarihi
                    </label>
                    <input
                      type="date"
                      value={hesaplamaTarihi}
                      onChange={(e) => setHesaplamaTarihi(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hesaplama Saati
                    </label>
                    <input
                      type="time"
                      value={hesaplamaSaati}
                      onChange={(e) => setHesaplamaSaati(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Varsayılan: Şu anki zaman
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Cake className="h-6 w-6 mr-3 text-blue-600" />
                  Yaş Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yaşınız</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {sonuc.yasYil} yıl {sonuc.yasAy} ay {sonuc.yasGun} gün
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.yasSaat} saat {sonuc.yasDakika} dakika
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yaş Grubu</div>
                    <div className="text-lg font-bold text-purple-600">
                      {sonuc.yasGrubu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Burç</div>
                    <div className="text-lg font-bold text-yellow-600 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      {sonuc.burcBilgisi}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Yaşam Süresi</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Gün:</span>
                        <span className="font-bold text-green-600">{formatSayi(sonuc.toplamGun)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saat:</span>
                        <span className="font-bold text-blue-600">{formatSayi(sonuc.toplamSaat)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dakika:</span>
                        <span className="font-bold text-purple-600">{formatSayi(sonuc.toplamDakika)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1 flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      Gelecek Doğum Günü
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatKisaTarih(sonuc.gelecekDogumGunu)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sonuc.dogumGunuKalanGun} gün kaldı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Gelecek Doğum Günleri</div>
                    <div className="space-y-1">
                      {sonuc.gelecekYasGunleri.slice(0, 3).map((tarih, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>{sonuc.yasYil + index + 1}. yaş:</span>
                          <span className="font-medium">{formatKisaTarih(tarih)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Yaş Grupları Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yaş Grupları ve Gelişim Dönemleri</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-pink-50 rounded-xl">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bebek</h3>
              <p className="text-sm text-gray-600 mb-2">0-1 yaş</p>
              <p className="text-xs text-gray-500">Temel gelişim dönemi</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Çocuk</h3>
              <p className="text-sm text-gray-600 mb-2">3-12 yaş</p>
              <p className="text-xs text-gray-500">Öğrenme ve sosyalleşme</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Yetişkin</h3>
              <p className="text-sm text-gray-600 mb-2">18-65 yaş</p>
              <p className="text-xs text-gray-500">Aktif yaşam dönemi</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Yaşlı</h3>
              <p className="text-sm text-gray-600 mb-2">65+ yaş</p>
              <p className="text-xs text-gray-500">Emeklilik dönemi</p>
            </div>
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Burç Bilgileri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Burç Takvimi</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {burclar.map(burc => (
              <div key={burc.ad} className={`p-4 rounded-xl border-2 ${
                sonuc?.burcBilgisi === burc.ad ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
              }`}>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  {burc.ad}
                </h3>
                <div className="text-sm text-gray-600">
                  {burc.baslangic} / {burc.bitis}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yaş Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yaş Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pratik Kullanım Alanları</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Resmi İşlemler</h4>
                  <p className="text-sm text-blue-800">
                    Kimlik başvuruları, pasaport işlemleri ve resmi evrak için hassas yaş hesaplama
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Eğitim Planlaması</h4>
                  <p className="text-sm text-green-800">
                    Okula başlama yaşı, sınıf atlama ve eğitim kademesi belirleme
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Sağlık Takibi</h4>
                  <p className="text-sm text-purple-800">
                    Aşı takvimleri, gelişim kontrolleri ve yaşa uygun sağlık önerileri
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-pink-900 mb-2">Özel Günler</h4>
                  <p className="text-sm text-pink-800">
                    Doğum günü planlaması, yıldönümü hesaplama ve özel tarih takibi
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlginç Yaş İstatistikleri</h3>
              {sonuc && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Yaşam İstatistikleri</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Yaşadığınız gün sayısı: {formatSayi(sonuc.toplamGun)}</li>
                      <li>• Yaşadığınız saat sayısı: {formatSayi(sonuc.toplamSaat)}</li>
                      <li>• Yaşadığınız dakika sayısı: {formatSayi(sonuc.toplamDakika)}</li>
                      <li>• Gelecek doğum gününe: {sonuc.dogumGunuKalanGun} gün</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Burç Bilgisi</h4>
                    <p className="text-sm text-yellow-800">
                      Burcunuz: <strong>{sonuc.burcBilgisi}</strong>
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Doğum tarihinize göre hesaplanmıştır
                    </p>
                  </div>
                </div>
              )}
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
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
              Yaş Hesaplama Nasıl Yapılır? Detaylı Zaman Hesaplama Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaş Hesaplama Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yaş hesaplama, bir kişinin doğum tarihinden belirli bir tarihe kadar geçen süreyi 
              yıl, ay, gün, saat ve dakika cinsinden hesaplama işlemidir. Bu hesaplama, resmi işlemler, 
              eğitim planlaması, sağlık takibi ve birçok günlük yaşam aktivitesi için kritik öneme sahiptir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hassas Yaş Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Doğru yaş hesaplama için şu adımlar izlenir:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Hedef tarihten doğum tarihini çıkarma</li>
                <li>Negatif değerleri bir üst birimden borç alma</li>
                <li>Yıl, ay, gün, saat ve dakika olarak ayrıştırma</li>
                <li>Toplam yaşam süresini farklı birimlerde hesaplama</li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaş Hesaplamanın Kullanım Alanları</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yaş hesaplama günlük hayatta birçok alanda kullanılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Resmi İşlemler:</strong> Kimlik, pasaport, vize başvuruları</li>
              <li><strong>Eğitim:</strong> Okula başlama yaşı, sınıf belirleme</li>
              <li><strong>Sağlık:</strong> Aşı takvimleri, gelişim kontrolleri</li>
              <li><strong>Hukuki İşlemler:</strong> Reşit olma, emeklilik hakları</li>
              <li><strong>Sigorta:</strong> Yaşa göre prim hesaplama</li>
              <li><strong>Spor:</strong> Yaş kategorisi belirleme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaş Grupları ve Özellikleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              İnsan yaşamı farklı gelişim dönemlerine ayrılır:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Çocukluk Dönemi</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Bebek (0-1 yaş): Temel gelişim</li>
                  <li>Küçük Çocuk (1-3 yaş): Dil gelişimi</li>
                  <li>Okul Öncesi (3-6 yaş): Sosyalleşme</li>
                  <li>Çocuk (6-12 yaş): Öğrenme dönemi</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Yetişkinlik Dönemi</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Ergen (12-18 yaş): Kimlik gelişimi</li>
                  <li>Genç Yetişkin (18-25 yaş): Bağımsızlık</li>
                  <li>Yetişkin (25-65 yaş): Kariyer dönemi</li>
                  <li>Yaşlı (65+ yaş): Emeklilik dönemi</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Burç Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Doğum tarihinize göre burcunuz otomatik olarak hesaplanır. 12 burç ve tarih aralıkları:
            </p>
            <div className="bg-yellow-50 p-6 rounded-xl mb-6">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p><strong>Koç:</strong> 21 Mart - 19 Nisan</p>
                  <p><strong>Boğa:</strong> 20 Nisan - 20 Mayıs</p>
                  <p><strong>İkizler:</strong> 21 Mayıs - 20 Haziran</p>
                  <p><strong>Yengeç:</strong> 21 Haziran - 22 Temmuz</p>
                </div>
                <div>
                  <p><strong>Aslan:</strong> 23 Temmuz - 22 Ağustos</p>
                  <p><strong>Başak:</strong> 23 Ağustos - 22 Eylül</p>
                  <p><strong>Terazi:</strong> 23 Eylül - 22 Ekim</p>
                  <p><strong>Akrep:</strong> 23 Ekim - 21 Kasım</p>
                </div>
                <div>
                  <p><strong>Yay:</strong> 22 Kasım - 21 Aralık</p>
                  <p><strong>Oğlak:</strong> 22 Aralık - 19 Ocak</p>
                  <p><strong>Kova:</strong> 20 Ocak - 18 Şubat</p>
                  <p><strong>Balık:</strong> 19 Şubat - 20 Mart</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Detaylı yaş hesaplama örneği:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Senaryo:</h4>
              <ul className="space-y-1 text-gray-700 mb-4">
                <li>Doğum Tarihi: 15 Mart 1990, 14:30</li>
                <li>Hesaplama Tarihi: 25 Aralık 2024, 16:45</li>
              </ul>
              
              <h4 className="font-semibold text-gray-900 mb-2">Hesaplama:</h4>
              <p className="text-gray-700 mb-2">
                Yıl: 2024 - 1990 = 34 yıl
              </p>
              <p className="text-gray-700 mb-2">
                Ay: Aralık - Mart = 9 ay
              </p>
              <p className="text-gray-700 mb-2">
                Gün: 25 - 15 = 10 gün
              </p>
              <p className="font-bold text-green-600 text-lg">
                Sonuç: 34 yıl 9 ay 10 gün 2 saat 15 dakika
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yaş Hesaplamanın Önemi</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Hukuki Haklar:</strong> Reşit olma, seçme-seçilme hakkı</li>
              <li><strong>Eğitim Hakları:</strong> Okula başlama, sınıf belirleme</li>
              <li><strong>Sağlık Takibi:</strong> Yaşa uygun kontroller</li>
              <li><strong>Sosyal Haklar:</strong> Emeklilik, yaşlılık aylığı</li>
              <li><strong>Ticari İşlemler:</strong> Kredi, sigorta başvuruları</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Özel Durumlar</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Artık Yıllar:</strong> 29 Şubat doğumlular için özel hesaplama</li>
              <li><strong>Zaman Dilimi Değişiklikleri:</strong> Yaz-kış saati uygulamaları</li>
              <li><strong>Farklı Takvimler:</strong> Hicri, Miladi takvim dönüşümleri</li>
              <li><strong>Uluslararası Hesaplama:</strong> Farklı ülke formatları</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Doğum Günü Planlaması</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yaş hesaplama aracımız aynı zamanda gelecek doğum günlerinizi de planlamanıza yardımcı olur:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Gelecek doğum gününe kalan gün sayısı</li>
              <li>Önümüzdeki 5 yılın doğum günü tarihleri</li>
              <li>Özel yaş dönümlerinin tarihleri</li>
              <li>Doğum günü organizasyonu için zaman planlaması</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">💡 İpucu</h4>
              <p className="text-blue-800">
                Yukarıdaki hesaplama aracımızı kullanarak hassas yaş hesaplama yapabilir, 
                doğum günü planlaması yapabilir ve yaşam istatistiklerinizi görebilirsiniz. 
                Saat bilgisi girerek daha detaylı hesaplama elde edebilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Yaş hesaplama, günlük yaşamın birçok alanında ihtiyaç duyulan temel bir işlemdir. 
              Doğru ve hassas hesaplama ile resmi işlemlerinizi kolaylaştırabilir, özel günlerinizi 
              planlayabilir ve yaşam istatistiklerinizi takip edebilirsiniz. Yukarıdaki hesaplama 
              aracı sayesinde tüm bu hesaplamaları kolayca yapabilir ve detaylı sonuçlar alabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default YasHesaplamaPage;