"""
Locust load test for AI Visibility API.

Usage:
    locust -f locustfile.py --host=http://127.0.0.1:8000

Then open http://localhost:8089 to start the test.

Recommended scenarios:
  - Smoke:   5 users,  spawn rate 1,  duration 60s  → verify baseline latency
  - Load:   20 users,  spawn rate 2,  duration 180s → normal traffic
  - Stress:  50 users, spawn rate 5,  duration 120s → find breaking point
"""

import random
from locust import HttpUser, task, between

# ─── Sample payloads ────────────────────────────────────────────────
BRANDS = ["Banco Santander", "Falabella", "Entel", "Ripley", "BCI"]
QUERIES = [
    "mejor banco en chile",
    "seguros de vida en chile",
    "telefonia movil chile",
    "tarjeta de credito sin costo",
    "crédito hipotecario chile",
]


class AuditUser(HttpUser):
    """Simulates a user who opens the app, checks health, then runs an audit."""

    wait_time = between(2, 6)  # seconds between tasks per user

    # ── Fast endpoints (weight 3) ──────────────────────────────────
    @task(3)
    def health_check(self):
        """Lightweight probe — should always be <50 ms."""
        with self.client.get("/health", catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
            else:
                resp.failure(f"Health returned {resp.status_code}")

    @task(2)
    def api_info(self):
        with self.client.get("/api/info", catch_response=True) as resp:
            if resp.status_code == 200:
                resp.success()
            else:
                resp.failure(f"/api/info returned {resp.status_code}")

    # ── Core endpoint (weight 1 — heavy, uses OpenAI) ─────────────
    @task(1)
    def run_audit(self):
        brand = random.choice(BRANDS)
        query = random.choice(QUERIES)
        with self.client.post(
            f"/api/audit?query={query}&brand={brand}",
            name="/api/audit",  # group all requests under same label
            catch_response=True,
            timeout=90,         # OpenAI can take up to 60 s
        ) as resp:
            if resp.status_code == 200:
                data = resp.json()
                if "resultados" not in data:
                    resp.failure("Response missing 'resultados' field")
                else:
                    resp.success()
            elif resp.status_code == 422:
                resp.failure(f"Validation error: {resp.text[:200]}")
            elif resp.status_code == 500:
                resp.failure(f"Server error: {resp.text[:200]}")
            else:
                resp.failure(f"Unexpected {resp.status_code}")


class DiscoveryUser(HttpUser):
    """Simulates the background discovery call (non-blocking in UI)."""

    wait_time = between(10, 30)  # slower cadence — discovery is expensive

    @task
    def run_discovery(self):
        brand = random.choice(BRANDS)
        query = random.choice(QUERIES)
        with self.client.post(
            f"/api/discovery?brand={brand}&topico={query}",
            name="/api/discovery",
            catch_response=True,
            timeout=120,
        ) as resp:
            if resp.status_code == 200:
                resp.success()
            else:
                resp.failure(f"Discovery {resp.status_code}: {resp.text[:100]}")
