# EVAAS Commerce v0.4 — contrato del cupón EVAAS10

Versión: 0.4. Fecha: 2026-09-25. Estado de esta cápsula: **PASS contractual**. La implementación y publicación corresponden a EVCOM-H01-L05-C04 y permanecen sujetas al gate de L01. Este contrato no determina si los precios de L01-C01 son netos o finales con IVA.

## Parámetros confirmados por David

| Parámetro | Valor |
| --- | --- |
| `COUPON_CODE` | `EVAAS10` |
| `COUPON_TYPE` | `percentage` |
| `COUPON_VALUE` | `10` (10 %) |
| `COUPON_TIMEZONE` | `America/Santiago` |
| `COUPON_START` | `2026-09-25T00:00:00-03:00` |
| `COUPON_END` | `2026-12-31T23:59:59-03:00` |
| `COUPON_TOTAL_LIMIT` | `unlimited` |
| `COUPON_BUYER_LIMIT` | `1` durante toda la vigencia |
| `COUPON_COMBINABLE` | `false` |
| `COUPON_ROUNDING` | `CLP_INTEGER_HALF_UP` |
| `COUPON_VALIDATION` | `authoritative_server` |

El inicio es inclusivo. El término incluye el segundo `2026-12-31T23:59:59-03:00`; en cómputo con subsegundos equivale a exigir un instante anterior a `2027-01-01T00:00:00-03:00`. Ambos límites se interpretan en `America/Santiago` con el desplazamiento indicado, no según el reloj o la zona del navegador.

## Productos y exclusiones

El cupón se aplica exclusivamente a Landing, Catálogo y Web Corporativa. Los productos futuros no quedan incluidos automáticamente. No se aplica a continuidades, hosting, dominio, costos externos, adicionales ni servicios fuera de esos tres productos. No se combina con otro cupón, promoción o descuento y no genera saldo, crédito ni diferencia reutilizable.

## Código y validación

Antes de comparar, el servidor aplica `trim` y luego `uppercase`. Así, `evaas10`, ` EVAAS10` y `Evaas10` equivalen a `EVAAS10`. Se conserva el interior del código; una entrada distinta, vacía o inválida no revela si existen otros códigos autorizados.

El servidor decide vigencia, producto, uso individual y precio. El navegador solo puede anticipar visualmente el descuento: `SERVER_PRICE > CLIENT_PRICE` y `SERVER_COUPON_STATE > CLIENT_COUPON_STATE`. El precio enviado por el cliente no es una fuente autoritativa. Un uso por comprador exige una identidad estable verificada en servidor, asociada al UUID de solicitud; un identificador editable en el navegador o un correo no verificado no basta. El mecanismo concreto de verificación se integrará con el flujo de venta y pago de L05. La reserva y el consumo deben ser atómicos e idempotentes por solicitud; un reintento de la misma solicitud no consume un segundo uso. Un intento fallido o cancelado no debe consumir definitivamente el cupón. No se publican detalles internos que faciliten eludir el límite.

## Cálculo contractual

```text
contract_price = precio contractual del producto según L01-C01
discount = round_half_up(contract_price * 0.10) en CLP enteros
discounted_price = contract_price - discount
```

Se aplica una sola vez y el descuento no puede superar el precio contractual. El importe comercial descontado conserva la naturaleza tributaria que L01-C01 defina para el producto:

```text
contract_price → coupon discount → discounted taxable amount → tax treatment defined by L01-C01
```

Si L01-C01 define precios netos, el IVA correspondiente se calcula sobre la base neta descontada. Si define precios finales con IVA, el precio descontado sigue siendo final con IVA y su composición neto/IVA se deriva de ese importe. El cupón no se aplica después del tratamiento tributario para eludirlo o alterarlo. Este contrato no fija la tasa de IVA ni resuelve cómo se presentan públicamente los precios.

| Producto | Precio contractual indicado | Descuento 10 % | Importe comercial descontado |
| --- | ---: | ---: | ---: |
| Landing | 99.000 CLP | 9.900 CLP | 89.100 CLP |
| Catálogo | 129.000 CLP | 12.900 CLP | 116.100 CLP |
| Web Corporativa | 149.000 CLP | 14.900 CLP | 134.100 CLP |

Estos tres importes son resultados comerciales confirmados por David. Su clasificación como netos o finales con IVA queda determinada únicamente por L01-C01.

## Matriz de casos obligatorios

| Caso | Entrada o condición | Resultado autoritativo |
| --- | --- | --- |
| Válido | `EVAAS10`, dentro de vigencia, producto aplicable, comprador sin uso anterior | Landing 89.100 CLP; Catálogo 116.100 CLP; Web Corporativa 134.100 CLP, según producto elegido. |
| Vencido | Instante igual o posterior a `2027-01-01T00:00:00-03:00` | Rechazar; descuento 0 CLP. |
| Producto no aplicable | Producto fuera de los tres permitidos | Rechazar; descuento 0 CLP. |
| Límite individual agotado | Identidad verificada ya consumió su único uso | Rechazar; descuento 0 CLP. |
| Vacío | Entrada vacía tras `trim` | No aplicar cupón; descuento 0 CLP. |
| Código incorrecto | Normalizado distinto de `EVAAS10` | Rechazar sin revelar otros códigos; descuento 0 CLP. |

En los cinco casos sin descuento se conserva el precio contractual correspondiente, con el tratamiento tributario que defina L01-C01. Ninguno de esos casos confirma pago o activación. El límite global ilimitado no anula el límite individual.

## Dependencia y alcance de implementación

L01-C03 queda cerrado como contrato de promoción. L01 en conjunto sigue bloqueada por las decisiones pendientes de C01, C02 y C04. L05-C04 implementará formulario, componente, estado, endpoint, persistencia, analítica y descuento en checkout únicamente después de satisfacer sus precondiciones. Ninguno de esos elementos se incorpora en esta cápsula.
