import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vento-us.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "vento. — good things happen offline.", template: "%s — vento." },
  description: "Find your people through curated experiences and meaningful offline connections.",
  applicationName: "vento.",
  openGraph: { type: "website", url: siteUrl, siteName: "vento.", title: "find your people.", description: "good things happen offline.", images:[{url:"/og.png",width:1200,height:630,alt:"vento. — find your people."}] },
  twitter: { card: "summary_large_image", title: "find your people.", description: "good things happen offline.", images:["/og.png"] },
  alternates: { canonical: siteUrl }, robots: { index: true, follow: true },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
