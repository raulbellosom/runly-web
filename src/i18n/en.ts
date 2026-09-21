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
      { icon: "BuildingComplex", label: "Multi-Tenant Hub", tag: "Isolation" },
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
  mirai: {
    badge: "Practical Artificial Intelligence",
    title: "Meet MirAI.",
    titleHighlight: "Intelligence that works alongside you.",
    description:
      "RUNLY includes AI-powered tools to speed up repetitive tasks, make sense of unstructured information, and help you make better decisions in seconds. MirAI lives inside Chat and the Inventory assistant, it is not a separate module.",
    capabilities: [
      {
        icon: "MessageCircle",
        color: "purple",
        title: "Built-in conversational assistant",
        description: "Ask about inventory, request meeting summaries, or check project status using natural Spanish or English.",
      },
      {
        icon: "FileText",
        color: "orange",
        title: "Receipt and invoice interpretation",
        description: "Upload photos of receipts or vouchers from your phone; MirAI extracts amount, date, tax ID, and accounting category automatically.",
      },
      {
        icon: "Brain",
        color: "blue",
        title: "Contextual help per module",
        description: "In Projects, MirAI helps you draft acceptance criteria. In CRM, it suggests sales follow-ups.",
      },
      {
        icon: "ShieldCheck",
        color: "emerald",
        title: "Privacy and an extensible foundation",
        description: "Your business data stays strictly confidential and isolated inside your private environment.",
      },
    ],
    demoLabel: "MirAI Assistant",
    demoContext: "Illustrative example, not a live conversation",
    demoDisclaimer: "Sample view of how MirAI responds inside Runly ERP",
    demoUserMessage: "MirAI, what is the projected payroll balance at month end across both companies?",
    demoAssistantIntro: "Analyzing the ledgers for Racoon Devs and Maquinaria y Canteras:",
    demoLineCompanyA: "Racoon Devs (8 employees): $148,500 MXN",
    demoLineCompanyB: "Maquinaria y Canteras (12 employees): $210,000 MXN",
    demoTotalLabel: "Estimated total commitment: $358,500 MXN",
    demoConfirmation: "You have enough recorded liquidity given the customer payments scheduled for September 25.",
    demoPromptsLabel: "Try asking:",
    demoPrompt1: "Summary of this week pending tasks",
    demoPrompt2: "Read the attached fuel receipt",
  },
  multiCompany: {
    eyebrow: "Native Multi-tenancy",
    title: "One place to connect your whole team.",
    description:
      "Work with your team from a platform that brings together information, communication, and tools for every area of your organization.",
    mockActiveCompany: "Racoon Devs",
    mockActiveInstance: "Active Instance",
    mockAdminUser: "Raul (Admin)",
    mockSwitcherLabel: "Switch legal entity / branch",
    mockCompanyA: "Racoon Devs S.A.S.",
    mockCompanyB: "Maquinaria y Canteras",
    mockChangeLabel: "Switch",
    mockAddCompany: "Create or link a new company",
    mockRoleFinance: "Finance",
    mockRoleFinanceAccess: "Restricted access",
    mockRoleWarehouse: "Warehouse",
    mockRoleWarehouseAccess: "Read/Write",
    mockRoleDirection: "Management",
    mockRoleDirectionAccess: "Global audit",
    pillars: [
      {
        icon: "Users",
        color: "orange",
        title: "Truly connected teams",
        description: "Avoid the sprawl of 5 disconnected apps. In RUNLY, project chats, attached files, and payment statuses live under one roof.",
      },
      {
        icon: "Flag",
        color: "blue",
        title: "Different companies, one platform",
        description: "Running a business group or multiple brands? Manage each company with a fully independent catalog, bank accounts, and inventory.",
      },
      {
        icon: "UserCog",
        color: "emerald",
        title: "Organized access and permissions",
        description: "Granular role-based control. Your sales team only accesses quotes and catalog, while accountants manage ledgers and invoices with full security.",
      },
    ],
  },
  implementation: {
    badge: "Transparency and business honesty",
    title: "We do not sell packages. We build the solution you need.",
    description:
      "Every company has different needs. That is why RUNLY offers custom implementations that fit your operation, your goals, and your budget.",
    steps: [
      { number: "01", title: "Tell us about your company", description: "We analyze your current processes, operational pain points, and the tools your team already uses day to day." },
      { number: "02", title: "We design your solution", description: "We select the exact modules and define the custom adaptations required, with no unnecessary modules." },
      { number: "03", title: "We implement RUNLY", description: "We configure your cloud instance, migrate base catalogs, and train your area leads hands-on." },
      { number: "04", title: "We evolve with you", description: "Ongoing support, direct access to developers, and fast rollout of new modules as your business grows." },
    ],
    valueTitle: "Enterprise software that is accessible, without paying for what you do not need.",
    valueDescription:
      "We want high-end enterprise technology to be within reach for more businesses across Mexico and Latin America. Forget the thousand-dollar-per-user licenses of traditional ERPs.",
    valueCta: "Request a custom proposal",
  },
  whyChoose: {
    eyebrow: "Key Differentiators",
    title: "Enterprise technology that works in your favor.",
    description: "Built from the ground up to eliminate unnecessary complexity and give real agility to fast-growing teams.",
    cards: [
      { icon: "Boxes", color: "orange", title: "Modular and adaptable", description: "Pay for and install only the modules your operation needs today." },
      { icon: "HandCoins", color: "emerald", title: "No inflated costs", description: "Zero overhead for features your team will never open." },
      { icon: "BuildingComplex", color: "blue", title: "Native multi-company", description: "Manage different companies or branches with strict isolation." },
      { icon: "Headset", color: "purple", title: "Direct support from developers", description: "Spanish and English support straight from the creators at Racoon Devs." },
      { icon: "Sparkles", color: "pink", title: "Practical, not decorative AI", description: "MirAI automates receipt reading and real stock lookups." },
      { icon: "CloudUpload", color: "amber", title: "Continuous innovation", description: "New features and optimizations every month at no hidden cost." },
      { icon: "Smartphone", color: "cyan", title: "100% cloud and responsive", description: "Access from your computer, tablet, or smartphone with high fluency." },
      { icon: "ShieldCheck", color: "indigo", title: "Security and backups", description: "Automatic daily backups and data encryption at rest and in transit." },
    ],
  },
};
