import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const kategoriler = [
    {
      id: 'temel',
      name: 'Temel',
      items: [
        { name: 'Kredi', link: '/kredi' },
        { name: 'Matematik', link: '/matematik' },
        { name: 'Zaman', link: '/zaman' },
        { name: 'Sağlık', link: '/saglik' }
      ]
    },
    {
      id: 'egitim-sinav',
      name: 'Eğitim & Sınav',
      items: [
        { name: 'Sınav', link: '/sinav' },
        { name: 'Eğitim', link: '/egitim' }
      ]
    },
    {
      id: 'finans-ticaret',
      name: 'Finans & Ticaret',
      items: [
        { name: 'Finans', link: '/finans' },
        { name: 'Ticaret', link: '/ticaret' },
        { name: 'Muhasebe', link: '/muhasebe' },
        { name: 'Vergi', link: '/vergi' }
      ]
    },
    {
      id: 'hukuk-sigorta',
      name: 'Hukuk & Sigorta',
      items: [
        { name: 'Hukuk', link: '/hukuk' },
        { name: 'Sigorta', link: '/sigorta' }
      ]
    },
    {
      id: 'diger',
      name: 'Diğer',
      items: [
        { name: 'Seyahat', link: '/seyahat' },
        { name: 'Diğer', link: '/diger' }
      ]
    }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hesaplama Araçları
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {kategoriler.map((kategori) => (
              <div key={kategori.id} className="relative">
                <button
                  onMouseEnter={() => setDropdownOpen(kategori.id)}
                  onMouseLeave={() => setDropdownOpen(null)}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <span>{kategori.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen === kategori.id && (
                  <div
                    onMouseEnter={() => setDropdownOpen(kategori.id)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {kategori.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="space-y-4">
              {kategoriler.map((kategori) => (
                <div key={kategori.id}>
                  <div className="font-semibold text-gray-900 mb-2 px-2">{kategori.name}</div>
                  <div className="space-y-1 ml-4">
                    {kategori.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;