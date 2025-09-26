import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdSenseInFeed from '../components/AdSenseInFeed';
import AdSenseDisplay from '../components/AdSenseDisplay';
import { Calculator, TrendingUp, DollarSign, Percent, ArrowRight, Info, Target, BarChart3, Plus, Minus } from 'lucide-react';

interface FaizInputs {
  hesaplamaTuru: string;
  anaParaP: number;
  faizOraniR: number;
  sureGun: number;
  sureYil: number;
  vergiOrani: number;
  bileşikTuru: string;
  hedefTutar: number;
  faizOraniTuru: string;
}

interface FaizSonuc {
  faizTutari: number;
  netGetiri: number;
  toplamTutar: number;
  vergiTutari: number;
  efektifFaizOrani: number;
  gunlukFaiz: number;
  aylikFaiz: number;
  yillikFaiz: number;
  formul: string;
  aciklama: string;
  hesaplamaDetayi: string;
}

const hesaplamaTurleri = [
  { 
    value: 'basit-faiz', 
    label: 'Basit Faiz (Mevduat/Yasal Faiz)', 
    aciklama: 'Günlük bazda hesaplanan basit faiz',
    formul: 'Faiz = P × r × (d/DC)'
  },
  { 
    value: 'bilesik-ayni-oran', 
    label: 'Bileşik Faiz - Aynı Oran', 
    aciklama: 'Eşit dönem, eşit oran bileşik faiz',
    formul: 'FV = P(1 + i)^n'
  },
  { 
    value: 'bilesik-gunluk', 
    label: 'Bileşik Faiz - Günlük', 
    aciklama: 'Günlük değerlenen bileşik faiz',
    formul: 'FV = P(1 + r/DC)^d'
  },
  { 
    value: 'bilesik-surekli', 
    label: 'Sürekli Bileşik Faiz', 
    aciklama: 'Sürekli faiz hesaplama',
    formul: 'FV = P × e^(rt)'
  },
  { 
    value: 'nominal-efektif', 
    label: 'Nominal → Efektif Yıllık', 
    aciklama: 'Nominal faizden efektif faiz hesaplama',
    formul: 'EAR = (1 + r/m)^m - 1'
  }
];

const bileşikTurleri = [
  { value: 'yillik', label: 'Yıllık', carpan: 1 },
  { value: 'aylik', label: 'Aylık', carpan: 12 },
  { value: 'gunluk', label: 'Günlük', carpan: 365 }
];

const faizOraniTurleri = [
  { value: 'yillik', label: 'Yıllık (%)', carpan: 1 },
  { value: 'aylik', label: 'Aylık (%)', carpan: 12 },
  { value: 'gunluk', label: 'Günlük (%)', carpan: 365 }
];
const benzerAraclar = [
  { name: 'Yüzde Hesaplama', icon: Percent, link: '/matematik/yuzde-hesaplama', active: true },
  { name: 'Alan Hesaplama', icon: Calculator, link: '/matematik/alan-hesaplama', active: true },
  { name: 'Hacim Hesaplama', icon: BarChart3, link: '#', active: false }
];

