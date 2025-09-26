import React from 'react';
import AdSense from './AdSense';

interface AdSenseDisplayProps {
  size?: 'large' | 'medium' | 'small';
  className?: string;
}

const AdSenseDisplay: React.FC<AdSenseDisplayProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'large':
        return {
          adSlot: '9876543210', // Large banner slot ID
          adFormat: 'rectangle' as const,
          insStyle: { width: '728px', height: '90px' },
          containerClass: 'mx-auto max-w-full'
        };
      case 'small':
        return {
          adSlot: '5555555555', // Small banner slot ID
          adFormat: 'rectangle' as const,
          insStyle: { width: '320px', height: '100px' },
          containerClass: 'mx-auto'
        };
      default:
        return {
          adSlot: '1111111111', // Medium banner slot ID
          adFormat: 'rectangle' as const,
          insStyle: { width: '300px', height: '250px' },
          containerClass: 'mx-auto'
        };
    }
  };

  const config = getSizeConfig();

  return (
    <div className={`my-6 ${className}`}>
      <div className="text-center mb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Reklam</span>
      </div>
      <AdSense
        adSlot={config.adSlot}
        adFormat={config.adFormat}
        insStyle={config.insStyle}
        containerStyle={{ minHeight: '100px' }}
        className={`${config.containerClass} bg-gray-50 rounded-lg flex items-center justify-center`}
      />
    </div>
  );
};

export default AdSenseDisplay;