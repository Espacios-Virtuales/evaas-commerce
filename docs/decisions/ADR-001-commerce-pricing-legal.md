# ADR-001 — precios e identidad legal de EVAAS Commerce v0.4

Estado: aceptada. Fecha: 2026-09-25 (`America/Santiago`). Responsable de la decisión comercial y tributaria: David, propietario del proyecto.

## Contexto

El modelo anterior en `src/data/products.ts` contiene precios distintos y la experiencia pública los describe como finales con IVA. Para v0.4, el propietario confirmó nuevos importes y su tratamiento tributario. `docs/contracts/commerce-v04/pricing-legal.md` es la fuente contractual de esta decisión; la publicación se hará en cápsulas posteriores al gate L01.

## Decisión

Los precios públicos base de EVAAS Commerce v0.4 son valores netos: Landing $99.000 CLP, Catálogo $129.000 CLP y Web Corporativa $149.000 CLP. El IVA aplicable de 19 % se agrega al precio neto para determinar el total comercial: $117.810, $153.510 y $177.310 CLP, respectivamente. La comunicación debe distinguir precio neto, IVA y total a pagar.

El cupón EVAAS10 descuenta 10 % del valor neto y el IVA se calcula sobre la base neta ya descontada. Sus totales de referencia son $106.029, $138.159 y $159.579 CLP. El servidor resolverá el importe autoritativo cuando se implemente el flujo comercial.

La identidad vendedora confirmada es ESPACIOS VIRTUALES SpA, RUT 78.428.352-6. Según los términos vigentes, el cliente compra y conserva su dominio; Espacios Virtuales realiza la conexión. Alcance, exclusiones y categorías de costos adicionales se mantienen según el contrato enlazado, sin ampliar promesas.

La versión contractual de términos es 0.4 y su fecha de cierre es 2026-09-25, correspondiente al cierre real de C01. La página pública de términos todavía no refleja esta versión; se actualizará en una cápsula posterior.

## Consecuencias

- Los precios y textos antiguos en `src` deberán alinearse antes de publicar v0.4, sin modificar la experiencia pública en C01.
- Ningún precio neto debe presentarse como total con IVA.
- El cupón mantiene la naturaleza tributaria de la base neta y no altera las reglas de pago o confirmación.
- C01 queda cerrada; el gate L01 completo sigue condicionado por C02.
