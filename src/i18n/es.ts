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
      { icon: "BuildingComplex", label: "Multi-Tenant Hub", tag: "Aislamiento" },
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
  multiCompany: {
    eyebrow: "Multitenancy Nativo",
    title: "Un solo lugar para conectar a todo tu equipo.",
    description:
      "Trabaja con tus colaboradores desde una plataforma que reúne información, comunicación y herramientas para las diferentes áreas de tu organización.",
    mockActiveCompany: "Racoon Devs",
    mockActiveInstance: "Instancia Activa",
    mockAdminUser: "Raúl (Admin)",
    mockSwitcherLabel: "Cambiar de razón social / sucursal",
    mockCompanyA: "Racoon Devs S.A.S.",
    mockCompanyB: "Maquinaria y Canteras",
    mockChangeLabel: "Cambiar",
    mockAddCompany: "Crear o vincular nueva empresa",
    mockRoleFinance: "Finanzas",
    mockRoleFinanceAccess: "Acceso Restringido",
    mockRoleWarehouse: "Almacén",
    mockRoleWarehouseAccess: "Lectura/Escritura",
    mockRoleDirection: "Dirección",
    mockRoleDirectionAccess: "Auditoría Global",
    pillars: [
      {
        icon: "Users",
        color: "orange",
        title: "Equipos verdaderamente conectados",
        description: "Evita la dispersión en 5 aplicaciones no conectadas. En RUNLY los chats de proyectos, archivos adjuntos y estados de pago conviven bajo el mismo techo.",
      },
      {
        icon: "Flag",
        color: "blue",
        title: "Diferentes empresas en una plataforma",
        description: "¿Manejas un grupo empresarial o diversas marcas? Administra cada empresa con catálogo, cuentas bancarias e inventarios completamente independientes.",
      },
      {
        icon: "UserCog",
        color: "emerald",
        title: "Accesos y permisos organizados",
        description: "Control granular por rol. Tus vendedores solo acceden a cotizaciones y catálogo, mientras los contadores gestionan libros y facturas con total seguridad.",
      },
    ],
  },
  implementation: {
    badge: "Transparencia y honestidad comercial",
    title: "No vendemos paquetes. Construimos la solución que necesitas.",
    description:
      "Cada empresa tiene necesidades diferentes. Por eso, en RUNLY ofrecemos implementaciones personalizadas que se ajustan a tu operación, tus objetivos y tu presupuesto.",
    steps: [
      { number: "01", title: "Cuéntanos sobre tu empresa", description: "Analizamos tus procesos actuales, dolores operativos y las herramientas que tu equipo ya utiliza en el día a día." },
      { number: "02", title: "Diseñamos tu solución", description: "Seleccionamos los módulos precisos y definimos las adaptaciones a la medida requeridas, sin módulos innecesarios." },
      { number: "03", title: "Implementamos RUNLY", description: "Configuramos tu instancia cloud, migramos catálogos base y capacitamos a tus líderes de área de forma práctica." },
      { number: "04", title: "Evolucionamos contigo", description: "Acompañamiento continuo, soporte directo con desarrolladores e incorporación ágil de nuevos módulos cuando tu negocio crezca." },
    ],
    valueTitle: "Software empresarial accesible, sin pagar por lo que no necesitas.",
    valueDescription:
      "Buscamos que la tecnología empresarial de alto nivel esté al alcance de más negocios en México y Latinoamérica. Olvídate de licencias prohibitivas de miles de dólares por usuario de los ERPs tradicionales.",
    valueCta: "Solicitar una propuesta personalizada",
  },
  whyChoose: {
    eyebrow: "Diferenciadores Clave",
    title: "Tecnología empresarial que trabaja a tu favor.",
    description: "Diseñado desde cero para erradicar la complejidad innecesaria y dar agilidad real a equipos en constante crecimiento.",
    cards: [
      { icon: "Boxes", color: "orange", title: "Modular y adaptable", description: "Paga e instala solo los módulos que tu operación necesita hoy." },
      { icon: "HandCoins", color: "emerald", title: "Sin costos inflados", description: "Cero sobrecostos por funciones que tu equipo nunca va a abrir." },
      { icon: "BuildingComplex", color: "blue", title: "Multiempresa nativo", description: "Administra diferentes empresas o sucursales con aislamiento estricto." },
      { icon: "Headset", color: "purple", title: "Soporte directo por devs", description: "Atención en español de México directa de los creadores en Racoon Devs." },
      { icon: "Sparkles", color: "pink", title: "IA práctica no decorativa", description: "MirAI automatiza lectura de comprobantes y consultas de stock reales." },
      { icon: "CloudUpload", color: "amber", title: "Innovación continua", description: "Nuevas funciones y optimizaciones mensuales sin costes ocultos." },
      { icon: "Smartphone", color: "cyan", title: "100% Cloud y Responsive", description: "Accede desde tu computadora, tablet o smartphone con alta fluidez." },
      { icon: "ShieldCheck", color: "indigo", title: "Seguridad y Respaldo", description: "Backups automáticos diarios y cifrado de datos en reposo y tránsito." },
    ],
  },
  faq: {
    eyebrow: "Dudas habituales",
    title: "Preguntas Frecuentes",
    description: "Todo lo que necesitas saber antes de implementar RUNLY en tu empresa.",
    items: [
      {
        question: "¿RUNLY funciona para empresas pequeñas o solo para grandes organizaciones?",
        answer: "RUNLY está diseñado con una arquitectura modular precisamente para adaptarse a cualquier tamaño. Una empresa de 3 personas puede comenzar únicamente con Chat, Calendario y Finanzas, mientras que una compañía consolidada puede operar inventarios complejos multialmacén y múltiples razones sociales.",
      },
      {
        question: "¿Tengo que contratar todos los módulos obligatoriamente?",
        answer: "No. En RUNLY no creemos en los paquetes forzosos. Tú eliges exactamente qué módulos habilitar en tu instancia. Si en el futuro necesitas un módulo adicional, lo activas con un clic sin necesidad de reinstalar ni migrar el sistema.",
      },
      {
        question: "¿Puedo solicitar módulos o funcionalidades personalizadas para mi empresa?",
        answer: "Sí, es una de nuestras principales fortalezas comerciales. Nuestro equipo en Racoon Devs puede desarrollar módulos personalizados exclusivos basados en la arquitectura RM3 que se adaptan exactamente a los cálculos, aprobaciones o regulaciones de tu negocio.",
      },
      {
        question: "¿Cómo funciona la gestión multiempresa?",
        answer: "Puedes dar de alta múltiples entidades o marcas bajo un mismo acceso maestro. Cada empresa tiene bases de datos lógicamente aisladas (inventario, empleados, cuentas bancarias), permitiendo que los administradores alternen entre una y otra con un solo clic.",
      },
      {
        question: "¿Mis datos están protegidos y respaldados?",
        answer: "Sí. Toda la comunicación viaja cifrada con SSL/TLS. Realizamos copias de seguridad automáticas diarias y contamos con redundancia en la nube, buscando garantizar disponibilidad y protección contra pérdidas imprevistas.",
      },
      {
        question: "¿Cómo se calcula el costo de RUNLY si no hay precios fijos publicados?",
        answer: "Cotizamos de forma justa basándonos en: los módulos exactos requeridos, el número de usuarios activos concurrentes y si requieres desarrollo personalizado. Esto evita que pagues por características infladas que no aportan valor a tu giro.",
      },
      {
        question: "¿Cuánto tiempo toma la implementación y puesta en marcha?",
        answer: "Para instancias estándar con módulos Core, la puesta en marcha suele tomar entre 2 y 3 días hábiles. Para proyectos con desarrollos custom y migración compleja de bases de datos, definimos un calendario por fases, habitualmente de 2 a 4 semanas según el alcance.",
      },
    ],
  },
  contact: {
    eyebrow: "Comienza hoy",
    title: "Hagamos que tu empresa avance.",
    description: "Cuéntanos qué necesita tu negocio y descubre cómo podemos adaptar RUNLY a tu manera de trabajar. Sin compromisos forzosos.",
    whatsappTitle: "¿Prefieres hablar de inmediato?",
    whatsappDescription: "Atención ágil con uno de nuestros consultores.",
    whatsappCta: "Contáctanos por WhatsApp",
    whatsappMessage: "Hola, me gustaría solicitar una demostración de RUNLY ERP",
    emailLabel: "hola@runly.mx",
    locationLabel: "México. Cobertura y despliegue para toda Latinoamérica",
    ndaLabel: "Acuerdo de Confidencialidad (NDA) disponible para empresas",
    formTitle: "Solicitud de propuesta o demostración",
    fields: {
      fullName: "Nombre completo *",
      fullNamePlaceholder: "Ej. Raúl Gómez",
      company: "Nombre de la empresa *",
      companyPlaceholder: "Ej. Maquinaria y Canteras",
      email: "Correo empresarial *",
      emailPlaceholder: "raul@miempresa.com",
      phone: "Teléfono o WhatsApp *",
      phonePlaceholder: "+52 55 1234 5678",
      teamSize: "Tamaño aproximado del equipo",
      teamSizeOptions: [
        { value: "1_5", label: "1 a 5 personas" },
        { value: "6_20", label: "6 a 20 personas" },
        { value: "21_50", label: "21 a 50 personas" },
        { value: "50_plus", label: "Más de 50 personas" },
      ],
      interest: "Principal interés *",
      interestOptions: [
        { value: "virtual_demo", label: "Solicitar demostración virtual" },
        { value: "modules_scope", label: "Conocer módulos y alcances" },
        { value: "enterprise_impl", label: "Implementación empresarial" },
        { value: "custom_module", label: "Desarrollo de módulo personalizado" },
        { value: "tech_questions", label: "Resolver dudas técnicas" },
      ],
      needs: "¿Qué procesos necesitas gestionar con RUNLY? *",
      needsPlaceholder: "Ej. Inventario multialmacén, control de gastos entre dos empresas y chat de soporte integrado...",
      consent: "Acepto el Aviso de Privacidad y el tratamiento de mis datos para ser contactado por Racoon Devs.",
    },
    submit: "Enviar solicitud",
    submitting: "Procesando solicitud...",
    successMessage: "¡Gracias por tu interés! Un consultor de Racoon Devs se pondrá en contacto contigo en breve.",
    errorMessage: "No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.",
    privacyNotice: "Al enviar este formulario aceptas nuestro Aviso de Privacidad. Tu información nunca será compartida.",
  },
};
