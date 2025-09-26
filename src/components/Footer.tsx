import React from 'react';
import { Link } from 'react-router-dom';
import AdSenseDisplay from './AdSenseDisplay';
import { Calculator, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Footer Top Ad */}
      <div className="bg-white dark:bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseDisplay size="large" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Hesaplama Araçları</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Kredi, finans, matematik ve daha birçok alanda ücretsiz hesaplama araçları. 
              Hızlı, güvenli ve kullanıcı dostu hesaplamalar için doğru adres.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/kredi" className="hover:text-white transition-colors duration-200">Kredi</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Finans</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Matematik</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Sağlık</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <ul className="space-y-2 text-gray-300 dark:text-gray-400">
              <li><Link to="/iletisim" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">İletişim</Link></li>
              <li><Link to="/gizlilik" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Gizlilik</Link></li>
              <li><Link to="/kullanim-sartlari" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Kullanım Şartları</Link></li>
              <li><Link to="/sss" className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">SSS</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by Hesaplama Araçları
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;