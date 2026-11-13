// English text for src/config/site.js. Merged over the Persian `site` (deepMerge):
// objects merge by key, arrays are REPLACED, so arrays here are written in full.

export const EN_SITE = {
  name: "Arano Web Studio",
  slogan: "Software Development Team",

  logo: { alt: "Arano Web Studio logo" },

  nav: [
    { label: "Services", href: "/services" },
    {
      label: "Web Design",
      href: "/web-design",
      items: [
        { label: "Online Store Websites", href: "/web-design/store" },
        { label: "Corporate Websites", href: "/web-design/corporate" },
        { label: "Personal Websites", href: "/web-design/personal" },
        { label: "WordPress Websites", href: "/web-design/wordpress" },
        { label: "Custom Websites", href: "/web-design/custom" },
        { label: "Landing Pages", href: "/web-design/landing" },
        { label: "Medical Websites", href: "/web-design/clinic" },
        { label: "Real Estate Websites", href: "/web-design/real-estate" },
        { label: "Educational Websites", href: "/web-design/education" },
        { label: "Restaurant Websites", href: "/web-design/restaurant" },
        { label: "Industrial Websites", href: "/web-design/industrial" },
        { label: "Portal & Automation", href: "/web-design/portal-automation" },
        { label: "Multilingual Websites", href: "/web-design/multilingual" },
      ],
    },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
  ],

  cta: { label: "Start a Project", href: "/contact" },

  hero: {
    status: "Open to new projects",
    titleLines: ["We turn your idea", "into a digital product"],
    highlightLine: 1,
    description:
      "Arano is a three-person team: a frontend developer, a backend developer and a UI/UX designer. From design to deployment, we build fast, stable, scalable web applications.",
    primaryCta: { label: "View Portfolio", href: "/portfolio" },
    secondaryCta: { label: "Talk to the Team", href: "/contact" },
    banner: { alt: "An Arano developer coding" },
    codeLines: [
      [["// Arano", "c"]],
      [
        ["const ", "k"],
        ["team ", "f"],
        ["= {", "p"],
      ],
      [
        ["  name: ", "p"],
        ['"Arano"', "s"],
        [",", "p"],
      ],
      [
        ["  frontend: ", "p"],
        ['"React"', "s"],
        [",", "p"],
      ],
      [
        ["  backend: [", "p"],
        ['"Laravel"', "s"],
        [", ", "p"],
        ['"Node.js"', "s"],
        ["],", "p"],
      ],
      [
        ["  database: [", "p"],
        ['"MySQL"', "s"],
        [", ", "p"],
        ['"MongoDB"', "s"],
        ["],", "p"],
      ],
      [
        ["  design: ", "p"],
        ['"UI/UX"', "s"],
        [",", "p"],
      ],
      [["};", "p"]],
      [["", "p"]],
      [
        ["await ", "k"],
        ["ship", "f"],
        ["(", "p"],
        ["idea", "f"],
        ["); ", "p"],
        ["// ✓ deployed", "c"],
      ],
    ],
    chips: [
      { icon: "layers", label: "UI/UX design", hint: "Ready to ship" },
      { icon: "server", label: "Laravel API", hint: "200 OK" },
    ],
  },

  stats: [
    { value: "30+", label: "Projects delivered" },
    { value: "3", label: "Specialists working together" },
    { value: "4+", label: "Years of team experience" },
    { value: "98%", label: "Client satisfaction" },
  ],

  sections: {
    services: {
      eyebrow: "Services",
      title: "Everything you need to build a website",
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Projects we are proud to have built",
      description:
        "A selection of the web applications, dashboards and digital products the Arano team has designed and built.",
    },
    about: {
      eyebrow: "About",
      title: "Small, focused and professional",
    },
    team: {
      eyebrow: "Team",
      title: "Three specialties, one shared goal",
      description:
        "Frontend, backend and design work side by side so no gap is left between the idea and the final product.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build your next project together",
      description:
        "Write to us about your idea or request. We usually reply within one business day.",
    },
  },

  about: {
    statement: [
      { text: "We combine " },
      { text: "clean code", strong: true },
      { text: ", " },
      { text: "precise design", strong: true },
      { text: " and " },
      { text: "on-time delivery", strong: true },
      { text: " to build a product that works right today and stays " },
      { text: "ready to grow", strong: true },
      { text: " tomorrow." },
    ],
    principles: [
      {
        title: "Simplify before building",
        text: "Before writing the first line of code we make the problem clear, so we build only what is really needed.",
      },
      {
        title: "Measurable quality",
        text: "Load speed, accessibility and stability are metrics we set numbers and targets for.",
      },
      {
        title: "Transparency all the way",
        text: "Regular reports, a demo at every stage and direct contact with the team; no middlemen and no surprises.",
      },
      {
        title: "Built to grow",
        text: "Clean architecture and proper documentation mean your product grows with your business, without a big rewrite.",
      },
    ],
  },

  contact: {
    items: [
      {
        icon: "mail",
        label: "Email",
        values: [
          { value: "aranogr3@aranogroup.ir", href: "mailto:aranogr3@aranogroup.ir" },
          { value: "Aranogroup@gmail.com", href: "mailto:Aranogroup@gmail.com" },
        ],
        ltr: true,
      },
      {
        icon: "phone",
        label: "Phone",
        values: [
          { value: "09370876514", href: "tel:09370876514" },
          { value: "09105008864", href: "tel:09105008864" },
        ],
        ltr: true,
      },
      {
        icon: "pin",
        label: "Location",
        values: [{ value: "Jaghatai, Razavi Khorasan, Iran", href: null }],
        ltr: false,
      },
    ],
    form: {
      nameLabel: "Full name",
      namePlaceholder: "e.g. Ali Ahmadi",
      phoneLabel: "Phone number",
      phonePlaceholder: "e.g. 09123456789",
      messageLabel: "About the project",
      messagePlaceholder: "Briefly describe your idea or need...",
      submit: "Send message",
      submitting: "Sending...",
      errors: {
        nameRequired: "Please enter your full name.",
        nameTooLong: "The name must not exceed 60 characters.",
        nameInvalid: "Please use only Persian or English letters in the name.",
        phoneRequired: "Please enter your phone number.",
        phoneInvalid: "The phone number is not valid (e.g. 09123456789).",
        messageRequired: "Please describe your project.",
        messageShort: "The description is a bit short; write at least 10 characters.",
        messageLong: "The message must not exceed 1000 characters.",
        messageMarkup: "Please don't use HTML tags or code in the message.",
        messageLinks: "A maximum of 2 links is allowed in a message.",
        messageInvalid: "The message text is not valid.",
        rateLimited: "Too many submissions. Try again in {time}.",
        tooFast: "Please wait a few seconds and send again.",
        failed: "The message could not be sent. Please try again.",
      },
    },
    successMessage: "Your message has been received. We'll contact you soon.",
  },

  socials: [
    { id: "github", label: "GitHub", icon: "github", href: "https://github.com/alifarashiani1276/" },
    { id: "instagram", label: "Instagram", icon: "instagram", href: "https://instagram.com/arano_group" },
    { id: "telegram", label: "Telegram", icon: "send", href: "https://t.me/+989150635682" },
  ],

  footer: {
    slogan: "Always one step ahead.",
    copyright: "© 2026 Arano Web Studio. All rights reserved.",
  },
};
