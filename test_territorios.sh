#!/bin/bash
echo "🧪 Probando Detector de Brechas (Territorios Desatendidos)"
echo "==========================================================="
echo ""

# Test simple
echo "📍 Query: 'mejor banco en chile'"
echo "🏢 Brand: MiBanco"
echo ""

# Hacer el request
curl -s -X POST "http://127.0.0.1:8000/api/audit?query=mejor%20banco%20en%20chile&brand=MiBanco" \
  -H "Content-Type: application/json" \
  --max-time 30 | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'resultados' in data and len(data['resultados']) > 0:
        resultado = data['resultados'][0]
        
        print('✅ RESPUESTA RECIBIDA')
        print('')
        print('📊 Territorios Desatendidos Detectados:')
        print('-' * 50)
        
        if 'territorios_desatendidos' in resultado and resultado['territorios_desatendidos']:
            for i, terr in enumerate(resultado['territorios_desatendidos'], 1):
                print(f'{i}. {terr.get(\"topico_emergente\", \"N/A\")}')
                print(f'   └─ Oportunidad: {terr.get(\"porque_es_oportunidad\", \"N/A\")}')
                print(f'   └─ Volumen: {terr.get(\"volumen_busqueda\", \"N/A\")}')
                print(f'   └─ Intención: {terr.get(\"intension_usuario\", \"N/A\")}')
                print()
        else:
            print('⚠️  No se detectaron territorios desatendidos')
        
        print('')
        print('📈 Estado de Invisibilidad:', resultado.get('estado_invisibilidad', 'N/A'))
        print('📊 Score de Invisibilidad:', resultado.get('invisibilidad_score', 'N/A'))
    else:
        print('❌ Error: No hay resultados en la respuesta')
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)
" 2>&1

echo ""
echo "✅ Test completado"
