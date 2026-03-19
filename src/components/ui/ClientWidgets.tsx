"use client";

import dynamic from "next/dynamic";

const MessengerWidget = dynamic(() => import("@/components/ui/MessengerWidget"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("@/components/ui/ExitIntentPopup"), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <MessengerWidget />
      <ExitIntentPopup />
    </>
  );
}
