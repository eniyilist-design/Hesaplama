import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Building, BarChart3, Calculator, Home, TrendingUp, MapPin, DollarSign, FileText } from 'lucide-react';

const ticaretAraclari = [
  {
    id: 'arsa-payi-hesaplama',
    name: 'Arsa Payı Hesaplama',
    description: 'Gayrimenkul arsa payı ve hisse oranı hesaplama araçları',
    icon: MapPin,
    color: 'from-emerald-600 to-green-700',
    link: '/ticaret/arsa-payi-hesaplama',
    active: true
  },
  {
    id: 'emlak-deger-hesaplama',
    name: 'Emlak Değer Hesaplama',
    description: 'Gayrimenkul değer tespiti ve piyasa analizi',
    icon: Home,
    color: 'from-blue-600 to-indigo-700',
    active: false
  },
  {
    id: 'kira-getiri-hesaplama',
    name: 'Kira Getiri Hesaplama',
    description: 'Gayrimenkul kira getirisi ve yatırım analizi',
    icon: TrendingUp,
    color: 'from-purple-600 to-pink-700',
    active: false
  },
  {
    id: 'ticari-kar-hesaplama',
    name: 'Ticari Kar Hesaplama',
    description: 'İşletme kar-zarar hesaplama ve analiz araçları',
    icon: BarChart3,
    color: 'from-orange-600 to-red-700',
    active: false
  },
  {
    id: 'stok-hesaplama',
    name: 'Stok Hesaplama',
    description: 'Stok yönetimi ve envanter hesaplama araçları',
    icon: Building,
    color: 'from-teal-600 to-cyan-700',
    active: false
  },
  {
    id: 'doviz-hesaplama',
    name: 'Döviz Hesaplama',
    description: 'Döviz alım-satım ve kur hesaplama araçları',
    icon: DollarSign,
    color: 'from-indigo-600 to-purple-700',
    active: false
  },
  {
    id: 'fatura-hesaplama',
    name: 'Fatura Hesaplama',
    description: 'Ticari fatura ve KDV hesaplama araçları',
    icon: FileText,
    color: 'from-pink-600 to-rose-700',
    active: false
  },
  {
    id: 'maliyet-hesaplama',
    name: 'Maliyet Hesaplama',
    description: 'Ürün maliyeti ve fiyatlandırma hesaplama',
    icon: Calculator,
    color: 'from-slate-600 to-gray-700',
    active: false
  },
  {
    id: 'kar-marji-hesaplama',
    name: 'Kar Marjı Hesaplama',
    description: 'Ticari kar marjı ve karlılık analizi',
    icon: ShoppingCart,
    color: 'from-yellow-600 to-amber-700',
    active: false
  }
];

const TicaretPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Ticaret Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gayrimenkul, ticari kar-zarar, stok yönetimi ve döviz hesaplamalarınızı kolayca yapın
          </p>
        </div>

        {/* Ticaret Araçları Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ticaretAraclari.map((arac, index) => {
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
                        <IconComponent className="h-8 w-8 text-white group-hover:text-pink-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                        {arac.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                        {arac.description}
                      </p>
                      <div className="mt-6 flex items-center text-pink-600 group-hover:text-white transition-colors duration-300">
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
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ticaret Hesaplama Araçları Nasıl Kullanılır?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verileri Girin</h3>
                <p className="text-gray-600">Ticari veriler, fiyat bilgileri ve oranları girin</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analiz Yapın</h3>
                <p className="text-gray-600">Ticari hesaplama ve karlılık analizi</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuçları Görün</h3>
                <p className="text-gray-600">Detaylı ticari analiz ve öneriler</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TicaretPage;