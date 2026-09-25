# EVAAS Commerce v04 — precios y datos legales

Versión del contrato Commerce: **0.4**. Fecha de cierre contractual y de términos v0.4: **2026-09-25** (`America/Santiago`).

Estado de C01: **PASS contractual**. Fuente interna versionada para implementar posteriormente la comunicación pública. El gate L01 todavía depende de C02; esta cápsula no modifica páginas ni componentes públicos.

```text
PRICING_TAX_MODE=NET_PLUS_VAT
VAT_RATE=19%
CURRENCY=CLP
```

## Precios contractuales confirmados por el propietario

| Producto | Precio neto contractual | IVA 19 % | Total con IVA |
| --- | ---: | ---: | ---: |
| Landing | $99.000 CLP | $18.810 CLP | $117.810 CLP |
| Catálogo | $129.000 CLP | $24.510 CLP | $153.510 CLP |
| Web Corporativa | $149.000 CLP | $28.310 CLP | $177.310 CLP |

David confirmó que los tres importes son **netos más IVA**. La comunicación comercial debe separar precio neto, IVA y total a pagar; los valores netos nunca se presentan como precios finales. El cupón C03 conserva esta naturaleza tributaria. Los importes actuales de `src/data/products.ts` son distintos y siguen publicados; no constituyen la fuente contractual de v0.4 y se actualizarán en una cápsula de implementación.

### Referencia calculada con el cupón EVAAS10

El 10 % de descuento se aplica al precio neto contractual; el IVA de 19 % se calcula sobre la base neta descontada:

```text
precio neto contractual → descuento → base neta descontada → IVA 19 % → total final
```

| Producto | Neto | Descuento 10 % | Neto descontado | IVA 19 % | Total final |
| --- | ---: | ---: | ---: | ---: | ---: |
| Landing | $99.000 | $9.900 | $89.100 | $16.929 | $106.029 CLP |
| Catálogo | $129.000 | $12.900 | $116.100 | $22.059 | $138.159 CLP |
| Web Corporativa | $149.000 | $14.900 | $134.100 | $25.479 | $159.579 CLP |

Los importes de esta referencia corresponden al cupón contractual de C03 y no alteran sus reglas de vigencia, límite o validación autoritativa.

## Identificación del proveedor

- Razón social que debe mostrarse (`LEGAL_NAME`): **ESPACIOS VIRTUALES SpA**.
- RUT que debe mostrarse (`TAX_ID`): **78.428.352-6**.
- Correo comercial (`COMMERCIAL_EMAIL`): **info@espaciosvirtuales.lat**.

Estos datos fueron entregados expresamente por el propietario.

## Dominio

`DOMAIN_POLICY`: según los términos publicados en `src/pages/terminos.astro`, el cliente compra y conserva su dominio; Espacios Virtuales realiza su conexión. La compra del dominio no está incluida en el precio de la activación. Esta fuente no define renovación, transferencia ni propiedad del código, por lo que este contrato tampoco las inventa.

## Alcance común y exclusiones vigentes

El alcance común descrito en `src/pages/terminos.astro` y `src/data/products.ts` comprende branding básico, estructura según el producto, diseño responsive, llamada a la acción y contacto, publicación inicial y conexión del dominio del cliente. El cliente aporta textos, datos, identidad y materiales. Cada producto contempla una revisión consolidada. Los límites específicos vigentes son: Landing, una página y hasta seis secciones; Catálogo, hasta doce ítems; Web Corporativa, cuatro áreas (Inicio, Empresa, Servicios y Contacto). C01 registra estos límites, sin redefinir los productos o sus layouts.

Los términos existentes excluyen ecommerce, carrito, pasarela de pago, agenda, automatizaciones, integraciones, áreas privadas, sistemas internos, producción fotográfica, redacción extensa y compra del dominio, salvo acuerdo adicional por escrito. No se prometen dominio gratuito, licencias de terceros gratuitas, mantenimiento indefinido, soporte ilimitado ni resultados comerciales garantizados.

## Costos adicionales posibles

Las categorías respaldadas por los términos existentes son compra del dominio por el cliente, un eventual plan pagado u otro servicio externo necesario para publicar o usar comercialmente el sitio, y capacidades posteriores o desarrollos fuera del alcance que se evalúan y cotizan por separado. El texto vigente exige informar un costo externo antes de contratarlo. No se asignan importes, periodicidades ni condiciones no documentadas.

## Términos definitivos

- Versión de los términos contractuales de Commerce: **0.4**.
- Fecha de cierre y versión contractual definitiva: **2026-09-25**, fecha real de cierre de C01 en `America/Santiago`.
- Referencia pública todavía vigente: `src/pages/terminos.astro` presenta un resumen de condiciones generales sin versión ni fecha visibles. La publicación de los términos v0.4 corresponde a una cápsula posterior al gate L01.

## Decisión y trazabilidad

La decisión de precios netos más IVA fue confirmada expresamente por David y se registra en `docs/decisions/ADR-001-commerce-pricing-legal.md`. La etiqueta anterior «precio final» en `src` no prevalece sobre este contrato v0.4. No se infieren plazos, garantías, devoluciones ni propiedad del código.

La experiencia pública se alineará en las cápsulas de implementación. C01 está cerrada; L03 espera el cierre completo de L01.
