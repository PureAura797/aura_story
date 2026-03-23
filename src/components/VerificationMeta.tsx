"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function VerificationMeta() {
  const [yandex, setYandex] = useState("");
  const [google, setGoogle] = useState("");

  useEffect(() => {
    fetch("/api/seo")
      .then((r) => r.json())
      .then((d) => {
        if (d.yandexVerification) setYandex(d.yandexVerification);
        if (d.googleVerification) setGoogle(d.googleVerification);
      })
      .catch(() => {});
  }, []);

  if (!yandex && !google) return null;

  return createPortal(
    <>
      {yandex && <meta name="yandex-verification" content={yandex} />}
      {google && <meta name="google-site-verification" content={google} />}
    </>,
    document.head
  );
}
