#!/bin/bash
echo "🧪 Test de Pipeline Completo (Territorios + Plan Acción + Discovery)"
echo "=================================================================="
echo ""

echo "📍 Query: 'mejor banco en chile'"
echo "🏢 Brand: MiBanco"
echo ""

# Hacer el request con JSON body
curl -s -X POST "http://127.0.0.1:8000/api/audit" \
  -H "Content-Type: application/json" \
  -d '{"query": "mejor banco en chile", "brand": "MiBanco"}' \
  --max-time 60 | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'resultados' in data and len(data['resultados']) > 0:
        resultado = data['resultados'][0]
        
        print('✅ RESPUESTA RECIBIDA')
        print('')

        # ── Veredicto (zone-veredicto) ──
        print('📊 Score de Invisibilidad:', resultado.get('invisibilidad_score', 'N/A'))
        print('📈 Estado:', resultado.get('estado_invisibilidad', 'N/A'))
        print('')

        # ── Territorios (zone-territorios) ──
        print('🗺️  Territorios Desatendidos:')
        print('-' * 50)
        terrs = resultado.get('territorios_desatendidos', [])
        if terrs:
            for i, terr in enumerate(terrs, 1):
                print(f'{i}. {terr.get(\"topico_emergente\", \"N/A\")}')
                print(f'   └─ Oportunidad: {terr.get(\"porque_es_oportunidad\", \"N/A\")}')
                print(f'   └─ Nivel: {terr.get(\"nivel_oportunidad\", \"N/A\")}')
                print(f'   └─ Intención: {terr.get(\"intension_usuario\", \"N/A\")}')
                print()
        else:
            print('⚠️  No se detectaron territorios desatendidos')

        # ── Plan de Acción (zone-plan-recuperacion) ──
        plan = resultado.get('plan_accion')
        if plan:
            print('🎯 Plan de Acción:')
            print('-' * 50)
            vehiculos = plan.get('vehiculos', [])
            acciones_total = 0
            for v in vehiculos:
                acciones = v.get('acciones', [])
                acciones_total += len(acciones)
                for a in sorted(acciones, key=lambda x: x.get('ice_score', 0), reverse=True):
                    area = a.get('area_responsable', 'Equipo')
                    print(f'  [{area}] ICE {a.get(\"ice_score\", 0):.1f} — {a.get(\"concepto_objetivo\", \"?\")}')
                    print(f'          └─ {a.get(\"tactica_tecnica\", \"\")}')
            print(f'\n  Total acciones: {acciones_total}')
            roi = plan.get('roi_estimado', '')
            if roi:
                print(f'  ROI: {roi}')
        else:
            print('⚠️  Sin plan de acción')

        print('')
    else:
        print('❌ Error: No hay resultados en la respuesta')
        print(json.dumps(data, indent=2)[:500])
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)
" 2>&1

echo ""
echo "✅ Test completado"
