# Runly Web — Landing comercial (runly.mx) — Diseño

Fecha: 2026-09-21
Estado: Aprobado por el usuario en conversación (ver resumen de decisiones)

## 1. Objetivo

Construir el sitio comercial oficial de RUNLY en `runly.mx`, en un repositorio nuevo e independiente (`runly-web`, separado de `runly-erp`), implementando fielmente el diseño aprobado en Stitch (`stitch_runly_erp_landing_page/code.html` + `screen.png`), con contenido real (no inventado) tomado del ecosistema de módulos de `runly-erp`, un formulario de contacto funcional, SEO completo y despliegue en un contenedor Docker propio.

## 2. Decisiones ya tomadas (no reabrir sin razón)

| Tema | Decisión |
|---|---|
| Framework | Astro |
| Formulario de contacto | Backend propio con Nodemailer sobre SMTP genérico (host/usuario/password vía env vars, aún no configurados) |
| Despliegue | Contenedor Docker propio en el VPS, junto al resto de la infraestructura de Runly |
| Idioma | Bilingüe ES/EN desde el lanzamiento (`/` = español default, `/en/` = inglés) |
| Repositorio | Nuevo repo público `raulbellosom/runly-web`, git local ya inicializado en esta sesión |
| DNS de `runly.mx` | Libre / sin configurar — no hay nada que romper, pero no se tocará DNS/Nginx/Cloudflare desde este trabajo; solo se documentan los pasos |
| Atribución de commits | Sin coautoría ni firmas de IA en ningún commit o PR — el usuario es el único autor |

## 3. Arquitectura técnica

- **Astro 5**, output `hybrid`/`server` según corresponda por página: todas las páginas de marketing se prerenderizan (`export const prerender = true` o por config global con excepción explícita), y únicamente `/api/contact` corre en el servidor Node.
- **Adapter**: `@astrojs/node` en modo `standalone` (necesario porque el endpoint de contacto necesita ejecutar Nodemailer en tiempo real, no en build).
- **Estilos**: Tailwind CSS, migrando la configuración custom del Stitch (colores `runly-navy #070D1E`, `orange #FF5E14`→`amber #FF9F1C`, `blue #0E3A8C`, sombras `glow-orange`/`glass`/`glass-dark`, glassmorphism cuadrado con bordes definidos) a `tailwind.config.mjs` real del proyecto, en vez de Tailwind CDN.
- **Interactividad**: islas mínimas con `@astrojs/react` (o Alpine.js si se prefiere aún más ligero — a decidir en plan) solo para: menú móvil, filtro de módulos por categoría, acordeón de FAQ, demo animada de MirAI, formulario de contacto con estados de envío. El resto (scroll reveal, hover) se mantiene en CSS/vanilla JS como en el Stitch original.
- **Fuentes**: Plus Jakarta Sans (Google Fonts) vía `@fontsource` o self-hosted, para no depender de una conexión externa en cada carga y mejorar CWV.
- **Iconografía**: Font Awesome se sustituye por un set de iconos SVG inline o `lucide-astro` (evaluar en plan) para no cargar un CDN completo de iconos solo por unos ~40 iconos usados.

## 4. Estructura de contenido / i18n

- Rutas: `/` (ES, sin prefijo) y `/en/` (EN). Config `i18n` nativo de Astro, `defaultLocale: 'es'`, `prefixDefaultLocale: false`.
- Diccionarios tipados por idioma: `src/i18n/es.ts`, `src/i18n/en.ts`, con la misma forma (TypeScript garantiza que no falte ninguna clave al traducir).
- `hreflang` alternates en cada página + `sitemap-es.xml` / `sitemap-en.xml` vía `@astrojs/sitemap` con `i18n` config.
- Componentes de sección reciben el diccionario ya resuelto según el locale de la ruta — no hay lógica de traducción en los componentes, solo consumo de datos.

## 5. Secciones de la landing (fidelidad al Stitch, en orden)

