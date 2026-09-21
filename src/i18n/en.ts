// src/i18n/en.ts
import type { SiteDictionary } from "./types";

export const en: SiteDictionary = {
  meta: {
    title: "RUNLY ERP - Business in motion | Modular, multi-company software",
    description:
      "RUNLY is Racoon Devs modular, multi-company, collaborative ERP. Pick the modules you need, connect your team, and grow your business.",
  },
  nav: {
    platform: "Platform",
    modules: "Modules",
    rm3: "RM3 Architecture",
    mirai: "MirAI",
    implementation: "Implementation",
    contact: "Contact",
    requestDemo: "Request a demo",
  },
  footer: {
    tagline:
      "RUNLY - Business in motion. The modular, multi-company, collaborative operating system for businesses that move fast.",
    platformHeading: "Platform",
    ecosystemHeading: "Ecosystem",
    legalHeading: "Legal & Company",
    uptime: "All systems operational (99.98% uptime)",
    copyright: "RUNLY ERP - runly.mx. All rights reserved.",
    builtBy: "Built with passion by",
    links: {
      modulesCatalog: "Module Catalog",
      rm3Architecture: "RM3 Architecture",
      mirai: "MirAI (Artificial Intelligence)",
      customImplementation: "Custom Implementation",
      officialModules: "Official Modules",
      customDevelopment: "Custom Development",
      communityPartners: "Community Partners",
      apiDocs: "API Documentation",
      privacyNotice: "Privacy Notice",
      termsOfService: "Terms of Service",
      dataSecurity: "Data Security",
      supportContact: "Support Contact",
    },
  },
  hero: {
    imageAlt: "RUNLY ERP main interface",
    badge: "Your business. Your way of working.",
    titleLine1: "Your business in motion.",
    titleLine2: "Everything connected with RUNLY.",
    subtitle:
      "Manage your operations from a single platform. Choose the modules you need, connect your team, and grow your business with an ERP that adapts to you.",
    ctaPrimary: "Discover RUNLY",
    ctaSecondary: "Request a demo",
    badgeModular: "Modular",
    badgeMultiCompany: "Multi-company",
    badgeCustomizable: "Customizable",
    windowUrl: "app.runly.mx/dashboard",
    floatingMultiBranchTitle: "Connected multi-branch",
    floatingMultiBranchSubtitle: "2 companies synced",
    floatingMiraiTitle: "MirAI assistant ready",
    floatingMiraiSubtitle: "100% contextual active",
  },
  flexibility: {
    eyebrow: "Flexibility without strings attached",
    title: "Do not change how you work to fit a piece of software.",
    description:
      "RUNLY adapts to your processes, your team, and your needs. Start with the tools you need and expand your platform as your company grows.",
    cards: [
      {
        icon: "PuzzlePiece",
        color: "orange",
        title: "Modular by nature",
        description:
          "Install and use only what you need. Turn modules on or off with one click without affecting system stability.",
      },
      {
        icon: "Zap",
        color: "blue",
        title: "Everything connected",
        description:
          "Information synced in real time. A contact created in chat is instantly reflected in quotes and projects.",
      },
      {
        icon: "Building2",
        color: "purple",
        title: "A space for every company",
        description:
          "Multi-company with strict isolation and defined roles. Switch between legal entities without logging out.",
      },
      {
        icon: "TrendingUp",
        color: "emerald",
        title: "Grow at your own pace",
        description:
          "Frictionless scalability. Go from 3 to 300 employees without disproportionate costs or painful migrations.",
      },
    ],
  },
  modulesCatalog: {
    eyebrow: "RUNLY Core Catalog",
    title: "A complete ecosystem to run your business.",
    description:
      "From your team collaboration to organizing your resources and operations, RUNLY brings different tools together in one place.",
    roadmapTitle: "And this is just the beginning. RUNLY keeps evolving.",
    roadmapDescription:
      "Our team at Racoon Devs ships new modules and improvements every month. All clients with active support get immediate access to updates.",
    comingSoonLabel: "Coming soon",
  },
  rm3: {
    badge: "Cutting-edge architecture",
    title: "One platform. Infinite ways to adapt.",
    description:
      "RUNLY is built on the RM3 modular engine, designed to decouple processes, enable stable microservices, and guarantee updates with zero operational downtime.",
    coreTitle: "RUNLY CORE",
    coreSubtitle: "RM3 Modular Engine",
    coreDescription: "Event orchestrator, federated authentication, RBAC access control, and global synchronization.",
    leftNodes: [
      { icon: "Boxes", label: "Core Inventory", tag: "Micro-app" },
      { icon: "MessageCircle", label: "Real-time Chat", tag: "Websockets" },
      { icon: "Building2", label: "Multi-Tenant Hub", tag: "Isolation" },
    ],
    rightNodes: [
      { icon: "Sparkles", label: "MirAI Engine", tag: "LLM Context" },
      { icon: "GitBranch", label: "Custom Modules", tag: "Tailor-made" },
      { icon: "CloudUpload", label: "External APIs", tag: "Banks / Tax authority" },
    ],
    pillars: [
      {
        icon: "Boxes",
        title: "Independent, integrable modules",
        description:
          "Each module works as a decoupled component. You can update or migrate one specific area without risking a system-wide outage.",
      },
      {
        icon: "Split",
        title: "Dynamic expansion",
        description:
          "Add custom fields, specific reports, and new flows without breaking compatibility with future versions of RUNLY.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure operational flexibility",
        description:
          "Guaranteed optimal performance with fine-grained control over permissions, access traceability, and change auditing.",
      },
    ],
  },
  classification: {
    eyebrow: "Solutions ecosystem",
    title: "Your business is unique. Your software can be too.",
    description:
      "Extend RUNLY with tools built for different needs and put together a platform that truly fits your operation.",
    official: {
      badge: "Racoon-certified",
      title: "Official Modules",
      description:
        "Built, maintained, and supported directly by the Racoon Devs engineering team. Maximum stability, automatic updates, and guaranteed compatibility.",
      bullets: [
        "Updates at no extra cost",
        "Priority support in Spanish",
        "Immediate native integration",
      ],
    },
    custom: {
      tag: "Made to measure",
      badge: "Specific workflows",
      title: "Custom Modules",
      description:
        "Does your industry have a unique business rule or calculation? We design and build custom modules that integrate seamlessly into your RUNLY screens.",
      bullets: [
        "Technical process discovery",
        "Adapts to your legacy software",
        "Exclusive to your organization",
      ],
    },
    community: {
      badge: "Ecosystem in the works",
      title: "Community Modules",
      description:
        "We are laying the groundwork so certified developers and partners can contribute extensions and connectors in the future, under our team security review.",
      bullets: [
        "Open standards and SDK in progress",
        "Security and code review",
        "Not publicly available yet",
      ],
    },
    bannerTitle: "Have an idea for a module that does not exist yet?",
    bannerDescription: "We build the exact tool to remove the friction from your daily operation.",
    bannerCta: "Let us talk about your project",
  },
};
