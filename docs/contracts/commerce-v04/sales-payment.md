# EVAAS Commerce v0.4 — contrato de venta y pago

Versión: 0.4. Fecha de cierre: 2026-09-25 (`America/Santiago`). Estado de C02: **PASS contractual**. La integración, las credenciales y las pruebas externas pertenecen a L05/L07; esta cápsula no implementa pago ni modifica la experiencia pública.

## Canal comercial WhatsApp

```text
SALES_CONTACT_DISPLAY=David · AI Product Manager
WHATSAPP_E164=+56979959180
WHATSAPP_URL=https://wa.me/56979959180
SALES_EMAIL=info@espaciosvirtuales.lat
```

`WHATSAPP_E164` es el dato contractual canónico y cumple la comprobación sintáctica `^\+[1-9][0-9]{1,14}$`. `WHATSAPP_URL` se deriva quitando únicamente el signo `+`; no sustituye el número E.164. Referencia del formato: [UIT, E.164](https://www.itu.int/rec/T-REC-E.164-202602-I).

Mensaje base parametrizado:

```text
Hola, quiero solicitar una activación de EVAAS Station.

Producto: {product}
Precio neto: {netPrice}
IVA: {vat}
Total: {total}
Color del proyecto: {projectColor}
Referencia: {reference}
```

`{product}` debe ser Landing, Catálogo o Web Corporativa. `{netPrice}`, `{vat}` y `{total}` proceden del cálculo contractual de C01/C03 resuelto o confirmado por servidor. `{projectColor}` pertenece a la paleta cerrada de C04. `{reference}` es el UUID v4 completo generado por el servidor. El mensaje no añade nombre, correo, teléfono, texto libre ni atribución. Una conversación de WhatsApp es una solicitud comercial, nunca evidencia de compra, pago o activación.

## Modalidad y productos

```text
PAYMENT_PROVIDER=Transbank
PAYMENT_PRODUCT=Webpay Plus
PAYMENT_MODE=integrated_checkout
```

No se usarán enlaces estáticos de pago por producto. El servidor crea una transacción Webpay Plus para cada intención de compra. Identificadores internos estables:

| Producto comercial | ID interno |
| --- | --- |
| Landing | `landing` |
| Catálogo | `catalog` |
| Web Corporativa | `corporate-web` |

Estos IDs se resuelven exclusivamente en servidor contra los contratos comerciales vigentes. Los slugs actuales de `src` (`landing`, `catalogo`, `corporativa`) son datos de navegación heredados; L05 deberá mapearlos explícitamente a los IDs internos sin aceptar un importe del navegador.

## Referencia y asociación

```text
REQUEST_REFERENCE=UUID_V4
```

La referencia EVAAS es el UUID v4 completo, creado una sola vez por el servidor al registrar la solicitud. El registro de servidor asocia esa referencia con producto, solicitud comercial, `buy_order`, `session_id`, token Webpay y estado de transacción. El token Webpay no es el identificador comercial principal. `buy_order` y `session_id` son identificadores de pasarela propios de la operación, generados en servidor y vinculados al UUID. El UUID completo no se usa directamente como `buy_order`: la documentación de Webpay Plus limita ese campo a 26 caracteres. La respuesta del servidor y la pantalla pueden mostrar la referencia completa; los ocho primeros caracteres no son identificador autoritativo.

## Creación y confirmación de transacción

```text
selección
→ servidor resuelve producto y precio neto
→ servidor valida/aplica cupón si corresponde
→ servidor calcula IVA y total autorizado
→ servidor crea solicitud/orden
→ servidor crea transacción Webpay Plus
→ Transbank devuelve token y URL de pago
→ navegador continúa a Webpay mediante el mecanismo exigido por el proveedor
→ retorno
→ servidor confirma o consulta la transacción
→ paid_verified solo tras resultado autoritativo válido
```

Para crear la transacción, el servidor construye `buy_order`, `session_id`, `amount` y `return_url`. `amount` es el total en CLP determinado como precio neto contractual menos descuento autoritativo, más IVA de 19 % sobre la base neta descontada. No se acepta un precio enviado por el navegador como monto definitivo. La respuesta de creación entrega token y URL; la continuación usa el flujo requerido por Transbank, que en su ejemplo oficial envía el token mediante formulario POST a la URL recibida. Ningún token ni URL se inventa en C02.

La fuente de pago es `WEBPAY_SERVER_CONFIRMATION`: operación de confirmación y, ante duda, consulta de estado mediante SDK/API de Webpay Plus desde el servidor. `paid_verified` exige una respuesta autenticada compatible con autorización, asociada al token y a los `buy_order`, `session_id` y `amount` guardados para el UUID EVAAS. El mapeo concreto de campos y estados nativos se implementa en L05; no se equiparan automáticamente todos los estados de Transbank a estados EVAAS. La redirección del navegador, la llegada a `return_url` y el clic del usuario no prueban pago. [Referencia oficial de creación de Webpay Plus](https://proyecto-ejemplo-node.transbankdevelopers.cl/webpay-plus), [operaciones de estado de Webpay Plus](https://proyecto-ejemplo-node.transbankdevelopers.cl/api-reference/webpay-plus).

## Estados EVAAS y recuperación

| Estado EVAAS | Significado contractual | Condición de entrada |
| --- | --- | --- |
| `created` | Solicitud/orden creada | Registro confirmado por servidor. |
| `pending_payment` | Transacción Webpay creada o pago en curso | Creación válida desde `created`, sin confirmación de pago. |
| `paid_verified` | Pago autorizado y verificado | Confirmación auténtica y coherente obtenida por servidor desde `pending_payment`. |
| `failed` | Pago rechazado, fallido o confirmación inválida | Resultado fallido comprobado desde `pending_payment`. |
| `cancelled` | Abandono o cancelación identificable | Cancelación fiable desde `created` o `pending_payment`. |

Secuencia principal: `created → pending_payment → paid_verified | failed | cancelled`. Ante timeout, token ausente, URL ausente, respuesta incompleta, error de red o estado desconocido, se conserva `last_verified_state`, se informa que no hay pago confirmado y se permite reconciliación posterior mediante consulta autoritativa. Una cancelación indicada solo por el navegador no convierte por sí sola el estado persistido en `cancelled`; requiere evidencia o conciliación. Ningún caso incierto produce `paid_verified`. La consulta de estado y el mapeo de retornos se probarán en L05/L07.

## Ambientes, configuración y credenciales

| Ambiente | Uso | Condición |
| --- | --- | --- |
| `integration` | Desarrollo, pruebas y smoke no transaccional real | Configuración de integración de Transbank, separada de producción. |
| `production` | Cobros productivos | Credenciales comerciales productivas de ESPACIOS VIRTUALES SpA y validación externa aprobada. |

Variables solo de servidor, documentadas por nombre y sin valor en Git:

```text
WEBPAY_ENVIRONMENT
WEBPAY_COMMERCE_CODE
WEBPAY_API_KEY
WEBPAY_RETURN_URL
```

Si L05 requiere separar ambos ambientes en el despliegue, puede usar `WEBPAY_INTEGRATION_COMMERCE_CODE`, `WEBPAY_INTEGRATION_API_KEY`, `WEBPAY_PRODUCTION_COMMERCE_CODE` y `WEBPAY_PRODUCTION_API_KEY`, siempre server-only. Ninguna credencial Webpay tendrá prefijo `PUBLIC_`, se enviará al navegador o se imprimirá en logs. `WEBPAY_RETURN_URL` se configurará por ambiente con la URL real del despliegue correspondiente; no se fija aquí un endpoint productivo ficticio y su visita no verifica pago.

```text
CREDENTIAL_OWNER=ESPACIOS VIRTUALES SpA
OPERATIONAL_RESPONSIBLE=David · AI Product Manager
```

El responsable administra los secretos en la configuración segura del ambiente de despliegue. La ausencia actual de credenciales productivas no impide cerrar este contrato, pero impide declarar validación productiva en L05/L07. Las variables heredadas `CHECKOUT_URL_LANDING`, `CHECKOUT_URL_CATALOGO` y `CHECKOUT_URL_CORPORATIVA` de `.env.example` no representan la modalidad aprobada y deberán retirarse o quedar inactivas al implementar L05; C02 no las utiliza.

## Alcance de C02

El código actual registra solicitudes por webhook y puede redirigir a una URL opcional de checkout. Todavía no persiste órdenes ni confirma pagos Webpay. L05-C03 implementará SDK, endpoints, creación, retorno, confirmación, consulta, persistencia y mapper de estados; C02 solo fija el contrato. No se ejecuta una transacción real ni se declara un pago verificado en esta cápsula.