1. **Header** — logo real (sustituye el placeholder de Google), nav (`Plataforma`, `Módulos`, `Arquitectura RM3`, `MirAI` con badge IA, `Implementación`, `Contacto`), CTA "Solicitar una demostración", menú móvil.
2. **Hero** — H1 + subtítulo + 2 CTAs + badges (Modular / Multiempresa / Personalizable) + mockup de ventana de app con dos tarjetas flotantes glass (Multisucursal, MirAI). La captura de "app.runly.mx/dashboard" se sustituye por una composición basada en componentes reales de Runly (no una captura de stock ni inventada) — se coordinará qué imagen real usar o se construye una recreación fiel con los propios componentes de UI del proyecto.
3. **Flexibilidad sin ataduras** — 4 tarjetas glass (Modular, Todo conectado, Multiempresa, Escalable).
4. **Catálogo de módulos** (`#modulos`) — filtro por categoría (Todos/Comunicación/Operaciones/Finanzas/IA), tarjetas generadas desde `src/data/modules.ts` (ver §6), bloque "Y esto es solo el comienzo" con roadmap marcado explícitamente "Próximamente".
5. **Arquitectura RM3** (`#motor-rm3`) — diagrama de 3 columnas (nodos periféricos / núcleo RUNLY CORE / nodos periféricos) + 3 pilares. Contenido técnico verificado contra `packages/module-engine` y `packages/core` del repo (a confirmar detalle exacto en plan/implementación).
6. **Clasificación de módulos** — 3 tarjetas (Oficiales / Custom / Community) + banner CTA. Community se redacta como *ecosistema en construcción*, sin prometer un marketplace público que no existe.
7. **MirAI** (`#mirai`) — 4 capacidades reales (asistente conversacional, interpretación de tickets/facturas, apoyo contextual por módulo, privacidad) + demo de chat **claramente etiquetada como simulación** (no conectada al backend real), reflejando que MirAI es una capacidad embebida en Chat/Inventario y no un módulo instalable aparte.
8. **Multiempresa y colaboración** — mockup de selector de empresa + 3 pilares (equipos conectados, multiempresa, permisos).
9. **Implementación a medida** (`#implementacion`) — 4 pasos + banner de valor comercial (sin tablas de precios, mensaje de accesibilidad/flexibilidad).
10. **Por qué elegir RUNLY** — grid de 8 diferenciadores.
11. **FAQ** — acordeón accesible (7 preguntas del Stitch, revisadas para que ningún dato sea inventado — p. ej. tiempos de implementación se marcan como estimados).
12. **Contacto** (`#contacto`) — columna info (WhatsApp, correo, ubicación, NDA) + formulario completo (ver §7). Los datos de contacto (número de WhatsApp, correos) son placeholders en el Stitch — **se confirmarán con el usuario antes de publicar** para no mostrar información falsa.
13. **Footer** — logo, tagline, enlaces (Plataforma/Ecosistema/Legal), copyright, crédito a Racoon Devs.

## 6. Catálogo de módulos — modelo de datos

`src/data/modules.ts`, tipado:

```ts
type ModuleStatus = "disponible" | "proximamente";
type ModuleCategory = "comunicacion" | "operaciones" | "finanzas" | "productividad" | "plataforma" | "comercial" | "sistema" | "ia";

interface RunlyModuleEntry {
  id: string;            // coincide con la key real del manifiesto (p. ej. "runly.chat")
  name: { es: string; en: string };
  description: { es: string; en: string };
  category: ModuleCategory;
  status: ModuleStatus;
  icon: string;           // nombre de icono
  color: string;          // token de color de marca
  version: string;
  order: number;
}
```

Contenido inicial poblado a partir de los manifiestos reales ya leídos de `runly-erp`:
`apps/api/src/manifests/official/core-modules.js` (Core, Identidad, Archivos, …) y
`apps/api/src/manifests/official/feature-modules.js` (Contactos, RRHH, Sitio web, Growth, Documentos, Actividad, Notificaciones, Proyectos, Chat). Durante la implementación se completará la lectura de módulos restantes (Calendario, Inventario, Ledger, Fleet, Calls, Catalog/POS) para no omitir ninguno del catálogo real, y **MirAI se presenta como capacidad destacada, no como entrada del catálogo instalable**, porque en el código vive como funcionalidad de Chat (`chat.mirai.use`) y del asistente de inventario, no como módulo propio.

Este archivo es la única fuente de verdad del catálogo comercial: agregar un módulo nuevo a futuro es agregar una entrada aquí, sin tocar el layout.

