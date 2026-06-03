import { Inter } from "next/font/google";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
