'use client';

import RekapPerkerasanWidget from "@/app/infrastruktur/components/RekapPerkerasanWidget";
import DistribusiWidget from "@/app/infrastruktur/components/DistribusiWidget";

export default function StatistikWidget() {
  return (
    <>
      <RekapPerkerasanWidget />
      <DistribusiWidget />
    </>
  )
}
