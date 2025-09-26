import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, TrendingUp, Calculator, Target, Calendar, CaseSensitive as University, FileText } from 'lucide-react';

const egitimAraclari = [
  {
    id: 'ders-notu-hesaplama',
    name: 'Ders Notu Hesaplama',
    description: 'Sınav notlarından ders geçme notunu hesaplayın',
    icon: BookOpen,
    color: 'from-blue-600 to-blue-700',
    link: '/egitim/ders-notu-hesaplama',
    active: true
  },
  {
    id: 'lise-ders-puani',
    name: 'Lise Ders Puanı Hesaplama',
    description: 'Lise derslerinin kredi puanlarını hesaplayın',
    icon: Calculator,
    color: 'from-green-600 to-green-700',
    link: '/egitim/lise-ders-puani',
    active: true
  },
  {
    id: 'lise-mezuniyet-puani',
    name: 'Lise Mezuniyet Puanı Hesaplama',
    description: 'Diploma notu ve mezuniyet puanını hesaplayın',
    icon: Award,
    color: 'from-purple-600 to-purple-700',
    link: '/egitim/lise-mezuniyet-puani',
    active: true
  },
  {
    id: 'lise-ortalama',
    name: 'Lise Ortalama Hesaplama',
    description: 'Lise genel not ortalamasını hesaplayın',
    icon: TrendingUp,
    color: 'from-orange-600 to-orange-700',
    link: '/egitim/lise-ortalama',
    active: true
  },
  {
    id: 'lise-sinif-gecme',
    name: 'Lise Sınıf Geçme Hesaplama',
    description: 'Sınıf geçme durumunu kontrol edin',
    icon: Target,
    color: 'from-pink-600 to-pink-700',
    link: '/egitim/lise-sinif-gecme',
    active: true
  },
  {
    id: 'lise-ybp',
    name: 'Lise Yılsonu Başarı Puanı (YBP)',
    description: 'Yılsonu başarı puanınızı hesaplayın',
    icon: GraduationCap,
    color: 'from-indigo-600 to-indigo-700',
    link: '/egitim/lise-ybp',
    active: true
  },
  {
    id: 'okula-baslama-yasi',
    name: 'Okula Başlama Yaşı Hesaplama',
    description: 'Çocuğunuzun okula başlama yaşını hesaplayın',
    icon: Calendar,
    color: 'from-teal-600 to-teal-700',
    link: '/egitim/okula-baslama-yasi',
    active: true
  },
  {
    id: 'universite-not-ortalamasi',
    name: 'Üniversite Not Ortalaması Hesaplama',
    description: 'Üniversite GNO ve AGNO hesaplaması',
    icon: University,
    color: 'from-cyan-600 to-cyan-700',
    link: '/egitim/universite-not-ortalamasi',
    active: true
  },
  {
    id: 'vize-final-ortalama',
    name: 'Vize Final Ortalama Hesaplama',
    description: 'Vize ve final notlarından ders ortalaması',
    icon: FileText,
    color: 'from-emerald-600 to-emerald-700',
    link: '/egitim/vize-final-ortalama',
    active: true
  },
  {
    id: 'okula-baslama-yasi',
    name: 'Okula Başlama Yaşı Hesaplama',
    description: 'Çocuğunuzun okula başlama yaşını hesaplayın',
    icon: Calendar,
    color: 'from-teal-600 to-teal-700',
    link: '/egitim/okula-baslama-yasi',
    active: true
  },
  {
    id: 'universite-not-ortalamasi',
    name: 'Üniversite Not Ortalaması Hesaplama',
    description: 'Üniversite GNO ve AGNO hesaplaması',
    icon: University,
    color: 'from-cyan-600 to-cyan-700',
    link: '/egitim/universite-not-ortalamasi',
    active: true
  },
  {
    id: 'vize-final-ortalama',
    name: 'Vize Final Ortalama Hesaplama',
    description: 'Vize ve final notlarından ders ortalaması',
    icon: FileText,
    color: 'from-emerald-600 to-emerald-700',
    link: '/egitim/vize-final-ortalama',
    active: true
  }
];

const EgitimPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Eğitim Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye eğitim sistemine uygun not hesaplama, ortalama hesaplama ve akademik başarı araçları
          </p>
        </div>

        {/* Eğitim Araçları Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {egitimAraclari.map((arac, index) => {
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
                        <IconComponent className="h-8 w-8 text-white group-hover:text-indigo-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                        {arac.name}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                        {arac.description}
                      </p>
                      <div className="mt-6 flex items-center text-indigo-600 group-hover:text-white transition-colors duration-300">
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
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Türkiye Eğitim Sistemi Hesaplama Araçları
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notları Girin</h3>
                <p className="text-gray-600">Sınav notlarınızı ve ders bilgilerinizi girin</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hesaplama Yapın</h3>
                <p className="text-gray-600">MEB sistemine uygun hesaplama yapın</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuçları Görün</h3>
                <p className="text-gray-600">Detaylı sonuçlar ve öneriler alın</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EgitimPage;