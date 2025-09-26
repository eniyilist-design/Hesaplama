import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Calculator, Clock, Fuel, Car, Navigation, Compass, Map } from 'lucide-react';

const seyahatAraclari = [
  {
    id: 'iller-arasi-mesafe-hesaplama',
    name: 'İller Arası Mesafe Hesaplama',
    description: 'Türkiye şehirleri arası mesafe, süre ve maliyet hesaplama',
    icon: MapPin,
    color: 'from-blue-600 to-indigo-700',
    link: '/seyahat/iller-arasi-mesafe-hesaplama',
    active: true
  },
  {
    id: 'yakit-tuketim-hesaplama',
    name: 'Yakıt Tüketim Hesaplama',
    description: 'Seyahat yakıt maliyeti ve tüketim hesaplama',
    icon: Fuel,
    color: 'from-green-600 to-emerald-700',
    active: false
  },
  {
    id: 'seyahat-butce-hesaplama',
    name: 'Seyahat Bütçe Hesaplama',
    description: 'Tatil ve seyahat bütçesi planlama araçları',
    icon: Calculator,
    color: 'from-purple-600 to-pink-700',
    active: false
  },
  {
    id: 'ucak-bileti-karsilastirma',
    name: 'Uçak Bileti Karşılaştırma',
    description: 'Havayolu şirketleri ve fiyat karşılaştırma',
    icon: Plane,
    color: 'from-orange-600 to-red-700',
    active: false
  },
  {
    id: 'otel-rezervasyon-hesaplama',
    name: 'Otel Rezervasyon Hesaplama',
    description: 'Konaklama maliyeti ve rezervasyon planlama',
    icon: Clock,
    color: 'from-teal-600 to-cyan-700',
    active: false
  },
  {
    id: 'otobus-bilet-hesaplama',
    name: 'Otobüs Bilet Hesaplama',
    description: 'Şehirlerarası otobüs bilet fiyat hesaplama',
    icon: Navigation,
    color: 'from-indigo-600 to-purple-700',
    active: false
  },
  {
    id: 'rent-a-car-hesaplama',
    name: 'Rent A Car Hesaplama',
    description: 'Araç kiralama maliyeti ve süre hesaplama',
    icon: Car,
    color: 'from-pink-600 to-rose-700',
    active: false
  },
  {
    id: 'gps-koordinat-hesaplama',
    name: 'GPS Koordinat Hesaplama',
    description: 'Enlem-boylam koordinatları ve mesafe hesaplama',
    icon: Compass,
    color: 'from-slate-600 to-gray-700',
    active: false
  },
  {
    id: 'harita-olcek-hesaplama',
    name: 'Harita Ölçek Hesaplama',
    description: 'Harita ölçeği ve gerçek mesafe hesaplama',
    icon: Map,
    color: 'from-yellow-600 to-amber-700',
    active: false
  }
];

const SeyahatPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Seyahat Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye içi seyahat mesafe, maliyet ve süre hesaplamaları. Seyahat planlamanızı kolaylaştıran araçlar
          </p>
        </div>

        {/* Seyahat Araçları Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {seyahatAraclari.map((arac, index) => {
            const IconComponent = arac.icon;
            
            return (
              <div key={arac.id} className="group">
                {arac.active ? (
                  <Link to={arac.link} className="block">
                    <div className={`
                      bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 
                      transform hover:-translate-y-2 transition-all duration-300
                      hover:border-transparent group-hover:bg-gradient-to-br group-hover:${arac.color}
                      cursor-pointer h-full
                    `}
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}>
                      <div className={`
                        w-16 h-16 rounded-xl bg-gradient-to-r ${arac.color} 
                        flex items-center justify-center mb-6
                        group-hover:bg-white group-hover:shadow-lg transition-all duration-300
                      `}>
                        <IconComponent className="h-8 w-8 text-white group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                        {arac.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                        {arac.description}
                      </p>
                      <div className="mt-6 flex items-center text-blue-600 group-hover:text-white transition-colors duration-300">
                        <Calculator className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Hesapla</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={`
                    bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 
                    transform hover:-translate-y-1 transition-all duration-300
                    opacity-75 hover:opacity-90 cursor-not-allowed h-full
                  `}
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}>
                    <div className={`
                      w-16 h-16 rounded-xl bg-gradient-to-r ${arac.color} 
                      flex items-center justify-center mb-6 opacity-75
                    `}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {arac.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {arac.description}
                    </p>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full inline-block">
                      Yakında Aktif Olacak
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Seyahat Hesaplama Araçları Nasıl Kullanılır?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Güzergah Seçin</h3>
                <p className="text-gray-600">Çıkış ve varış noktalarını belirleyin</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ulaşım Türü Seçin</h3>
                <p className="text-gray-600">Otomobil, otobüs veya uçak seçenekleri</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuçları Görün</h3>
                <p className="text-gray-600">Mesafe, süre ve maliyet analizi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeyahatPage;