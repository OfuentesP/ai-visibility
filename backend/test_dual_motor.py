"""
Tests de los helpers de motor dual (_norm_motor, _gather_dual, _wrap_dual).

Sin LLM ni red: mockean gemini_available y usan factories falsas.
Las funciones async se ejecutan con asyncio.run() para no depender de
pytest-asyncio; siguen siendo descubribles por pytest (test_*).
"""

import asyncio

from pydantic import BaseModel

import main
import gemini_tracking


class FakeResp(BaseModel):
    name: str
    motor: str | None = None
    por_motor: dict | None = None


# ── _norm_motor ───────────────────────────────────────────────────────────────

def test_norm_motor_defaults_to_ambos():
    assert main._norm_motor(None) == "ambos"
    assert main._norm_motor("") == "ambos"
    assert main._norm_motor("   ") == "ambos"
    assert main._norm_motor("desconocido") == "ambos"


def test_norm_motor_normaliza_validos():
    assert main._norm_motor("CHATGPT") == "chatgpt"
    assert main._norm_motor(" Gemini ") == "gemini"
    assert main._norm_motor("ambos") == "ambos"


# ── _wrap_dual ────────────────────────────────────────────────────────────────

def test_wrap_dual_un_motor():
    base = main._wrap_dual([("gemini", FakeResp(name="g"))])
    assert base.motor == "gemini"
    assert base.por_motor is None
    assert base.name == "g"


def test_wrap_dual_dos_motores():
    base = main._wrap_dual([
        ("chatgpt", FakeResp(name="c")),
        ("gemini", FakeResp(name="g")),
    ])
    assert base.motor == "ambos"
    assert base.name == "c"  # el primero es la base
    assert set(base.por_motor.keys()) == {"chatgpt", "gemini"}
    assert base.por_motor["gemini"]["name"] == "g"


# ── _gather_dual ──────────────────────────────────────────────────────────────

def test_gather_dual_motor_unico_no_toca_gemini(monkeypatch=None):
    async def factory(m):
        return FakeResp(name=m)
    pares = asyncio.run(main._gather_dual(factory, "chatgpt"))
    assert pares == [("chatgpt", FakeResp(name="chatgpt"))]


def test_gather_dual_ambos_sin_gemini_cae_a_chatgpt():
    orig = gemini_tracking.gemini_available
    gemini_tracking.gemini_available = lambda: False
    try:
        async def factory(m):
            return FakeResp(name=m)
        pares = asyncio.run(main._gather_dual(factory, "ambos"))
    finally:
        gemini_tracking.gemini_available = orig
    assert [k for k, _ in pares] == ["chatgpt"]


def test_gather_dual_ambos_corre_los_dos():
    orig = gemini_tracking.gemini_available
    gemini_tracking.gemini_available = lambda: True
    try:
        async def factory(m):
            return FakeResp(name=m)
        pares = asyncio.run(main._gather_dual(factory, "ambos"))
    finally:
        gemini_tracking.gemini_available = orig
    assert sorted(k for k, _ in pares) == ["chatgpt", "gemini"]


def test_gather_dual_ambos_un_motor_falla_devuelve_el_otro():
    orig = gemini_tracking.gemini_available
    gemini_tracking.gemini_available = lambda: True
    try:
        async def factory(m):
            if m == "gemini":
                raise RuntimeError("503 transitorio")
            return FakeResp(name=m)
        pares = asyncio.run(main._gather_dual(factory, "ambos"))
    finally:
        gemini_tracking.gemini_available = orig
    assert [k for k, _ in pares] == ["chatgpt"]


def test_gather_dual_ambos_los_dos_fallan_relanza():
    orig = gemini_tracking.gemini_available
    gemini_tracking.gemini_available = lambda: True
    try:
        async def factory(m):
            raise RuntimeError(f"fallo {m}")
        try:
            asyncio.run(main._gather_dual(factory, "ambos"))
            assert False, "debió relanzar"
        except RuntimeError:
            pass
    finally:
        gemini_tracking.gemini_available = orig


# ── Integración helpers: gather + wrap ────────────────────────────────────────

def test_gather_y_wrap_ambos_produce_por_motor():
    orig = gemini_tracking.gemini_available
    gemini_tracking.gemini_available = lambda: True
    try:
        async def factory(m):
            return FakeResp(name=m)
        pares = asyncio.run(main._gather_dual(factory, "ambos"))
        base = main._wrap_dual(pares)
    finally:
        gemini_tracking.gemini_available = orig
    assert base.motor == "ambos"
    assert set(base.por_motor.keys()) == {"chatgpt", "gemini"}


if __name__ == "__main__":
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    fallos = 0
    for fn in fns:
        try:
            fn()
            print(f"  PASS  {fn.__name__}")
        except Exception as e:  # noqa: BLE001
            fallos += 1
            print(f"  FAIL  {fn.__name__}: {type(e).__name__}: {e}")
    print(f"\n{len(fns) - fallos}/{len(fns)} tests OK")
    raise SystemExit(1 if fallos else 0)
