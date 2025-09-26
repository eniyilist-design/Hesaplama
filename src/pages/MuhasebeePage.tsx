import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calculator, TrendingDown, Receipt, DollarSign, Building, Percent, BarChart3, PieChart } from 'lucide-react';

const muhasebeAraclari = [
  {
    id: 'amortisman-hesaplama',
    name: 'Amortisman Hesaplama',
    description: 'Duran varlık amortisman hesaplama ve değer kaybı analizi',
    icon: TrendingDown,
    color: 'from-gray-600 to-slate-700',
    link: '/muhasebe/amortisman-hesaplama',
    active: true
  },
  {
    id: 'kdv-hesaplama',
    name: 'KDV Hesaplama',
    description: 'Katma Değer Vergisi hesaplama ve beyanname hazırlama',
    icon: Receipt,
    color: 'from-blue-600 to-indigo-700',
    active: false
  },
  {
    id: 'gelir-vergisi',
    name: 'Gelir Vergisi Hesaplama',
    description: 'Gelir vergisi matrahı ve vergi hesaplama',
    icon: DollarSign,
    color: 'from-green-600 to-emerald-700',
    active: false
  },
  {
    id: 'sgk-prim',
    name: 'SGK Prim Hesaplama',
    description: 'Sosyal güvenlik primi ve işveren payı hesaplama',
    icon: Building,
    color: 'from-purple-600 to-pink-700',
    active: false
  },
  {
    id: 'stopaj-hesaplama',
    name: 'Stopaj Hesaplama',
    description: 'Gelir ve kurumlar vergisi stopaj hesaplama',
    icon: Percent,
    color: 'from-orange-600 to-red-700',
    active: false
  },
  {
    id: 'bilanço-analizi',
    name: 'Bilanço Analizi',
    description: 'Finansal tablo analizi ve oran hesaplama',
    icon: BarChart3,
    color: 'from-teal-600 to-cyan-700',
    active: false
  },
  {
    id: 'maliyet-hesaplama',
    name: 'Maliyet Hesaplama',
    description: 'Ürün maliyeti ve karlılık analizi',
    icon: PieChart,
    color: 'from-indigo-600 to-purple-700',
    active: false
  },
  {
    id: 'nakit-akis',
    name: 'Nakit Akış Hesaplama',
    description: 'Nakit giriş-çıkış analizi ve projeksiyon',
    icon: Calculator,
    color: 'from-pink-600 to-rose-700',
    active: false
  },
  {
    id: 'faiz-hesaplama',
    name: 'Ticari Faiz Hesaplama',
    description: 'Ticari borç ve alacak faiz hesaplama',
    icon: FileText,
    color: 'from-yellow-600 to-amber-700',
    active: false
  }
];

const MuhasebeePage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Muhasebe Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye muhasebe mevzuatına uygun hesaplama araçları. Amortisman, vergi, SGK ve finansal analiz
          </p>
        </div>

        {/* Muhasebe Araçları Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {muhasebeAraclari.map((arac, index) => {
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
                        <IconComponent className="h-8 w-8 text-white group-hover:text-gray-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                        {arac.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                        {arac.description}
                      </p>
                      <div className="mt-6 flex items-center text-gray-600 group-hover:text-white transition-colors duration-300">
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
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Muhasebe Hesaplama Araçları Nasıl Kullanılır?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verileri Girin</h3>
                <p className="text-gray-600">Varlık bilgileri, tutarlar ve tarihleri girin</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hesaplama Yapın</h3>
                <p className="text-gray-600">Türkiye mevzuatına uygun hesaplama</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuçları Görün</h3>
                <p className="text-gray-600">Detaylı analiz ve muhasebe kayıtları</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MuhasebeePage;