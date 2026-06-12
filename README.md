# AI Visibility — La plataforma que pone a tu marca en la mente de la IA

> **Tu marca existe para Google. ¿Pero existe para ChatGPT?**

Cuando un cliente hoy busca "el mejor banco para cuenta corriente" o "qué fintech me conviene", no lo googlea: **le pregunta a la IA**. ChatGPT, Perplexity y Google AI Overviews responden al instante con una recomendación. Si tu marca no aparece en esa respuesta, no existes para ese cliente.

**AI Visibility** es la primera plataforma en Latinoamérica que audita, mide y mejora tu posición en los motores de IA — igual que el SEO lo hizo por Google, pero para la era de las respuestas generativas.

---

## El problema que resolvemos

Las empresas hoy gastan millones en SEO y pauta, pero están **completamente ciegas** ante el canal que ya captura el 30-40% de las decisiones de compra informadas: la IA conversacional.

Un Gerente de Marketing no sabe hoy:
- ¿Me está recomendando ChatGPT a mí o a mi competencia?
- ¿Cómo habla la IA de mi marca — positivo, negativo, neutral?
- ¿Qué argumento usa la IA para preferir a Banco Santander sobre Banco de Chile?
- ¿Cómo subo en ese ranking?

**Sin datos, no hay estrategia. Sin estrategia, pierden share of voice sin saberlo.**

---

## Lo que entregamos

Ingresa tu marca y una consulta de mercado. En segundos obtienes:

| Métrica | Descripción |
|---|---|
| **Posición en IA** | En qué lugar te pone ChatGPT, Claude o Gemini vs tu competencia |
| **Sentimiento** | Positivo / Neutral / Negativo — con las frases exactas que usa la IA |
| **Share of Voice** | Qué % de las respuestas de IA mencionan tu marca vs el mercado total |
| **Radar de intención** | Qué perfiles de cliente buscan tu categoría y qué marcas les recomienda la IA |
| **Plan de acción** | Qué cambiar en tu contenido público para subir en el ranking de la IA |

---

## A quién va dirigido

**Cliente ideal (ICP):**

- Gerentes de Marketing y Brand de bancos, retail y fintechs
- Agencias de marketing digital que reportan share of voice a sus clientes
- Empresas con presencia en Chile que compiten en mercados donde la IA ya influye la decisión de compra

**El early adopter** es cualquier empresa que hoy paga por SEO y quiere la misma visibilidad, pero en el canal de mayor crecimiento: la búsqueda por IA.

---

## Por qué ahora

- **ChatGPT superó los 200M de usuarios activos semanales** (2025). En Chile, más del 60% de los profesionales lo usan regularmente.
- Google AI Overviews ya responde el 40% de las búsquedas antes de mostrar links.
- **No existe una solución equivalente en español ni orientada al mercado latinoamericano.**
- Las marcas que actúen primero construirán una ventaja de datos que será muy difícil de alcanzar después.

---

## Modelo de negocio

| Plan | Precio estimado | Incluye |
|---|---|---|
| **Starter** | $99 USD/mes | 50 auditorías/mes, 1 marca, 2 motores de IA |
| **Growth** | $299 USD/mes | 300 auditorías/mes, 5 marcas, 4 motores de IA, histórico |
| **Enterprise** | A convenir | Auditorías ilimitadas, API, reportes PDF, SLA, onboarding dedicado |

---

## Estado actual del producto

| Componente | Estado |
|---|---|
| Motor de auditoría (ChatGPT + análisis estructurado) | ✅ Producción |
| Dashboard de resultados en tiempo real | ✅ Producción |
| Base de datos histórica (Supabase PostgreSQL) | ✅ Conectado |
| Discovery de intención por perfil de cliente | ✅ Producción |
| Plan de acción con acciones priorizadas (ICE Score) | ✅ Producción |
| Soporte multi-motor (Claude, Gemini, Perplexity) | 🔄 En desarrollo |
| Reportes PDF descargables | 📋 Roadmap Q3 |
| Alertas automáticas de cambio de posición | 📋 Roadmap Q3 |
| API para integraciones externas | 📋 Roadmap Q4 |

