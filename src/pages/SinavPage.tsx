import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Target, TrendingUp, Calculator, FileText, Award, Users } from 'lucide-react';

const sinavAraclari = [
  {
    id: 'dgs-hesaplama',
    name: 'DGS (Dikey Geçiş Sınavı) Hesaplama',
    description: 'Ön lisanstan lisansa geçiş puanınızı hesaplayın',
    icon: GraduationCap,
    color: 'from-purple-600 to-pink-700',
    link: '/sinav/dgs-hesaplama',
    active: true
  },
  {
    id: 'yks-hesaplama',
    name: 'YKS (Yükseköğretim Kurumları Sınavı) Hesaplama',
    description: 'Üniversite sınav puanınızı hesaplayın',
    icon: Target,
    color: 'from-blue-600 to-indigo-700',
    active: false
  },
  {
    id: 'ales-hesaplama',
    name: 'ALES (Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı)',
    description: 'Lisansüstü eğitim sınav puanınızı hesaplayın',
    icon: Award,
    color: 'from-green-600 to-emerald-700',
    active: false
  },
  {
    id: 'kpss-hesaplama',
    name: 'KPSS (Kamu Personeli Seçme Sınavı) Hesaplama',
    description: 'Kamu personeli sınav puanınızı hesaplayın',
    icon: Users,
    color: 'from-orange-600 to-red-700',
    active: false
  },
  {
    id: 'tus-hesaplama',
    name: 'TUS (Tıpta Uzmanlık Sınavı) Hesaplama',
    description: 'Tıp uzmanlık sınav puanınızı hesaplayın',
    icon: FileText,
    color: 'from-red-600 to-pink-700',
    active: false
  },
  {
    id: 'dus-hesaplama',
    name: 'DUS (Diş Hekimliğinde Uzmanlık Sınavı) Hesaplama',
    description: 'Diş hekimliği uzmanlık sınav puanınızı hesaplayın',
    icon: Calculator,
    color: 'from-teal-600 to-cyan-700',
    active: false
  }
];

const SinavPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sınav Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            YKS, DGS, ALES, KPSS ve diğer sınavlar için puan hesaplama araçları. Hedef belirleme ve başarı analizi
          </p>
        </div>

        {/* Sınav Araçları Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sinavAraclari.map((arac, index) => {
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
                        <IconComponent className="h-8 w-8 text-white group-hover:text-purple-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                        {arac.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                        {arac.description}
                      </p>
                      <div className="mt-6 flex items-center text-purple-600 group-hover:text-white transition-colors duration-300">
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
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sınav Hesaplama Araçları Nasıl Kullanılır?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sınav Bilgilerini Girin</h3>
                <p className="text-gray-600">Doğru, yanlış sayıları ve diğer bilgileri girin</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Puan Hesaplama</h3>
                <p className="text-gray-600">ÖSYM sistemine uygun puan hesaplama</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuçları Analiz Edin</h3>
                <p className="text-gray-600">Detaylı analiz ve tercih önerileri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SinavPage;