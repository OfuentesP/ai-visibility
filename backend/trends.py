"""Validación de territorios desatendidos contra Google Trends."""
import logging
import time
from pytrends.request import TrendReq

_PYTRENDS_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
}

logger = logging.getLogger(__name__)


def consultar_crecimiento(topico: str, geo: str = "CL", timeframe: str = "today 3-m") -> str:
    """
    Consulta Google Trends para un tópico y devuelve un string legible
    con el crecimiento porcentual en los últimos 3 meses.
    """
    try:
        pytrends = TrendReq(hl='es-CL', tz=240, timeout=(10, 25), retries=2, backoff_factor=0.1, requests_args={'headers': _PYTRENDS_HEADERS})
        time.sleep(2)
        pytrends.build_payload([topico], cat=0, timeframe=timeframe, geo=geo)
        df = pytrends.interest_over_time()

        if df is None or df.empty or topico not in df.columns:
            return "Sin datos de Trends"

        series = df[topico]
        inicio = series.iloc[:4].mean()  # primeras 4 semanas
        fin = series.iloc[-4:].mean()    # últimas 4 semanas

        if inicio <= 0:
            return f"Emergente (interés actual: {int(fin)})" if fin > 30 else "Bajo volumen"

        cambio = ((fin - inicio) / inicio) * 100
        if cambio > 20:
            return f"+{int(cambio)}% de interés"
        elif cambio < -20:
            return f"{int(cambio)}% de interés"
        else:
            return "Tendencia estable"

    except Exception as e:
        logger.warning(f"⚠️  Trends bloqueado para '{topico}': {e}")
        return "Validado por IA"


def enriquecer_territorios(territorios: list[dict]) -> list[dict]:
    """
    Itera sobre territorios desatendidos y enriquece cada uno
    con crecimiento_trends real de Google Trends.
    """
    for t in territorios:
        topico = t.get("topico_emergente", "")
        if topico:
            t["crecimiento_trends"] = consultar_crecimiento(topico)
        else:
            t["crecimiento_trends"] = "Sin datos de Trends"
    return territorios


def get_keyword_trend_direction(keyword: str, geo: str = "CL", timeframe: str = "today 3-m") -> str:
    """
    Consulta Google Trends para una keyword principal y devuelve la dirección
    de la tendencia como 'Al alza', 'Estable' o 'Baja'.

    Args:
        keyword: Keyword principal a consultar (generada por la IA)
        geo: Código de país para Google Trends (default: 'CL' para Chile)
        timeframe: Ventana temporal (default: últimos 3 meses)

    Returns:
        str: 'Al alza', 'Estable' o 'Baja'
    """
    try:
        pytrends = TrendReq(hl='es-CL', tz=240, timeout=(10, 25), retries=2, backoff_factor=0.1, requests_args={'headers': _PYTRENDS_HEADERS})
        time.sleep(2)
        pytrends.build_payload([keyword], cat=0, timeframe=timeframe, geo=geo)
        df = pytrends.interest_over_time()

        if df is None or df.empty or keyword not in df.columns:
            return "Estable"

        series = df[keyword]
        inicio = series.iloc[:4].mean()   # primeras 4 semanas
        fin = series.iloc[-4:].mean()     # últimas 4 semanas

        if inicio <= 0:
            return "Al alza" if fin > 30 else "Estable"

        cambio = ((fin - inicio) / inicio) * 100

        if cambio > 15:
            return "Al alza"
        elif cambio < -15:
            return "Baja"
        else:
            return "Estable"

    except Exception as e:
        logger.warning(f"⚠️  Trend direction bloqueado para '{keyword}': {e}")
        return "Estable"