const FaizHesaplamaPage: React.FC = () => {
  const [inputs, setInputs] = useState<FaizInputs>({
    hesaplamaTuru: 'basit-faiz',
    anaParaP: 10000,
    faizOraniR: 15,
    sureGun: 365,
    sureYil: 1,
    vergiOrani: 10,
    bileşikTuru: 'yillik',
    hedefTutar: 12000,
    faizOraniTuru: 'yillik'
  });
  
  const [sonuc, setSonuc] = useState<FaizSonuc | null>(null);

  const hesapla = () => {
    const { hesaplamaTuru, anaParaP, faizOraniR, sureGun, sureYil, vergiOrani, bileşikTuru, hedefTutar, faizOraniTuru } = inputs;
    
    let faizTutari = 0;
    let toplamTutar = 0;
    let formul = '';
    let aciklama = '';
    let hesaplamaDetayi = '';
    
    // Faiz oranını yıllık orana çevir
    const faizOraniTipi = faizOraniTurleri.find(f => f.value === faizOraniTuru);
    const yillikFaizOrani = faizOraniR * (faizOraniTipi?.carpan || 1);
    const r = yillikFaizOrani / 100; // Yıllık faiz oranı (ondalık)
    const DC = 365; // Gün sayısı (bankalar genelde 365 kullanır)
    const tau = vergiOrani / 100; // Vergi oranı
    
    switch (hesaplamaTuru) {
      case 'basit-faiz':
        // Basit faiz: Faiz = P × r × (d/DC)
        faizTutari = anaParaP * r * (sureGun / DC);
        toplamTutar = anaParaP + faizTutari;
        formul = `Faiz = ${anaParaP} × ${r.toFixed(4)} × (${sureGun}/${DC})`;
        aciklama = `${sureGun} gün için basit faiz hesaplama`;
        hesaplamaDetayi = `${anaParaP} TL ana para, %${faizOraniR} ${faizOraniTipi?.label.toLowerCase()} faiz (yıllık %${yillikFaizOrani}), ${sureGun} gün`;
        break;
      
      case 'bilesik-ayni-oran':
        // Bileşik faiz - aynı oran: FV = P(1 + i)^n
        const bileşikCarpan = bileşikTurleri.find(b => b.value === bileşikTuru)?.carpan || 1;
        const i = r / bileşikCarpan; // Dönemlik faiz oranı
        const n = sureYil * bileşikCarpan; // Dönem sayısı
        
        toplamTutar = anaParaP * Math.pow(1 + i, n);
        faizTutari = toplamTutar - anaParaP;
        formul = `FV = ${anaParaP} × (1 + ${i.toFixed(6)})^${n}`;
        aciklama = `${bileşikTuru} bileşik faiz, ${sureYil} yıl`;
        hesaplamaDetayi = `${anaParaP} TL ana para, %${faizOraniR} yıllık faiz, ${n} dönem`;
        break;
      
      case 'bilesik-gunluk':
        // Günlük bileşik faiz: FV = P(1 + r/DC)^d
        toplamTutar = anaParaP * Math.pow(1 + r / DC, sureGun);
        faizTutari = toplamTutar - anaParaP;
        formul = `FV = ${anaParaP} × (1 + ${(r/DC).toFixed(8)})^${sureGun}`;
        aciklama = `Günlük değerlenen bileşik faiz`;
        hesaplamaDetayi = `${anaParaP} TL ana para, günlük %${(faizOraniR/365).toFixed(4)} faiz`;
        break;
      
      case 'bilesik-surekli':
        // Sürekli bileşik faiz: FV = P × e^(rt)
        const t = sureGun / 365; // Yıl cinsinden süre
        toplamTutar = anaParaP * Math.exp(r * t);
        faizTutari = toplamTutar - anaParaP;
        formul = `FV = ${anaParaP} × e^(${r.toFixed(4)} × ${t.toFixed(4)})`;
        aciklama = `Sürekli faiz hesaplama`;
        hesaplamaDetayi = `${anaParaP} TL ana para, %${faizOraniR} sürekli faiz`;
        break;
      
      case 'nominal-efektif':
        // Nominal → Efektif: EAR = (1 + r/m)^m - 1
        const m = bileşikTurleri.find(b => b.value === bileşikTuru)?.carpan || 1;
        const efektifOran = Math.pow(1 + r / m, m) - 1;
        
        // 1 yıllık hesaplama
        toplamTutar = anaParaP * (1 + efektifOran);
        faizTutari = toplamTutar - anaParaP;
        formul = `EAR = (1 + ${r.toFixed(4)}/${m})^${m} - 1 = ${(efektifOran * 100).toFixed(4)}%`;
        aciklama = `Nominal %${faizOraniR} → Efektif %${(efektifOran * 100).toFixed(2)}`;
        hesaplamaDetayi = `${m} dönemlik bileşik faizden efektif yıllık oran`;
        break;
    }
    
    // Vergi hesaplama
    const vergiTutari = faizTutari * tau;
    const netGetiri = faizTutari - vergiTutari;
    
    // Efektif faiz oranı
    const efektifFaizOrani = anaParaP > 0 ? (netGetiri / anaParaP) * 100 : 0;
    
    // Dönemsel faiz hesaplamaları
    const gunlukFaiz = faizTutari / Math.max(sureGun, 1);
    const aylikFaiz = faizTutari / Math.max(sureYil * 12, 1);
    const yillikFaiz = faizTutari / Math.max(sureYil, 1);
    
    setSonuc({
      faizTutari,
      netGetiri,
      toplamTutar,
      vergiTutari,
      efektifFaizOrani,
      gunlukFaiz,
      aylikFaiz,
      yillikFaiz,
      formul,
      aciklama,
      hesaplamaDetayi
    });
  };

  useEffect(() => {
    hesapla();
  }, [inputs]);

  const handleInputChange = (field: keyof FaizInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedHesaplama = () => {
    return hesaplamaTurleri.find(h => h.value === inputs.hesaplamaTuru);
  };

  const getInputLabels = () => {
    switch (inputs.hesaplamaTuru) {
      case 'basit-faiz':
        return { 
          showGun: true, 
          showYil: false, 
          showBileşik: false, 
          showHedef: false,
         showFaizOraniTuru: true,
          anaParaLabel: 'Ana Para (P)',
         faizLabel: `${faizOraniTurleri.find(f => f.value === inputs.faizOraniTuru)?.label || 'Faiz Oranı (%)'}`,
          sureLabel: 'Süre (Gün)'
        };
      case 'bilesik-ayni-oran':
        return { 
          showGun: false, 
          showYil: true, 
          showBileşik: true, 
          showHedef: false,
         showFaizOraniTuru: false,
          anaParaLabel: 'Ana Para (P)',
          faizLabel: 'Dönemlik Faiz Oranı (%)',
          sureLabel: 'Süre (Yıl)'
        };
      case 'bilesik-gunluk':
        return { 
          showGun: true, 
          showYil: false, 
          showBileşik: false, 
          showHedef: false,
         showFaizOraniTuru: false,
          anaParaLabel: 'Ana Para (P)',
          faizLabel: 'Yıllık Faiz Oranı (%)',
          sureLabel: 'Süre (Gün)'
        };
      case 'bilesik-surekli':
        return { 
          showGun: true, 
          showYil: false, 
          showBileşik: false, 
          showHedef: false,
         showFaizOraniTuru: false,
          anaParaLabel: 'Ana Para (P)',
          faizLabel: 'Sürekli Faiz Oranı (%)',
          sureLabel: 'Süre (Gün)'
        };
      case 'nominal-efektif':
        return { 
          showGun: false, 
          showYil: false, 
          showBileşik: true, 
          showHedef: false,
         showFaizOraniTuru: false,
          anaParaLabel: 'Ana Para (P)',
          faizLabel: 'Nominal Yıllık Oran (%)',
          sureLabel: 'Bileşik Dönem'
        };
      default:
        return { 
          showGun: true, 
          showYil: false, 
          showBileşik: false, 
          showHedef: false,
         showFaizOraniTuru: false,
          anaParaLabel: 'Ana Para (P)',
          faizLabel: 'Faiz Oranı (%)',
          sureLabel: 'Süre'
        };
    }
  };

  const inputLabels = getInputLabels();

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600 transition-colors">Ana Sayfa</Link>
          <ArrowRight className="h-4 w-4" />
          <Link to="/matematik" className="hover:text-green-600 transition-colors">Matematik</Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Faiz Hesaplama</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Faiz Hesaplama
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Basit faiz, bileşik faiz ve efektif faiz hesaplamalarını kolayca yapın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Top Ad */}
          <div className="lg:col-span-3">
            <AdSenseDisplay size="large" />
          </div>
          
          {/* Hesaplama Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 mr-3 text-green-600" />
                Faiz Hesaplama Türü
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hesaplama Türü
                  </label>
                  <select
                    value={inputs.hesaplamaTuru}
                    onChange={(e) => handleInputChange('hesaplamaTuru', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                  >
                    {hesaplamaTurleri.map(tur => (
                      <option key={tur.value} value={tur.value}>
                        {tur.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-600">
                    {getSelectedHesaplama()?.aciklama}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {inputLabels.anaParaLabel}
                    </label>
                    <input
                      type="number"
                      value={inputs.anaParaP}
                      onChange={(e) => handleInputChange('anaParaP', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="1"
                      step="100"
                    />
                  </div>

                  {inputLabels.showFaizOraniTuru && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Faiz Oranı Türü
                      </label>
                      <select
                        value={inputs.faizOraniTuru}
                        onChange={(e) => handleInputChange('faizOraniTuru', e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      >
                        {faizOraniTurleri.map(tur => (
                          <option key={tur.value} value={tur.value}>
                            {tur.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {inputLabels.faizLabel}
                    </label>
                    <input
                      type="number"
                      value={inputs.faizOraniR}
                      onChange={(e) => handleInputChange('faizOraniR', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="0.1"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {inputLabels.showGun && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Süre (Gün)
                      </label>
                      <input
                        type="number"
                        value={inputs.sureGun}
                        onChange={(e) => handleInputChange('sureGun', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                        min="1"
                        max="3650"
                      />
                    </div>
                  )}

                  {inputLabels.showYil && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Süre (Yıl)
                      </label>
                      <input
                        type="number"
                        value={inputs.sureYil}
                        onChange={(e) => handleInputChange('sureYil', Number(e.target.value))}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                        min="0.1"
                        max="50"
                        step="0.1"
                      />
                    </div>
                  )}

                  {inputLabels.showBileşik && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Bileşik Dönem Türü
                      </label>
                      <select
                        value={inputs.bileşikTuru}
                        onChange={(e) => handleInputChange('bileşikTuru', e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      >
                        {bileşikTurleri.map(tur => (
                          <option key={tur.value} value={tur.value}>
                            {tur.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Vergi Oranı (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.vergiOrani}
                      onChange={(e) => handleInputChange('vergiOrani', Number(e.target.value))}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      min="0"
                      max="50"
                      step="1"
                    />
                  </div>
                </div>

                {/* Formül Gösterimi */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Kullanılan Formül</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <code className="text-lg font-mono text-green-800">
                      {getSelectedHesaplama()?.formul}
                    </code>
                  </div>
                  <div className="mt-3 text-sm text-green-700">
                    <strong>Açıklama:</strong> {getSelectedHesaplama()?.aciklama}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="lg:col-span-1">
            {sonuc && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="h-6 w-6 mr-3 text-green-600" />
                  Hesaplama Sonuçları
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Toplam Tutar</div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(sonuc.toplamTutar)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Ana para + Faiz
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Brüt Faiz Tutarı</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(sonuc.faizTutari)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Vergi Tutarı</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(sonuc.vergiTutari)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      %{inputs.vergiOrani} vergi oranı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Net Getiri</div>
                    <div className="text-lg font-bold text-emerald-600">
                      {formatCurrency(sonuc.netGetiri)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Vergi sonrası kazanç
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Efektif Faiz Oranı</div>
                    <div className="text-lg font-bold text-purple-600">
                      %{sonuc.efektifFaizOrani.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Net getiri oranı
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Hesaplama Detayı</div>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {sonuc.formul}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Açıklama</div>
                    <div className="text-sm text-gray-700">
                      {sonuc.aciklama}
                    </div>
                  </div>

                  {(inputs.hesaplamaTuru === 'basit-faiz' || inputs.hesaplamaTuru === 'bilesik-gunluk') && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-sm text-gray-600 mb-2">Dönemsel Faiz</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Günlük:</span>
                          <span className="font-medium">{formatCurrency(sonuc.gunlukFaiz)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aylık:</span>
                          <span className="font-medium">{formatCurrency(sonuc.aylikFaiz)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yıllık:</span>
                          <span className="font-medium">{formatCurrency(sonuc.yillikFaiz)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mid-content Ad */}
        <AdSenseInFeed />

        {/* Faiz Hesaplama Türleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Faiz Hesaplama Türleri</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hesaplamaTurleri.map(tur => {
              const IconComponent = tur.value.includes('basit') ? DollarSign :
                                  tur.value.includes('bilesik') ? TrendingUp :
                                  tur.value.includes('nominal') ? Percent : Calculator;
              
              return (
                <div key={tur.value} className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  inputs.hesaplamaTuru === tur.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleInputChange('hesaplamaTuru', tur.value)}>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tur.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tur.aciklama}</p>
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
                    {tur.formul}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Another Ad */}
        <AdSenseDisplay size="medium" />

        {/* Faiz Hesaplama Örnekleri */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Faiz Hesaplama Örnekleri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basit Faiz Örnekleri</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Mevduat Faizi</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    10.000 TL, %20 yıllık faiz, 180 gün
                  </p>
                  <p className="text-sm text-blue-700">
                    Faiz: 10.000 × 0.20 × (180/365) = 986,30 TL
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Kredi Faizi</h4>
                  <p className="text-sm text-green-800 mb-2">
                    50.000 TL, %25 yıllık faiz, 90 gün
                  </p>
                  <p className="text-sm text-green-700">
                    Faiz: 50.000 × 0.25 × (90/365) = 3.082,19 TL
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bileşik Faiz Örnekleri</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Yıllık Bileşik</h4>
                  <p className="text-sm text-purple-800 mb-2">
                    10.000 TL, %15 yıllık faiz, 3 yıl
                  </p>
                  <p className="text-sm text-purple-700">
                    Toplam: 10.000 × (1.15)³ = 15.208,75 TL
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Aylık Bileşik</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    20.000 TL, %18 yıllık faiz, aylık bileşik, 2 yıl
                  </p>
                  <p className="text-sm text-orange-700">
                    Toplam: 20.000 × (1 + 0.18/12)²⁴ = 28.579,84 TL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benzer Araçlar */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benzer Hesaplama Araçları</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benzerAraclar.map((arac, index) => {
              const IconComponent = arac.icon;
              return (
                <div key={index} className={`
                  bg-white rounded-2xl p-6 shadow-lg border border-gray-100
                  ${arac.active ? 'hover:shadow-xl cursor-pointer' : 'opacity-75'}
                  transition-all duration-300
                `}>
                  {arac.active ? (
                    <Link to={arac.link} className="block">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                    </Link>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 opacity-75">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arac.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Yakında
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SEO Makale */}
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <header className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Faiz Hesaplama Nasıl Yapılır? Basit ve Bileşik Faiz Rehberi
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Faiz Nedir?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Faiz, borç verilen paranın kullanımı karşılığında alınan ücrettir. Bankacılık, finans ve 
              yatırım dünyasında temel kavramlardan biridir. Faiz hesaplama, hem borç alanlar hem de 
              borç verenler için kritik öneme sahiptir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Basit Faiz Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Basit faiz, sadece ana para üzerinden hesaplanan faiz türüdür. Türkiye'de bankalar 
              genellikle günlük basit faiz hesaplama yapar:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-blue-900 mb-2">Basit Faiz Formülü:</p>
              <p className="text-blue-800 mb-2">
                Faiz = P × r × (d/DC)
              </p>
              <p className="text-sm text-blue-700">
                P = Ana para, r = Yıllık faiz oranı, d = Gün sayısı, DC = Yıldaki gün sayısı (365)
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bileşik Faiz Hesaplama</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bileşik faiz, faizin faiz getirmesi prensibiyle çalışır. Uzun vadeli yatırımlarda 
              basit faizden çok daha yüksek getiri sağlar:
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Aynı Oran, Eşit Dönem</h4>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-green-900 mb-2">Formül: FV = P(1 + i)ⁿ</p>
              <p className="text-green-800 mb-2">
                FV = Gelecek değer, P = Ana para, i = Dönemlik faiz oranı, n = Dönem sayısı
              </p>
              <p className="text-sm text-green-700">
                Örnek: 10.000 TL, %15 yıllık, 3 yıl → 10.000 × (1.15)³ = 15.208,75 TL
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Günlük Bileşik Faiz</h4>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-purple-900 mb-2">Formül: FV = P(1 + r/DC)ᵈ</p>
              <p className="text-purple-800 mb-2">
                Her gün faiz ana paraya eklenir ve ertesi gün faiz hesaplamasına dahil edilir
              </p>
              <p className="text-sm text-purple-700">
                Günlük bileşik faiz, yıllık bileşik faizden daha yüksek getiri sağlar
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Sürekli Bileşik Faiz</h4>
            <div className="bg-orange-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-orange-900 mb-2">Formül: FV = P × e^(rt)</p>
              <p className="text-orange-800 mb-2">
                Matematiksel olarak mümkün olan en yüksek bileşik faiz hesaplama yöntemi
              </p>
              <p className="text-sm text-orange-700">
                e = Euler sayısı (≈2.71828), teorik maksimum getiri hesaplama
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Nominal ve Efektif Faiz</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Nominal faiz ile efektif faiz arasındaki fark önemlidir:
            </p>
            <div className="bg-yellow-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-yellow-900 mb-2">Efektif Yıllık Oran (EAR):</p>
              <p className="text-yellow-800 mb-2">
                EAR = (1 + r/m)ᵐ - 1
              </p>
              <p className="text-sm text-yellow-700">
                r = Nominal oran, m = Yıldaki bileşik dönem sayısı
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vergi ve Net Getiri</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Türkiye'de faiz gelirleri vergilendirilir:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Mevduat Faizi:</strong> %10 stopaj vergisi</li>
              <li><strong>Tahvil/Bono Faizi:</strong> %10 stopaj vergisi</li>
              <li><strong>Kredi Faizi:</strong> Vergi indirimi yok</li>
              <li><strong>Net Getiri:</strong> Brüt faiz - Vergi tutarı</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Faiz Hesaplama Kullanım Alanları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Bankacılık:</strong> Mevduat ve kredi faiz hesaplama</li>
              <li><strong>Yatırım:</strong> Getiri analizi ve karşılaştırma</li>
              <li><strong>Hukuk:</strong> Gecikme faizi ve tazminat hesaplama</li>
              <li><strong>Muhasebe:</strong> Finansal tablo hazırlama</li>
              <li><strong>Kişisel Finans:</strong> Birikim ve borç planlaması</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hesaplama İpuçları</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Gün sayısı:</strong> Bankalar genelde 365 gün kullanır</li>
              <li><strong>Bileşik dönem:</strong> Sık bileşik daha yüksek getiri</li>
              <li><strong>Vergi etkisi:</strong> Net getiriyi mutlaka hesaplayın</li>
              <li><strong>Enflasyon:</strong> Reel getiri için enflasyonu düşün</li>
              <li><strong>Risk faktörü:</strong> Yüksek faiz = yüksek risk</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8">
              <h4 className="text-lg font-semibold text-green-900 mb-2">💡 İpucu</h4>
              <p className="text-green-800">
                Yukarıdaki hesaplama aracımızı kullanarak farklı faiz türlerini karşılaştırabilir, 
                yatırım getirilerinizi hesaplayabilir ve en uygun finansal ürünü seçebilirsiniz. 
                Vergi etkisini de dikkate alarak net getiri hesaplama yapabilirsiniz.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h3>
            <p className="text-gray-700 leading-relaxed">
              Faiz hesaplama, finansal okuryazarlığın temel taşlarından biridir. Basit ve bileşik 
              faiz arasındaki farkı anlayarak, doğru yatırım kararları alabilir ve finansal 
              hedeflerinize daha etkili ulaşabilirsiniz. Yukarıdaki hesaplama aracını kullanarak 
              çeşitli faiz senaryolarını analiz edebilir ve en karlı seçenekleri belirleyebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default FaizHesaplamaPage;