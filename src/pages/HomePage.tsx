import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import AdSense from '../components/AdSense';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { 
  CreditCard, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Heart,
  Calculator,
  Clock,
  FileText,
  Receipt,
  ShoppingCart,
  Scale,
  Shield,
  Plane,
  Grid3X3,
  MessageSquare,
  Send
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

const categories = [
  { id: 'kredi', name: 'Kredi', icon: CreditCard, color: 'from-blue-600 to-blue-700', link: '/kredi' },
  { id: 'finans', name: 'Finans', icon: TrendingUp, color: 'from-green-600 to-green-700', link: '/finans' },
  { id: 'sinav', name: 'Sınav', icon: BookOpen, color: 'from-purple-600 to-purple-700', link: '/sinav' },
  { id: 'egitim', name: 'Eğitim', icon: GraduationCap, color: 'from-indigo-600 to-indigo-700', link: '/egitim' },
  { id: 'saglik', name: 'Sağlık', icon: Heart, color: 'from-red-600 to-red-700', link: '/saglik' },
  { id: 'matematik', name: 'Matematik', icon: Calculator, color: 'from-orange-600 to-orange-700', link: '/matematik' },
  { id: 'zaman', name: 'Zaman', icon: Clock, color: 'from-teal-600 to-teal-700', link: '/zaman' },
  { id: 'muhasebe', name: 'Muhasebe', icon: FileText, color: 'from-gray-600 to-gray-700', link: '/muhasebe' },
  { id: 'vergi', name: 'Vergi', icon: Receipt, color: 'from-yellow-600 to-yellow-700', link: '/vergi' },
  { id: 'ticaret', name: 'Ticaret', icon: ShoppingCart, color: 'from-pink-600 to-pink-700', link: '/ticaret' },
  { id: 'hukuk', name: 'Hukuk', icon: Scale, color: 'from-amber-600 to-amber-700', link: '/hukuk' },
  { id: 'sigorta', name: 'Sigorta', icon: Shield, color: 'from-cyan-600 to-cyan-700', link: '/sigorta' },
  { id: 'seyahat', name: 'Seyahat', icon: Plane, color: 'from-emerald-600 to-emerald-700', link: '/seyahat' },
  { id: 'diger', name: 'Diğer', icon: Grid3X3, color: 'from-slate-600 to-slate-700', link: '/diger' }
];

const HomePage: React.FC = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hesaplama Araçları
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Kredi, finans, matematik ve daha birçok alanda ihtiyacınız olan hesaplamaları 
            hızlı ve güvenli bir şekilde yapın. Ücretsiz, kullanıcı dostu araçlarımızla zamandan tasarruf edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/kredi"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Hesaplamaya Başla
            </Link>
            <button 
              onClick={() => {
                const categoriesSection = document.getElementById('categories-section');
                categoriesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            >
              Tüm Kategoriler
            </button>
          </div>
        </div>
      </section>

      {/* Top Banner Ad */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseDisplay size="large" />
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hesaplama Kategorileri
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İhtiyacınız olan hesaplama aracını bulun ve hemen kullanmaya başlayın
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              
              return (
                <div key={category.id} className="group">
                  {category.link ? (
                    <Link to={category.link} className="block">
                      <div className={`
                        bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 
                        transform hover:-translate-y-2 transition-all duration-300
                        hover:border-transparent group-hover:bg-gradient-to-br group-hover:${category.color}
                        cursor-pointer
                      `}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}>
                        <div className={`
                          w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} 
                          flex items-center justify-center mb-4 mx-auto
                          group-hover:bg-white group-hover:shadow-lg transition-all duration-300
                        `}>
                          <IconComponent className="h-6 w-6 text-white group-hover:text-blue-600 transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 text-center">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  ) : (
                    <div className={`
                      bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 
                      transform hover:-translate-y-2 transition-all duration-300
                      hover:border-transparent group-hover:bg-gradient-to-br group-hover:${category.color}
                      cursor-pointer opacity-75 hover:opacity-100
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}>
                      <div className={`
                        w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} 
                        flex items-center justify-center mb-4 mx-auto
                        group-hover:bg-white group-hover:shadow-lg transition-all duration-300
                      `}>
                        <IconComponent className="h-6 w-6 text-white group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 text-center">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Yakında...
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Mid-content Ad */}
          <div className="mt-16">
            <AdSenseDisplay size="medium" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı ve Doğru</h3>
              <p className="text-gray-600">
                Gelişmiş algoritmalarmızla saniyeler içinde doğru sonuçlar alın
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Güvenli ve Gizli</h3>
              <p className="text-gray-600">
                Verileriniz güvende. Hiçbir kişisel bilginizi saklamıyoruz
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ücretsiz Kullanım</h3>
              <p className="text-gray-600">
                Tüm hesaplama araçlarımızı tamamen ücretsiz kullanabilirsiniz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Görüşleriniz Bizim İçin Değerli
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hangi hesaplama aracını ekleyelim? Bir hata mı buldunuz? Önerilerinizi ve geri bildirimlerinizi bizimle paylaşın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Öneri Gönder</span>
            </button>
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Hata Bildir</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)} 
      />
    </main>
  );
};

export default HomePage;