# EVAAS Commerce · Modelo financiero del piloto v0.1

**Estado:** `FINANCIAL_REVIEW_DRAFT`

**Cápsula:** `EVW-EVCOM-H03-L01-C02`

**Base documental:** `844ff25f539efea4cf09d0b0792ccb693e50cece` — `ACTIVATION_CONTINUITY_PILOT_v0.1.md`

**Moneda y presentación:** CLP; importes comerciales finales, salvo cuando se indique expresamente ingreso sin IVA o costo.

**Uso:** análisis interno del piloto. No constituye tarifa, oferta, cotización, cobro ni instrucción tributaria.

## 1. Fuentes, alcance y etiquetas

Este modelo reutiliza los tres productos y la separación activación/continuidad/ampliaciones del borrador C01. También considera el intake H03 aprobado, el informe de conciliación de productos del 9 de octubre de 2026, la adenda financiera del piloto, `src/data/products.ts`, `src/pages/terminos.astro` y `docs/traces/EVCOM_H02_L01.md`.

Etiquetas:

- `PUBLIC_BASELINE`: hecho publicado o trazado en v0.6.
- `HYPOTHESIS_NOT_APPROVED`: supuesto para evaluar el piloto; no se puede publicar, cotizar ni cobrar.
- `OWNER_DECISION_REQUIRED`: definición que requiere aprobación comercial, operacional, jurídica o tributaria.
- `NOT_VERIFIED`: dato sin evidencia actual suficiente; no participa en una conclusión cuantitativa.

Este documento no modifica los precios v0.6 ni resuelve la tensión documentada en C01: `/terminos` presenta hoy los valores finales como contratación anual, mientras su interpretación futura como activación única sigue siendo una propuesta contractual pendiente.

## 2. Productos y modelo de precios hipotético

La oferta conserva exactamente tres productos. Un perfil editorial, artístico o sectorial es una composición dentro de uno de ellos, no un producto o plugin adicional.

| Producto (`ProductSlug`) | Activación actual (`PUBLIC_BASELINE`) | Mensual propuesto (`HYPOTHESIS_NOT_APPROVED`) | Anual prepago −10 % propuesto (`HYPOTHESIS_NOT_APPROVED`) | Primer año con anualidad (`HYPOTHESIS_NOT_APPROVED`) |
| --- | ---: | ---: | ---: | ---: |
| Landing (`landing`) | $120.000 | $19.900 | $214.920 | $334.920 |
| Catálogo (`catalogo`) | $160.000 | $24.900 | $268.920 | $428.920 |
| Corporativa (`corporativa`) | $180.000 | $29.900 | $322.920 | $502.920 |

“Activación actual” registra los importes finales públicos v0.6 para la conciliación; no afirma que su cambio desde contratación anual a cobro inicial único esté aprobado. “Primer año con anualidad” es suma de cobros hipotéticos, no utilidad, margen ni contribución.

La continuidad es independiente de la activación. Las tres mensualidades, la modalidad anual y el descuento de 10 % permanecen `HYPOTHESIS_NOT_APPROVED`. El descuento solo se modela sobre continuidad. Su acumulabilidad con CiberDay u otra promoción está `OWNER_DECISION_REQUIRED`; hasta aprobar una regla, no debe suponerse acumulable.

## 3. Reconciliación de fórmulas

Para cada producto, con `M` como mensualidad hipotética y `A` como activación:

```text
anual_lista = M × 12
anual_prepago = M × 12 × (1 − 0,10)
primer_año = A + anual_prepago
ahorro_anual = M × 12 − anual_prepago
```

| Producto | `M × 12` | Cálculo anual prepago | Anual verificado | Ahorro | Cálculo primer año | Primer año verificado |
| --- | ---: | --- | ---: | ---: | --- | ---: |
| Landing | $238.800 | $19.900 × 12 × 0,90 | $214.920 | $23.880 | $120.000 + $214.920 | $334.920 |
| Catálogo | $298.800 | $24.900 × 12 × 0,90 | $268.920 | $29.880 | $160.000 + $268.920 | $428.920 |
| Corporativa | $358.800 | $29.900 × 12 × 0,90 | $322.920 | $35.880 | $180.000 + $322.920 | $502.920 |

Resultado aritmético: `PASS`. El resultado valida las operaciones, no aprueba precios, descuento o alcance.

## 4. Supuestos para contribución

Los siguientes valores no son hechos contables ni compromisos:

| Variable | Supuesto de trabajo | Estado / efecto |
| --- | ---: | --- |
| Costo de trabajo | $15.000 por hora | `HYPOTHESIS_NOT_APPROVED`; debe reemplazarse por costo completo observado |
| Costo fijo por activación | $15.000 | `HYPOTHESIS_NOT_APPROVED`; separado de horas y terceros |
| Margen objetivo de contribución | 30 % del ingreso sin IVA, si corresponde | `HYPOTHESIS_NOT_APPROVED`; no es utilidad neta |
| IVA ilustrativo | 19 % incluido en el importe comercial final | Solo para reconciliar el escenario; `OWNER_DECISION_REQUIRED` con revisión tributaria |
| Infraestructura | $0, $5.000 o $10.000 mensuales para sensibilidad | `HYPOTHESIS_NOT_APPROVED`; no es cotización de proveedor |
| Soporte | 15, 30 o 45 minutos mensuales | `HYPOTHESIS_NOT_APPROVED`; no define alcance o SLA |
| Pasarela | Sin precio ni comisión asumidos | `NOT_VERIFIED`; una comisión futura reduce contribución |

