import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import LangToggleButton from "./LangToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "CuriousClass — AI-Powered Critical Thinking",
  description:
    "AI-powered critical thinking platform for Indian government school students. Engage with Socratic questioning, Devil's Advocate challenges, and real-time teacher dashboards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Hidden Google Translate mount point */}
        <div id="google_translate_element" style={{ display: "none" }} />

        {children}

        {/* Floating Hindi/English language toggle button */}
        <LangToggleButton />

        {/* Google Translate initializer */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'hi,en',
                  autoDisplay: false,
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* Suppress the default Google Translate toolbar banner */}
        <style>{`
          .goog-te-banner-frame { display: none !important; }
          .goog-te-balloon-frame { display: none !important; }
          body { top: 0 !important; }
        `}</style>
      </body>
    </html>
  );
}

