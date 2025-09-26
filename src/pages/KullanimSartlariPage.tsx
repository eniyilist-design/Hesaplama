import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Scale, AlertTriangle, CheckCircle, ArrowRight, Info, Shield, Users } from 'lucide-react';

const KullanimSartlariPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Kullanım Şartları</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Kullanım Şartları
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Hesaplama Araçları platformunu kullanım koşulları ve kuralları
          </p>
          <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
            <Info className="h-4 w-4 mr-2" />
            <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8 md:p-12">
            
            {/* Kabul Bildirimi */}
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-3 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Kullanım Şartlarının Kabulü
              </h2>
              <p className="text-green-800">
                Bu web sitesini kullanarak, aşağıdaki kullanım şartlarını okuduğunuzu, anladığınızı 
                ve kabul ettiğinizi beyan etmiş olursunuz. Bu şartları kabul etmiyorsanız, 
                lütfen siteyi kullanmayınız.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                1. Hizmet Tanımı
              </h2>
              
              <p className="text-gray-700 mb-6">
                Hesaplama Araçları, kullanıcılara çeşitli alanlarda (kredi, matematik, sağlık, vergi vb.) 
                ücretsiz hesaplama araçları sunan bir web platformudur. Tüm hesaplamalar bilgilendirme 
                amaçlıdır ve profesyonel danışmanlık yerine geçmez.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-3 text-purple-600" />
                2. Kullanıcı Sorumlulukları
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Doğru Bilgi Girişi</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Hesaplama araçlarına doğru ve güncel bilgiler girmelisiniz</li>
                <li>Yanlış bilgi girişinden doğacak sonuçlardan sorumlu değiliz</li>
                <li>Hesaplama sonuçlarını kendi sorumluluğunuzda değerlendirmelisiniz</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Yasalara Uygunluk</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Siteyi yasalara uygun şekilde kullanmalısınız</li>
                <li>Zararlı yazılım, spam veya kötüye kullanım yasaktır</li>
                <li>Diğer kullanıcıların haklarına saygı göstermelisiniz</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hizmet Sınırlamaları</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
                <div className="flex items-center text-yellow-800 mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <strong>Önemli Uyarı</strong>
                </div>
                <p className="text-yellow-700 text-sm">
                  Hesaplama sonuçları sadece bilgilendirme amaçlıdır. Finansal, hukuki, tıbbi 
                  veya vergi konularında profesyonel danışmanlık almadan karar vermeyiniz.
                </p>
              </div>

              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Bilgilendirme Amaçlı:</strong> Sonuçlar tavsiye niteliği taşımaz</li>
                <li><strong>Doğruluk Garantisi Yok:</strong> Hesaplamalarda hata olabilir</li>
                <li><strong>Güncellik:</strong> Veriler ve oranlar değişebilir</li>
                <li><strong>Profesyonel Danışmanlık:</strong> Uzman görüşü alınmalıdır</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Fikri Mülkiyet Hakları</h2>
              
              <p className="text-gray-700 mb-4">
                Bu sitedeki tüm içerik, tasarım, kod ve hesaplama algoritmaları Hesaplama Araçları'na aittir:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Telif Hakları:</strong> Tüm içerik telif hakkı ile korunur</li>
                <li><strong>Marka Hakları:</strong> Logo ve marka adı tescillidir</li>
                <li><strong>Kod Hakları:</strong> Kaynak kod ve algoritmalar korunur</li>
                <li><strong>İzinsiz Kullanım:</strong> İzinsiz kopyalama yasaktır</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Hizmet Kesintileri</h2>
              
              <p className="text-gray-700 mb-6">
                Aşağıdaki durumlarda hizmet kesintisi yaşanabilir ve bundan sorumlu değiliz:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Planlı bakım ve güncellemeler</li>
                <li>Teknik arızalar ve sunucu sorunları</li>
                <li>İnternet altyapı sorunları</li>
                <li>Güvenlik tehditleri nedeniyle geçici kapatmalar</li>
                <li>Yasal düzenlemeler gereği erişim kısıtlamaları</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sorumluluk Reddi</h2>
              
              <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Sorumluluk Sınırlaması:</strong> Hesaplama sonuçlarına dayanarak alınan 
                  kararlardan, oluşabilecek zararlardan veya kayıplardan sorumlu değiliz. 
                  Tüm hesaplamalar kullanıcının kendi sorumluluğundadır.
                </p>
              </div>

              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Hesaplama hatalarından doğan zararlar</li>
                <li>Güncel olmayan verilerden kaynaklanan sorunlar</li>
                <li>Üçüncü taraf hizmetlerden kaynaklanan sorunlar</li>
                <li>Hizmet kesintilerinden doğan kayıplar</li>
                <li>Kötüye kullanımdan doğan zararlar</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Yasaklı Kullanımlar</h2>
              
              <p className="text-gray-700 mb-4">Aşağıdaki kullanımlar kesinlikle yasaktır:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Otomatik Erişim:</strong> Bot, crawler veya otomatik araçlar</li>
                <li><strong>Aşırı Kullanım:</strong> Sunucu kaynaklarını tüketen kullanım</li>
                <li><strong>Zararlı İçerik:</strong> Virüs, malware veya zararlı kod</li>
                <li><strong>Telif İhlali:</strong> İçeriklerin izinsiz kopyalanması</li>
                <li><strong>Yanıltıcı Bilgi:</strong> Kasıtlı yanlış bilgi paylaşımı</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Hesaplama Doğruluğu</h2>
              
              <p className="text-gray-700 mb-6">
                Hesaplama araçlarımızın doğruluğu için elimizden geleni yapıyoruz, ancak:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Hesaplama sonuçları yaklaşık değerlerdir</li>
                <li>Gerçek durumlar daha karmaşık olabilir</li>
                <li>Yasal düzenlemeler değişebilir</li>
                <li>Profesyonel doğrulama önerilir</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Reklam Politikası</h2>
              
              <p className="text-gray-700 mb-6">
                Sitemizde Google AdSense reklamları gösterilir. Bu reklamlar:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Üçüncü taraf şirketler tarafından sağlanır</li>
                <li>Kullanıcı davranışlarına göre kişiselleştirilebilir</li>
                <li>Çerezler kullanarak hedefleme yapabilir</li>
                <li>Reklam içeriğinden sorumlu değiliz</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Uygulanacak Hukuk</h2>
              
              <p className="text-gray-700 mb-6">
                Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. 
                Uyuşmazlıklar İstanbul mahkemelerinde çözülür. Türkçe metin esas alınır, 
                çeviriler sadece kolaylık içindir.
              </p>

              <div className="mt-8 p-6 bg-green-50 rounded-xl">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Şartların Kabulü
                </h3>
                <p className="text-green-800">
                  Bu siteyi kullanmaya devam ederek, yukarıdaki tüm kullanım şartlarını 
                  okuduğunuzu, anladığınızı ve kabul ettiğinizi onaylamış olursunuz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KullanimSartlariPage;