// English text of the "Web Design" pillar page: /en/web-design
// Source: Arano-Pillar-Page-Website-Design-Step2.txt (SEO team, Persian) — English version written to match it 1:1.
// Same structure and keys as the Persian file src/data/webDesignPillar.js.
//
// Internal links inside text: {{link text|/path}}  (the /en prefix is added automatically)
//
// The source file's blank "[ ... ]" placeholders (track record / project count, price range, timeframes,
// address and phone, the multilingual project story) are intentionally NOT included, so no invented content gets published.
// The /blog/conversion-rate-optimization link of the source is left out until that article exists.

export const EN_WEB_DESIGN_PILLAR = {
  eyebrow: "Website design services",
  heading: "Professional, SEO-Driven Web Design: From Idea to Ranking, in One Team",
  imageAlt: "Professional, SEO-driven web design by the Arano team",

  shortLabel: "Short answer:",
  short:
    "Web design means building a website that looks professional, loads fast, gets found on Google and turns visitors into customers. At Arano, design, development, SEO and branding live in one team, so your site is built for sales and rankings from day one.",

  cta: { primary: "Request a free consultation", secondary: "See all services" },

  stats: [
    { value: "13", label: "Website types" },
    { value: "SEO", label: "From day one" },
    { value: "100%", label: "Responsive" },
  ],

  tocTitle: "On this page",

  intro: [
    "If you are looking for web design, you probably have three questions: which type of website suits my business? How much does it cost and how long does it take? And how can I be sure the site is not just pretty but actually brings customers? This page answers those three questions and, at the end, explains how to choose the right web design company.",
    "Arano is a web design and development, branding and SEO agency. Our strongest expertise is industrial, corporate, online store and multilingual websites, and we plan speed and SEO from the very start of the design, not as an add-on at the end of the project.",
  ],

  includes: {
    id: "what-is",
    toc: "What is web design?",
    title: "What exactly is web design and what does it include?",
    lead: "Web design is not just drawing a nice layout. A complete project has several layers:",
    items: [
      {
        icon: "target",
        title: "Strategy and structure",
        text: "Defining the goal, the audience and the page map",
      },
      {
        icon: "layout",
        title: "UI/UX design",
        text: "The user journey and the visual look",
        link: { label: "UI/UX and graphic design", href: "/services/ui-ux-graphic" },
      },
      {
        icon: "code",
        title: "Frontend development",
        text: "Turning the design into fast, responsive code",
        link: { label: "Frontend", href: "/services/frontend" },
      },
      {
        icon: "server",
        title: "Backend and database development",
        text: "Admin panel, orders, forms and integrations",
        link: { label: "Backend, API and database", href: "/services/backend-api" },
      },
      {
        icon: "search",
        title: "SEO and content",
        text: "A structure Google can understand and well-built copy",
        link: { label: "SEO services", href: "/services/seo" },
      },
      {
        icon: "tool",
        title: "Deployment, support and growth",
        text: "Hosting, SSL, backups and improvements after launch",
        link: { label: "Website maintenance", href: "/services/maintenance" },
      },
    ],
    footer:
      "If you want one team to be responsible for all of these steps: {{Full project delivery, from 0 to 100|/services/full-project}}.",
  },

  why: {
    id: "why",
    toc: "Why a professional site?",
    title: "Why does your business need a professional website?",
    items: [
      {
        icon: "heart",
        title: "Trust",
        text: "Customers search for you before they call. A tidy, fast site builds trust.",
      },
      {
        icon: "globe",
        title: "Available 24/7",
        text: "Even when you are away, your site introduces you, answers questions and collects leads.",
      },
      {
        icon: "layers",
        title: "A channel you own",
        text: "The site and the domain are yours, unlike social networks whose rules keep changing.",
      },
      {
        icon: "target",
        title: "Targeted leads",
        text: "Someone who searches Google for \"web design\" or \"industrial website design\" is ready to buy.",
      },
      {
        icon: "zap",
        title: "The base of all marketing",
        text: "Ads, SEO, Instagram and email all end up on your website.",
      },
    ],
  },

  principles: {
    id: "principles",
    toc: "Our four principles",
    title: "Our four principles of web design",
    items: [
      {
        title: "Speed",
        text: "A slow site loses both users and rankings. Our goal is to show the main content in under 2.5 seconds (LCP) on mobile.",
        link: {
          lead: "Details:",
          label: "Website Speed and Core Web Vitals",
          href: "/blog/website-speed-core-web-vitals",
        },
      },
      {
        title: "SEO from the start",
        text: "Page structure, URLs, headings, Schema and internal linking are planned into the design.",
        link: { lead: "Full guide:", label: "SEO-friendly web design", href: "/blog/seo-friendly-website-design" },
      },
      {
        title: "User experience and conversion",
        text: "Every page has one goal, and the user's path to a call or a purchase is clear.",
        // when the CRO article is published: link: { lead: "Read more:", label: "Conversion rate optimization (CRO)", href: "/blog/conversion-rate-optimization" },
      },
      {
        title: "Identity and trust",
        text: "Colors, fonts, images and tone of voice match your brand, with a clear portfolio, team and contact details.",
        link: { lead: "Explained:", label: "What is E-E-A-T?", href: "/blog/what-is-eeat" },
      },
    ],
  },

  types: {
    id: "types",
    toc: "Types of websites",
    title: "Types of web design (which one is right for you?)",
    forLabel: "Best for",
    items: [
      { href: "/web-design/corporate", label: "Corporate website design", forWho: "Introducing a company, its services and winning customers" },
      { href: "/web-design/store", label: "Online store website design", forWho: "Selling products online" },
      { href: "/web-design/industrial", label: "Industrial and factory website design", forWho: "Manufacturers, exporters, technical catalogs" },
      { href: "/web-design/multilingual", label: "Multilingual website design", forWho: "International audience and exports" },
      { href: "/web-design/wordpress", label: "WordPress website design", forWho: "Company sites and blogs that are easy to manage" },
      { href: "/web-design/custom", label: "Custom website design", forWho: "Special needs, panels and tailor-made systems" },
      { href: "/web-design/landing", label: "Landing page design", forWho: "Ad campaigns and lead generation" },
      { href: "/web-design/clinic", label: "Medical and clinic website design", forWho: "Practices, clinics, appointment booking" },
      { href: "/web-design/real-estate", label: "Real estate website design", forWho: "Property consulting and sales" },
      { href: "/web-design/education", label: "Educational website design", forWho: "Online courses and training centers" },
      { href: "/web-design/restaurant", label: "Restaurant and cafe website design", forWho: "Menu, reservations, presenting the venue" },
      { href: "/web-design/portal-automation", label: "Portal and automation design", forWho: "Corporate and management systems" },
      { href: "/web-design/personal", label: "Personal and resume website design", forWho: "Personal brand and portfolio" },
    ],
  },

  compare: {
    id: "wordpress-or-custom",
    toc: "WordPress or custom?",
    title: "WordPress or custom code?",
    items: [
      {
        title: "WordPress",
        text: "Faster to launch, simple content management, suited to company sites, corporate sites and blogs.",
        link: { label: "WordPress website design", href: "/web-design/wordpress" },
      },
      {
        title: "Custom",
        text: "Full flexibility and speed, suited to special systems, user panels and long-term growth.",
        link: { label: "Custom website design", href: "/web-design/custom" },
      },
      {
        title: "The middle way",
        text: "A custom WordPress theme.",
        link: { label: "Custom WordPress theme development", href: "/services/wordpress-theme" },
      },
    ],
    footer:
      "Full comparison with a table: {{WordPress vs Custom Website|/blog/wordpress-vs-custom-website}}.",
  },

  process: {
    id: "process",
    toc: "Our process",
    title: "Arano's web design process (8 steps)",
    outputLabel: "What you get",
    steps: [
      { title: "Needs-analysis meeting and competitor analysis", output: "Goal document, audience and page list" },
      { title: "Structure and keywords", output: "Site map and SEO plan" },
      { title: "Wireframe and UI/UX design", output: "A design you can approve in Figma" },
      { title: "Frontend development", output: "Responsive, fast pages" },
      { title: "Backend / WordPress development", output: "Admin panel, forms, integrations" },
      { title: "Content and technical SEO", output: "Copy, headings, Schema, sitemap" },
      { title: "Testing and deployment", output: "Device, speed and security tests, launch" },
      { title: "Support and growth", output: "Bug fixes and continuous improvement" },
    ],
  },

  deliverables: {
    id: "deliverables",
    toc: "What you receive",
    title: "What do you receive?",
    items: [
      "Custom design (not just a ready-made template)",
      "Fully responsive for mobile, tablet and desktop",
      "SEO-driven structure: H1 to H3, clean URLs, Schema, sitemap, canonical",
      "Speed and Core Web Vitals optimization",
      "A simple admin panel for you",
      "Right-to-left and multilingual support (Persian/English)",
      "SSL, backups and a secure configuration",
      "Google Search Console and Analytics connection",
      "Source code handover and training",
      "Full ownership of the code and the domain",
    ],
  },

  tech: {
    id: "technologies",
    toc: "Technologies",
    title: "Technologies we use",
    rows: [
      { area: "Frontend", items: ["React", "Tailwind CSS", "Vite"] },
      { area: "Backend", items: ["Laravel", "Node.js"] },
      { area: "Database", items: ["MySQL"] },
      { area: "Managed sites", items: ["WordPress", "PHP", "Elementor"] },
      { area: "Design", items: ["Figma"] },
    ],
    note: "We choose technology based on the project's needs, not on taste.",
  },

  seo: {
    id: "seo-focused",
    toc: "SEO-driven web design",
    title: "What does SEO-driven web design mean?",
    lead: "It means the site is built to be found from the very beginning:",
    items: [
      "Every service gets its own page with its own keyword",
      "Real links in menus and cards (not just anchors or JavaScript)",
      "Unique titles and descriptions for every page",
      "High speed and a complete mobile experience",
      "Experience-driven content with a portfolio and FAQ",
      "Readiness for AI answers: {{SEO for AI Overviews|/blog/seo-for-ai-overviews}}",
    ],
  },

  cost: {
    id: "cost",
    toc: "Web design cost",
    title: "What does the cost of web design depend on?",
    text: "There is no single fixed price, because projects differ. These factors decide it:",
    factors: [
      "The type of website",
      "Number and complexity of pages",
      "Custom design or a template",
      "Features (payments, user panel, multilingual)",
      "Content and image production",
      "SEO and support after delivery",
    ],
    footer:
      "Full guide: {{How much does website design cost?|/blog/website-design-cost}}. For an exact estimate: {{free consultation|/contact}}.",
  },

  local: {
    id: "mashhad",
    toc: "Web design in Mashhad",
    title: "Web design in Mashhad",
    text: "Arano is based in Mashhad and designs websites for businesses in Mashhad and across Iran. For local businesses, an SEO-driven site combined with a Google Business Profile and city keywords is very effective.",
  },

  expertise: {
    id: "expertise",
    toc: "Our expertise",
    title: "Our expertise: industrial and multilingual websites",
    text: "An industrial website must show production capacity, certificates and technical specifications as readable text, and be available in several languages for export customers. See: {{industrial website design|/web-design/industrial}} and {{multilingual website design|/web-design/multilingual}}.",
  },

  portfolio: {
    id: "portfolio",
    toc: "Portfolio",
    title: "Portfolio",
    lead: "A few projects the Arano team has designed and built.",
    all: "See the full portfolio",
  },

  whyUs: {
    id: "why-arano",
    toc: "Why Arano?",
    title: "Why Arano?",
    items: [
      {
        title: "Developer and SEO specialist in one team",
        text: "The code we write is built for Google too.",
      },
      { title: "Experience with industrial and multilingual websites" },
      { title: "Speed as part of the design" },
      { title: "Web + brand + print and advertising", text: "In one studio." },
      { title: "You get full ownership of the code and the domain" },
      {
        title: "Transparency",
        text: "Written scope, delivery of every stage and price before we start.",
      },
    ],
  },

  choose: {
    id: "choose",
    toc: "Choosing a web design company",
    title: "How to choose the right web design company",
    lead: "Check these before you order:",
    items: [
      "Open real portfolio sites and test their speed and mobile experience.",
      "Ask who owns the code and the domain, and whether it is written in the contract.",
      "Ask for the process and timeline in writing.",
      "Ask whether technical SEO (speed, Schema, structure) is included.",
      "Find out how much support you get after delivery, and how.",
      "Do not look only at the price; compare like for like.",
      "Talk to previous clients, if possible.",
    ],
  },

  mistakes: {
    id: "mistakes",
    toc: "Common mistakes",
    title: "Common mistakes when ordering a website",
    items: [
      "Choosing only by the cheapest price",
      "No contract about code and domain ownership",
      "Starting without defining the scope and the pages",
      "Ignoring SEO and speed until after launch",
      "Having the designer and the developer separate",
    ],
    footer: "Read more: {{10 Common Web Design Mistakes|/blog/web-design-mistakes}}.",
  },

  faq: {
    id: "faq",
    toc: "FAQ",
    title: "Frequently asked questions about web design",
    items: [
      {
        q: "How long does web design take?",
        a: "It depends on the type and the number of pages. After the needs-analysis meeting we give you a written timeline.",
      },
      {
        q: "How much does web design cost?",
        a: "There is no fixed price; it depends on the type of site, the features and how custom it is. The factors are explained in the cost section, and the full guide is in {{website design cost|/blog/website-design-cost}}.",
      },
      {
        q: "What is the difference between a WordPress and a custom website?",
        a: "WordPress launches faster and more simply, while custom code gives more flexibility and control. Comparison: {{WordPress or custom|/blog/wordpress-vs-custom-website}}.",
      },
      {
        q: "Do you design the site to be SEO-driven?",
        a: "Yes, the SEO structure is planned into the design from the start. Nobody can guarantee a specific ranking, but we build the foundations right.",
      },
      {
        q: "Is the website responsive?",
        a: "Yes, with a mobile-first approach.",
      },
      {
        q: "Who owns the source code and the domain?",
        a: "You do, and it is specified in the contract.",
      },
      {
        q: "Do you offer support after delivery?",
        a: "Yes, there is a support period and {{website maintenance|/services/maintenance}}.",
      },
      {
        q: "Do you build multilingual websites?",
        a: "Yes, with a correct URL structure, hreflang and right-to-left / left-to-right support: {{multilingual website design|/web-design/multilingual}}.",
      },
      {
        q: "Is an idea enough if I have no design yet?",
        a: "Yes. In the needs-analysis meeting we turn the idea into a site map and a design.",
      },
      {
        q: "How do we get started?",
        a: "Fill in the free consultation form or call us: {{Contact Arano|/contact}}.",
      },
    ],
  },

  finalCta: {
    title: "Start right now",
    text: "Want a website that is both professional and easy to find?",
    button: "Get a free consultation with the Arano team",
  },
};
