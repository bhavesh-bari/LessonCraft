import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LessonCraft AI | AI-Powered Tools for Teachers",
  description: "Save hours of prep time with LessonCraft AI, the intelligent platform for teachers to instantly generate high-quality lesson plans, notes, quizzes, and classroom activities.",
  keywords: ["AI for teachers", "lesson plan generator", "quiz maker", "notes generator", "teacher tools", "education AI"],
  icons: {
    icon: '/LessonCraftLogo.png', 
  },
  openGraph: {
    title: "LessonCraft AI | AI-Powered Tools for Teachers",
    description: "Instantly generate lesson plans, notes, and quizzes with the power of AI.",
    images: [
      {
        url: '/LessonCraftLogo.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
