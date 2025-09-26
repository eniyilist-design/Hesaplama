import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Car, Home, Heart, Calculator, Briefcase, Baby, Activity, Stethoscope } from 'lucide-react';

const sigortaAraclari = [
  {
    id: 'arac-kasko-degeri-hesaplama',
    name: 'Araç Kasko Değeri Hesaplama',
    description: '2025 TSB güncel verilerine göre araç kasko değeri ve sigorta primi hesaplama',
    icon: Car,
    color: 'from-cyan-600 to-blue-700',
    link: '/sigorta/arac-kasko-degeri-hesaplama',
    active: true
  },
  {
    id: 'trafik-sigortasi-hesaplama',
    name: 'Trafik Sigortası Hesaplama',
    description: 'Zorunlu trafik sigortası primi hesaplama ve karşılaştırma',
    icon: Shield,
    color: 'from-red-600 to-orange-700',
    active: false
  },
  {
    id: 'konut-sigortasi-hesaplama',
    name: 'Konut Sigortası Hesaplama',
    description: 'Ev sigortası primi ve teminat hesaplama araçları',
    icon: Home,
    color: 'from-green-600 to-emerald-700',
    active: false
  },
  {
    id: 'hayat-sigortasi-hesaplama',
    name: 'Hayat Sigortası Hesaplama',
    description: 'Hayat sigortası primi ve teminat tutarı hesaplama',
    icon: Heart,
    color: 'from-pink-600 to-rose-700',
    active: false
  },
  {
    id: 'saglik-sigortasi-hesaplama',
    name: 'Sağlık Sigortası Hesaplama',
    description: 'Özel sağlık sigortası primi ve teminat hesaplama',
    icon: Stethoscope,
    color: 'from-purple-600 to-pink-700',
    active: false
  },
  {
    id: 'isyeri-sigortasi-hesaplama',
    name: 'İşyeri Sigortası Hesaplama',
    description: 'İşyeri sigortası primi ve risk analizi',
    icon: Briefcase,
    color: 'from-indigo-600 to-purple-700',
    active: false
  },
  {
    id: 'ferdi-kaza-sigortasi',
    name: 'Ferdi Kaza Sigortası Hesaplama',
    description: 'Kişisel kaza sigortası primi hesaplama',
    icon: Activity,
    color: 'from-orange-600 to-red-700',
    active: false
  },
  {
    id: 'cocuk-egitim-sigortasi',
    name: 'Çocuk Eğitim Sigortası Hesaplama',
    description: 'Eğitim sigortası primi ve birikim hesaplama',
    icon: Baby,
    color: 'from-teal-600 to-cyan-700',
    active: false
  },
  {
    id: 'emeklilik-sigortasi',
    name: 'Bireysel Emeklilik Sigortası',
    description: 'BES primi ve emeklilik birikimi hesaplama',
    icon: Calculator,
    color: 'from-slate-600 to-gray-700',
    active: false
  }
];

const SigortaPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Sigorta Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            2025 yılı güncel TSB verilerine göre kasko, trafik, konut ve diğer sigorta hesaplamalarınızı yapın
          </p>
        </div>

        {/* Sigorta Araçları Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sigortaAraclari.map((arac, index) => {
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
                        <IconComponent className="h-8 w-8 text-white group-hover:text-cyan-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                        {arac.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                        {arac.description}
                      </p>
                      <div className="mt-6 flex items-center text-cyan-600 group-hover:text-white transition-colors duration-300">
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
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2025 Yılı Sigorta Hesaplama Araçları
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bilgileri Girin</h3>
                <p className="text-gray-600">Araç, konut veya kişi bilgilerini detaylı girin</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Analizi</h3>
                <p className="text-gray-600">TSB verilerine göre risk değerlendirme</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuçları Görün</h3>
                <p className="text-gray-600">Detaylı sigorta analizi ve prim hesaplama</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SigortaPage;