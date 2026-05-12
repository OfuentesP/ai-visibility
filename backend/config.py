import os

# AI model used across all OpenAI calls.
# Override via environment variable: AI_MODEL=gpt-4o
AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")

# In-memory URL audit cache TTL (seconds). Default: 24 hours.
URL_CACHE_TTL = int(os.getenv("URL_CACHE_TTL", "86400"))
