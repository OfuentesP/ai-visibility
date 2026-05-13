import os

# AI model used across all OpenAI calls.
# Override via environment variable: AI_MODEL=gpt-4o
AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")

# In-memory URL audit cache TTL (seconds). Default: 24 hours.
URL_CACHE_TTL = int(os.getenv("URL_CACHE_TTL", "86400"))

# Supabase audit cache TTL in days. Default: 14 days.
AUDIT_CACHE_TTL_DAYS = int(os.getenv("AUDIT_CACHE_TTL_DAYS", "14"))