---

## Stack tecnológico

- **Backend:** Python / FastAPI — robusto, escalable, listo para producción
- **Frontend:** Next.js 16 / React 19 / Tailwind CSS — interfaz moderna y rápida
- **Base de datos:** PostgreSQL en Supabase — histórico de auditorías, multi-tenant
- **IA:** Motor dual — OpenAI GPT-4o-mini y Google Gemini 2.5-flash. La auditoría de marca corre ambos en paralelo (`motor=ambos`) y compara cómo posiciona cada uno. Salidas estructuradas + validación Pydantic — resultados confiables y auditables
- **Arquitectura:** 4 capas con defensa determinística — la IA extrae, Python decide (sin alucinaciones en métricas)

---

## ⚡ Inicio Rápido (5 minutos)

### Requisitos
- Node.js 20+ / npm
- Python 3.9+
- PostgreSQL gratis (Supabase)
- OpenAI API key
- Gemini API key (Google AI Studio) — opcional; sin ella `motor=ambos` cae a solo ChatGPT

### Setup

```bash
# 1️⃣ Clonar y navegar
git clone <repo> ai-visibility
cd ai-visibility

# 2️⃣ Setup Frontend (Next.js)
npm install && npm run dev
# → http://localhost:3000

# 3️⃣ Setup Backend (FastAPI) - En otra terminal
cd backend
pip install -r requirements.txt
cp .env.local .env.local  # Copiar template
# Agregar DATABASE_URL desde Supabase

# 4️⃣ Verificar sistema
python ../test_paso_3.py

# 5️⃣ Iniciar Backend
python main.py
# → http://localhost:8000/docs (Swagger UI)
```

---

## 📋 Estatus del Proyecto

### ✅ COMPLETADO - Pasos 1-3

| Paso | Nombre | Estado | Detalles |
|------|--------|--------|----------|
| 1 | Scaffolding Fullstack | ✅ | Next.js + FastAPI, CORS, middleware |
| 2 | Motor de Búsqueda | ✅ | Dual: OpenAI + Gemini async (`consultar_motor`) |
| 3 | Base de Datos | ✅ | SQLAlchemy ORM, 5 tablas, 21 endpoints |

### ⏳ PRÓXIMOS - Pasos 4-6

| Paso | Nombre | Tareas | Prioridad |
|------|--------|--------|-----------|
| 4 | Dashboard Frontend | React forms, gráficos | 🔴 Alto |
| 5 | Auth + Pagos | JWT, API keys, Stripe | 🟡 Medio |
| 6 | Deployment | Docker, CI/CD, prod | 🟢 Bajo |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│   FRONTEND (Next.js + React)            │
│   http://localhost:3000                 │
│  • Dashboard, Forms, Gráficos           │
└─────────┬───────────────────────────────┘
          │ HTTP/REST (Axios)
          ▼
┌─────────────────────────────────────────┐
│   BACKEND (FastAPI)                     │
│   http://localhost:8000                 │
│  • 21 endpoints CRUD + AI analysis      │
└─────────┬───────────────────────────────┘
          │ SQLAlchemy ORM
          ▼
┌─────────────────────────────────────────┐
│   PostgreSQL (Supabase FREE)            │
│  • clients, audit_urls, content_audits  │
│  • recommendations, subscriptions       │
└─────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
ai-visibility/
├── src/                          # Frontend Next.js
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── api/                 # API routes
│   ├── components/              # React components
│   ├── lib/
│   │   ├── api-client.ts        # Axios client
│   │   └── validation.ts         # Zod schemas
│   └── types/index.ts           # TypeScript models
│
├── backend/                      # Python FastAPI
│   ├── main.py                  # ✅ 21 endpoints
│   ├── database.py              # ✅ SQLAlchemy ORM
│   ├── crud.py                  # ✅ 15+ operaciones
│   ├── models.py                # Pydantic models
│   ├── searcher.py              # Dispatcher motor dual (OpenAI/Gemini)
│   ├── openai_tracking.py       # Wrapper OpenAI + tracking de uso
│   ├── gemini_tracking.py       # Wrapper Gemini + tracking de uso
│   ├── requirements.txt
│   ├── .env.local               # Variables (GIT IGNORED)
│   └── README.md
│
├── prisma/                       # Prisma schema
│   └── schema.prisma
│
├── .env.local.example           # Template
├── test_paso_3.py               # ✅ Script de test
├── PASO_3_SETUP.md              # 📖 Guía Supabase
├── PASO_3_COMPLETADO.md         # ✅ Resumen técnico
└── README.md                    # Este archivo
```

---

## 🎯 21 Endpoints API

### Health & Info
```
GET  /health                    → Estado del servicio
GET  /api/info                  → Info de la API
GET  /api/modelos/esquema       → Esquemas JSON
```

### Gestión de Clientes
```
POST /api/clients/create        → Crear cliente (retorna api_key)
GET  /api/clients/{cliente_id}  → Datos cliente + URLs + métricas
GET  /api/clients               → Listar todos
```

### URLs para Auditar
```
POST /api/urls/add              → Agregar URL
GET  /api/clients/{id}/urls     → Listar URLs del cliente
```

### Auditorías
```
POST /api/audits/save           → Guardar resultado auditoría
GET  /api/urls/{url_id}/audits  → Listar auditorías
```

### Recomendaciones
```
POST /api/recommendations/save  → Guardar recomendación
GET  /api/urls/{id}/recommendations → Listar recomendaciones
```

### Analítica
```
GET  /api/clients/{id}/metrics  → Métricas de visibilidad
```

### AI Analysis (compatibilidad)
```
POST /api/analizar              → Analizar búsquedas
POST /api/competencia           → Análisis competencia
```

**Total: 21 endpoints** con validación Pydantic, CORS, error handling

---

## 🗄️ Base de Datos

**5 Tablas PostgreSQL** creadas automáticamente:

### clients
```sql
id (UUID, PK) | name | email (UNIQUE) | website
api_key (UNIQUE) | created_at | updated_at
```

### audit_urls
```sql
id (UUID, PK) | client_id (FK) | url (UNIQUE)
title | description | created_at | last_audited
```

### content_audits
```sql
id (UUID, PK) | audit_url_id (FK)
ai_engine | cited_status | snippet | position | created_at
```

### recommendations
```sql
id (UUID, PK) | audit_url_id (FK) | engine
tipo | prioridad | descripcion | action_items (JSON)
estimated_impact | created_at
```

### subscriptions
```sql
id (UUID, PK) | client_id (FK) | plan
status | created_at | expires_at
```

---

## 🧪 Verificación & Testing

### Script Completo
```bash
python test_paso_3.py
```

Verifica:
- ✅ Imports de todos los módulos
- ✅ Conexión a PostgreSQL
- ✅ Creación de tablas
- ✅ CRUD operations
- ✅ Modelos Pydantic

### Probar Manualmente

```bash
# Health check
curl http://localhost:8000/health

# Crear cliente
curl -X POST "http://localhost:8000/api/clients/create?nombre=Test&email=test@test.com"

# Ver documentación interactiva
# Abre: http://localhost:8000/docs
```

---

## 🔑 Configuración

### Variables de Entorno

Copiar `backend/.env.local.example` a `backend/.env.local`:

```bash
# Database (Supabase FREE)
DATABASE_URL="postgresql://postgres:PASSWORD@region.supabase.co:5432/postgres"

# AI Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# FastAPI
ENVIRONMENT="development"
DEBUG=true

