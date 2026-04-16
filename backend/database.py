"""
Database Connection - PostgreSQL/Supabase
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL not found. "
        "Set it in .env.local or as environment variable. "
        "Example: DATABASE_URL=postgresql://user:pass@host:5432/dbname"
    )

# Para desarrollo local, reemplaza el driver si es necesario
# Si usas Supabase, la URL ya está completa
if "localhost" in DATABASE_URL:
    # Local development
    engine = create_engine(DATABASE_URL)
else:
    # Supabase o remote - agregar parámetros SSL
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        connect_args={
            "connect_timeout": 10,
            "keepalives": 1,
            "keepalives_idle": 30,
        }
    )

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para modelos
Base = declarative_base()


def get_db() -> Session:
    """
    Dependency para obtener session de BD en FastAPI
    
    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Inicializa las tablas en la base de datos
    Ejecutar después de migrar con Prisma
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
        raise


def test_connection():
    """
    Prueba la conexión a la base de datos
    """
    try:
        connection = engine.connect()
        result = connection.execute("SELECT 1")
        connection.close()
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False


# Models using SQLAlchemy ORM
from sqlalchemy import Column, String, Integer, DateTime, Float, ForeignKey, Boolean, Text, ARRAY
from datetime import datetime

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    website = Column(String, nullable=True)
    api_key = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AuditURL(Base):
    __tablename__ = "audit_urls"
    
    id = Column(String, primary_key=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    client_id = Column(String, ForeignKey("clients.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ContentAudit(Base):
    __tablename__ = "content_audits"
    
    id = Column(String, primary_key=True)
    url_id = Column(String, ForeignKey("audit_urls.id"), nullable=False)
    ai_engine = Column(String, nullable=False)  # chatgpt, perplexity, etc
    cited_status = Column(String, nullable=False)  # cited, not-cited, partial
    snippet = Column(Text, nullable=True)
    position = Column(Integer, nullable=True)
    last_checked = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(String, primary_key=True)
    url_id = Column(String, ForeignKey("audit_urls.id"), nullable=False)
    engine = Column(String, nullable=False)
    type = Column(String, nullable=False)  # keyword, content, structure, semantic
    priority = Column(String, nullable=False)  # high, medium, low
    description = Column(Text, nullable=False)
    action_items = Column(ARRAY(String), nullable=False)
    estimated_impact = Column(Integer, nullable=False)  # 0-100
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True)
    client_id = Column(String, ForeignKey("clients.id"), nullable=False)
    plan = Column(String, nullable=False)  # starter, pro, enterprise
    status = Column(String, nullable=False)  # active, cancelled, expired
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


if __name__ == "__main__":
    print("Testing database connection...")
    if test_connection():
        print("✅ Connection successful")
        print("\nTo initialize tables:")
        print("1. Run Prisma migrations: npx prisma migrate dev --name init")
        print("2. Or call: init_db()")
    else:
        print("❌ Connection failed")
        print("\nMake sure DATABASE_URL is set correctly")
