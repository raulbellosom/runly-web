# Páginas de Legal y Empresa (Aviso de Privacidad, Términos, Seguridad de Datos, Soporte) — Diseño

Fecha: 2026-09-21
Estado: Aprobado por el usuario en conversación — ejecutar sin más checkpoints (el usuario delegó todas las decisiones restantes).

## 1. Objetivo

El footer (`Footer.astro`) ya tiene la sección "Legal y Empresa" con 4 enlaces (Aviso de Privacidad, Términos de Servicio, Seguridad de Datos, Contacto de Soporte) que hoy son `<span>` sin destino. Se crean las 4 páginas reales, bilingües (ES/EN), siguiendo el patrón i18n existente del sitio.

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Alcance | Las 4 páginas: Privacy Notice, Terms of Service, Data Security, Support Contact |
| Contenido legal | Texto completo y realista (LFPDPPP para el aviso de privacidad, al ser empresa mexicana), con placeholders entre corchetes donde falten datos reales de la empresa (razón social, RFC, domicilio fiscal, responsable de datos) |
| Support Contact | Página de contacto de soporte dedicada (canales, horario, qué cubre vs. ventas), no un simple redirect a `#contacto` |
| Slugs | Mismo slug en inglés para ambos locales (`/privacy-notice`, `/en/privacy-notice`, etc.) para no romper la lógica de `SiteHead.astro`, que asume rutas simétricas entre locales para `hreflang`/canonical |
| Almacenamiento de contenido | Dentro de `src/i18n/es.ts` / `en.ts` (nuevo namespace `legal`), igual que el resto del sitio — no se introducen content collections/Markdown para no meter un patrón nuevo en un proyecto 100% basado en diccionarios TS |
| Atribución de commits | Sin coautoría ni firmas de IA (regla ya vigente en el proyecto) |

## 3. Rutas

- `/privacy-notice` (ES) · `/en/privacy-notice` (EN)
- `/terms-of-service` (ES) · `/en/terms-of-service` (EN)
- `/data-security` (ES) · `/en/data-security` (EN)
- `/support-contact` (ES) · `/en/support-contact` (EN)

Cada página: `export const prerender = true`, usa `BaseLayout` + `Header` + `Footer` igual que `index.astro`/`en/index.astro`, con `path` pasado a `BaseLayout`/`SiteHead` sin prefijo de locale (p. ej. `/privacy-notice`).

## 4. Componente nuevo: `LegalContent.astro`

`src/components/sections/LegalContent.astro` — renderer genérico de prosa, reutilizado por las 4 páginas:

- Props: `eyebrow`, `title`, `lastUpdated`, `intro?`, `sections: { heading: string; paragraphs: string[]; list?: string[] }[]`.
- Layout: contenedor `max-w-3xl mx-auto`, título grande + fecha de actualización, secciones con `h2` + párrafos + listas con viñetas, estilado con utilidades Tailwind existentes (sin plugin de typography, que no está instalado).
- Sin lógica de i18n interna: recibe el contenido ya resuelto desde el diccionario, igual que el resto de secciones del sitio.

## 5. Cambios a componentes existentes

- **`Footer.astro`**: añade `const prefix = locale === "es" ? "" : "/en";` (mismo patrón que `Header.astro`). Los 3 `<span class="cursor-default">` (Aviso de Privacidad, Términos, Seguridad de Datos) pasan a `<a href={`${prefix}/<slug>`}>`. "Contacto de Soporte" cambia su `href` de `#contacto` a `${prefix}/support-contact`.
- **`Header.astro`**: los enlaces de ancla (`#hero`, `#modulos`, `#motor-rm3`, `#mirai`, `#implementacion`, `#contacto`) se anteponen con el prefijo de locale (`${prefix}/#modulos`, etc.) tanto en el nav desktop como en el menú móvil y los botones CTA, para que funcionen también desde las páginas legales (regresan al home y hacen scroll). En el home esto sigue funcionando igual (navegación al mismo documento).

## 6. Contenido — `src/i18n/types.ts` (nuevo namespace `legal`)

```ts
interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalPageDictionary {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

interface LegalDictionary {
  privacy: LegalPageDictionary;
  terms: LegalPageDictionary;
  security: LegalPageDictionary;
  support: LegalPageDictionary;
}
```

Añadido a `SiteDictionary` como `legal: LegalDictionary`.

### 6.1 Aviso de Privacidad (`legal.privacy`)

Conforme a la LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares, México). Secciones: identidad y domicilio del responsable, datos personales recabados, finalidades (primarias y secundarias, con opción de negar las secundarias), transferencias de datos, derechos ARCO y mecanismo para ejercerlos, uso de cookies/tecnologías de rastreo, conservación de datos, cambios al aviso, contacto.

### 6.2 Términos de Servicio (`legal.terms`)

Secciones: aceptación de los términos, descripción del servicio (RUNLY ERP como SaaS), cuentas y suscripciones, uso aceptable, propiedad intelectual, tarifas y facturación, disponibilidad del servicio (disclaimer sin comprometer un SLA numérico no confirmado), limitación de responsabilidad, terminación, modificaciones a los términos, ley aplicable y jurisdicción (México), contacto.

### 6.3 Seguridad de Datos (`legal.security`)

Secciones: compromiso con la seguridad, cifrado y protección de datos (tránsito/reposo), infraestructura y alojamiento, control de accesos, respaldos y continuidad, monitoreo y respuesta a incidentes, proveedores y subencargados, reporte responsable de vulnerabilidades, contacto de seguridad.

### 6.4 Contacto de Soporte (`legal.support`)

Secciones: canales de soporte (correo `CONTACT_SUPPORT_EMAIL` y WhatsApp `CONTACT_WHATSAPP_NUMBER`, ambos desde `consts.ts`), horario de atención, qué cubre soporte técnico (clientes existentes) vs. el formulario de ventas/demo (enlace a `${prefix}/#contacto`), tiempos de respuesta esperados, checklist de qué incluir antes de escribir (cuenta/empresa, pasos para reproducir, capturas).

### 6.5 Placeholders

Donde no hay datos reales confirmados (razón social legal, RFC, domicilio fiscal completo, nombre del responsable/DPO), se usan placeholders explícitos entre corchetes, p. ej. `[RAZÓN SOCIAL LEGAL DE RACOON DEVS]`, `[RFC]`, `[DOMICILIO FISCAL COMPLETO]`, `[NOMBRE DEL RESPONSABLE DE PROTECCIÓN DE DATOS]`. El resto de datos de contacto (correo, WhatsApp) usa los valores reales ya existentes en `consts.ts`.

## 7. Fuera de alcance

- No se toca el formulario de contacto ni `ContactSection.astro`.
- No se añade banner de cookies/consentimiento (fuera de este alcance; el `README` ya documenta que el sitio no tiene uno).
- No se modifica `SiteHead.astro` (los slugs simétricos entre locales evitan la necesidad).
- No se valida contenido con un abogado — placeholders quedan explícitos para revisión posterior por el usuario.
