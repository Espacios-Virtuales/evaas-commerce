# EVAAS Commerce v0.4 — contratos comerciales

| Campo | Valor |
| --- | --- |
| Estado | **PASS** |
| Gate | `EVCOM-H01-L01` |
| Fecha de cierre | **2026-09-25** (`America/Santiago`) |
| Entidad | **ESPACIOS VIRTUALES SpA** |
| RUT | **78.428.352-6** |

## Fuentes contractuales

| Cápsula | Contrato | Estado | Commit de cierre | Responsable | Define |
| --- | --- | --- | --- | --- | --- |
| C01 · Pricing & Legal | [pricing-legal.md](pricing-legal.md) | PASS | `a689583188090e8eba7c431b3a57dcfa6274f362` | ESPACIOS VIRTUALES SpA / David | Precios, IVA, identidad legal, dominio, alcance, exclusiones y costos adicionales. |
| C02 · Sales & Payment | [sales-payment.md](sales-payment.md) | PASS | `5f8fda0887a7f864b9d35ac984bb37c12adb525d` | ESPACIOS VIRTUALES SpA / David · AI Product Manager | WhatsApp, referencia comercial, Webpay Plus, ambientes, estados y confirmación autoritativa. |
| C03 · Coupon | [coupon.md](coupon.md) | PASS | `77aa09f9857200e02abccd647b78dadd9a5ebe2f` | ESPACIOS VIRTUALES SpA / David | EVAAS10, descuento, vigencia, aplicabilidad, límites, redondeo y relación tributaria. |
| C04 · Brand & Content | [brand-content.md](brand-content.md) | PASS | `22c1ad67d88b557f93ebcd6a8bbbfa2007d3eb77` | ESPACIOS VIRTUALES SpA / David | Canales oficiales, temas, color del proyecto, video y fallback, contenido demostrativo, dorado y demos. |

La [decisión de precios e IVA](../../decisions/ADR-001-commerce-pricing-legal.md) complementa C01. Las notas de dependencia escritas en cada contrato reflejan el estado al cierre de su cápsula; **este índice registra el estado vigente del gate**.

## Gate L01

Los cuatro contratos están cerrados y no contienen `PENDING_OWNER_INPUT`. Los precios base de Landing, Catálogo y Web Corporativa son, respectivamente, **99.000, 129.000 y 149.000 CLP netos**; el IVA de **19 %** se suma después del descuento autoritativo cuando corresponde. La integración de pago es Webpay Plus y solo una confirmación verificable del servidor permite `paid_verified`.

L01 queda habilitado como fuente contractual de L03 (experiencia global), L04 (demos), L05 (conversión) y L06 (confianza). Las implementaciones posteriores deben consumir estos contratos y no redefinir sus decisiones sin una nueva decisión contractual versionada. Este gate no publica cambios en la experiencia ni integra la rama a `develop`.
