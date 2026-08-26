"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RoleRevealTemplate from "@/components/Template/RoleRevealTemplate";

function RevealInner() {
  const params = useSearchParams();
  const id = params.get("id");
  return <RoleRevealTemplate playerId={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">…</p>}>
      <RevealInner />
    </Suspense>
  );
}
