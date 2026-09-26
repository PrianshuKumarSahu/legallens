import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalLens — AI-Powered Legal Document Assistant",
  description:
    "Simplify, analyze, and understand legal documents with AI. Get plain-English explanations, risk analysis, contract comparisons, and more.",
  keywords: [
    "legal",
    "AI",
    "document analysis",
    "contract review",
    "legal assistant",
  ],
  openGraph: {
    title: "LegalLens — AI-Powered Legal Document Assistant",
    description:
      "Make legal documents accessible with AI-powered analysis and simplification.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
