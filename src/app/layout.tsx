import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ai Visibility | Auditoría de Visibilidad en LLMs y Motores de Respuesta Generativa (GEO)",
  description: "Plataforma de análisis de presencia de marca en modelos de lenguaje (LLMs). Evalúa cómo ChatGPT, Perplexity, Claude y Gemini citan tu marca frente a la competencia mediante auditorías basadas en Ai.",
  metadataBase: new URL('https://ai-visibility.cl'),
  alternates: {
    canonical: '/',
    languages: { 'es': '/', 'es-CL': '/' },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ai Visibility | GEO & Share of Model Platform',
    description: 'Mide cómo ChatGPT, Perplexity y Gemini perciben tu marca. Auditorías de Share of Model y tácticas GEO accionables.',
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ai-visibility.cl/#organization",
  "name": "Ai Visibility",
  "url": "https://ai-visibility.cl",
  "description": "Empresa especializada en análisis de Share of Model y Generative Engine Optimization (GEO).",
  "foundingDate": "2025",
  "knowsAbout": [
    "Generative Engine Optimization (GEO)",
    "Share of Model",
    "AI search visibility",
    "Schema.org / JSON-LD",
    "RAG (Retrieval-Augmented Generation)",
    "ChatGPT, Perplexity, Gemini, Claude"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alonso de Córdova 5870, Edificio Quantum",
    "addressLocality": "Las Condes",
    "addressRegion": "Región Metropolitana",
    "addressCountry": "CL"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+56997065555",
    "contactType": "customer service",
    "areaServed": "CL",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": [
    "https://www.instagram.com/ai_visibility_latam/",
    "https://www.linkedin.com/company/ai-visibility-latam/"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wqtybgccfk");`,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8WZ9147LEH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-8WZ9147LEH');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <a
          href="https://wa.me/56997065555?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20Ai%20Visibility"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-4 h-14 shadow-[0_4px_24px_rgba(37,211,102,0.35)] hover:bg-[#1ebe5d] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-slate-900 text-sm font-semibold whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
            ¿Hablamos?
          </span>
        </a>
      </body>
    </html>
  );
}
