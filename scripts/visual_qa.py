#!/usr/bin/env python3
"""
Visual QA E2E — Playwright.
Simula usuario, ejecuta auditoría, captura screenshot + JSON.
Uso: ./venv/bin/python3 scripts/visual_qa.py "Banco de Chile" "Seguros de Vida"
"""

import sys
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

FRONTEND = "http://localhost:3000"
OUT_DIR = Path(__file__).resolve().parent.parent / "qa_exports"

marca = sys.argv[1] if len(sys.argv) > 1 else "Banco de Chile"
busqueda = sys.argv[2] if len(sys.argv) > 2 else "Seguros de Vida"
slug = marca.lower().replace(" ", "-")

OUT_DIR.mkdir(exist_ok=True)


def run():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        print(f"[1/5] Navegando a {FRONTEND}")
        page.goto(FRONTEND, wait_until="networkidle")

        # Llenar inputs
        print(f"[2/5] Llenando: marca='{marca}' búsqueda='{busqueda}'")
        input_marca = page.locator("input[placeholder='Banco Santander']")
        input_busqueda = page.locator("input[placeholder='mejor banco en chile']")
        input_marca.fill(marca)
        input_busqueda.fill(busqueda)

        # Click Auditar
        print("[3/5] Lanzando auditoría...")
        page.locator("button", has_text="Auditar").click()

        # Esperar resultado (zone-veredicto) — timeout 120s
        print("[4/5] Esperando respuesta de la IA (hasta 120s)...")
        page.wait_for_selector("#zone-veredicto", timeout=120_000)

        # Esperar a que "Qué hacer ahora" cargue (discovery + plan_accion)
        print("  ⏳ Esperando Qué hacer ahora (discovery)...")
        page.wait_for_selector("#zone-plan-recuperacion", state="visible", timeout=90_000)
        # Esperar a que los skeletons de carga desaparezcan
        page.locator("#zone-plan-recuperacion .animate-pulse").first.wait_for(state="hidden", timeout=90_000)
        page.wait_for_timeout(2000)
        print("  ✅ Dashboard completo. Tomando captura de pantalla...")

        # Screenshot completo
        shot_path = OUT_DIR / f"{slug}_dashboard.png"
        page.screenshot(path=str(shot_path), full_page=True)
        print(f"  📸 Screenshot: {shot_path}")

        # Descargar JSON
        print("[5/5] Exportando JSON...")
        with page.expect_download() as dl_info:
            page.locator("#btn-export-json").click()
        download = dl_info.value
        json_path = OUT_DIR / f"{slug}_auditoria.json"
        download.save_as(str(json_path))
        print(f"  📄 JSON: {json_path}")

        browser.close()
        print(f"\n✅ QA Visual completo para '{marca}' — archivos en {OUT_DIR}/")


if __name__ == "__main__":
    run()
