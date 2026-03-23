import fs from "fs";
import path from "path";

interface SeoData {
  yandexVerification: string;
  googleVerification: string;
}

function loadSeo(): SeoData {
  const DATA_FILE = path.join(process.cwd(), "src/data/seo.json");
  const defaults: SeoData = { yandexVerification: "", googleVerification: "" };
  try {
    if (fs.existsSync(DATA_FILE)) {
      return { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) };
    }
  } catch {}
  return defaults;
}

export default function VerificationMeta() {
  const seo = loadSeo();

  return (
    <>
      {seo.yandexVerification && (
        <meta name="yandex-verification" content={seo.yandexVerification} />
      )}
      {seo.googleVerification && (
        <meta name="google-site-verification" content={seo.googleVerification} />
      )}
    </>
  );
}
