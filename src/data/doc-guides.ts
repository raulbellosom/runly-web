// src/data/doc-guides.ts
//
// Curated reading paths through the module help: each guide strings together
// help views from one or more modules in the order you'd actually do them.
// Rendered as cards on /documentacion/modulos and as one continuous page per
// guide at /documentacion/guias/<slug>. Every step must point at an existing
// src/content/help/<moduleKey>/views/<view>.md (enforced by a test).
export interface DocGuideStep {
  moduleKey: string;
  view: string;
}

export interface DocGuide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  audience: string;
  steps: DocGuideStep[];
}

export const docGuides: DocGuide[] = [
  {
    slug: "primeros-pasos",
    title: "Primeros pasos",
    description: "Deja lista tu instancia: datos de la empresa, marca, usuarios, roles y los módulos que vas a usar.",
    icon: "Rocket",
    audience: "Administradores",
    steps: [
      { moduleKey: "runly.core", view: "inicio" },
      { moduleKey: "runly.company", view: "perfil" },
      { moduleKey: "runly.company", view: "marca" },
      { moduleKey: "runly.identity", view: "usuarios" },
      { moduleKey: "runly.identity", view: "roles" },
      { moduleKey: "runly.core", view: "modulos" },
    ],
  },
  {
    slug: "vender-en-mostrador",
    title: "Vender en mostrador",
    description: "Del catálogo de productos al cobro en caja, pasando por comandas y cocina.",
    icon: "Store",
    audience: "Comercios y restaurantes",
    steps: [
      { moduleKey: "runly.catalog", view: "categorias" },
      { moduleKey: "runly.catalog", view: "productos" },
      { moduleKey: "runly.pos", view: "administracion" },
      { moduleKey: "runly.pos", view: "comandero" },
      { moduleKey: "runly.pos", view: "cocina" },
      { moduleKey: "runly.pos", view: "caja" },
      { moduleKey: "runly.pos", view: "ordenes" },
    ],
  },
  {
    slug: "crear-tu-modulo",
    title: "Crea tu propio módulo",
    description: "Diseña un módulo a tu medida sin programar: datos, relaciones, pantallas, vistas y publicación.",
    icon: "Hammer",
    audience: "Administradores y creadores",
    steps: [
      { moduleKey: "runly.core", view: "constructor-de-modulos" },
      { moduleKey: "runly.core", view: "constructor-datos-y-campos" },
      { moduleKey: "runly.core", view: "constructor-relaciones" },
      { moduleKey: "runly.core", view: "constructor-diseno" },
      { moduleKey: "runly.core", view: "constructor-condiciones" },
      { moduleKey: "runly.core", view: "constructor-archivos" },
      { moduleKey: "runly.core", view: "constructor-vistas" },
      { moduleKey: "runly.core", view: "constructor-enlaces-publicos" },
      { moduleKey: "runly.core", view: "constructor-publicar" },
    ],
  },
  {
    slug: "tu-equipo",
    title: "Organiza a tu equipo",
    description: "Colaboradores, organigrama, agenda compartida y comunicación interna.",
    icon: "UsersRound",
    audience: "Recursos humanos",
    steps: [
      { moduleKey: "runly.hr", view: "catalogos" },
      { moduleKey: "runly.hr", view: "colaboradores" },
      { moduleKey: "runly.hr", view: "organigrama" },
      { moduleKey: "runly.calendar", view: "calendario" },
      { moduleKey: "runly.chat", view: "inbox" },
    ],
  },
  {
    slug: "control-financiero",
    title: "Control financiero",
    description: "Cuentas, categorías, presupuestos y tickets para saber a dónde va el dinero.",
    icon: "Wallet",
    audience: "Finanzas",
    steps: [
      { moduleKey: "runly.ledger", view: "cuentas" },
      { moduleKey: "runly.ledger", view: "categorias" },
      { moduleKey: "runly.pfm", view: "resumen" },
      { moduleKey: "runly.pfm", view: "carteras" },
      { moduleKey: "runly.pfm", view: "presupuestos" },
      { moduleKey: "runly.pfm", view: "tickets" },
    ],
  },
  {
    slug: "presencia-en-linea",
    title: "Presencia en línea",
    description: "Publica tu sitio web, capta prospectos con formularios y dales seguimiento.",
    icon: "Globe",
    audience: "Marketing y ventas",
    steps: [
      { moduleKey: "runly.website", view: "resumen" },
      { moduleKey: "runly.website", view: "tema" },
      { moduleKey: "runly.website", view: "paginas" },
      { moduleKey: "runly.website", view: "formularios" },
      { moduleKey: "runly.growth", view: "leads" },
      { moduleKey: "runly.contacts", view: "contactos" },
    ],
  },
];
