"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";

export default function GuideTemplate() {
  const router = useRouter();
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-4">
      <PageHeader back="/" title="راهنما" subtitle="همه نقش‌ها و فازها، کوتاه و برای مهمانی." />

      <ListCard>
        <ListRow icon={<i className="fa-duotone fa-users" />} title="شهروند" subtitle="کلمه را می‌بیند. با اشاره نزدیک حرف بزن؛ جاسوس را پیدا کنید." />
        <ListRow icon={<i className="fa-duotone fa-user-secret" />} title="جاسوس" subtitle="کلمه را نمی‌داند. از حرف‌ها حدس بزن یا تا آخر لو نرو. هر لحظه می‌توانی حدس بزنی." />
        <ListRow
          last
          icon={<i className="fa-duotone fa-ghost" />}
          title="نقش سفید"
          subtitle="هیچ کلمه‌ای نمی‌بیند. اگر روشن باشد باید مثل شهروند حرف بزند. پیش‌فرض خاموش است."
        />
      </ListCard>

      <ListCard>
        <ListRow icon={<i className="fa-duotone fa-hand-pointer" />} title="پرده نقش" subtitle="فقط اسم خودت را بزن. نگه دار تا نقش بیاید. بعد از «دیدم» اسم‌ات از لیست حذف می‌شود." />
        <ListRow icon={<i className="fa-duotone fa-comments" />} title="اشاره" subtitle="هر نفر به نوبت کلمه‌ای نزدیک می‌گوید. تایمر که تمام شود نوبت می‌سوزد." />
        <ListRow icon={<i className="fa-duotone fa-circle-question" />} title="سوال دوگزینه‌ای" subtitle="دو گزینه بساز؛ گوشی را به متهم بده تا یکی را بزند. تاریخچه سوال‌ها روی میز می‌ماند." />
        <ListRow icon={<i className="fa-duotone fa-scale-balanced" />} title="سوءظن و اخراج" subtitle="شک بزن. از سه به بالا پیشنهاد اخراج می‌آید. اخراج نقش را همان لحظه لو می‌دهد." />
        <ListRow last icon={<i className="fa-duotone fa-key" />} title="حدس جاسوس" subtitle="اگر درست باشد جاسوس می‌برد؛ اگر غلط باشد شهروندان." />
      </ListCard>

      <div className="mt-auto">
        <Button onClick={() => router.push("/")}>خانه</Button>
      </div>
    </div>
  );
}
