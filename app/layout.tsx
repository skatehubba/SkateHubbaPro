import React from "react";
import "./globals.css";

export const metadata = {
  title: "SkateHubba Pro",
  description: "Next-gen skateboarding app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