# Frontend
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
NODE_ENV="development"
```

Ver [.env.local.example](.env.local.example) para todas las opciones.

### Base de Datos (Supabase)

1. Ve a https://supabase.com
2. Sign up con GitHub
3. Crea proyecto (nombre: `ai-visibility`)
4. En Settings > Database > Connection Strings, copia PostgreSQL URL
5. Reemplaza `PASSWORD` en la URL
6. Copia a `backend/.env.local` como `DATABASE_URL`

Ver [PASO_3_SETUP.md](PASO_3_SETUP.md) para instrucciones detalladas.

---

## 🛠️ Tech Stack

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| **Frontend** | Next.js | 16.2.4 | Framework React |
| | React | 19.2.4 | UI library |
| | TypeScript | 5.0 | Type safety |
| | Tailwind CSS | 4.0 | Styling |
| | Axios | - | HTTP client |
| **Backend** | FastAPI | 0.104.1 | Web framework |
| | Python | 3.9+ | Runtime |
| | Pydantic | 2.5.0 | Validación |
| | SQLAlchemy | 2.0.23 | ORM |
| **Database** | PostgreSQL | 15+ | Storage |
| | Supabase | FREE | Hosted DB |
| **AI** | OpenAI GPT-4o-mini | - | Motor + juez/extractor |
| | Google Gemini 2.5-flash | - | Motor de búsqueda dual |

---

## 📚 Documentación

- **[PASO_3_SETUP.md](PASO_3_SETUP.md)** - Guía paso a paso Supabase
- **[PASO_3_COMPLETADO.md](PASO_3_COMPLETADO.md)** - Resumen técnico
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Integración clientes
- **[backend/README.md](backend/README.md)** - Docs backend
- **[.env.local.example](.env.local.example)** - Variables de entorno
- **Swagger UI** - http://localhost:8000/docs (cuando backend está corriendo)

---

## 🚀 Desarrollo

### Terminal 1: Frontend
```bash
npm install
npm run dev
# http://localhost:3000
```

### Terminal 2: Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# http://localhost:8000/docs
```

### Build Producción
```bash
# Frontend
npm run build && npm start

# Backend
# Ver instrucciones en backend/README.md
```

---

## 🐛 Troubleshooting

### Backend no conecta a BD
```bash
# 1. Verificar que DATABASE_URL está en backend/.env.local
# 2. Ejecutar: python test_paso_3.py
# 3. Ver detalles en PASO_3_SETUP.md
```

### Frontend no conecta a Backend
```bash
# 1. Verificar que backend está corriendo en puerto 8000
# 2. Verificar NEXT_PUBLIC_BACKEND_URL en .env.local
# 3. Ver CORS en backend/main.py
```

### Module not found
```bash
# Frontend
npm install

# Backend
pip install -r requirements.txt
```

Ver [PASO_3_SETUP.md](PASO_3_SETUP.md) para troubleshooting detallado.

---

## 📊 Roadmap

```
2024-01
├─ ✅ Paso 1: Setup fullstack
├─ ✅ Paso 2: Motor búsqueda
├─ ✅ Paso 3: Base de datos
├─ ⏳ Paso 4: Dashboard frontend
├─ ⏳ Paso 5: Auth + Pagos
└─ ⏳ Paso 6: Deployment

2024-02
├─ Más AI providers
├─ Análisis competidores
├─ Reportes avanzados
└─ Integración Slack

2024-03
├─ Mobile app
├─ Webhooks
├─ Analytics
└─ Enterprise
```

---

## 📄 Licencia

MIT - Ver LICENSE para detalles

---

## 📞 Contacto

- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions
- 📧 **Email**: (próximo)

---

**Versión:** 0.1.0 | **Estado:** 🟡 Development (Pasos 1-3 completados)

**Última actualización:** Enero 2024
# AI Visibility - SaaS Platform

Platform para auditar y optimizar la visibilidad de contenido en motores de búsqueda con IA (ChatGPT, Perplexity, Google AI Overviews, etc).

## 🏗️ Arquitectura

