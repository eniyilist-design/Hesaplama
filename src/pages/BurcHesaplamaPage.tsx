import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, Star, Calendar, Sparkles, ArrowRight, Info, Target, Heart, Sun, Moon } from 'lucide-react';

interface BurcBilgisi {
  ad: string;
  baslangic: string;
  bitis: string;
  element: string;
  kalite: string;
  yoneticiGezegen: string;
  sembol: string;
  renk: string;
  sansliSayi: number[];
  uyumluBurclar: string[];
  ozellikler: string[];
  aciklama: string;
}

interface BurcSonuc {
  burc: BurcBilgisi;
  dogumTarihi: Date;
  yasGrubu: string;
  burcYasi: number;
  gelecekDogumGunu: Date;
  dogumGunuKalanGun: number;
  astrolojikAnaliz: string;
  gunlukYorum: string;
}

const burclar: BurcBilgisi[] = [
  {
    ad: 'Koç',
    baslangic: '03-21',
    bitis: '04-19',
    element: 'Ateş',
    kalite: 'Öncü',
    yoneticiGezegen: 'Mars',
    sembol: '♈',
    renk: 'Kırmızı',
    sansliSayi: [1, 8, 17],
    uyumluBurclar: ['Aslan', 'Yay', 'İkizler'],
    ozellikler: ['Liderlik', 'Cesaret', 'Girişimcilik', 'Hızlı karar verme'],
    aciklama: 'Doğal lider, enerjik ve girişimci. Yeni başlangıçları sever.'
  },
  {
    ad: 'Boğa',
    baslangic: '04-20',
    bitis: '05-20',
    element: 'Toprak',
    kalite: 'Sabit',
    yoneticiGezegen: 'Venüs',
    sembol: '♉',
    renk: 'Yeşil',
    sansliSayi: [2, 6, 9],
    uyumluBurclar: ['Başak', 'Oğlak', 'Balık'],
    ozellikler: ['Kararlılık', 'Güvenilirlik', 'Sabır', 'Pratiklik'],
    aciklama: 'Kararlı, güvenilir ve sabırlı. Güvenlik ve konfor arar.'
  },
  {
    ad: 'İkizler',
    baslangic: '05-21',
    bitis: '06-20',
    element: 'Hava',
    kalite: 'Değişken',
    yoneticiGezegen: 'Merkür',
    sembol: '♊',
    renk: 'Sarı',
    sansliSayi: [5, 7, 14],
    uyumluBurclar: ['Terazi', 'Kova', 'Koç'],
    ozellikler: ['İletişim', 'Zeka', 'Uyum', 'Çok yönlülük'],
    aciklama: 'Zeki, iletişim yeteneği güçlü ve uyumlu. Değişimi sever.'
  },
  {
    ad: 'Yengeç',
    baslangic: '06-21',
    bitis: '07-22',
    element: 'Su',
    kalite: 'Öncü',
    yoneticiGezegen: 'Ay',
    sembol: '♋',
    renk: 'Gümüş',
    sansliSayi: [2, 7, 11],
    uyumluBurclar: ['Akrep', 'Balık', 'Boğa'],
    ozellikler: ['Duygusallık', 'Koruyuculuk', 'Sezgi', 'Aile sevgisi'],
    aciklama: 'Duygusal, koruyucu ve sezgileri güçlü. Aile ve ev önemlidir.'
  },
  {
    ad: 'Aslan',
    baslangic: '07-23',
    bitis: '08-22',
    element: 'Ateş',
    kalite: 'Sabit',
    yoneticiGezegen: 'Güneş',
    sembol: '♌',
    renk: 'Altın',
    sansliSayi: [1, 3, 10],
    uyumluBurclar: ['Koç', 'Yay', 'İkizler'],
    ozellikler: ['Güven', 'Yaratıcılık', 'Cömertlik', 'Drama'],
    aciklama: 'Güvenli, yaratıcı ve cömert. Dikkat çekmeyi ve takdir edilmeyi sever.'
  },
  {
    ad: 'Başak',
    baslangic: '08-23',
    bitis: '09-22',
    element: 'Toprak',
    kalite: 'Değişken',
    yoneticiGezegen: 'Merkür',
    sembol: '♍',
    renk: 'Lacivert',
    sansliSayi: [3, 27, 35],
    uyumluBurclar: ['Boğa', 'Oğlak', 'Yengeç'],
    ozellikler: ['Mükemmeliyetçilik', 'Analitik düşünce', 'Hizmet', 'Detaycılık'],
    aciklama: 'Mükemmeliyetçi, analitik ve hizmet odaklı. Detaylara önem verir.'
  },
  {
    ad: 'Terazi',
    baslangic: '09-23',
    bitis: '10-22',
    element: 'Hava',
    kalite: 'Öncü',
    yoneticiGezegen: 'Venüs',
    sembol: '♎',
    renk: 'Pembe',
    sansliSayi: [6, 15, 24],
    uyumluBurclar: ['İkizler', 'Kova', 'Aslan'],
    ozellikler: ['Denge', 'Adalet', 'Estetik', 'Diplomasi'],
    aciklama: 'Dengeli, adil ve estetik anlayışı gelişmiş. Uyum arar.'
  },
  {
    ad: 'Akrep',
    baslangic: '10-23',
    bitis: '11-21',
    element: 'Su',
    kalite: 'Sabit',
    yoneticiGezegen: 'Plüton',
    sembol: '♏',
    renk: 'Bordo',
    sansliSayi: [4, 13, 31],
    uyumluBurclar: ['Yengeç', 'Balık', 'Başak'],
    ozellikler: ['Yoğunluk', 'Tutku', 'Dönüşüm', 'Sır'],
    aciklama: 'Yoğun, tutkulu ve dönüşümcü. Derinlikleri keşfetmeyi sever.'
  },
  {
    ad: 'Yay',
    baslangic: '11-22',
    bitis: '12-21',
    element: 'Ateş',
    kalite: 'Değişken',
    yoneticiGezegen: 'Jüpiter',
    sembol: '♐',
    renk: 'Mor',
    sansliSayi: [3, 9, 22],
    uyumluBurclar: ['Koç', 'Aslan', 'Terazi'],
    ozellikler: ['Özgürlük', 'Macera', 'Felsefe', 'İyimserlik'],
    aciklama: 'Özgür ruhlu, maceracı ve iyimser. Yeni deneyimler arar.'
  },
  {
    ad: 'Oğlak',
    baslangic: '12-22',
    bitis: '01-19',
    element: 'Toprak',
    kalite: 'Öncü',
    yoneticiGezegen: 'Satürn',
    sembol: '♑',
    renk: 'Kahverengi',
    sansliSayi: [8, 10, 26],
    uyumluBurclar: ['Boğa', 'Başak', 'Akrep'],
    ozellikler: ['Disiplin', 'Sorumluluk', 'Hırs', 'Geleneksellik'],
    aciklama: 'Disiplinli, sorumlu ve hırslı. Başarı ve statü önemlidir.'
  },
  {
    ad: 'Kova',
    baslangic: '01-20',
    bitis: '02-18',
    element: 'Hava',
    kalite: 'Sabit',
    yoneticiGezegen: 'Uranüs',
    sembol: '♒',
    renk: 'Turkuaz',
    sansliSayi: [4, 7, 11],
    uyumluBurclar: ['İkizler', 'Terazi', 'Yay'],
    ozellikler: ['Özgünlük', 'İnsancıllık', 'Yenilik', 'Bağımsızlık'],
    aciklama: 'Özgün, insancıl ve yenilikçi. Toplumsal değişimi destekler.'
  },
  {
    ad: 'Balık',
    baslangic: '02-19',
    bitis: '03-20',
    element: 'Su',
    kalite: 'Değişken',
    yoneticiGezegen: 'Neptün',
    sembol: '♓',
    renk: 'Deniz Mavisi',
    sansliSayi: [7, 12, 29],
    uyumluBurclar: ['Yengeç', 'Akrep', 'Oğlak'],
    ozellikler: ['Hayal gücü', 'Empati', 'Sanat', 'Ruhaniyet'],
    aciklama: 'Hayalperest, empatik ve sanatsal. Ruhani derinlik arar.'
  }
];

