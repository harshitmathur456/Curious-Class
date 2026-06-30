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

        {/* Aggressively hide the Google Translate toolbar ribbon */}
        <style>{`
          /* Hide the translate banner iframe */
          .goog-te-banner-frame,
          .goog-te-banner-frame.skiptranslate,
          iframe.skiptranslate,
          .skiptranslate > iframe {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
          }

          /* Prevent body from being pushed down */
          body {
            top: 0 !important;
            position: static !important;
          }

          /* Hide tooltip and balloon */
          #goog-gt-tt,
          .goog-te-balloon-frame,
          .goog-tooltip,
          .goog-tooltip-content {
            display: none !important;
          }

          /* Hide the translate element container itself */
          #google_translate_element,
          .skiptranslate {
            display: none !important;
          }
        `}</style>

        {/* MutationObserver script: re-hides the banner if Google re-injects it */}
        <Script
          id="hide-translate-bar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function hideGoogleBar() {
                var frames = document.querySelectorAll('iframe.skiptranslate, .goog-te-banner-frame');
                frames.forEach(function(el) {
                  el.style.display = 'none';
                  el.style.visibility = 'hidden';
                  el.style.height = '0';
                });
                document.body.style.top = '0';
                document.body.style.position = 'static';
              }

              // Run immediately and after a short delay
              hideGoogleBar();
              setTimeout(hideGoogleBar, 500);
              setTimeout(hideGoogleBar, 1500);

              // Watch for dynamic DOM insertions by Google Translate
              var observer = new MutationObserver(hideGoogleBar);
              observer.observe(document.body, { childList: true, subtree: true });
            `,
          }}
        />
      </body>
    </html>
  );
}