```
ai-visibility/
├── frontend/                 # Next.js 14 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/             # App Router
│   │   ├── components/      # Componentes React
│   │   ├── features/        # Módulos por feature
│   │   ├── lib/             # Utilidades y API client
│   │   └── types/           # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # FastAPI + Pydantic
│   ├── main.py              # API FastAPI
│   ├── models.py            # Modelos Pydantic
│   ├── examples.py          # Ejemplos de uso
│   ├── requirements.txt      # Dependencias Python
│   └── README.md            # Documentación
│
└── prisma/                   # Base de datos
    └── schema.prisma        # Esquema PostgreSQL
```

## 🚀 Quick Start

### Frontend (Next.js)

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

Abre http://localhost:3000

### Backend (FastAPI)

```bash
cd backend

# Crear ambiente virtual
python -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py
```

El backend estará en http://localhost:8000

**Documentación interactiva:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📊 Modelos Pydantic

### AnalisisMarca
Análisis de marcas mencionadas en un resultado de búsqueda:

```python
{
  "marcas_mencionadas": ["Apple", "Samsung", "Tu Marca"],
  "marca_ganadora": "Apple",
  "posicion_mi_marca": 3,
  "sentimiento_general": "positivo"
}
```

### ResultadoBusqueda
Resultado completo de análisis de búsqueda:

```python
{
  "prompt": "mejores smartphones 2024",
  "analisis_marcas": [...],
  "timestamp": "2024-04-15T10:30:00"
}
```

### AnalisisCompetencia
Análisis agregado de competencia:

```python
{
  "total_resultados": 10,
  "apariciones_mi_marca": 3,
  "posicion_promedio": 2.5,
  "marca_competidora_principal": "Apple",
  "sentimiento_dominante": "positivo",
  "recomendaciones": [...]
}
```

Ver más en [backend/README.md](backend/README.md)

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Audit
```
POST /api/audit
```

### Análisis de Marca
```
POST /api/analizar
Request: ResultadoBusqueda
Response: AnalisisCompetencia
```

### Competencia
```
POST /api/competencia
Request: List[ResultadoBusqueda]
Response: AnalisisCompetencia
```

## 🗄️ Base de Datos

PostgreSQL con Prisma ORM. Esquema en `prisma/schema.prisma`

**Entidades principales:**
- `Client` - Clientes/organizaciones
- `AuditURL` - URLs a auditar
- `ContentAudit` - Resultados de auditoría
- `Recommendation` - Recomendaciones de optimización
- `Subscription` - Planes de suscripción

## 📦 Dependencias Frontend

- **Next.js 16.2.4** - Framework React
- **React 19.2.4** - UI library
- **Tailwind CSS** - Styling
- **TypeScript 5** - Type safety
- **Axios** - HTTP client
- **Zod** - Validación
- **SWR** - Data fetching
- **Prisma** - ORM

## 📦 Dependencias Backend

- **FastAPI 0.104.1** - Framework web
- **Pydantic 2.5.0** - Validación de datos
- **Uvicorn 0.24.0** - ASGI server
- **SQLAlchemy 2.0.23** - ORM
- **PostgreSQL** - Database

## 🔐 Configuración

Copiar `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Y actualizar con tus valores:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
OPENAI_API_KEY="sk-..."
```

## 📝 Características

- ✅ Dashboard de auditoría
- ✅ Análisis de visibilidad en AI engines
- ✅ Recomendaciones de optimización
- ✅ Tracking de citas
- ✅ Analytics y reportes
- ✅ Integración con múltiples AI engines
- ✅ Modelos Pydantic + tipos TypeScript

## 🛠️ Stack Tecnológico

**Frontend:**
- Next.js 14+ (React 19, TypeScript)
- Tailwind CSS
- API Client (Axios)

**Backend:**
- FastAPI
- Pydantic
- PostgreSQL

**DevOps:**
- Docker (próximamente)
- GitHub Actions (próximamente)

## 📚 Documentación

- [Backend API](backend/README.md)
- [Backend Examples](backend/examples.py)
- [Prisma Schema](prisma/schema.prisma)
- [TypeScript Types](src/types/index.ts)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 📞 Soporte

Para soporte, contacta a: oscar@aivisibility.com
