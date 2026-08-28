"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";
import Toggle from "@/components/Module/Toggle";
import { useTheme } from "@/lib/ThemeContext";
import { useSound } from "@/lib/SoundContext";

export default function SettingsTemplate() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { sfx, music, vibrate, setSfx, setMusic, setVibrate } = useSound();
  const dark = theme === "dark";

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader back="/" title="تنظیمات" subtitle="ظاهر، صدا و لرزش این دستگاه." />
      <ListCard>
        <ListRow
          icon={<i className={`fa-solid ${dark ? "fa-moon" : "fa-sun"}`} />}
          title="حالت تاریک"
          subtitle={dark ? "شب و پرونده‌های محرمانه" : "کاغذ و نور روز"}
          trailing={<Toggle on={dark} onChange={() => setTheme(dark ? "light" : "dark")} />}
        />
        <ListRow
          icon={<i className="fa-solid fa-volume-high" />}
          title="صداهای لمس و بازی"
          trailing={<Toggle on={sfx} onChange={() => setSfx(!sfx)} />}
        />
        <ListRow
          icon={<i className="fa-solid fa-music" />}
          title="موسیقی پس‌زمینه"
          trailing={<Toggle on={music} onChange={() => setMusic(!music)} />}
        />
        <ListRow
          last
          icon={<i className="fa-solid fa-mobile-screen" />}
          title="لرزش"
          trailing={<Toggle on={vibrate} onChange={() => setVibrate(!vibrate)} />}
        />
      </ListCard>
      <p className="mt-6 text-center text-xs text-muted">ساختهٔ Azhdar Game</p>
      <div className="mt-auto pt-6">
        <Button onClick={() => router.push("/")}>خانه</Button>
      </div>
    </div>
  );
}