La contribución usada aquí es ingreso sin IVA menos costos directos modelados. No incluye gastos generales, ventas, administración, impuestos a la renta, financiamiento, incobrables ni contingencias, por lo que no debe llamarse utilidad.

## 5. Activación: horas máximas orientativas

Solo para validar la adenda, se supone que el importe comercial final incluye IVA de 19 % y que se busca conservar 30 % del ingreso sin IVA después del costo fijo y las horas:

```text
ingreso_sin_IVA = activación_final ÷ 1,19
presupuesto_costos_directos = ingreso_sin_IVA × (1 − 0,30)
horas_máximas = (presupuesto_costos_directos − costo_fijo_activación) ÷ costo_hora
```

| Producto | Activación final | Ingreso sin IVA ilustrativo | 70 % disponible para costos directos | Menos costo fijo | Horas máximas a $15.000/h |
| --- | ---: | ---: | ---: | ---: | ---: |
| Landing | $120.000 | $100.840 | $70.588 | $55.588 | 3,7 h |
| Catálogo | $160.000 | $134.454 | $94.118 | $79.118 | 5,3 h |
| Corporativa | $180.000 | $151.261 | $105.882 | $90.882 | 6,1 h |

Las cifras exactas no redondeadas son aproximadamente 3,706; 5,275 y 6,059 horas. Redondearlas a una décima puede mover la contribución algunas centenas de pesos. Son topes orientativos bajo supuestos, no estimaciones de esfuerzo, promesas de entrega ni márgenes garantizados. Costos de terceros, retrabajo, coordinación o más horas reducen la contribución; si deben caber dentro del mismo presupuesto, su costo se resta antes de dividir por el costo por hora.

Si el tratamiento tributario no corresponde a “precio final dividido por 1,19”, la tabla debe recalcularse. Sin decisión tributaria no se puede convertir este escenario en política comercial.

## 6. Continuidad: sensibilidad de soporte e infraestructura

Para aislar el efecto de las variables, esta sección aplica el mismo supuesto ilustrativo de IVA a los prepagos anuales y no asigna costo fijo de activación a continuidad:

```text
ingreso_anual_sin_IVA = anual_prepago ÷ 1,19
costo_soporte_anual = (minutos_soporte ÷ 60) × $15.000 × 12
contribución_continuidad = ingreso_anual_sin_IVA − costo_soporte_anual − costo_infraestructura_anual − otros_costos_directos
```

El costo anual de soporte sería $45.000 con 15 min/mes, $90.000 con 30 min/mes y $135.000 con 45 min/mes.

### Sensibilidad de soporte con infraestructura en $0

| Producto | Ingreso anual sin IVA ilustrativo | Contribución con 15 min/mes | Contribución con 30 min/mes | Contribución con 45 min/mes |
| --- | ---: | ---: | ---: | ---: |
| Landing | $180.605 | $135.605 (75,1 %) | $90.605 (50,2 %) | $45.605 (25,3 %) |
| Catálogo | $225.983 | $180.983 (80,1 %) | $135.983 (60,2 %) | $90.983 (40,3 %) |
| Corporativa | $271.361 | $226.361 (83,4 %) | $181.361 (66,8 %) | $136.361 (50,3 %) |

Los porcentajes son contribución sobre el ingreso anual sin IVA ilustrativo. Excluyen todos los demás costos y no son margen neto.

### Efecto incremental de infraestructura

| Infraestructura hipotética mensual | Costo anual que se resta a cada escenario | Ejemplo Landing con 30 min/mes |
| ---: | ---: | ---: |
| $0 | $0 | $90.605 (50,2 %) |
| $5.000 | $60.000 | $30.605 (16,9 %) |
| $10.000 | $120.000 | −$29.395 (−16,3 %) |

El efecto es lineal: a cualquier celda de contribución de la tabla anterior se le restan 12 meses de infraestructura y los demás costos directos. Estos importes de infraestructura son sensibilidad, no tarifas externas verificadas ni prestaciones incluidas.

## 7. Factores omitidos que pueden cambiar el resultado

