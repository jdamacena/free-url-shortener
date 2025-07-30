import React from "react";
import Script from "next/script";
import { googleAdsConfig } from "@/lib/config";

/**
 * GoogleAd component for rendering Google AdSense ads
 *
 * @param slot - Ad slot ID for the ad placement
 */
export const GoogleAd: React.FC<{ slot: string }> = ({ slot }) => {
  if (!googleAdsConfig.enabled || !googleAdsConfig.clientId || !slot) return null;

  return (
    <>
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsConfig.clientId}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={googleAdsConfig.clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
      />
      <Script id="adsbygoogle-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
};
