# EVCOM H03-L02 · Checklist de release y rollback

- **Estado al cierre C11:** `BLOCKED`
- **Oferta pública:** v0.6
- **Autorización de publicación:** `NO`
- **Fecha efectiva H03:** `NOT_SET`

Este checklist prepara una decisión futura y una reversión controlada. Ningún paso de publicación o rollback se ejecutó en C11.

## Condiciones previas de publicación

- [ ] Registrar una decisión manual de release que autorice la versión pública H03; la aprobación económica del 2026-10-22 se mantiene y no equivale a esta autorización.
- [ ] Para cada servicio mensual/anual que se pretenda ofrecer, adjuntar evidencia fechada, responsable operativo y de aprobación, proveedor/titular de cuenta, costo y periodicidad, procedimiento probado, cobertura, límites, exclusiones, dependencias y salida.
- [ ] Resolver explícitamente servicios no verificados: hosting, SSL, conexión/DNS, backups, restauración, actualizaciones, soporte/incidentes/SLA, capacidad/tráfico, licencias/cuentas y portabilidad. No marcarlos incluidos sin evidencia por servicio.
- [ ] Registrar revisión jurídica real: quién revisó, fecha, documento/versión y decisiones sobre formación del contrato, información, renovación, cancelación, prepago/reembolso, propiedad/licencias, terceros, datos, retención y salida.
- [ ] Registrar revisión tributaria real: quién revisó, fecha, documento/versión y clasificación de activación, cada continuidad, prepago, terceros y ampliaciones; validar emisión y oportunidad de documento tributario. No inferir tratamiento desde “valor final”.
- [ ] Completar aceptación explícita y versionada separada de solicitud/WhatsApp. Definir autoridad, contenido/versión/hash, producto, modalidad, valores, marca de tiempo, confirmación, custodia, privacidad y retención.
- [ ] Aprobar un texto de términos público versionado, su `TERMS_EFFECTIVE_DATE` no nula y un registro/hash del texto. Mantener `1.0-draft` y fecha nula hasta esa decisión.
- [ ] Resolver prospectivamente la discrepancia de copy entre `/terminos` v0.6 y “Preparación para publicación según la cotización”; conservar las condiciones de clientes/contratos v0.6.
- [ ] Revisar catálogo, tarjetas, detalle, demos, solicitud, selector, reglas, mensajes, términos y endpoints contra una única versión de precios/modalidades. Confirmar solo `landing`, `catalogo`, `corporativa` y la regla de descuento aprobada.
- [ ] Registrar origen del artefacto v0.6 de rollback y su deployment ID/URL/SHA antes de elegir un candidato de release.
- [ ] Completar la matriz de aceptación y repetir build, pruebas HTTP/runtime, browser/accessibility y escaneo estático sobre el candidato exacto a publicar.
- [ ] Preparar responsable, ventana, destino, monitorización y criterio de reversión. El release requiere procedimiento manual separado.

## Verificación posterior a un release autorizado

- [ ] Confirmar `TERMS_VERSION`, `COMMERCIAL_RULES_VERSION` y fecha efectiva iguales en UI, request, cotización/aceptación y términos.
- [ ] Confirmar rutas públicas, tres productos, demos, activaciones, privacidad y confirmación con precios/condiciones concordantes.
- [ ] Confirmar campañas expiradas rechazadas y `/api/activation`/Handoff V2 compatible para solicitudes v0.6 existentes.
- [ ] Confirmar que las rutas internas no enlazadas permanecen cerradas por defecto y los assets públicos no exponen datos internos.
- [ ] Confirmar que WhatsApp solo abre después de revisión, vigencia y clic explícito; no afirmar envío o consentimiento sin registro.
- [ ] Guardar SHA del artefacto, deployment ID, resultados de smoke, revisión de release y decisión de continuar o revertir.

## Procedimiento de rollback

- [ ] Activar el criterio de reversión acordado y registrar hora, responsable, deployment ID, síntoma y evidencia. No usar un rollback para cambiar retroactivamente acuerdos de clientes.
- [ ] Restaurar el artefacto público v0.6 identificado en el checklist previo; no seleccionar un SHA por inferencia.
- [ ] Desactivar switches privados de preview/runtime. Si una credencial interna quedó expuesta o dejó de estar controlada, revocarla/rotarla según el procedimiento del proveedor.
- [ ] Confirmar que páginas y APIs de preview responden 404; confirmar que ningún endpoint acepta una modalidad pública incoherente con términos activos.
- [ ] Confirmar que `/terminos` muestra v0.6, precios anuales $120.000/$160.000/$180.000 y que los contratos v0.6 conservan su versión.
- [ ] Ejecutar smoke de portada, tres productos, tres demos, tres activaciones, confirmación, privacidad, términos y `/api/activation` V2.
- [ ] Escanear assets/rutas públicas para ausencias de precios, términos y modalidades H03 no autorizados.
- [ ] Verificar enlaces, caché/activos derivados y coherencia UI/API/términos según el mecanismo de hosting aprobado; registrar el resultado.
- [ ] Preservar logs y solicitudes existentes como evidencia. No convertir `requestId` ni mensajes de WhatsApp en órdenes o contratos.
- [ ] Cerrar la incidencia solo después de confirmar la oferta v0.6 y sus flujos V2; documentar tareas y nuevo gate antes de otro intento.

## Estado C11

Todos los pasos anteriores quedan sin marcar. C11 no publica, no modifica términos, no activa flags y no ejecuta rollback porque la producción no cambió. `PUBLIC_RELEASE_GATE=BLOCKED` hasta completar las condiciones previas y recibir autorización manual.
