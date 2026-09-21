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
}
