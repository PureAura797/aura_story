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
  yandexMetrika: string;
  googleAnalytics: string;
  googleTagManager: string;
  vkPixel: string;
  customScripts: CustomScript[];
}

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
      {/* Yandex.Metrika */}
      {a.yandexMetrika && (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
            ym(${a.yandexMetrika},"init",{ssr:true,webvisor:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href});`}
          </Script>
          <noscript>
            <div>
              <img src={`https://mc.yandex.ru/watch/${a.yandexMetrika}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
            </div>
          </noscript>
        </>
      )}

      {/* Google Analytics GA4 */}
      {a.googleAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${a.googleAnalytics}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());gtag('config','${a.googleAnalytics}');`}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {a.googleTagManager && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${a.googleTagManager}');`}
        </Script>
      )}

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
        .filter((s) => s.enabled)
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
