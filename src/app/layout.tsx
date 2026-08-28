import type { Metadata } from "next";
import Script from "next/script";
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
  title: {
    default: 'MomOfMoms — مستشارتك في الأمومة',
    template: '%s | MomOfMoms',
  },
  description: 'Your trusted partner in pregnancy and motherhood. Pregnancy calculator, baby products, awake windows, and appointment booking for new moms.',
  keywords: ['pregnancy', 'maternity', 'baby', 'motherhood', 'حمل', 'أمومة', 'pregnancy calculator', 'baby clothes', 'mom consultant'],
  authors: [{ name: 'MomOfMoms' }],
  metadataBase: new URL('https://momofmomskw.com'),
  openGraph: {
    title: 'MomOfMoms — مستشارتك في الأمومة',
    description: 'Your trusted partner in pregnancy and motherhood.',
    url: 'https://momofmomskw.com',
    siteName: 'MomOfMoms',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MomOfMoms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MomOfMoms — مستشارتك في الأمومة',
    description: 'Your trusted partner in pregnancy and motherhood.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://momofmomskw.com/ar',
    languages: {
      'ar': 'https://momofmomskw.com/ar',
      'en': 'https://momofmomskw.com/en',
    },
  },
  icons: {
    apple: '/apple-icon.png',
  },
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
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xieahsyfrg");`}
        </Script>
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
