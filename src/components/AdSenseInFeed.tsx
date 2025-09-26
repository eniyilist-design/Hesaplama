import React from 'react';
import AdSense from './AdSense';

interface AdSenseInFeedProps {
  className?: string;
}

const AdSenseInFeed: React.FC<AdSenseInFeedProps> = ({ className = '' }) => {
  return (
    <div className={`my-8 ${className}`}>
      <div className="text-center mb-4">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Reklam</span>
      </div>
      <AdSense
        adSlot="1234567890" // In-feed reklam slot ID'si
        adFormat="auto"
        adLayout="in-article"
        className="min-h-[250px] bg-gray-50 rounded-lg flex items-center justify-center"
      />
    </div>
  );
};

export default AdSenseInFeed;