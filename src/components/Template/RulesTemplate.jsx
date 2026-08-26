"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";

export default function RulesTemplate() {
  const router = useRouter();
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader back="/" title="قوانین" subtitle="کوتاه، برای خواندن وسط مهمانی." />
      <ListCard>
        <ListRow icon={<i className="fa-solid fa-eye" />} title="نقش" subtitle="همه جز جاسوس کلمه را می‌بینند." />
        <ListRow icon={<i className="fa-solid fa-comment" />} title="اشاره" subtitle="کلمه‌ای نزدیک بگو؛ نه لو، نه بی‌ربط." />
        <ListRow last icon={<i className="fa-solid fa-scale-balanced" />} title="سوال و رأی" subtitle="دوگزینه‌ای، اخراج، حدس جاسوس." />
      </ListCard>
      <div className="mt-auto pt-6">
        <Button onClick={() => router.push("/")}>خانه</Button>
      </div>
    </div>
  );
}