| Factor | Tratamiento en este modelo | Efecto que debe medirse |
| --- | --- | --- |
| Soporte | Sensibilidad de 15/30/45 min por mes | Más tiempo, escalaciones o SLA reducen contribución; registrar tiempo real completo |
| Infraestructura | Sensibilidad de $0/$5.000/$10.000 por mes | Planes, tráfico, backups y servicios externos se restan como costos directos según su tratamiento tributario |
| IVA e impuestos | IVA de 19 % solo como escenario ilustrativo; otros impuestos omitidos | Cambian ingreso reconocible, créditos fiscales, flujo de caja y resultado; requiere revisión tributaria |
| Pasarelas futuras | `NOT_VERIFIED`, sin comisión modelada | Una comisión porcentual, fija, por cuota, contracargo o devolución reduce la contribución de cada cobro |
| Renovación | Sin tasa histórica | Para una cohorte, ingreso y contribución esperados dependen de clientes elegibles × tasa efectiva de renovación |
| Bajas | Sin tasa histórica ni regla de devolución | En mensual, menos meses activos reducen ingreso; en prepago, cancelación, devolución y costos no recuperables dependen del contrato aprobado |
| Morosidad e incobrables | Omitidos | Reducen ingreso realizado y agregan costo de cobranza |
| Ampliaciones y upgrades | Excluidos del precio base | Deben cotizarse aparte; medir ingreso y costo incremental sin usarlos para ocultar déficit del producto base |

Para pagos mensuales, si `m` es la cantidad efectiva de meses cobrados antes de la baja, el ingreso comercial es `M × m`, no `M × 12`. Para prepago anual, no se presume reconocimiento inmediato, ausencia de devoluciones ni permanencia: esas condiciones están `OWNER_DECISION_REQUIRED`.

## 8. Captura para las próximas 3–5 activaciones piloto

Completar una fila por activación con datos observados. No registrar datos personales del cliente en esta tabla financiera; usar una referencia interna controlada.

| Piloto | Producto | Horas reales totales | Costos de terceros | Días hasta preview | Días hasta publicación | Soporte mensual (min y período observado) | Permanencia | Upgrades / ampliaciones |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| P01 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| P02 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| P03 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| P04 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| P05 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

Para hacer comparables los registros:

- “horas reales” incluye coordinación, producción, revisión, publicación y retrabajo;
- “costos de terceros” identifica importe, periodicidad, responsable y si el impuesto es recuperable;
- los plazos se miden desde materiales completos y aceptación hasta cada hito;
- “soporte mensual” registra minutos reales por mes, materia y escalaciones;
- “permanencia” distingue meses facturados, renovación, baja y causa conocida;
- “upgrades” separa ingreso y costo de ampliaciones del producto y continuidad base.

## 9. Plataformas externas

`NOT_VERIFIED` al 21 de octubre de 2026: no se incorporó evidencia contemporánea de precios, impuestos, límites, promociones o términos de plataformas externas. Por ello no se presentan cifras ni se usa una plataforma externa como ancla del precio.

Una comparación futura deberá citar la página oficial, país, moneda, impuestos, fecha y plan consultado, y separar hosting, dominio, almacenamiento, tráfico, soporte, edición, ecommerce, comisiones y propiedad de cuentas. Aun con esos datos, será contexto de mercado y no equivalencia funcional con activación, composición, entrega o continuidad de EVAAS Commerce.

## 10. Recomendación comercial condicional

Mantener los valores v0.6 sin cambios mientras se ejecutan entre tres y cinco activaciones piloto y se capturan horas, costos, plazos, soporte, permanencia y ampliaciones. Las mensualidades de $19.900/$24.900/$29.900 y el prepago con 10 % de descuento pueden usarse solo como escenarios internos. Considerar una prueba comercial recién cuando:

1. el owner apruebe el paso de los valores v0.6 a activación única y su transición contractual;
2. exista evidencia de costo y capacidad para el alcance explícito de continuidad;
3. la revisión tributaria confirme la base de ingreso, facturación e impuestos;
4. la cotización distinga activación, continuidad, terceros y ampliaciones; y
5. la medición observada sostenga una contribución aceptable bajo soporte, infraestructura, renovaciones y bajas reales.

No prometer un margen de 30 %: es un objetivo de evaluación y puede no alcanzarse.

## 11. Decisiones del owner

1. Aprobar, modificar o rechazar las mensualidades hipotéticas por producto.
2. Aprobar, modificar o rechazar el prepago anual y su porcentaje de descuento.
3. Resolver si el descuento de continuidad puede acumularse con promociones; por defecto no asumir acumulabilidad.
4. Definir el alcance de soporte: canal, horario, materias, minutos o casos, escalación, respuesta, exclusiones y sobreconsumo.
5. Definir infraestructura incluida, responsable, límites, costos de terceros y tratamiento de alto tráfico.
6. Aprobar duración, renovación, avisos, reajustes, suspensión, baja, devolución y reactivación.
7. Confirmar con revisión tributaria el tratamiento de IVA, facturación, reconocimiento de ingresos, créditos fiscales y demás impuestos.
8. Definir el margen de contribución mínimo y qué costos completos entran en su cálculo.
9. Establecer reglas para comisiones, cuotas, devoluciones y contracargos si existe una pasarela futura.
10. Aprobar el umbral de evidencia piloto necesario antes de publicar o cotizar continuidad.

Hasta cerrar estas decisiones, todas las mensualidades, el descuento anual, los escenarios de contribución y las horas máximas permanecen `HYPOTHESIS_NOT_APPROVED`.
