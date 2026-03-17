import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse — API Monitoring temps réel pour devs & SRE",
  description: "Alertes instantanées quand votre API ralentit ou tombe. Tracing des performances, détection d'anomalies par IA, notifications Slack et PagerDuty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.className} scroll-smooth`}>
      <body className="antialiased bg-[#0a0a0a] text-zinc-100">
        {children}
      </body>
    </html>
  );
}