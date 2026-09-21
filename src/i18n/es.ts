// src/i18n/es.ts
import type { SiteDictionary } from "./types";

export const es: SiteDictionary = {
  meta: {
    title: "RUNLY ERP - Business in motion | Software modular y multiempresa",
    description:
      "RUNLY es el ERP modular, multiempresa y colaborativo de Racoon Devs. Elige los módulos que necesitas, conecta a tu equipo y haz crecer tu negocio.",
  },
  nav: {
    platform: "Plataforma",
    modules: "Módulos",
    rm3: "Arquitectura RM3",
    mirai: "MirAI",
    implementation: "Implementación",
    contact: "Contacto",
    requestDemo: "Solicitar una demostración",
  },
  footer: {
    tagline:
      "RUNLY - Business in motion. El sistema operativo modular, multiempresa y colaborativo para empresas que avanzan rápido.",
    platformHeading: "Plataforma",
    ecosystemHeading: "Ecosistema",
    legalHeading: "Legal y Empresa",
    uptime: "Todos los sistemas operativos en línea (99.98% uptime)",
    copyright: "RUNLY ERP - runly.mx. Todos los derechos reservados.",
    builtBy: "Desarrollado con pasión por",
    links: {
      modulesCatalog: "Catálogo de Módulos",
      rm3Architecture: "Arquitectura RM3",
      mirai: "MirAI (Inteligencia Artificial)",
      customImplementation: "Implementación a Medida",
      officialModules: "Módulos Oficiales",
      customDevelopment: "Desarrollo Custom",
      communityPartners: "Community Partners",
      apiDocs: "Documentación de API",
      privacyNotice: "Aviso de Privacidad",
      termsOfService: "Términos de Servicio",
      dataSecurity: "Seguridad de Datos",
      supportContact: "Contacto de Soporte",
    },
  },
  hero: {
    imageAlt: "Interfaz principal de RUNLY ERP",
    badge: "Tu empresa. Tu manera de trabajar.",
    titleLine1: "Tu empresa en movimiento.",
    titleLine2: "Todo conectado con RUNLY.",
    subtitle:
      "Gestiona tus operaciones desde una sola plataforma. Elige los módulos que necesitas, conecta a tu equipo y haz crecer tu negocio con un ERP que se adapta a ti.",
    ctaPrimary: "Descubre RUNLY",
    ctaSecondary: "Solicitar una demostración",
    badgeModular: "Modular",
    badgeMultiCompany: "Multiempresa",
    badgeCustomizable: "Personalizable",
    windowUrl: "app.runly.mx/dashboard",
    floatingMultiBranchTitle: "Multisucursal conectada",
    floatingMultiBranchSubtitle: "2 empresas sincronizadas",
    floatingMiraiTitle: "MirAI asistente listo",
    floatingMiraiSubtitle: "100% contextual activo",
  },
  flexibility: {
    eyebrow: "Flexibilidad sin ataduras",
    title: "No cambies tu forma de trabajar para adaptarte a un software.",
    description:
      "RUNLY se adapta a tus procesos, tu equipo y tus necesidades. Comienza con las herramientas que necesitas y amplía tu plataforma conforme evoluciona tu empresa.",
    cards: [
      {
        icon: "PuzzlePiece",
        color: "orange",
        title: "Modular por naturaleza",
        description:
          "Instala y utiliza solo lo que necesitas. Activa o desactiva módulos con un clic sin alterar la estabilidad del sistema.",
      },
      {
        icon: "Zap",
        color: "blue",
        title: "Todo conectado",
        description:
          "Información sincronizada en tiempo real. Un contacto creado en el chat se refleja inmediatamente en cotizaciones y proyectos.",
      },
      {
        icon: "Building2",
        color: "purple",
        title: "Un espacio para cada empresa",
        description:
          "Multiempresa con aislamiento estricto y roles definidos. Alterna entre razones sociales sin cerrar sesión.",
      },
      {
        icon: "TrendingUp",
        color: "emerald",
        title: "Crece a tu ritmo",
        description:
          "Escalabilidad sin fricciones. Pasa de 3 a 300 colaboradores sin costos desproporcionados ni migraciones dolorosas.",
      },
    ],
  },
  modulesCatalog: {
    eyebrow: "Catálogo RUNLY Core",
    title: "Un ecosistema completo para hacer funcionar tu empresa.",
    description:
      "Desde la colaboración de tu equipo hasta la organización de tus recursos y operaciones, RUNLY reúne diferentes herramientas en un mismo lugar.",
    roadmapTitle: "Y esto es solo el comienzo. RUNLY evoluciona constantemente.",
    roadmapDescription:
      "Nuestro equipo en Racoon Devs despliega nuevos módulos y mejoras mensualmente. Todos los clientes con soporte activo reciben acceso inmediato a las actualizaciones.",
    comingSoonLabel: "Próximamente",
  },
  rm3: {
    badge: "Arquitectura de vanguardia",
    title: "Una plataforma. Infinitas posibilidades de adaptación.",
    description:
      "RUNLY está construido sobre el motor modular RM3, diseñado para desacoplar procesos, permitir microservicios estables y garantizar actualizaciones sin interrupciones operativas.",
    coreTitle: "RUNLY CORE",
    coreSubtitle: "Motor Modular RM3",
    coreDescription: "Orquestador de eventos, autenticación federada, control de acceso RBAC y sincronización global.",
    leftNodes: [
      { icon: "Boxes", label: "Inventario Core", tag: "Micro-app" },
      { icon: "MessageCircle", label: "Chat en Tiempo Real", tag: "Websockets" },
      { icon: "Building2", label: "Multi-Tenant Hub", tag: "Aislamiento" },
    ],
    rightNodes: [
      { icon: "Sparkles", label: "Motor MirAI", tag: "LLM Context" },
      { icon: "GitBranch", label: "Módulos Custom", tag: "A la medida" },
      { icon: "CloudUpload", label: "APIs Externas", tag: "Bancos / SAT" },
    ],
    pillars: [
      {
        icon: "Boxes",
        title: "Módulos independientes integrables",
        description:
          "Cada módulo funciona como un componente desacoplado. Puedes actualizar o migrar un área específica sin riesgo de caídas generales.",
      },
      {
        icon: "Split",
        title: "Ampliación dinámica",
        description:
          "Incorpora campos personalizados, reportes específicos y nuevos flujos sin romper la compatibilidad con futuras versiones de RUNLY.",
      },
      {
        icon: "ShieldCheck",
        title: "Flexibilidad operativa segura",
        description:
          "Garantía de rendimiento óptimo con control minucioso sobre permisos, trazabilidad de accesos y auditoría de cambios.",
      },
    ],
  },
  classification: {
    eyebrow: "Ecosistema de soluciones",
    title: "Tu negocio es único. Tu software también puede serlo.",
    description:
      "Amplía RUNLY con herramientas desarrolladas para diferentes necesidades y construye una plataforma que realmente se ajuste a tu operación.",
    official: {
      badge: "Certificados Racoon",
      title: "Módulos Oficiales",
      description:
        "Desarrollados, mantenidos y soportados directamente por el equipo de ingeniería de Racoon Devs. Máxima estabilidad, actualizaciones automáticas y compatibilidad garantizada.",
      bullets: [
        "Actualizaciones sin costo adicional",
        "Soporte prioritario en español",
        "Integración nativa inmediata",
      ],
    },
    custom: {
      tag: "Hecho a la medida",
      badge: "Flujos específicos",
      title: "Módulos Personalizados",
      description:
        "¿Tu industria tiene una regla de negocio o cálculo único? Diseñamos y programamos módulos custom que se integran con fluidez exacta a tu pantalla de RUNLY.",
      bullets: [
        "Levantamiento técnico de procesos",
        "Adaptación a tu software heredado",
        "Exclusivo para tu organización",
      ],
    },
    community: {
      badge: "Ecosistema en construcción",
      title: "Módulos Community",
      description:
        "Estamos sentando las bases para que desarrolladores y partners certificados puedan aportar extensiones y conectores en el futuro, bajo revisión de seguridad de nuestro equipo.",
      bullets: [
        "Estándares abiertos y SDK en desarrollo",
        "Revisión de seguridad y código",
        "Aún no disponible públicamente",
      ],
    },
    bannerTitle: "¿Tienes una idea para un módulo que todavía no existe?",
    bannerDescription: "Construimos la herramienta exacta para resolver la fricción de tu operación diaria.",
    bannerCta: "Hablemos de tu proyecto",
  },
  mirai: {
    badge: "Inteligencia Artificial Práctica",
    title: "Conoce a MirAI.",
    titleHighlight: "Inteligencia que acompaña tu trabajo.",
    description:
      "RUNLY incorpora herramientas impulsadas por inteligencia artificial para facilitar tareas repetitivas, interpretar información desestructurada y ayudarte a tomar mejores decisiones en segundos. MirAI vive dentro de Chat y del asistente de Inventario, no es un módulo aparte.",
    capabilities: [
      {
        icon: "MessageCircle",
        color: "purple",
        title: "Asistente conversacional integrado",
        description: "Pregunta sobre el inventario, solicita resúmenes de reuniones o consulta el estatus de proyectos usando lenguaje natural en español.",
      },
      {
        icon: "FileText",
        color: "orange",
        title: "Interpretación de tickets y facturas",
        description: "Sube fotos de tickets o comprobantes desde tu teléfono; MirAI extrae monto, fecha, RFC y categoría contable de forma automática.",
      },
      {
        icon: "Brain",
        color: "blue",
        title: "Apoyo contextual por módulo",
        description: "Si estás en Proyectos, MirAI te ayuda a redactar criterios de aceptación. Si estás en CRM, sugiere follow-ups comerciales.",
      },
      {
        icon: "ShieldCheck",
        color: "emerald",
        title: "Privacidad y base extensible",
        description: "Tus datos empresariales permanecen estrictamente confidenciales y aislados dentro de tu entorno privado.",
      },
    ],
    demoLabel: "MirAI Asistente",
    demoContext: "Ejemplo ilustrativo - no es una conversación en vivo",
    demoDisclaimer: "Vista de ejemplo de cómo responde MirAI dentro de Runly ERP",
    demoUserMessage: "¿MirAI, cuál es el saldo proyectado para nómina a fin de mes entre las dos empresas?",
    demoAssistantIntro: "Analizando los libros de cuentas de Racoon Devs y Maquinaria y Canteras:",
    demoLineCompanyA: "Racoon Devs (8 colaboradores): $148,500 MXN",
    demoLineCompanyB: "Maquinaria y Canteras (12 colab.): $210,000 MXN",
    demoTotalLabel: "Compromiso total estimado: $358,500 MXN",
    demoConfirmation: "Tienes liquidez suficiente registrada con los cobros de clientes programados para el 25 de septiembre.",
    demoPromptsLabel: "Prueba preguntar:",
    demoPrompt1: "Resumen de tareas pendientes de la semana",
    demoPrompt2: "Leer ticket de combustible adjunto",
  },
};
