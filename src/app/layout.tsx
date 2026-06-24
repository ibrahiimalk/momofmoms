import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MomOfMoms",
  description: "Everything you need for your motherhood journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className="bg-white" style={{ colorScheme: 'light', backgroundColor: '#ffffff' }}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 min-h-screen`}
        style={{ backgroundColor: '#ffffff', color: '#171717' }}
      >
        {children}
      </body>
    </html>
  );
}
