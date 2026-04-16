"""
CRUD Operations - Create, Read, Update, Delete
Operaciones con la base de datos
"""

from sqlalchemy.orm import Session
from database import Client, AuditURL, ContentAudit, Recommendation, Subscription
from models import AnalisisMarca, ResultadoBusqueda
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# CLIENT OPERATIONS
# ============================================================================

def crear_cliente(db: Session, nombre: str, email: str, website: str = None) -> dict:
    """
    Crea un nuevo cliente
    
    Args:
        db: Session de SQLAlchemy
        nombre: Nombre de la empresa/cliente
        email: Email del cliente
        website: Sitio web (opcional)
    
    Returns:
        dict con datos del cliente creado
    """
    try:
        cliente_id = str(uuid.uuid4())
        api_key = str(uuid.uuid4())
        
        nuevo_cliente = Client(
            id=cliente_id,
            name=nombre,
            email=email,
            website=website,
            api_key=api_key
        )
        
        db.add(nuevo_cliente)
        db.commit()
        db.refresh(nuevo_cliente)
        
        logger.info(f"✅ Cliente creado: {nombre}")
        
        return {
            "id": nuevo_cliente.id,
            "name": nuevo_cliente.name,
            "email": nuevo_cliente.email,
            "api_key": nuevo_cliente.api_key
        }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error creando cliente: {e}")
        raise


def obtener_cliente(db: Session, cliente_id: str) -> dict:
    """Obtiene datos de un cliente"""
    cliente = db.query(Client).filter(Client.id == cliente_id).first()
    
    if not cliente:
        return None
    
    return {
        "id": cliente.id,
        "name": cliente.name,
        "email": cliente.email,
        "website": cliente.website,
        "created_at": cliente.created_at
    }


def listar_clientes(db: Session) -> list:
    """Lista todos los clientes"""
    clientes = db.query(Client).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "website": c.website
        }
        for c in clientes
    ]


# ============================================================================
# AUDIT URL OPERATIONS
# ============================================================================

def agregar_url_auditar(
    db: Session,
    url: str,
    titulo: str,
    cliente_id: str,
    descripcion: str = None
) -> dict:
    """
    Agrega una URL para auditar
    
    Args:
        db: Session
        url: URL a auditar
        titulo: Título de la página
        cliente_id: ID del cliente propietario
        descripcion: Descripción (opcional)
    
    Returns:
        dict con datos de la URL creada
    """
    try:
        url_id = str(uuid.uuid4())
        
        # Verificar que el cliente existe
        cliente = db.query(Client).filter(Client.id == cliente_id).first()
        if not cliente:
            raise ValueError(f"Cliente {cliente_id} no existe")
        
        nueva_url = AuditURL(
            id=url_id,
            url=url,
            title=titulo,
            description=descripcion,
            client_id=cliente_id
        )
        
        db.add(nueva_url)
        db.commit()
        db.refresh(nueva_url)
        
        logger.info(f"✅ URL agregada: {url}")
        
        return {
            "id": nueva_url.id,
            "url": nueva_url.url,
            "title": nueva_url.title,
            "created_at": nueva_url.created_at
        }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error agregando URL: {e}")
        raise


def obtener_urls_cliente(db: Session, cliente_id: str) -> list:
    """Obtiene todas las URLs de un cliente"""
    urls = db.query(AuditURL).filter(AuditURL.client_id == cliente_id).all()
    
    return [
        {
            "id": u.id,
            "url": u.url,
            "title": u.title,
            "created_at": u.created_at
        }
        for u in urls
    ]


# ============================================================================
# CONTENT AUDIT OPERATIONS
# ============================================================================

def guardar_auditoria(
    db: Session,
    url_id: str,
    ai_engine: str,
    cited_status: str,
    snippet: str = None,
    position: int = None
) -> dict:
    """
    Guarda resultado de auditoría
    
    Args:
        db: Session
        url_id: ID de la URL auditada
        ai_engine: Motor IA (chatgpt, perplexity, google-ai, etc)
        cited_status: Estado (cited, not-cited, partial)
        snippet: Fragment de la respuesta (opcional)
        position: Posición en la respuesta (opcional)
    
    Returns:
        dict con datos de la auditoría
    """
    try:
        auditoria_id = str(uuid.uuid4())
        
        # Verificar que la URL existe
        url_obj = db.query(AuditURL).filter(AuditURL.id == url_id).first()
        if not url_obj:
            raise ValueError(f"URL {url_id} no existe")
        
        # Verificar si ya existe auditoría para este engine
        existente = db.query(ContentAudit).filter(
            ContentAudit.url_id == url_id,
            ContentAudit.ai_engine == ai_engine
        ).first()
        
        if existente:
            # Actualizar existente
            existente.cited_status = cited_status
            existente.snippet = snippet
            existente.position = position
            existente.last_checked = datetime.utcnow()
            db.commit()
            logger.info(f"✅ Auditoría actualizada: {ai_engine}")
            return {
                "id": existente.id,
                "status": "updated"
            }
        else:
            # Crear nueva
            nueva_auditoria = ContentAudit(
                id=auditoria_id,
                url_id=url_id,
                ai_engine=ai_engine,
                cited_status=cited_status,
                snippet=snippet,
                position=position
            )
            
            db.add(nueva_auditoria)
            db.commit()
            logger.info(f"✅ Auditoría guardada: {ai_engine}")
            return {
                "id": nueva_auditoria.id,
                "status": "created"
            }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error guardando auditoría: {e}")
        raise


