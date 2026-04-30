import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kushal Jain Portfolio",
  description: "Interactive portfolio with an AI-powered Memoji that answers questions about me, my skills, and my experience",
  keywords: [
    "Kushal Jain",
    "Portfolio",
    "Developer",
    "AI",
    "Interactive",
    "Memoji",
    "Web Development",
    "Full Stack",
    "Data Science",
    "Machine Learning",
    "Next.js",
    "React"
  ],
  authors: [
    {
      name: "Kushal Jain",
      url: "https://kushal.bio",
    },
  ],
  creator: "Kushal Jain",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kushal.bio",
    title: "Kushal Jain Portfolio",
    description: "Interactive portfolio with an AI-powered Memoji that answers questions about me",
    siteName: "Kushal Jain Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushal Jain Portfolio",
    description: "Interactive portfolio with an AI-powered Memoji that answers questions about me",
    creator: "@kuushhhall",
  },
  icons: {
    icon: [
      {
        url: "/logo-kushal.svg",
        sizes: "any",
      }
    ],
    shortcut: "/logo-kushal.svg?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/logo-kushal.svg" sizes="any" />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QTH2CN2YRQ"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window['dataLayer'] = window['dataLayer'] || [];
              function gtag(){window['dataLayer'].push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QTH2CN2YRQ');
            `,
          }}
        />
      </head>
      <body
        className={cn(
          // "min-h-screen bg-background font-sans antialiased",
          "min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans antialiased transition-colors duration-500 ease-in-out",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
