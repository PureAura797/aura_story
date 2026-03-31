"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface CustomScript {
  id: string;
  name: string;
  position: "head" | "body";
  code: string;
  enabled: boolean;
}

interface AnalyticsSettings {
  vkPixel: string;
  customScripts: CustomScript[];
}

/**
 * Client component — handles VK Pixel and custom scripts only.
 * Yandex Metrika, GA4, and GTM are now handled by ServerAnalytics (server component in <head>).
 */
export default function AnalyticsScripts() {
  const [a, setA] = useState<AnalyticsSettings | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setA)
      .catch(() => {});
  }, []);

  if (!a) return null;

  return (
    <>
      {/* VK Pixel */}
      {a.vkPixel && (
        <Script id="vk-pixel" strategy="afterInteractive">
          {`!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,
          t.src="https://vk.com/js/api/openapi.js?169",t.onload=function(){VK.Retargeting.Init("${a.vkPixel}"),
          VK.Retargeting.Hit()},document.head.appendChild(t)}();`}
        </Script>
      )}

      {/* Custom Scripts */}
      {a.customScripts
        ?.filter((s) => s.enabled)
        .map((s) => (
          <Script
            key={s.id}
            id={`custom-${s.id}`}
            strategy={s.position === "head" ? "beforeInteractive" : "afterInteractive"}
            dangerouslySetInnerHTML={{ __html: s.code.replace(/<\/?script[^>]*>/gi, "") }}
          />
        ))}
    </>
  );
}
