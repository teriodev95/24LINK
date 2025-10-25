Refactoriza el componente especificado siguiendo estas directrices:

## Estructura y Modularidad
- Identifica oportunidades para extraer sub-componentes atómicos cuando:
  * Una sección del template tiene lógica independiente
  * Se repite código similar en múltiples lugares
  * Un bloque supera las 50 líneas o tiene más de 2 niveles de responsabilidad

## Principios de Refactorización
- NO apliques reingeniería: mantén la funcionalidad exactamente igual
- Preserva la estructura de datos y el flujo existente
- Realiza cambios incrementales y seguros

## Mejores Prácticas Nuxt 4
- Usa Composition API con <script setup>
- Aplica auto-imports para composables y utilidades
- Utiliza TypeScript para props y tipos cuando corresponda
- Implementa reactivity de Vue 3 (ref, computed, watch) apropiadamente
- Aprovecha las utilidades de Nuxt: useState, useFetch, useAsyncData

## Simplificación
- Crea computeds SOLO cuando:
  * Se calcula un valor derivado usado en múltiples lugares
  * La lógica de transformación es compleja (> 3 operaciones)
  * Mejora significativamente la legibilidad del template
- Extrae funciones auxiliares SOLO si:
  * La lógica se reutiliza 2+ veces
  * Simplifica métodos que superan las 15 líneas
  * Separa concerns claros (validación, formateo, cálculos)
- EVITA sobre-abstraer: prefiere código directo si es claro y simple

## Salida Esperada
1. Lista los cambios propuestos antes de aplicarlos
2. Explica brevemente el razonamiento de cada cambio significativo
3. Aplica la refactorización manteniendo compatibilidad 100%