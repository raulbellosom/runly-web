---
title: Marketplace comunitario y catálogo v2
summary: Oficial Runly frente a comunidad, publicadores verificados, firma separada, catálogo v2 secuenciado, revocaciones, compatibilidad y comportamiento offline.
order: 9.5
---

El catálogo oficial v1 (**Módulos > Disponibles**) no cambia. El catálogo v2 es un canal **paralelo y opcional** que añade módulos de la comunidad con confianza explícita. Ningún módulo de la comunidad entra en el feed oficial antiguo.

## Tres niveles de confianza que nunca se mezclan

| Etiqueta | Qué significa | Quién firma |
|---|---|---|
| **✓ Oficial Runly** | Módulo revisado y publicado por Runly. | Clave oficial fijada en Runly (la misma del v1). |
| **✓ Publicador verificado · Comunidad** | Identidad del publicador comprobada por la moderación de Developer Hub. **No** es autoría de Runly. | Clave comunitaria, distinta de la oficial. |
| **Comunidad · publicador no verificado** | Publicado por la comunidad sin verificación de identidad. | Clave comunitaria. |
| **Catálogo administrado** | Catálogo privado que configuró la administración de tu instancia. | Claves que agregó tu administrador. |

Una firma comunitaria nunca produce «Oficial Runly», aunque el publicador esté verificado. Las firmas de la comunidad usan un formato con separación de dominio que no puede coincidir con la firma oficial `key@version:sha256`. Si una entrada afirma ser oficial sin la firma oficial válida, se muestra **Firma no confiable** y no se puede instalar.

## Publicadores y claves de módulo

- Un **publicador** es una identidad pública separada de tu organización: identificador permanente (por ejemplo `acme-labs`) y nombre visible.
- No se admiten identificadores ni nombres que imiten a Runly, Racoon Devs u «oficial/verificado».
- Las claves instalables siguen siendo `custom.*`. Cada clave pertenece a un solo publicador y no puede reclamarse si ya está en el canal oficial.
- Una clave solo cambia de dueño mediante **transferencia**: la solicita el publicador de origen, la acepta el destino y la aprueba la moderación. El proyecto se mueve con la clave y el historial queda visible en la página pública del publicador.

## Publicar en el Marketplace

1. Valida, genera el ZIP y guarda una **versión privada** (como para la publicación oficial). Si tiene pantallas CUSTOM, compílalas primero.
2. En **Publicador**, reclama la clave y crea una release desde esa versión: visibilidad **pública** o **no listada** y rango de versiones de Runly. Los contratos de compilador/runtime y las capacidades se toman de la evidencia verificada, no de la versión del módulo.
3. Envíala a moderación. La moderación comunitaria la aprueba o la devuelve; es una autoridad separada de la revisión oficial.
4. Un proceso separado firma la release con la clave comunitaria y publica un nuevo snapshot del catálogo v2.

Las versiones privadas nunca aparecen en el Marketplace ni en el catálogo público. Las no listadas no aparecen en búsquedas; se abren por enlace y siguen sujetas a las mismas reglas de confianza.

## Retirar y revocar

- **Retirar** deja de listar y recomendar una versión. No invalida instalaciones existentes ni borra el ZIP.
- **Revocar** marca una versión como insegura para futuras operaciones: Runly bloquea nuevas instalaciones y avisa en las instancias que la tienen instalada, con la actualización recomendada si existe.
- También se puede revocar un **publicador** (todas sus versiones dejan de ser instalables) o una **clave de firma** (las versiones firmadas con ella pierden confianza).
- Una revocación **nunca desinstala módulos ni borra datos**. No existe un interruptor remoto. Los ZIP e historiales se conservan.

## Catálogo v2: secuencia y frescura

Cada snapshot del catálogo v2 incluye una secuencia creciente, la huella del snapshot anterior, fecha de generación, vigencia de 7 días, publicadores, entradas, revocaciones y claves comunitarias activas/retiradas/revocadas. El snapshot completo está firmado.

Runly rechaza y conserva la última copia verificada cuando recibe:

- un snapshot con secuencia menor (rollback/replay);
- dos snapshots distintos con la misma secuencia (feed comprometido);
- un snapshot que no continúa la cadena del anterior;
- un catálogo v1 donde se esperaba v2 (downgrade);
- firmas que no son de una clave de confianza.

## Compatibilidad

Antes de instalar, Runly comprueba la versión de Runly declarada, los contratos de compilador/runtime, que los servicios, eventos y Connections existan en la instancia y que las dependencias `custom.*` estén instaladas. Si algo no se cumple, el módulo se muestra como no compatible y no se instala. La metadata de seguridad firmada (capacidades, servicios, eventos, Connections, dependencias) debe coincidir con el ZIP inspeccionado.

## Instalar y actualizar en Runly

**Módulos > Catálogo v2** muestra la etiqueta de confianza, el publicador, la versión, las capacidades, los permisos solicitados y el estado de revocación. Para un módulo no oficial, la administración debe aceptar explícitamente la versión exacta antes de instalar. Las actualizaciones se detectan y se muestran con su confianza y cambios, pero **siempre requieren confirmación**: no hay actualizaciones automáticas.

## Sin conexión

Sin conexión o con información vencida, Runly muestra la **última sincronización** y no instala módulos del catálogo v2: no puede confirmar revocaciones recientes. Los módulos instalados siguen funcionando. Una instancia offline no recibe revocaciones hasta volver a sincronizar.

## Estado actual

Developer Hub implementa Marketplace, publicadores, moderación, firma comunitaria y exportación del catálogo v2 en desarrollo local. La clave comunitaria de producción todavía no existe ni está fijada en Runly; hasta entonces el catálogo v2 solo se prueba con claves de prueba y no hay despliegue público. La preparación estática verifica firmas, secuencia y bytes con `pnpm catalog:prepare:v2 --from <export>`.
