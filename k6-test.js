/**
 * k6 load test for the Next.js API routes.
 *
 * Install:  brew install k6
 * Run:      k6 run k6-test.js
 * Report:   k6 run --out json=results.json k6-test.js
 *
 * Scenarios
 * ─────────────────────────────────────────────────────
 * smoke  →  1 VU, 30 s  — baseline latency check
 * load   →  20 VU, 3 min — normal traffic
 * spike  →  ramp to 100 VU in 10 s then back  — stress test
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// ── Custom metrics ──────────────────────────────────────────────────
const errorRate = new Rate('error_rate')
const auditLatency = new Trend('audit_latency_ms', true)

// ── Test options ────────────────────────────────────────────────────
export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { scenario: 'smoke' },
    },
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },   // ramp up
        { duration: '2m',  target: 10 },   // sustain
        { duration: '30s', target: 0  },   // ramp down
      ],
      startTime: '35s',                    // start after smoke
      tags: { scenario: 'load' },
    },
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // sudden spike
        { duration: '30s', target: 50 },
        { duration: '10s', target: 0  },
      ],
      startTime: '4m',                     // start after load
      tags: { scenario: 'spike' },
    },
  },
  // SLA thresholds — test fails if these are breached
  thresholds: {
    http_req_duration: ['p(95)<5000'],     // 95% of requests under 5 s
    error_rate:        ['rate<0.05'],      // error rate below 5%
    audit_latency_ms:  ['p(90)<10000'],    // 90% of audits under 10 s
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

const BRANDS  = ['Banco Santander', 'Falabella', 'Entel', 'Ripley', 'BCI']
const QUERIES = [
  'mejor banco en chile',
  'seguros de vida en chile',
  'telefonia movil chile',
  'tarjeta de credito sin costo',
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Default scenario (VU function) ─────────────────────────────────
export default function () {
  const brand = randomItem(BRANDS)
  const query = randomItem(QUERIES)
  const params = { headers: { 'Content-Type': 'application/json' }, timeout: '90s' }

  // 1 — Health check on Next.js API route
  const health = http.get(`${BASE_URL}/api/health`, params)
  check(health, {
    'health 200':              (r) => r.status === 200,
    'health response < 500ms': (r) => r.timings.duration < 500,
  })
  errorRate.add(health.status !== 200)

  sleep(1)

  // 2 — Audit via Next.js proxy
  const start = Date.now()
  const audit = http.post(
    `${BASE_URL}/api/audit?query=${encodeURIComponent(query)}&brand=${encodeURIComponent(brand)}`,
    null,
    params
  )
  auditLatency.add(Date.now() - start)

  const auditOk = check(audit, {
    'audit 200':                     (r) => r.status === 200,
    'audit has resultados':          (r) => {
      try { return Array.isArray(JSON.parse(r.body).resultados) }
      catch { return false }
    },
    'audit latency < 30s':           (r) => r.timings.duration < 30000,
  })
  errorRate.add(!auditOk)

  sleep(randomItem([2, 3, 5]))
}
