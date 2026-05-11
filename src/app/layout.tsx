import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "AI Visibility | Auditoría de Visibilidad en LLMs y Motores de Respuesta Generativa (GEO)",
  description: "Plataforma de análisis de presencia de marca en modelos de lenguaje (LLMs). Evalúa cómo ChatGPT, Perplexity, Claude y Gemini citan tu marca frente a la competencia mediante auditorías basadas en IA.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI Visibility",
  "url": "https://ai-visibility.cl",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Herramienta de auditoría para Generative Engine Optimization (GEO). Analiza la visibilidad de marcas en modelos fundacionales de IA como GPT-4, Claude 3, y Gemini.",
  "offers": {
    "@type": "Offer",
    "price": "12.00",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Auditoría de marca en LLMs",
    "Análisis de sentimiento en respuestas generativas",
    "Benchmarking de competidores en motores de respuesta",
    "Generación de arquetipos de usuario para búsqueda de IA",
    "Seguimiento de tendencias en visibilidad generativa"
  ],
  "author": {
    "@type": "Organization",
    "name": "AI Visibility",
    "url": "https://ai-visibility.cl"
  }
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
