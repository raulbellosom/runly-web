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
}
