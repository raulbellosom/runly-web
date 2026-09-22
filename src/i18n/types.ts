// src/i18n/types.ts
export interface NavDictionary {
  platform: string;
  modules: string;
  rm3: string;
  mirai: string;
  implementation: string;
  contact: string;
  requestDemo: string;
}

export interface FooterDictionary {
  tagline: string;
  platformHeading: string;
  ecosystemHeading: string;
  legalHeading: string;
  uptime: string;
  copyright: string;
  builtBy: string;
  links: {
    modulesCatalog: string;
    rm3Architecture: string;
    mirai: string;
    customImplementation: string;
    officialModules: string;
    customDevelopment: string;
    communityPartners: string;
    apiDocs: string;
    privacyNotice: string;
    termsOfService: string;
    dataSecurity: string;
    supportContact: string;
  };
}

export interface SiteDictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: NavDictionary;
  footer: FooterDictionary;
  hero: {
    imageAlt: string;
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badgeModular: string;
    badgeMultiCompany: string;
    badgeCustomizable: string;
    windowUrl: string;
    floatingMultiBranchTitle: string;
    floatingMultiBranchSubtitle: string;
    floatingMiraiTitle: string;
    floatingMiraiSubtitle: string;
  };
  flexibility: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { icon: string; color: string; title: string; description: string }[];
  };
  modulesCatalog: {
    eyebrow: string;
    title: string;
    description: string;
    roadmapTitle: string;
    roadmapDescription: string;
    comingSoonLabel: string;
  };
  rm3: {
    badge: string;
    title: string;
    description: string;
    coreTitle: string;
    coreSubtitle: string;
    coreDescription: string;
    leftNodes: { icon: string; label: string; tag: string }[];
    rightNodes: { icon: string; label: string; tag: string }[];
    pillars: { icon: string; title: string; description: string }[];
  };
  classification: {
    eyebrow: string;
    title: string;
    description: string;
    official: { badge: string; title: string; description: string; bullets: string[] };
    custom: { tag: string; badge: string; title: string; description: string; bullets: string[] };
    community: { badge: string; title: string; description: string; bullets: string[] };
    bannerTitle: string;
    bannerDescription: string;
    bannerCta: string;
  };
  mirai: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    capabilities: { icon: string; color: string; title: string; description: string }[];
    demoLabel: string;
    demoContext: string;
    demoDisclaimer: string;
    demoUserMessage: string;
    demoAssistantIntro: string;
    demoLineCompanyA: string;
    demoLineCompanyB: string;
    demoTotalLabel: string;
    demoConfirmation: string;
    demoPromptsLabel: string;
    demoPrompt1: string;
    demoPrompt2: string;
  };
  multiCompany: {
    eyebrow: string;
    title: string;
    description: string;
    mockActiveCompany: string;
    mockActiveInstance: string;
    mockAdminUser: string;
    mockSwitcherLabel: string;
    mockCompanyA: string;
    mockCompanyB: string;
    mockChangeLabel: string;
    mockAddCompany: string;
    mockRoleFinance: string;
    mockRoleFinanceAccess: string;
    mockRoleWarehouse: string;
    mockRoleWarehouseAccess: string;
    mockRoleDirection: string;
    mockRoleDirectionAccess: string;
    pillars: { icon: string; color: string; title: string; description: string }[];
  };
  implementation: {
    badge: string;
    title: string;
    description: string;
    steps: { number: string; title: string; description: string }[];
    valueTitle: string;
    valueDescription: string;
    valueCta: string;
  };
  whyChoose: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { icon: string; color: string; title: string; description: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    whatsappTitle: string;
    whatsappDescription: string;
    whatsappCta: string;
    whatsappMessage: string;
    emailLabel: string;
    locationLabel: string;
    ndaLabel: string;
    formTitle: string;
    fields: {
      fullName: string;
      fullNamePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      teamSize: string;
      // value is a stable, locale-independent key sent to Runly's form
      // validation (the ERP's field "options" whitelist matches on this,
      // not on the translated label) — must be identical across en/es.
      teamSizeOptions: { value: string; label: string }[];
      interest: string;
      interestOptions: { value: string; label: string }[];
      needs: string;
      needsPlaceholder: string;
      consent: string;
    };
    submit: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
    privacyNotice: string;
  };
}
