import { readData } from "@/lib/supabase";
import Script from "next/script";

interface AnalyticsSettings {
  yandexMetrika: string;
  googleAnalytics: string;
  googleTagManager: string;
  vkPixel: string;
}

const DEFAULTS: AnalyticsSettings = {
  yandexMetrika: "",
  googleAnalytics: "",
  googleTagManager: "",
  vkPixel: "",
};

/**
 * Server component — reads analytics IDs from Supabase at render time
 * and injects scripts into <head> via beforeInteractive strategy.
 * Must be placed inside <head> or at root layout level.
 */
export default async function ServerAnalytics() {
  let settings = DEFAULTS;
  try {
    const saved = await readData<AnalyticsSettings>("analytics", DEFAULTS);
    settings = { ...DEFAULTS, ...saved };
  } catch {}

  const ym = settings.yandexMetrika;
  const ga = settings.googleAnalytics;
  const gtm = settings.googleTagManager;

  return (
    <>
      {/* <!-- Yandex.Metrika counter --> */}
      {ym && (
        <>
          <Script id="yandex-metrika" strategy="beforeInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${ym}','ym');
ym(${ym},'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}
          </Script>
          <noscript>
            <div>
              <img src={`https://mc.yandex.ru/watch/${ym}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
            </div>
          </noscript>
        </>
      )}
      {/* <!-- /Yandex.Metrika counter --> */}

      {/* Google Analytics GA4 */}
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="beforeInteractive"
          />
          <Script id="google-analytics" strategy="beforeInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtm && (
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
    </>
  );
}
