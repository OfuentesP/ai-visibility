import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '0.1.0',
    features: {
      audit: 'Content audit for AI search engines',
      recommendations: 'AI-powered optimization recommendations',
      analytics: 'Citation tracking and analytics',
    },
  });
}
