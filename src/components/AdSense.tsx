import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  containerStyle?: React.CSSProperties;
  insStyle?: React.CSSProperties;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  containerStyle,
  insStyle,
  className = ''
}) => {
  const adRef = useRef<HTMLElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Prevent duplicate ad loads in React StrictMode
    if (isAdLoaded.current) return;

    try {
      // Check if the ad element exists and doesn't already have an ad
      if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }

    // Cleanup function to reset the flag when component unmounts
    return () => {
      isAdLoaded.current = false;
    };
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={containerStyle}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...insStyle }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your actual AdSense ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={adFormat === 'auto' ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSense;