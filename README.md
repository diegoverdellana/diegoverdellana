# Mi Negocio — prueba de factibilidad

MVP beta local-first para que un microemprendedor registre ventas y gastos, consulte su **ganancia estimada** por día, semana o mes y calcule un precio sugerido. No pretende sustituir la contabilidad formal.

## Ejecutar

Requiere Node.js 22.13 o posterior, npm y Expo Go compatible con SDK 57 o un emulador Android.

```bash
npm install
npx expo install --fix
npx expo install --check
npx expo-doctor
npm run typecheck
npm test
npm run android
```

La base `mi-negocio.db` se crea en el dispositivo mediante `expo-sqlite`. Para validar código y pruebas:

```bash
npm run typecheck
npm test
npm start
```

En Windows, ejecuta los mismos comandos desde PowerShell en la carpeta raíz del proyecto. Para abrir Android directamente, inicia antes un dispositivo virtual desde Android Studio y ejecuta `npm run android`. `npx expo install --fix` es quien debe realizar el ajuste final de paquetes nativos contra la versión de Expo instalada; conserva el `package-lock.json` real que genere npm en tu equipo.

## Arquitectura

- `App.tsx`: composición, navegación mínima y ciclo de carga.
- `src/features`: dashboard, formularios de movimientos y calculadora.
- `src/features/history`, `onboarding`, `settings`: historial filtrable, bienvenida local y configuración informativa.
- `src/components`: controles reutilizables sin acceso a datos.
- `src/database/schema`: migraciones versionadas y preferencias iniciales PEN/PE.
- `src/database/repositories`: única frontera de lectura/escritura de movimientos.
- `src/utils`: reglas puras de cálculo, moneda y periodos en hora local.
- `src/types`, `src/theme`: contratos y estilos compartidos.
- `src/analytics`: contrato de eventos con proveedor de desarrollo/no-op; nunca incluye descripciones libres.

SQLite es la fuente de verdad. La UI solo usa `TransactionRepository`, que guarda fechas ISO y consulta periodos con límite inicial inclusivo/final exclusivo. WAL mejora el comportamiento de escritura y los parámetros enlazados evitan interpolar datos de usuario en SQL.

## Fórmulas

- Ganancia estimada = ventas − gastos.
- Costo base = producto + empaque + envío + publicidad + otros.
- Precio sugerido = costo base / (1 − margen − comisión).
- Margen = ganancia estimada / precio × 100.
- Markup = ganancia estimada / costo base × 100.

La comisión de pago se descuenta al calcular la ganancia del precio. Margen y comisión deben ser individuales válidos y sumar menos de 100%.

## Alcance y limitaciones

Esta versión no incluye backend, autenticación, nube, facturación, inventario, pagos ni un proveedor externo de analítica. La selección de fecha es intencionalmente básica (`AAAA-MM-DD`). Los tests de repositorio usan un adaptador en memoria; la regresión final en SQLite nativo requiere ejecutar el flujo manual en Expo Go o un emulador/dispositivo Android.

V0.1 incluye navegación inferior entre Inicio, Historial, Calculadora y Configuración. La analítica es solo una abstracción local de desarrollo/no-op: no se conecta a ningún servicio ni transmite datos.

### Validación manual crítica

1. Registrar una venta de S/ 100 y un gasto de S/ 30 con fecha de hoy.
2. Confirmar Ventas S/ 100.00, Gastos S/ 30.00 y Ganancia estimada S/ 70.00.
3. Cerrar por completo la app y abrirla otra vez.
4. Confirmar que los tres valores permanecen iguales.

## Decisión de factibilidad

La arquitectura local-first validada se conserva en V0.1 y sigue siendo compatible con Android e iOS. Esta beta no debe publicarse ni avanzar de versión hasta completar los controles automáticos y la lista de QA en hardware Android.

**V0.1 PENDING MANUAL QA**

## QA manual Android — V0.1

1. **Primera apertura:** comprobar que aparecen las tres vistas de bienvenida, pulsar `Comenzar`, cerrar y abrir la app y confirmar que no reaparecen.
2. **Venta:** registrar S/ 100 con fecha de hoy y confirmar que Inicio se actualiza inmediatamente.
3. **Gasto:** registrar S/ 30, elegir una categoría y confirmar una ganancia estimada de S/ 70.
4. **Persistencia:** cerrar totalmente la app, abrirla y confirmar que ventas, gastos y ganancia estimada siguen iguales.
5. **Historial:** confirmar ambos movimientos, signos `+`/`−`, etiquetas Venta/Gasto, fechas e importes; probar Hoy, Semana, Mes y Todos.
6. **Periodos:** en Inicio, probar Hoy, Semana y Mes y verificar totales y cantidad de movimientos.
7. **Calculadora:** usar producto 50, empaque 5, publicidad 5, comisión 3% y margen 30%; verificar precio sugerido aproximado S/ 89.55. Confirmar que una suma de porcentajes de 100% se bloquea.
8. **Sin conexión:** apagar internet, registrar un movimiento, cerrar y abrir la app y confirmar que permanece.
9. **Configuración:** comprobar Perú, PEN — S/, versión y aviso de almacenamiento local.

**V0.1 requiere completar esta lista en Android antes de considerarse lista para cualquier lanzamiento.**
