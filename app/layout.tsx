// ============================================================
// ROOT LAYOUT
// ============================================================

import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { cache } from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { AdminShortcut } from "@/components/admin/AdminShortcut";
import { loadAdminDataServer } from "@/lib/admin-data-server";
import { DEFAULT_PERSONAL, DEFAULT_SETTINGS } from "@/content/defaults";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ingabadefrancois.vercel.app";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const getSiteData = cache(async () => {
  const adminData = await loadAdminDataServer();

  return {
    personal: {
      ...DEFAULT_PERSONAL,
      ...adminData.personal,
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...adminData.settings,
    },
  };
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { personal, settings } = await getSiteData();
  const siteName = settings.seo?.siteName || personal.name;
  const defaultTitle =
    settings.seo?.defaultTitle || `${personal.name} — ${personal.tagline}`;
  const titleTemplate =
    settings.seo?.titleTemplate || `%s | ${personal.name}`;
  const description = settings.seo?.description || personal.bio;
  const ogImage = settings.seo?.ogImage || "/photo.png";
  const twitterHandle = settings.seo?.twitterHandle || "@francoisleking";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: personal.bio,
    keywords: [
      "développeur fullstack",
      "React",
      "Next.js",
      "Python",
      "Django",
      "Cameroun",
      "portfolio",
    ],
    authors: [{ name: personal.name, url: SITE_URL }],
    creator: personal.name,
    alternates: {
      canonical: SITE_URL,
    },
    icons: {
      icon: "/photo.png",
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: SITE_URL,
      siteName,
      title: defaultTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${personal.name} — Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { personal } = await getSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.name,
    url: SITE_URL,
    email: personal.email,
    jobTitle: personal.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yaoundé",
      addressCountry: "CM",
    },
    sameAs: personal.socials.map((social) => social.href),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${personal.name} — Portfolio`,
    url: SITE_URL,
    description: personal.bio,
    inLanguage: "fr-FR",
    publisher: {
      "@type": "Person",
      name: personal.name,
      url: SITE_URL,
    },
  };

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <SkipToContent />
        <AdminShortcut />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