def obtener_auditorias_url(db: Session, url_id: str) -> list:
    """Obtiene todas las auditorías de una URL"""
    auditorias = db.query(ContentAudit).filter(
        ContentAudit.url_id == url_id
    ).all()
    
    return [
        {
            "id": a.id,
            "ai_engine": a.ai_engine,
            "cited_status": a.cited_status,
            "snippet": a.snippet,
            "position": a.position,
            "last_checked": a.last_checked
        }
        for a in auditorias
    ]


# ============================================================================
# RECOMMENDATION OPERATIONS
# ============================================================================

def guardar_recomendacion(
    db: Session,
    url_id: str,
    engine: str,
    tipo: str,
    prioridad: str,
    descripcion: str,
    action_items: list,
    estimated_impact: int
) -> dict:
    """
    Guarda una recomendación de optimización
    
    Args:
        db: Session
        url_id: ID de la URL
        engine: Motor IA objetivo
        tipo: Tipo (keyword, content, structure, semantic)
        prioridad: Prioridad (high, medium, low)
        descripcion: Descripción de la recomendación
        action_items: Lista de acciones
        estimated_impact: Impacto estimado (0-100)
    
    Returns:
        dict con recomendación guardada
    """
    try:
        recom_id = str(uuid.uuid4())
        
        nueva_recom = Recommendation(
            id=recom_id,
            url_id=url_id,
            engine=engine,
            type=tipo,
            priority=prioridad,
            description=descripcion,
            action_items=action_items,
            estimated_impact=estimated_impact
        )
        
        db.add(nueva_recom)
        db.commit()
        logger.info(f"✅ Recomendación guardada: {tipo}")
        
        return {
            "id": nueva_recom.id,
            "type": nueva_recom.type,
            "priority": nueva_recom.priority
        }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error guardando recomendación: {e}")
        raise


def obtener_recomendaciones_url(db: Session, url_id: str) -> list:
    """Obtiene todas las recomendaciones de una URL"""
    recomendaciones = db.query(Recommendation).filter(
        Recommendation.url_id == url_id
    ).all()
    
    return [
        {
            "id": r.id,
            "engine": r.engine,
            "type": r.type,
            "priority": r.priority,
            "description": r.description,
            "action_items": r.action_items,
            "estimated_impact": r.estimated_impact
        }
        for r in recomendaciones
    ]


# ============================================================================
# ANALYTICS & REPORTING
# ============================================================================

def obtener_metricas_cliente(db: Session, cliente_id: str) -> dict:
    """
    Obtiene métricas consolidadas del cliente
    
    Returns:
        dict con métricas de visibilidad
    """
    try:
        # Total de URLs
        total_urls = db.query(AuditURL).filter(
            AuditURL.client_id == cliente_id
        ).count()
        
        # Total de citaciones
        citadas = db.query(ContentAudit).join(AuditURL).filter(
            AuditURL.client_id == cliente_id,
            ContentAudit.cited_status == "cited"
        ).count()
        
        # Total de auditorías
        total_audits = db.query(ContentAudit).join(AuditURL).filter(
            AuditURL.client_id == cliente_id
        ).count()
        
        # Breakdown por engine
        engines = db.query(ContentAudit.ai_engine).join(AuditURL).filter(
            AuditURL.client_id == cliente_id,
            ContentAudit.cited_status == "cited"
        ).group_by(ContentAudit.ai_engine).all()
        
        engine_breakdown = {}
        for engine in engines:
            count = db.query(ContentAudit).join(AuditURL).filter(
                AuditURL.client_id == cliente_id,
                ContentAudit.ai_engine == engine[0],
                ContentAudit.cited_status == "cited"
            ).count()
            engine_breakdown[engine[0]] = count
        
        citation_rate = (citadas / total_audits * 100) if total_audits > 0 else 0
        
        return {
            "total_urls": total_urls,
            "total_audits": total_audits,
            "citations_found": citadas,
            "citation_rate": round(citation_rate, 2),
            "engine_breakdown": engine_breakdown,
            "last_updated": datetime.utcnow()
        }
    
    except Exception as e:
        logger.error(f"Error obteniendo métricas: {e}")
        raise


if __name__ == "__main__":
    from database import SessionLocal
    
    print("Testing CRUD operations...")
    db = SessionLocal()
    
    try:
        # Test crear cliente
        cliente = crear_cliente(
            db,
            nombre="Test Company",
            email="test@company.com",
            website="https://company.com"
        )
        print(f"✅ Cliente creado: {cliente['id']}")
        
        # Test agregar URL
        url_auditoria = agregar_url_auditar(
            db,
            url="https://company.com/products",
            titulo="Nuestros Productos",
            cliente_id=cliente['id'],
            descripcion="Página de productos"
        )
        print(f"✅ URL agregada: {url_auditoria['id']}")
        
        # Test guardar auditoría
        auditoria = guardar_auditoria(
            db,
            url_id=url_auditoria['id'],
            ai_engine="chatgpt",
            cited_status="cited",
            snippet="Nuestra empresa ofrece...",
            position=1
        )
        print(f"✅ Auditoría guardada")
        
        # Test obtener métricas
        metricas = obtener_metricas_cliente(db, cliente['id'])
        print(f"✅ Métricas: {metricas}")
    
    finally:
        db.close()
