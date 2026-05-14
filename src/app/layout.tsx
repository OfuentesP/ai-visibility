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
  title: "AI Visibility | Auditoría de Visibilidad en LLMs y Motores de Respuesta Generativa (GEO)",
  description: "Plataforma de análisis de presencia de marca en modelos de lenguaje (LLMs). Evalúa cómo ChatGPT, Perplexity, Claude y Gemini citan tu marca frente a la competencia mediante auditorías basadas en IA.",
  metadataBase: new URL('https://ai-visibility.cl'),
  alternates: {
    canonical: '/',
    languages: { 'es': '/', 'es-CL': '/' },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility | GEO & Share of Model Platform',
    description: 'Mide cómo ChatGPT, Perplexity y Gemini perciben tu marca. Auditorías de Share of Model y tácticas GEO accionables.',
  },
  robots: { index: true, follow: true },
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es Generative Engine Optimization (GEO)?",
      "acceptedAnswer": { "@type": "Answer", "text": "Generative Engine Optimization (GEO) es el proceso técnico y estratégico de optimizar la presencia de una marca para que sea recomendada por modelos de lenguaje de gran escala (LLMs) y motores de respuesta generativa, como ChatGPT, Perplexity, Claude y Gemini." }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la diferencia entre SEO y GEO?",
      "acceptedAnswer": { "@type": "Answer", "text": "El SEO busca posicionar enlaces en Google. El GEO posiciona tu marca como la respuesta definitiva dentro de un texto conversacional generado por IA, donde no hay listas de enlaces, sino una única recomendación directa." }
    },
    {
      "@type": "Question",
      "name": "¿Qué es el Share of Model (SoM)?",
      "acceptedAnswer": { "@type": "Answer", "text": "El Share of Model (SoM) representa el porcentaje exacto de veces que un modelo de inteligencia artificial cita a tu marca en comparación con tus competidores directos cuando se le pregunta sobre tu industria, productos o servicios." }
    },
    {
      "@type": "Question",
      "name": "¿Por qué mi marca no aparece en ChatGPT o Perplexity?",
      "acceptedAnswer": { "@type": "Answer", "text": "Si tu marca no aparece en LLMs se debe a falta de densidad de entidades, ausencia en fuentes de alta autoridad o carencia de datos estructurados legibles para máquinas en tu sitio web." }
    }
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