## 7. Formulario de contacto

- `POST /api/contact` (Astro API route, server-rendered).
- Validación: esquema Zod compartido entre cliente (feedback inmediato) y servidor (autoridad real).
- Campos: nombre completo, empresa, correo, teléfono/WhatsApp, tamaño de equipo, tipo de solicitud (demo / conocer módulos / implementación / módulo custom / dudas), procesos a gestionar (mensaje), checkbox de consentimiento de privacidad.
- Antispam: campo honeypot oculto + límite de solicitudes por IP (ventana simple en memoria o Upstash/Redis si ya existe infraestructura — a decidir en plan) + validación de user-agent/tiempo mínimo de llenado.
- Envío: Nodemailer sobre SMTP, variables de entorno: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_TO_EMAIL`. Documentadas en `.env.example`, sin valores reales ni credenciales en el repo.
- El mensaje de éxito en el frontend solo se muestra si la API respondió 200 (envío SMTP confirmado); cualquier error de SMTP se reporta como error al usuario, nunca como éxito falso.

## 8. SEO

- Todas las páginas de marketing con `prerender = true`.
- `<title>` y `<meta name="description">` por página y por idioma.
- Open Graph + Twitter Cards por página.
- `rel="canonical"` + `hreflang` ES/EN.
- `@astrojs/sitemap` (consciente de i18n) + `robots.txt` (sin rutas de `/api/`).
- JSON-LD `Organization` (Racoon Devs) y `SoftwareApplication` (Runly).
- `astro:assets` para imágenes (logo, mockups) con `width`/`height`/`alt` explícitos, evitando CLS.
- Sin contenido duplicado entre ES/EN gracias al `hreflang`.

## 9. Marca / assets

Assets reales confirmados en `C:\Users\raulb\Downloads\` (raíz, no en la carpeta del Stitch):
`runly-logo-{light,dark}.png`, `runly-logo-horizontal-{light,dark}.png`, `runly-logo-vertical-{light,dark}.png`,
`runly-isotipo-{light,dark}.png`, `runly-isotipo-alter-blue.{png,svg}`, `runly-app-icon-{light,dark}.png`.

Se copiarán a `public/brand/` (para uso directo `<img>`/favicon) y `src/assets/brand/` (para `astro:assets`), sustituyendo los `src` de Google (`lh3.googleusercontent.com/...`) del HTML de Stitch. El isotipo no se recolorea: se usa tal cual, respetando `.github/instructions/logo-components.instructions.md` del repo del ERP (fuente de verdad de la geometría de marca).

## 10. Despliegue

- `Dockerfile` multi-stage: build de Astro → imagen final `node:*-slim` corriendo el adapter standalone.
- Servicio nuevo en `docker-compose` (propio de este repo, no se edita el compose de `runly-erp`), puerto configurable, healthcheck simple.
- `.env.example` documentando todas las variables (SMTP + cualquier config de sitio).
- README con pasos de build/dev/deploy y una sección explícita "Pendiente de aprobación" para: apuntar DNS de `runly.mx`/`www.runly.mx` al contenedor, configurar reverse proxy/Nginx/Cloudflare, emitir certificado TLS. Estos pasos se documentan, no se ejecutan.

## 11. Fuera de alcance (v1)

- Tablas de precios, checkout o suscripciones.
- Conexión real del demo de MirAI a un backend de IA.
- Marketplace público de módulos Community con instalación automática.
- Cambios de DNS/infraestructura de producción ejecutados por el asistente.
- Integración con el sistema de captura de leads multi-tenant de `runly-erp` (`storefront-capture-service`), porque está diseñado para sitios de clientes tenant, no para el sitio corporativo de Runly — el formulario de contacto de `runly-web` es independiente.

## 12. Validación antes de dar por terminado

- Build de Astro sin errores (`astro build`).
- Typecheck limpio (`astro check` / `tsc`).
- Todas las secciones del Stitch representadas en ambos idiomas.
- Envío de formulario probado contra un SMTP de prueba (o Mailhog/Ethereal en dev) antes de asumir que "funciona".
- Lighthouse/PageSpeed razonable en móvil (Core Web Vitals) antes de considerar la optimización de SEO completa.
- Ningún dato de contacto falso publicado sin confirmación explícita del usuario.
