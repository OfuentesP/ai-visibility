"""
PASO 3: Base de Datos Gratuita - GUÍA DE CONFIGURACIÓN SUPABASE
"""

# ============================================================================
# OPCIÓN RECOMENDADA: SUPABASE
# ============================================================================

"""
✅ SUPABASE - PostgreSQL Gratuito + APIs Automáticas

Ventajas:
- PostgreSQL real (no limitado como otros)
- APIs REST y GraphQL automáticas
- Autenticación JWT incluida
- Real-time subscriptions
- Storage para archivos
- Backups automáticos
- 500MB almacenamiento gratis
- Dashboard excelente
- Integración perfecta con Prisma

Enlace: https://supabase.com

PASO 1: Registrarse
$ Ir a https://supabase.com
$ Sign up con GitHub/email
$ Crear organización

PASO 2: Crear Proyecto
$ Nombre: ai-visibility
$ Región: us-east-1 (o la más cercana)
$ Database password: (genera una fuerte)
$ Click "Create new project"

PASO 3: Obtener Connection String
$ Ir a Settings > Database
$ Connection string: postgresql://...
$ Copiar URL

PASO 4: Configurar .env.local
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"

O más fácil:
$ Click "Connection pooling"
$ Copiar "Connection string" (PgBouncer)
$ En .env.local:
DATABASE_URL="..." 

PASO 5: Instalar cliente
$ pip install supabase python-dotenv

PASO 6: Verificar conexión
$ python
>>> import os
>>> from dotenv import load_dotenv
>>> load_dotenv()
>>> os.getenv("DATABASE_URL")
'postgresql://...'

PASO 7: Configurar Prisma
Ya viene configurado en prisma/schema.prisma

Ejecutar migraciones:
$ npx prisma migrate dev --name init

PASO 8: Ver datos en Supabase UI
$ Dashboard > Table Editor
$ Ver tablas creadas automáticamente
"""

# ============================================================================
# ALTERNATIVAS GRATUITAS
# ============================================================================

"""
1. NEON - PostgreSQL Puro
   URL: https://neon.tech
   - PostgreSQL
   - 3 proyectos gratis
   - 0.5 GB almacenamiento
   - Bueno pero sin APIs automáticas

2. RAILWAY - Más opciones
   URL: https://railway.app
   - PostgreSQL, MySQL, MongoDB
   - $5/mes crédito gratis
   - Fácil deployment
   - Menos features que Supabase

3. PLANETSCALE - MySQL
   URL: https://planetscale.com
   - MySQL compatible
   - Conexiones ilimitadas
   - Pero no es PostgreSQL puro

RECOMENDACIÓN: Usa SUPABASE ⭐
Es la mejor opción para AI Visibility
"""

if __name__ == "__main__":
    print(__doc__)
