# Mi Negocio — prueba de factibilidad

Prototipo local-first para que un microemprendedor registre ventas y gastos, consulte su **ganancia estimada** diaria y calcule un precio sugerido. No pretende sustituir la contabilidad formal.

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
- `src/components`: controles reutilizables sin acceso a datos.
- `src/database/schema`: migraciones versionadas y preferencias iniciales PEN/PE.
- `src/database/repositories`: única frontera de lectura/escritura de movimientos.
- `src/utils`: reglas puras de cálculo, moneda y periodos en hora local.
- `src/types`, `src/theme`: contratos y estilos compartidos.

SQLite es la fuente de verdad. La UI solo usa `TransactionRepository`, que guarda fechas ISO y consulta periodos con límite inicial inclusivo/final exclusivo. WAL mejora el comportamiento de escritura y los parámetros enlazados evitan interpolar datos de usuario en SQL.

## Fórmulas

- Ganancia estimada = ventas − gastos.
- Costo base = producto + empaque + envío + publicidad + otros.
- Precio sugerido = costo base / (1 − margen − comisión).
- Margen = ganancia estimada / precio × 100.
- Markup = ganancia estimada / costo base × 100.

La comisión de pago se descuenta al calcular la ganancia del precio. Margen y comisión deben ser individuales válidos y sumar menos de 100%.

## Alcance y limitaciones

Esta prueba no incluye backend, autenticación, nube, facturación, inventario, pagos ni analítica. El dashboard muestra solamente el día local actual. La selección de fecha es intencionalmente básica (`AAAA-MM-DD`). Los tests de repositorio usan un adaptador en memoria; la validación final en SQLite nativo requiere ejecutar el flujo manual en Expo Go o un emulador/dispositivo Android.

### Validación manual crítica

1. Registrar una venta de S/ 100 y un gasto de S/ 30 con fecha de hoy.
2. Confirmar Ventas S/ 100.00, Gastos S/ 30.00 y Ganancia estimada S/ 70.00.
3. Cerrar por completo la app y abrirla otra vez.
4. Confirmar que los tres valores permanecen iguales.

## Decisión de factibilidad

La arquitectura y las APIs seleccionadas soportan el alcance offline en Android y siguen siendo compatibles con iOS. La aprobación definitiva para pasar al MVP queda condicionada a completar la validación manual en hardware Android y a incorporar pruebas instrumentadas contra SQLite nativo en la siguiente fase.

**FEASIBILITY PENDING LOCAL VALIDATION**
