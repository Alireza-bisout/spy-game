"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sheet from "@/components/Module/Sheet";
import Button from "@/components/Module/Button";

function isHome(path) {
  return path === "/" || path === "";
}

export default function BackGuard() {
  const pathname = usePathname();
  const [askExit, setAskExit] = useState(false);

  useEffect(() => {
    let remove = () => {};

    async function bind() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { App } = await import("@capacitor/app");
        const handle = await App.addListener("backButton", () => {
          const path = window.location.pathname.replace(/\/$/, "") || "/";
          if (isHome(path) || path === "") {
            setAskExit(true);
            return;
          }
          if (window.history.length > 1) window.history.back();
          else setAskExit(true);
        });
        remove = () => handle.remove();
      } catch {
        /* وب یا بدون Capacitor */
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

  return (
    <Sheet open={askExit} onClose={() => setAskExit(false)} title="خروج از بازی">
      <p className="mb-2 text-sm text-muted">مطمئنی می‌خوای از برنامه خارج بشی؟</p>
      <Button variant="danger" onClick={exitApp}>
        بله، خارج شو
      </Button>
      <Button variant="ghost" onClick={() => setAskExit(false)}>
        نه، بمون
      </Button>
    </Sheet>
  );
}
