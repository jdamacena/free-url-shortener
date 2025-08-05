import React from "react";
import Script from "next/script";
import { googleAdsConfig } from "@/lib/config";

/**
 * GoogleAd component for rendering Google AdSense ads
 *
 * @param slot - Ad slot ID for the ad placement
 * @param format - Ad format (auto, rectangle, banner, etc.)
 * @param className - Additional CSS classes
 * @param responsive - Whether the ad should be responsive
 */
interface GoogleAdProps {
  slot: string;
  format?: string;
  className?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format = "auto", 
  className = "",
  responsive = true,
  style 
}) => {
  if (!googleAdsConfig.enabled || !googleAdsConfig.clientId || !slot) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`} style={style}>
        <p className="text-gray-500 text-sm">Advertisement Space</p>
        <p className="text-gray-400 text-xs">Ad slot: {slot || 'Not configured'}</p>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: "block",
          width: "100%",
          height: "auto",
          ...style
        }}
        data-ad-client={googleAdsConfig.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      <Script id={`adsbygoogle-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
};
