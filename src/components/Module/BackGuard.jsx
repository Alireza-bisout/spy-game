"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import Sheet from "@/components/Module/Sheet";
import Button from "@/components/Module/Button";

function norm(path) {
  return (path || "/").replace(/\/$/, "") || "/";
}

function isHome(path) {
  return norm(path) === "/";
}

function isLockedPlay(path) {
  const p = norm(path);
  return (
    p === "/play/roles" ||
    p.startsWith("/play/roles/") ||
    p === "/play/table" ||
    p === "/play/result"
  );
}

export default function BackGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { resetToHome } = useGame();
  const [askExit, setAskExit] = useState(false);
  const [askHome, setAskHome] = useState(false);

  useEffect(() => {
    let remove = () => {};

    async function bind() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { App } = await import("@capacitor/app");
        const handle = await App.addListener("backButton", () => {
          const path = norm(window.location.pathname);
          if (isHome(path)) {
            setAskHome(false);
            setAskExit(true);
            return;
          }
          if (isLockedPlay(path)) {
            setAskExit(false);
            setAskHome(true);
            return;
          }
          if (window.history.length > 1) window.history.back();
          else setAskExit(true);
        });
        remove = () => handle.remove();
      } catch {
        /* وب */
      }
    }

    bind();
    return () => remove();
  }, [pathname]);

  async function exitApp() {
    setAskExit(false);
    try {
      const { App } = await import("@capacitor/app");
      await App.exitApp();
    } catch {
      window.close();
    }
  }

  function goHome() {
    setAskHome(false);
    resetToHome();
    router.replace("/");
  }

  return (
    <>
      <Sheet open={askExit} onClose={() => setAskExit(false)} title="خروج از بازی">
        <p className="mb-2 text-sm text-muted">مطمئنی می‌خوای از برنامه خارج بشی؟</p>
        <Button variant="danger" onClick={exitApp}>
          بله، خارج شو
        </Button>
        <Button variant="ghost" onClick={() => setAskExit(false)}>
          نه، بمون
        </Button>
      </Sheet>
      <Sheet open={askHome} onClose={() => setAskHome(false)} title="برگشت به خانه">
        <p className="mb-2 text-sm text-muted">دست فعلی تمام می‌شود و به صفحه اصلی برمی‌گردی. مطمئنی؟</p>
        <Button variant="danger" onClick={goHome}>
          بله، برو خانه
        </Button>
        <Button variant="ghost" onClick={() => setAskHome(false)}>
          ادامه بازی
        </Button>
      </Sheet>
    </>
  );
}