const benzerAraclar = [
  { name: 'Yaş Hesaplama', icon: Calendar, link: '/zaman/yas-hesaplama', active: true },
  { name: 'Çin Burcu Hesaplama', icon: Star, link: '#', active: false },
  { name: 'Numeroloji Hesaplama', icon: Calculator, link: '#', active: false }
];

const BurcHesaplamaPage: React.FC = () => {
  const [dogumTarihi, setDogumTarihi] = useState<string>('');
  const [dogumSaati, setDogumSaati] = useState<string>('12:00');
  const [sonuc, setSonuc] = useState<BurcSonuc | null>(null);

  const burcHesapla = (tarih: Date): BurcBilgisi | null => {
    const ay = tarih.getMonth() + 1;
    const gun = tarih.getDate();
    const tarihStr = `${ay.toString().padStart(2, '0')}-${gun.toString().padStart(2, '0')}`;
    
    for (const burc of burclar) {
      const baslangic = burc.baslangic;
      const bitis = burc.bitis;
      
      if (baslangic <= bitis) {
        if (tarihStr >= baslangic && tarihStr <= bitis) {
          return burc;
        }
      } else {
        // Yılbaşını geçen burçlar (Oğlak)
        if (tarihStr >= baslangic || tarihStr <= bitis) {
          return burc;
        }
      }
    }
    return null;
  };

  const yasGrubuBelirle = (yas: number): string => {
    if (yas < 18) return 'Genç';
    if (yas < 30) return 'Genç Yetişkin';
    if (yas < 45) return 'Yetişkin';
    if (yas < 60) return 'Orta Yaş';
    return 'Olgun';
  };

  const astrolojikAnaliz = (burc: BurcBilgisi, yas: number): string => {
    const element = burc.element;
    const kalite = burc.kalite;
    
    let analiz = `${element} elementi ve ${kalite} kalitesi ile `;
    
    if (yas < 25) {
      analiz += 'gençlik döneminde potansiyelinizi keşfetme zamanı. ';
    } else if (yas < 40) {
      analiz += 'kariyer ve ilişki kurma döneminde dengeyi bulma zamanı. ';
    } else if (yas < 55) {
      analiz += 'olgunluk döneminde bilgelik ve deneyim kazanma zamanı. ';
    } else {
      analiz += 'bilgelik döneminde rehberlik etme ve paylaşma zamanı. ';
    }
    
    return analiz + `${burc.ad} burcu olarak ${burc.ozellikler.slice(0, 2).join(' ve ')} özellikleriniz öne çıkıyor.`;
  };

  const gunlukYorumOlustur = (burc: BurcBilgisi): string => {
    const yorumlar = [
      `${burc.ad} burcu için bugün ${burc.element.toLowerCase()} enerjisi güçlü. ${burc.ozellikler[0].toLowerCase()} özelliğinizi kullanın.`,
      `${burc.yoneticiGezegen} etkisiyle bugün ${burc.ozellikler[1].toLowerCase()} yönünüz ön plana çıkıyor.`,
      `${burc.renk.toLowerCase()} rengi bugün sizin için şanslı. ${burc.ozellikler[2].toLowerCase()} konularında dikkatli olun.`,
      `Bugün ${burc.uyumluBurclar[0]} ve ${burc.uyumluBurclar[1]} burçları ile uyumunuz yüksek.`
    ];
    
    const randomIndex = Math.floor(Math.random() * yorumlar.length);
    return yorumlar[randomIndex];
  };

  const hesapla = () => {
    if (!dogumTarihi) {
      setSonuc(null);
      return;
    }

    const dogum = new Date(`${dogumTarihi}T${dogumSaati}:00`);
    const bugun = new Date();
    
    const burc = burcHesapla(dogum);
    if (!burc) return;
    
    // Yaş hesaplama
    const yas = bugun.getFullYear() - dogum.getFullYear();
    const yasGrubu = yasGrubuBelirle(yas);
    
    // Burç yaşı (bu yıl kaçıncı kez bu burcu yaşıyor)
    const burcYasi = yas;
    
    // Gelecek doğum günü
    const gelecekDogumGunu = new Date(dogum);
    gelecekDogumGunu.setFullYear(bugun.getFullYear());
    if (gelecekDogumGunu < bugun) {
      gelecekDogumGunu.setFullYear(bugun.getFullYear() + 1);
    }
    
    const dogumGunuKalanGun = Math.ceil((gelecekDogumGunu.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
    
    // Astrolojik analiz
    const astrolojikAnalizMetni = astrolojikAnaliz(burc, yas);
    const gunlukYorum = gunlukYorumOlustur(burc);
    
    setSonuc({
      burc,
      dogumTarihi: dogum,
      yasGrubu,
      burcYasi,
      gelecekDogumGunu,
      dogumGunuKalanGun,
      astrolojikAnaliz: astrolojikAnalizMetni,
      gunlukYorum
    });
  };

  useEffect(() => {
    hesapla();
  }, [dogumTarihi, dogumSaati]);

  const formatTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatKisaTarih = (tarih: Date) => {
    return tarih.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Diğer</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Burç Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Burç Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Doğum tarihinize göre burcunuzu öğrenin, astrolojik özelliklerinizi keşfedin ve günlük yorumunuzu alın
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
                <Calendar className="h-6 w-6 mr-3 text-purple-600" />
                Doğum Bilgileri
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
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Doğum Saati (İsteğe Bağlı)
                    </label>
                    <input
                      type="time"
                      value={dogumSaati}
                      onChange={(e) => setDogumSaati(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Daha detaylı analiz için
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-purple-600" />
                  Burç Analizi
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Burcunuz</div>
                    <div className="text-3xl font-bold text-purple-600 flex items-center">
                      <span className="text-4xl mr-2">{sonuc.burc.sembol}</span>
                      {sonuc.burc.ad}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.burc.baslangic} - {sonuc.burc.bitis}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Element & Kalite</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.burc.element} - {sonuc.burc.kalite}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Yönetici: {sonuc.burc.yoneticiGezegen}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Şanslı Renk & Sayılar</div>
                    <div className="text-lg font-bold text-pink-600">
                      {sonuc.burc.renk}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Sayılar: {sonuc.burc.sansliSayi.join(', ')}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Uyumlu Burçlar</div>
                    <div className="text-sm font-medium text-gray-900">
                      {sonuc.burc.uyumluBurclar.join(', ')}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Gelecek Doğum Günü
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatKisaTarih(sonuc.gelecekDogumGunu)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sonuc.dogumGunuKalanGun} gün kaldı
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                    <div className="text-sm text-purple-800 mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Günlük Yorum
                    </div>
                    <div className="text-sm text-purple-700">
                      {sonuc.gunlukYorum}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Burç Özellikleri Detayı */}
        {sonuc && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{sonuc.burc.ad} Burcu Özellikleri</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Özellikler</h3>
                <div className="space-y-3">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Kişilik Özellikleri</h4>
                    <div className="flex flex-wrap gap-2">
                      {sonuc.burc.ozellikler.map((ozellik, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {ozellik}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-medium text-pink-900 mb-2">Genel Açıklama</h4>
                    <p className="text-sm text-pink-800">
                      {sonuc.burc.aciklama}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Astrolojik Analiz</h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Element:</span>
                      <span className="font-bold text-purple-600">{sonuc.burc.element}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kalite:</span>
                      <span className="font-bold text-pink-600">{sonuc.burc.kalite}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Yönetici Gezegen:</span>
                      <span className="font-bold text-indigo-600">{sonuc.burc.yoneticiGezegen}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Yaş Grubu:</span>
                      <span className="font-bold text-gray-700">{sonuc.yasGrubu}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-700">
                      {sonuc.astrolojikAnaliz}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Tüm Burçlar Takvimi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2025 Burç Takvimi</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {burclar.map(burc => (
              <div key={burc.ad} className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                sonuc?.burc.ad === burc.ad 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">{burc.sembol}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{burc.ad}</h3>
                  <div className="text-sm text-gray-600 mb-3">
                    {burc.baslangic} - {burc.bitis}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {burc.element} • {burc.kalite}
                  </div>
                  <div className="text-xs text-gray-500">
                    {burc.yoneticiGezegen}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Element ve Kalite Açıklamaları */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Astroloji Elementleri ve Kaliteleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">4 Element</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2 flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    Ateş (Koç, Aslan, Yay)
                  </h4>
                  <p className="text-sm text-red-800">
                    Enerjik, tutkulu, lider ruhlu. Girişimci ve cesur.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Toprak (Boğa, Başak, Oğlak)
                  </h4>
                  <p className="text-sm text-green-800">
                    Pratik, güvenilir, kararlı. Maddi güvenlik önemli.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Hava (İkizler, Terazi, Kova)
                  </h4>
                  <p className="text-sm text-blue-800">
                    Zeki, iletişimci, sosyal. Fikir ve iletişim odaklı.
                  </p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-medium text-cyan-900 mb-2 flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Su (Yengeç, Akrep, Balık)
                  </h4>
                  <p className="text-sm text-cyan-800">
                    Duygusal, sezgisel, empatik. İç dünya zengin.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">3 Kalite</h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Öncü (Koç, Yengeç, Terazi, Oğlak)
                  </h4>
                  <p className="text-sm text-yellow-800">
                    Başlatıcı, lider, girişimci. Yeni projeleri başlatır.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">
                    Sabit (Boğa, Aslan, Akrep, Kova)
                  </h4>
                  <p className="text-sm text-orange-800">
                    Kararlı, sebatkâr, güvenilir. Projeleri sürdürür.
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-2">
                    Değişken (İkizler, Başak, Yay, Balık)
                  </h4>
                  <p className="text-sm text-indigo-800">
                    Esnek, uyumlu, çok yönlü. Projeleri tamamlar.
                  </p>
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
                <div key={index} className={`
                  bg-white rounded-2xl p-6 shadow-lg border border-gray-100
                  ${arac.active ? 'hover:shadow-xl cursor-pointer' : 'opacity-75'}
                  transition-all duration-300
                `}>
                  {arac.active ? (
                    <Link to={arac.link} className="block">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                    </Link>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 opacity-75">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Yakında
                      </span>
                    </>
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
              Burç Nedir ve Nasıl Hesaplanır? Astroloji Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Burç Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Burç, astrolojide Güneş'in doğum anında bulunduğu zodyak konumunu ifade eder. 
              12 burç sistemi, binlerce yıldır farklı kültürlerde kullanılan ve kişilik özelliklerini, 
              davranış kalıplarını ve yaşam eğilimlerini açıklamaya çalışan sembolik bir sistemdir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12 Burç ve Tarihleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Zodyak takvimi, Güneş'in yıl boyunca takip ettiği yörüngeye göre 12 eşit bölüme ayrılmıştır:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">İlkbahar Burçları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Koç: 21 Mart - 19 Nisan</li>
                  <li>Boğa: 20 Nisan - 20 Mayıs</li>
                  <li>İkizler: 21 Mayıs - 20 Haziran</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Yaz Burçları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Yengeç: 21 Haziran - 22 Temmuz</li>
                  <li>Aslan: 23 Temmuz - 22 Ağustos</li>
                  <li>Başak: 23 Ağustos - 22 Eylül</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Sonbahar Burçları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Terazi: 23 Eylül - 22 Ekim</li>
                  <li>Akrep: 23 Ekim - 21 Kasım</li>
                  <li>Yay: 22 Kasım - 21 Aralık</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Kış Burçları</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Oğlak: 22 Aralık - 19 Ocak</li>
                  <li>Kova: 20 Ocak - 18 Şubat</li>
                  <li>Balık: 19 Şubat - 20 Mart</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Astroloji Elementleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              12 burç, 4 temel elemente göre gruplandırılır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Ateş Elementı (Koç, Aslan, Yay):</strong> Enerjik, tutkulu, lider</li>
              <li><strong>Toprak Elementı (Boğa, Başak, Oğlak):</strong> Pratik, güvenilir, kararlı</li>
              <li><strong>Hava Elementı (İkizler, Terazi, Kova):</strong> Zeki, iletişimci, sosyal</li>
              <li><strong>Su Elementı (Yengeç, Akrep, Balık):</strong> Duygusal, sezgisel, empatik</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Burç Kaliteleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Burçlar ayrıca 3 farklı kaliteye göre de sınıflandırılır:
            </p>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Öncü Kalite:</strong> Yeni dönemleri başlatan, girişimci</li>
                <li><strong>Sabit Kalite:</strong> Kararlı, sebatkâr, güvenilir</li>
                <li><strong>Değişken Kalite:</strong> Esnek, uyumlu, çok yönlü</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Burç Uyumluluğu</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Astrolojide burç uyumluluğu, elementler ve kaliteler arasındaki uyuma dayanır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Aynı element burçları genellikle uyumludur</li>
              <li>Ateş-Hava, Toprak-Su elementleri birbirini destekler</li>
              <li>Farklı kaliteler farklı roller üstlenir</li>
              <li>Karşıt burçlar (6 burç fark) çekici olabilir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yönetici Gezegenler</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Her burcun bir yönetici gezegeni vardır ve bu gezegen o burcun özelliklerini etkiler:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Klasik Gezegenler</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Güneş: Aslan - Yaşam enerjisi</li>
                  <li>Ay: Yengeç - Duygular, sezgi</li>
                  <li>Merkür: İkizler, Başak - İletişim, zeka</li>
                  <li>Venüs: Boğa, Terazi - Aşk, güzellik</li>
                  <li>Mars: Koç - Enerji, savaşçılık</li>
                  <li>Jüpiter: Yay - Genişleme, şans</li>
                  <li>Satürn: Oğlak - Disiplin, sorumluluk</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Modern Gezegenler</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Uranüs: Kova - Yenilik, özgürlük</li>
                  <li>Neptün: Balık - Hayal, ruhaniyet</li>
                  <li>Plüton: Akrep - Dönüşüm, güç</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Burç Hesaplamanın Kullanım Alanları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Kişilik Analizi:</strong> Güçlü ve zayıf yönleri keşfetme</li>
              <li><strong>İlişki Uyumluluğu:</strong> Partner seçimi ve uyum analizi</li>
              <li><strong>Kariyer Rehberliği:</strong> Uygun meslek alanları belirleme</li>
              <li><strong>Kişisel Gelişim:</strong> Potansiyeli ortaya çıkarma</li>
              <li><strong>Zaman Planlaması:</strong> Uygun dönemleri belirleme</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Astroloji ve Bilim</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Astroloji, bilimsel bir disiplin olmamakla birlikte, kültürel ve psikolojik açıdan 
              önemli bir role sahiptir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Kişisel farkındalık geliştirme aracı olarak kullanılabilir</li>
              <li>Kültürel miras ve geleneksel bilgi sistemi</li>
              <li>Psikolojik destek ve rehberlik aracı</li>
              <li>Sosyal bağlantı ve iletişim konusu</li>
            </ul>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">💫 İpucu</h4>
              <p className="text-purple-800">
                Yukarıdaki hesaplama aracımızı kullanarak burcunuzu öğrenebilir, astrolojik 
                özelliklerinizi keşfedebilir ve günlük yorumlarınızı alabilirsiniz. Astrolojiyi 
                kişisel gelişim ve farkındalık aracı olarak kullanabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Burç hesaplama, binlerce yıllık astroloji geleneğinin modern bir uygulamasıdır. 
              Doğum tarihinize göre burcunuzu öğrenmek, kişilik özelliklerinizi keşfetmek ve 
              astrolojik analizler yapmak için kullanışlı bir araçtır. Bu bilgileri kişisel 
              gelişim, ilişki analizi ve yaşam rehberliği amacıyla değerlendirebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default BurcHesaplamaPage;