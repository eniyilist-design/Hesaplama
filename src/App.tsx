import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SinavPage from './pages/SinavPage';
import DGSHesaplamaPage from './pages/DGSHesaplamaPage';
import KrediPage from './pages/KrediPage';
import IhtiyacKredisiPage from './pages/IhtiyacKredisiPage';
import KonutKredisiPage from './pages/KonutKredisiPage';
import TasitKredisiPage from './pages/TasitKredisiPage';
import IsYeriKredisiPage from './pages/IsYeriKredisiPage';
import KrediDosyaMasrafiPage from './pages/KrediDosyaMasrafiPage';
import EgitimPage from './pages/EgitimPage';
import DersNotuHesaplamaPage from './pages/DersNotuHesaplamaPage';
import LiseDersPuaniPage from './pages/LiseDersPuaniPage';
import LiseMezuniyetPuaniPage from './pages/LiseMezuniyetPuaniPage';
import LiseOrtalamaPage from './pages/LiseOrtalamaPage';
import LiseSinifGecmePage from './pages/LiseSinifGecmePage';
import LiseYBPPage from './pages/LiseYBPPage';
import OkulaBaslamaYasiPage from './pages/OkulaBaslamaYasiPage';
import UniversiteNotOrtalamasi from './pages/UniversiteNotOrtalamasi';
import VizeFinalOrtalamaPage from './pages/VizeFinalOrtalamaPage';
import FinansPage from './pages/FinansPage';
import AltinHesaplamaPage from './pages/AltinHesaplamaPage';
import SaglikPage from './pages/SaglikPage';
import AdetGunuHesaplamaPage from './pages/AdetGunuHesaplamaPage';
import MatematikPage from './pages/MatematikPage';
import AlanHesaplamaPage from './pages/AlanHesaplamaPage';
import ZamanPage from './pages/ZamanPage';
import YasHesaplamaPage from './pages/YasHesaplamaPage';
import MuhasebeePage from './pages/MuhasebeePage';
import AmortismanHesaplamaPage from './pages/AmortismanHesaplamaPage';
import YuzdeHesaplamaPage from './pages/YuzdeHesaplamaPage';
import FaizHesaplamaPage from './pages/FaizHesaplamaPage';
import VergiPage from './pages/VergiPage';
import DamgaVergisiHesaplamaPage from './pages/DamgaVergisiHesaplamaPage';
import TicaretPage from './pages/TicaretPage';
import ArsaPayiHesaplamaPage from './pages/ArsaPayiHesaplamaPage';
import HukukPage from './pages/HukukPage';
import ArabuluculukUcretiHesaplamaPage from './pages/ArabuluculukUcretiHesaplamaPage';
import SigortaPage from './pages/SigortaPage';
import AracKaskoDegeriHesaplamaPage from './pages/AracKaskoDegeriHesaplamaPage';
import SeyahatPage from './pages/SeyahatPage';
import IllerArasiMesafeHesaplamaPage from './pages/IllerArasiMesafeHesaplamaPage';
import DigerPage from './pages/DigerPage';
import BurcHesaplamaPage from './pages/BurcHesaplamaPage';
import IletisimPage from './pages/IletisimPage';
import GizlilikPage from './pages/GizlilikPage';
import KullanimSartlariPage from './pages/KullanimSartlariPage';
import SSS from './pages/SSS';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sinav" element={<SinavPage />} />
          <Route path="/sinav/dgs-hesaplama" element={<DGSHesaplamaPage />} />
          <Route path="/kredi" element={<KrediPage />} />
          <Route path="/kredi/ihtiyac-kredisi" element={<IhtiyacKredisiPage />} />
          <Route path="/kredi/konut-kredisi" element={<KonutKredisiPage />} />
          <Route path="/kredi/tasit-kredisi" element={<TasitKredisiPage />} />
          <Route path="/kredi/is-yeri-kredisi" element={<IsYeriKredisiPage />} />
          <Route path="/kredi/kredi-dosya-masrafi" element={<KrediDosyaMasrafiPage />} />
          <Route path="/egitim" element={<EgitimPage />} />
          <Route path="/egitim/ders-notu-hesaplama" element={<DersNotuHesaplamaPage />} />
          <Route path="/egitim/lise-ders-puani" element={<LiseDersPuaniPage />} />
          <Route path="/egitim/lise-mezuniyet-puani" element={<LiseMezuniyetPuaniPage />} />
          <Route path="/egitim/lise-ortalama" element={<LiseOrtalamaPage />} />
          <Route path="/egitim/lise-sinif-gecme" element={<LiseSinifGecmePage />} />
          <Route path="/egitim/lise-ybp" element={<LiseYBPPage />} />
          <Route path="/egitim/okula-baslama-yasi" element={<OkulaBaslamaYasiPage />} />
          <Route path="/egitim/universite-not-ortalamasi" element={<UniversiteNotOrtalamasi />} />
          <Route path="/egitim/vize-final-ortalama" element={<VizeFinalOrtalamaPage />} />
          <Route path="/egitim/lise-sinif-gecme" element={<LiseSinifGecmePage />} />
          <Route path="/egitim/lise-ybp" element={<LiseYBPPage />} />
          <Route path="/egitim/okula-baslama-yasi" element={<OkulaBaslamaYasiPage />} />
          <Route path="/egitim/universite-not-ortalamasi" element={<UniversiteNotOrtalamasi />} />
          <Route path="/egitim/vize-final-ortalama" element={<VizeFinalOrtalamaPage />} />
          <Route path="/finans" element={<FinansPage />} />
          <Route path="/finans/altin-hesaplama" element={<AltinHesaplamaPage />} />
          <Route path="/saglik" element={<SaglikPage />} />
          <Route path="/saglik/adet-gunu-hesaplama" element={<AdetGunuHesaplamaPage />} />
          <Route path="/matematik" element={<MatematikPage />} />
          <Route path="/matematik/alan-hesaplama" element={<AlanHesaplamaPage />} />
          <Route path="/matematik/yuzde-hesaplama" element={<YuzdeHesaplamaPage />} />
          <Route path="/matematik/faiz-hesaplama" element={<FaizHesaplamaPage />} />
          <Route path="/zaman" element={<ZamanPage />} />
          <Route path="/zaman/yas-hesaplama" element={<YasHesaplamaPage />} />
          <Route path="/muhasebe" element={<MuhasebeePage />} />
          <Route path="/muhasebe/amortisman-hesaplama" element={<AmortismanHesaplamaPage />} />
          <Route path="/vergi" element={<VergiPage />} />
          <Route path="/vergi/damga-vergisi-hesaplama" element={<DamgaVergisiHesaplamaPage />} />
          <Route path="/ticaret" element={<TicaretPage />} />
          <Route path="/ticaret/arsa-payi-hesaplama" element={<ArsaPayiHesaplamaPage />} />
          <Route path="/hukuk" element={<HukukPage />} />
          <Route path="/hukuk/arabuluculuk-ucreti-hesaplama" element={<ArabuluculukUcretiHesaplamaPage />} />
          <Route path="/sigorta" element={<SigortaPage />} />
          <Route path="/sigorta/arac-kasko-degeri-hesaplama" element={<AracKaskoDegeriHesaplamaPage />} />
          <Route path="/seyahat" element={<SeyahatPage />} />
          <Route path="/seyahat/iller-arasi-mesafe-hesaplama" element={<IllerArasiMesafeHesaplamaPage />} />
          <Route path="/diger" element={<DigerPage />} />
          <Route path="/diger/burc-hesaplama" element={<BurcHesaplamaPage />} />
          <Route path="/iletisim" element={<IletisimPage />} />
          <Route path="/gizlilik" element={<GizlilikPage />} />
          <Route path="/kullanim-sartlari" element={<KullanimSartlariPage />} />
          <Route path="/sss" element={<SSS />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;