import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, GraduationCap, BookOpen, Award, ArrowRight, Info, TrendingUp, Star } from 'lucide-react';

interface DonemNotu {
  id: string;
  donem: string;
  yazili1: number;
  yazili2: number;
  sozlu: number;
  performans: number;
  proje: number;
}

interface YBPSonuc {
  donemOrtalamalari: number[];
  yillikOrtalama: number;
  ybpPuani: number;
  harfNotu: string;
  basariDurumu: string;
  takdirTesekkur: string;
}

const benzerAraclar = [
  { name: 'Ders Notu Hesaplama', icon: BookOpen, link: '/egitim/ders-notu-hesaplama', active: true },
  { name: 'Lise Sınıf Geçme', icon: Calculator, link: '/egitim/lise-sinif-gecme', active: true },
  { name: 'Lise Mezuniyet Puanı', icon: Award, link: '/egitim/lise-mezuniyet-puani', active: true }
];

const LiseYBPPage: React.FC = () => {
  const [donemler, setDonemler] = useState<DonemNotu[]>([
    { id: '1', donem: '1. Dönem', yazili1: 0, yazili2: 0, sozlu: 0, performans: 0, proje: 0 },
    { id: '2', donem: '2. Dönem', yazili1: 0, yazili2: 0, sozlu: 0, performans: 0, proje: 0 }
  ]);
  
  const [agirliklar, setAgirliklar] = useState({
    yazili1: 25,
    yazili2: 25,
    sozlu: 25,
    performans: 15,
    proje: 10
  });
  
  const [sonuc, setSonuc] = useState<YBPSonuc | null>(null);

  const hesapla = () => {
    const donemOrtalamalari: number[] = [];
    
    donemler.forEach(donem => {
      const toplamAgirlik = agirliklar.yazili1 + agirliklar.yazili2 + agirliklar.sozlu + 
                           agirliklar.performans + agirliklar.proje;
      
      const agirlikliToplam = (donem.yazili1 * agirliklar.yazili1) +
                             (donem.yazili2 * agirliklar.yazili2) +
                             (donem.sozlu * agirliklar.sozlu) +
                             (donem.performans * agirliklar.performans) +
                             (donem.proje * agirliklar.proje);
      
      const donemOrtalamasi = toplamAgirlik > 0 ? agirlikliToplam / toplamAgirlik : 0;
      donemOrtalamalari.push(donemOrtalamasi);
    });
    
    const yillikOrtalama = donemOrtalamalari.reduce((sum, ort) => sum + ort, 0) / donemOrtalamalari.length;
    
    // YBP hesaplama (Yılsonu Başarı Puanı)
    const ybpPuani = yillikOrtalama; // Basitleştirilmiş hesaplama
    
    let harfNotu = '';
    let basariDurumu = '';
    let takdirTesekkur = '';
    
    if (ybpPuani >= 85) {
      harfNotu = 'AA (Pekiyi)';
      basariDurumu = 'Çok Başarılı';
      takdirTesekkur = 'Takdir Belgesi';
    } else if (ybpPuani >= 70) {
      harfNotu = 'BA (İyi)';
      basariDurumu = 'Başarılı';
      takdirTesekkur = 'Teşekkür Belgesi';
    } else if (ybpPuani >= 60) {
      harfNotu = 'BB (Orta)';
      basariDurumu = 'Orta';
      takdirTesekkur = 'Belge Yok';
    } else if (ybpPuani >= 50) {
      harfNotu = 'CB (Geçer)';
      basariDurumu = 'Geçer';
      takdirTesekkur = 'Belge Yok';
    } else if (ybpPuani >= 40) {
      harfNotu = 'CC (Koşullu)';
      basariDurumu = 'Koşullu Geçer';
      takdirTesekkur = 'Belge Yok';
    } else {
      harfNotu = 'FF (Başarısız)';
      basariDurumu = 'Başarısız';
      takdirTesekkur = 'Belge Yok';
    }
    
    setSonuc({
      donemOrtalamalari,
      yillikOrtalama,
      ybpPuani,
      harfNotu,
      basariDurumu,
      takdirTesekkur
    });
  };

  useEffect(() => {
    hesapla();
  }, [donemler, agirliklar]);

  const donemGuncelle = (id: string, field: keyof DonemNotu, value: number) => {
    setDonemler(prev => prev.map(donem => 
      donem.id === id ? { ...donem, [field]: value } : donem
    ));
  };

  const agirlikGuncelle = (field: keyof typeof agirliklar, value: number) => {
    setAgirliklar(prev => ({ ...prev, [field]: value }));
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
          <span className="text-gray-900 font-medium">Lise Yılsonu Başarı Puanı (YBP)</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Lise Yılsonu Başarı Puanı (YBP)
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dönem notlarınızdan yılsonu başarı puanınızı hesaplayın ve akademik durumunuzu değerlendirin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ağırlık Ayarları */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-indigo-600" />
                Değerlendirme Ağırlıkları (%)
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1. Yazılı
                  </label>
                  <input
                    type="number"
                    value={agirliklar.yazili1}
                    onChange={(e) => agirlikGuncelle('yazili1', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    2. Yazılı
                  </label>
                  <input
                    type="number"
                    value={agirliklar.yazili2}
                    onChange={(e) => agirlikGuncelle('yazili2', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sözlü
                  </label>
                  <input
                    type="number"
                    value={agirliklar.sozlu}
                    onChange={(e) => agirlikGuncelle('sozlu', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Performans
                  </label>
                  <input
                    type="number"
                    value={agirliklar.performans}
                    onChange={(e) => agirlikGuncelle('performans', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proje
                  </label>
                  <input
                    type="number"
                    value={agirliklar.proje}
                    onChange={(e) => agirlikGuncelle('proje', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    max="30"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <div className="text-sm text-indigo-800">
                  Toplam Ağırlık: {Object.values(agirliklar).reduce((sum, val) => sum + val, 0)}%
                  {Object.values(agirliklar).reduce((sum, val) => sum + val, 0) !== 100 && 
                    <span className="text-red-600 ml-2">(100% olmalı)</span>
                  }
                </div>
              </div>
            </div>

            {/* Dönem Notları */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-indigo-600" />
                Dönem Notları
              </h2>
              
              <div className="space-y-6">
                {donemler.map((donem) => (
                  <div key={donem.id} className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{donem.donem}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          1. Yazılı
                        </label>
                        <input
                          type="number"
                          value={donem.yazili1}
                          onChange={(e) => donemGuncelle(donem.id, 'yazili1', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          2. Yazılı
                        </label>
                        <input
                          type="number"
                          value={donem.yazili2}
                          onChange={(e) => donemGuncelle(donem.id, 'yazili2', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sözlü
                        </label>
                        <input
                          type="number"
                          value={donem.sozlu}
                          onChange={(e) => donemGuncelle(donem.id, 'sozlu', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Performans
                        </label>
                        <input
                          type="number"
                          value={donem.performans}
                          onChange={(e) => donemGuncelle(donem.id, 'performans', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proje
                        </label>
                        <input
                          type="number"
                          value={donem.proje}
                          onChange={(e) => donemGuncelle(donem.id, 'proje', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    {sonuc && (
                      <div className="mt-3 text-sm text-gray-600">
                        Dönem Ortalaması: <span className="font-bold text-indigo-600">
                          {sonuc.donemOrtalamalari[parseInt(donem.id) - 1]?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="h-6 w-6 mr-3 text-indigo-600" />
                  YBP Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yılsonu Başarı Puanı</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {sonuc.ybpPuani.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sonuc.harfNotu}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Yıllık Ortalama</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sonuc.yillikOrtalama.toFixed(2)}
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
                    <div className="text-sm text-gray-600 mb-1">Takdir/Teşekkür</div>
                    <div className={`text-lg font-bold flex items-center ${
                      sonuc.takdirTesekkur === 'Takdir Belgesi' ? 'text-yellow-600' :
                      sonuc.takdirTesekkur === 'Teşekkür Belgesi' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {sonuc.takdirTesekkur !== 'Belge Yok' && (
                        <Star className="h-4 w-4 mr-1" />
                      )}
                      {sonuc.takdirTesekkur}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Dönem Ortalamaları</div>
                    <div className="space-y-1">
                      {sonuc.donemOrtalamalari.map((ort, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{index + 1}. Dönem:</span>
                          <span className="font-medium">{ort.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* YBP Sistemi Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yılsonu Başarı Puanı (YBP) Sistemi</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">YBP Hesaplama Yöntemi</h3>
              <div className="bg-indigo-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>1. Adım:</strong> Her dönem için ağırlıklı ortalama hesaplanır
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>2. Adım:</strong> Dönem ortalamalarının aritmetik ortalaması alınır
                </p>
                <p className="text-sm text-gray-700">
                  <strong>3. Adım:</strong> Sonuç YBP puanı olarak belirlenir
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Standart Ağırlık Dağılımı</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-indigo-50 rounded">
                  <span className="font-medium">1. Yazılı</span>
                  <span>%25</span>
                </div>
                <div className="flex justify-between p-2 bg-indigo-50 rounded">
                  <span className="font-medium">2. Yazılı</span>
                  <span>%25</span>
                </div>
                <div className="flex justify-between p-2 bg-indigo-50 rounded">
                  <span className="font-medium">Sözlü</span>
                  <span>%25</span>
                </div>
                <div className="flex justify-between p-2 bg-indigo-50 rounded">
                  <span className="font-medium">Performans</span>
                  <span>%15</span>
                </div>
                <div className="flex justify-between p-2 bg-indigo-50 rounded">
                  <span className="font-medium">Proje</span>
                  <span>%10</span>
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
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
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
              Lise Yılsonu Başarı Puanı (YBP) Nedir? Nasıl Hesaplanır?
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Yılsonu Başarı Puanı (YBP) Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yılsonu Başarı Puanı (YBP), Türkiye'de lise eğitiminde öğrencilerin bir ders yılı boyunca 
              gösterdikleri akademik performansı değerlendiren kapsamlı bir puanlama sistemidir. Bu sistem, 
              öğrencilerin farklı değerlendirme türlerindeki başarısını ağırlıklı olarak hesaplayarak 
              yıllık başarı durumunu belirler.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">YBP Hesaplama Yöntemi</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              YBP hesaplaması, her dönem için ayrı ayrı yapılan ağırlıklı ortalama hesaplamalarının 
              yıllık ortalamasının alınmasıyla gerçekleştirilir:
            </p>
            <div className="bg-indigo-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-indigo-900 mb-3">Hesaplama Adımları:</h4>
              <ol className="list-decimal list-inside space-y-2 text-indigo-800">
                <li>Her dönem için ağırlıklı ortalama hesaplanır</li>
                <li>Dönem ortalamaları toplanır</li>
                <li>Toplam dönem sayısına bölünür</li>
                <li>Sonuç YBP puanı olarak belirlenir</li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Değerlendirme Bileşenleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              YBP hesaplamasında kullanılan temel değerlendirme bileşenleri şunlardır:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Yazılı Sınavlar:</strong> Genellikle dönemde 2 adet, toplam %50 ağırlık</li>
              <li><strong>Sözlü Değerlendirme:</strong> %20-30 ağırlık oranında</li>
              <li><strong>Performans Ödevleri:</strong> %10-20 ağırlık</li>
              <li><strong>Proje Çalışmaları:</strong> %5-15 ağırlık</li>
              <li><strong>Laboratuvar/Uygulama:</strong> Ders türüne göre değişken</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Standart Ağırlık Dağılımı</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Çoğu lise dersinde kullanılan standart ağırlık dağılımı şu şekildedir:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sınav Türleri</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>1. Yazılı Sınav: %25</li>
                    <li>2. Yazılı Sınav: %25</li>
                    <li>Sözlü Değerlendirme: %25</li>
                    <li>Performans Ödevi: %15</li>
                    <li>Proje Çalışması: %10</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Önemli Notlar</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Ağırlıklar ders türüne göre değişebilir</li>
                    <li>• Öğretmen takdiri ile ayarlanabilir</li>
                    <li>• Toplam %100 olmalıdır</li>
                    <li>• Okul yönetimi onayı gereklidir</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">YBP Başarı Dereceleri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              YBP puanına göre belirlenen başarı dereceleri şu şekildedir:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Başarı Seviyeleri</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>85-100: Pekiyi (AA) - Takdir Belgesi</li>
                  <li>70-84: İyi (BA) - Teşekkür Belgesi</li>
                  <li>60-69: Orta (BB)</li>
                  <li>50-59: Geçer (CB)</li>
                  <li>40-49: Koşullu Geçer (CC)</li>
                  <li>0-39: Başarısız (FF)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Ek Değerlendirmeler</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Takdir belgesi için 85+ YBP</li>
                  <li>• Teşekkür belgesi için 70+ YBP</li>
                  <li>• Geçme notu 50 ve üzeri</li>
                  <li>• Koşullu geçme 40-49 arası</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama Örneği</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Matematik dersinden alınan notlar örneği:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">1. Dönem:</h4>
              <ul className="space-y-1 text-blue-800 mb-4">
                <li>1. Yazılı: 80 (%25) = 80 × 0.25 = 20</li>
                <li>2. Yazılı: 75 (%25) = 75 × 0.25 = 18.75</li>
                <li>Sözlü: 85 (%25) = 85 × 0.25 = 21.25</li>
                <li>Performans: 90 (%15) = 90 × 0.15 = 13.5</li>
                <li>Proje: 95 (%10) = 95 × 0.10 = 9.5</li>
              </ul>
              <p className="font-semibold text-blue-900">1. Dönem Ortalaması: 82.5</p>
              
              <h4 className="font-semibold text-blue-900 mt-4 mb-3">2. Dönem:</h4>
              <ul className="space-y-1 text-blue-800 mb-4">
                <li>Benzer hesaplama ile: 78.0</li>
              </ul>
              
              <p className="font-bold text-green-600 text-lg">
                YBP: (82.5 + 78.0) ÷ 2 = 80.25 - İyi (BA)
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">YBP'nin Önemi</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Sınıf Geçme:</strong> YBP 50 ve üzeri olmalı</li>
              <li><strong>Diploma Notu:</strong> Mezuniyet puanı hesaplamasında kullanılır</li>
              <li><strong>Üniversite Sınavı:</strong> YKS puanının bir bileşenidir</li>
              <li><strong>Burs Başvuruları:</strong> Akademik başarı kriteri olarak değerlendirilir</li>
              <li><strong>Takdir-Teşekkür:</strong> Belge alma kriteridir</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">YBP Artırma Stratejileri</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Tüm değerlendirme türlerine eşit önem verin</li>
              <li>Performans ödevlerini zamanında teslim edin</li>
              <li>Sözlü değerlendirmelere aktif katılım gösterin</li>
              <li>Proje çalışmalarında yaratıcılık gösterin</li>
              <li>Düzenli çalışma programı oluşturun</li>
            </ul>

            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-indigo-900 mb-2">💡 İpucu</h4>
              <p className="text-indigo-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı not senaryolarını deneyebilir ve 
                hangi değerlendirme türlerinde daha fazla çalışmanız gerektiğini belirleyebilirsiniz. 
                YBP'nizi artırmak için tüm bileşenlere dengeli bir yaklaşım sergilemek önemlidir.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Yılsonu Başarı Puanı, lise eğitiminde akademik başarının kapsamlı bir göstergesidir. 
              Bu sistemi doğru anlayarak, tüm değerlendirme türlerinde başarılı olabilir ve 
              akademik hedeflerinize ulaşabilirsiniz. YBP hesaplama aracımız sayesinde mevcut 
              durumunuzu değerlendirebilir ve gelecekteki performansınızı planlayabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default LiseYBPPage;