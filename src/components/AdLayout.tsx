import React from 'react';
import { GoogleAd } from './GoogleAd';
import { googleAdsConfig } from '@/lib/config';

interface AdLayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
  showSidebar?: boolean;
  className?: string;
}

/**
 * AdLayout component that provides a consistent layout with ad placements
 * Automatically handles responsive behavior and ad visibility
 */
export const AdLayout: React.FC<AdLayoutProps> = ({
  children,
  showBanner = false,
  showSidebar = false,
  className = "",
}) => {
  if (!googleAdsConfig.enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`ad-layout ${className}`}>
      {/* Banner Ad */}
      {showBanner && googleAdsConfig.adSlots.redirectPage.banner && (
        <div className="w-full bg-white border-b shadow-sm mb-4">
          <GoogleAd 
            slot={googleAdsConfig.adSlots.redirectPage.banner}
            format="horizontal"
            className="max-h-20"
            style={{ maxHeight: "90px" }}
          />
        </div>
      )}

      {/* Main Content with Optional Sidebar */}
      <div className={`grid gap-4 ${showSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {/* Main Content */}
        <div className={showSidebar ? 'lg:col-span-3' : 'col-span-1'}>
          {children}
        </div>

        {/* Sidebar Ad */}
        {showSidebar && googleAdsConfig.adSlots.redirectPage.secondary && (
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <GoogleAd 
                slot={googleAdsConfig.adSlots.redirectPage.secondary}
                className="min-h-[300px]"
                style={{ minHeight: "300px" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
