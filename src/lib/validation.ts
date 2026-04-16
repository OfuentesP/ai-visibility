import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url('Invalid URL'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export const auditSchema = z.object({
  urlId: z.string().uuid(),
  engines: z.array(z.enum(['chatgpt', 'perplexity', 'google-ai', 'bing', 'duckduckgo'])),
});

export const recommendationSchema = z.object({
  urlId: z.string().uuid(),
  engine: z.enum(['chatgpt', 'perplexity', 'google-ai', 'bing', 'duckduckgo']),
  type: z.enum(['keyword', 'content', 'structure', 'semantic']),
  priority: z.enum(['high', 'medium', 'low']),
  description: z.string(),
  actionItems: z.array(z.string()),
  estimatedImpact: z.number().min(0).max(100),
});

export type URLFormData = z.infer<typeof urlSchema>;
export type AuditFormData = z.infer<typeof auditSchema>;
export type RecommendationData = z.infer<typeof recommendationSchema>;
