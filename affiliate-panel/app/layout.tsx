import MainProgressBar from "@/components/MainProgressBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Savebucks Affiliate Portal",
  description: "Savebucks Affiliate Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.png" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NKEW8JQXD4"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', 'G-NKEW8JQXD4');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <MainProgressBar>{children}</MainProgressBar>
      </body>
    </html>
  );
}
