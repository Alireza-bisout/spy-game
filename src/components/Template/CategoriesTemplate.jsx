"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";
import Toggle from "@/components/Module/Toggle";
import { CATEGORY_ICONS } from "@/lib/avatars";

export default function CategoriesTemplate() {
  const { state, categories, words, toggleCategory, patch } = useGame();
  const router = useRouter();
  const allOn = state.enabledCategories.length === categories.length;
  const count = words.filter((w) => state.enabledCategories.includes(w.category)).length;

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader
        back="/play/players"
        title="دنیاها"
        subtitle="هر دسته کارت خودش را دارد. با تاگل روشن یا خاموش کنید."
      />

      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          className="text-sm font-semibold text-accent"
          onClick={() => patch({ enabledCategories: allOn ? [] : categories.map((c) => c.id) })}
        >
          {allOn ? "خاموش کردن همه" : "روشن کردن همه"}
        </button>
      </div>

      <ListCard>
        {categories.map((c, i) => {
          const on = state.enabledCategories.includes(c.id);
          const n = words.filter((w) => w.category === c.id).length;
          return (
            <ListRow
              key={c.id}
              last={i === categories.length - 1}
              icon={<i className={`fa-duotone ${CATEGORY_ICONS[c.id] || "fa-layer-group"}`} />}
              title={c.fa}
              subtitle={`${n} کلمه`}
              trailing={<Toggle on={on} onChange={() => toggleCategory(c.id)} />}
            />
          );
        })}
      </ListCard>

      <div className="mt-auto pt-6">
        <p className="mb-3 text-center text-sm text-muted fa-num">{count} کلمه فعال</p>
        <Button disabled={!count} onClick={() => router.push("/play/setup")}>
          ادامه
        </Button>
      </div>
    </div>
  );
}
