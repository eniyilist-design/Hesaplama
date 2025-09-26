import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Database, ArrowRight, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const GizlilikPage: React.FC = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Gizlilik Politikası</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gizlilik Politikası
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Kişisel verilerinizin korunması bizim için önceliklidir
          </p>
          <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
            <Info className="h-4 w-4 mr-2" />
            <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8 md:p-12">
            
            {/* Özet */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Gizlilik Politikası Özeti
              </h2>
              <p className="text-blue-800">
                Hesaplama Araçları olarak, kullanıcılarımızın gizliliğini korumayı ve kişisel verilerini 
                güvenli bir şekilde işlemeyi taahhüt ediyoruz. Bu politika, hangi verileri topladığımızı, 
                nasıl kullandığımızı ve haklarınızı açıklar.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 mr-3 text-green-600" />
                1. Topladığımız Bilgiler
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Otomatik Olarak Toplanan Bilgiler</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü, işletim sistemi</li>
                <li><strong>Kullanım Verileri:</strong> Ziyaret edilen sayfalar, tıklama verileri, oturum süresi</li>
                <li><strong>Çerezler:</strong> Site performansı ve kullanıcı deneyimi için</li>
                <li><strong>Analytics:</strong> Google Analytics aracılığıyla anonim istatistikler</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Gönüllü Olarak Paylaştığınız Bilgiler</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>İletişim Formu:</strong> Ad, e-posta, mesaj içeriği</li>
                <li><strong>Geri Bildirim:</strong> Öneri ve hata bildirimleri</li>
                <li><strong>Hesaplama Verileri:</strong> Sadece geçici olarak işlenir, saklanmaz</li>
              </ul>

              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="flex items-center text-green-800 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <strong>Önemli Not</strong>
                </div>
                <p className="text-green-700 text-sm">
                  Hesaplama araçlarımızda girdiğiniz veriler (kredi tutarı, yaş, tarih vb.) 
                  hiçbir şekilde sunucularımızda saklanmaz. Tüm hesaplamalar tarayıcınızda yapılır.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-purple-600" />
                2. Bilgileri Nasıl Kullanıyoruz
              </h2>
              
              <p className="text-gray-700 mb-4">Topladığımız bilgileri şu amaçlarla kullanıyoruz:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Hizmet Sağlama:</strong> Hesaplama araçlarının çalışmasını sağlamak</li>
                <li><strong>Site İyileştirme:</strong> Kullanıcı deneyimini geliştirmek</li>
                <li><strong>İletişim:</strong> Sorularınızı yanıtlamak ve destek sağlamak</li>
                <li><strong>Güvenlik:</strong> Kötüye kullanımı önlemek ve güvenliği sağlamak</li>
                <li><strong>Analytics:</strong> Site performansını analiz etmek</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-3 text-red-600" />
                3. Bilgi Güvenliği
              </h2>
              
              <p className="text-gray-700 mb-4">Verilerinizin güvenliği için aldığımız önlemler:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>SSL Şifreleme:</strong> Tüm veri transferleri şifrelenir</li>
                <li><strong>Güvenli Sunucular:</strong> Veriler güvenli sunucularda saklanır</li>
                <li><strong>Erişim Kontrolü:</strong> Sadece yetkili personel erişebilir</li>
                <li><strong>Düzenli Yedekleme:</strong> Veri kaybını önlemek için</li>
                <li><strong>Güvenlik Güncellemeleri:</strong> Sistemler düzenli güncellenir</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Çerezler (Cookies)</h2>
              
              <p className="text-gray-700 mb-4">Sitemizde kullanılan çerez türleri:</p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Zorunlu Çerezler</h4>
                  <p className="text-sm text-gray-700">
                    Sitenin temel işlevlerinin çalışması için gerekli çerezler. 
                    Bu çerezler devre dışı bırakılamaz.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics Çerezleri</h4>
                  <p className="text-sm text-gray-700">
                    Site kullanımını analiz etmek ve iyileştirmeler yapmak için 
                    kullanılan anonim çerezler.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Üçüncü Taraf Hizmetleri</h2>
              
              <p className="text-gray-700 mb-4">Sitemizde kullanılan üçüncü taraf hizmetleri:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Google Analytics:</strong> Site kullanım istatistikleri</li>
                <li><strong>Google AdSense:</strong> Reklam gösterimi</li>
                <li><strong>CDN Hizmetleri:</strong> Site hızlandırma</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
                <div className="flex items-center text-yellow-800 mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <strong>Önemli Bilgi</strong>
                </div>
                <p className="text-yellow-700 text-sm">
                  Bu üçüncü taraf hizmetlerin kendi gizlilik politikaları vardır. 
                  Bu hizmetleri kullanarak onların politikalarını da kabul etmiş olursunuz.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Haklarınız</h2>
              
              <p className="text-gray-700 mb-4">KVKK kapsamında sahip olduğunuz haklar:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Bilgi Alma Hakkı:</strong> Hangi verilerinizin işlendiğini öğrenme</li>
                <li><strong>Düzeltme Hakkı:</strong> Yanlış verilerin düzeltilmesini isteme</li>
                <li><strong>Silme Hakkı:</strong> Verilerinizin silinmesini talep etme</li>
                <li><strong>İtiraz Hakkı:</strong> Veri işlemeye itiraz etme</li>
                <li><strong>Taşınabilirlik Hakkı:</strong> Verilerinizi başka platforma taşıma</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Veri Saklama Süreleri</h2>
              
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>İletişim Verileri:</strong> 3 yıl süreyle saklanır</li>
                <li><strong>Analytics Verileri:</strong> 26 ay süreyle saklanır (Google Analytics)</li>
                <li><strong>Çerez Verileri:</strong> Çerez türüne göre 1-24 ay arası</li>
                <li><strong>Hesaplama Verileri:</strong> Hiç saklanmaz (sadece tarayıcıda işlenir)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Çocukların Gizliliği</h2>
              
              <p className="text-gray-700 mb-6">
                Sitemiz 13 yaş altı çocuklardan bilerek kişisel bilgi toplamaz. 
                Eğer 13 yaş altı bir çocuğun bilgilerini topladığımızı fark edersek, 
                bu bilgileri derhal sileriz. Ebeveynler, çocuklarının online aktivitelerini 
                denetlemeli ve gerektiğinde bizimle iletişime geçmelidir.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Politika Değişiklikleri</h2>
              
              <p className="text-gray-700 mb-6">
                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
                olduğunda sitemizde duyuru yapacağız. Politikayı düzenli olarak gözden geçirmenizi 
                öneririz. Son güncelleme tarihi sayfanın üst kısmında belirtilmiştir.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. İletişim</h2>
              
              <p className="text-gray-700 mb-4">
                Gizlilik politikamız hakkında sorularınız varsa bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-gray-50 p-6 rounded-xl">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>E-posta:</strong> privacy@hesaplama-araclari.com</li>
                  <li><strong>Telefon:</strong> +90 (212) 555 0123</li>
                  <li><strong>Posta Adresi:</strong> Hesaplama Araçları Ltd. Şti., İstanbul, Türkiye</li>
                </ul>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">KVKK Uyumluluğu</h3>
                <p className="text-blue-800">
                  Bu gizlilik politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
                  ve ilgili mevzuata uygun olarak hazırlanmıştır. Kişisel verileriniz, yasal 
                  gereklilikler çerçevesinde işlenir ve korunur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GizlilikPage;