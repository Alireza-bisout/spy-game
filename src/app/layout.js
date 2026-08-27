import "./globals.css";
import { GameProvider } from "@/lib/GameContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { SoundProvider } from "@/lib/SoundContext";
import BackGuard from "@/components/Module/BackGuard";

export const metadata = {
  title: "جاسوس",
  description: "بازی جاسوس — یک گوشی، چند بازیکن",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport = {
  themeColor: "#1e1f20",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/css/all.min.css" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <SoundProvider>
            <GameProvider>
              <BackGuard />
              <div className="mx-auto min-h-dvh w-full max-w-md px-4 py-5 sm:max-w-lg sm:py-8 lg:max-w-xl">
                {children}
              </div>
            </GameProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
