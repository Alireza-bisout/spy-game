"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";

export default function StatsTemplate() {
  const router = useRouter();
  const [s, setS] = useState({ spy: 0, citizens: 0 });
  useEffect(() => {
    setS(JSON.parse(localStorage.getItem("spy-stats") || '{"spy":0,"citizens":0}'));
  }, []);
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader back="/" title="آمارها" subtitle="برد و باخت دست‌های همین گوشی." />
      <ListCard>
        <ListRow icon={<i className="fa-duotone fa-user-secret" />} title="برد جاسوس" trailing={<span className="fa-num font-bold">{s.spy}</span>} />
        <ListRow last icon={<i className="fa-duotone fa-users" />} title="برد شهروندان" trailing={<span className="fa-num font-bold">{s.citizens}</span>} />
      </ListCard>
      <div className="mt-auto pt-6">
        <Button onClick={() => router.push("/")}>خانه</Button>
      </div>
    </div>
  );
}
