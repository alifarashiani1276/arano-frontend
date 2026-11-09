// English versions of the small data files: services (home hub tags), team, projects, blog categories.
// Same ids / slugs as the Persian sources; only text fields are overridden.

export const EN_SERVICES = {
  frontend: {
    title: "Frontend Design & Development",
    description:
      "Modern, fast and fully responsive interfaces — from landing pages and company sites to professional, interactive web apps.",
  },
  backend: {
    title: "Backend, API & Database",
    description:
      "Project logic, APIs, authentication, service integration and database design that fit the real needs of your product.",
  },
  design: {
    title: "UI/UX & Graphic Design",
    description:
      "User interface and experience design in Figma, plus posters and graphic elements with a focus on a professional look and visual identity.",
  },
  products: {
    title: "Full Project Delivery, 0 to 100",
    description:
      "Just an idea is enough: discovery, design, development, integration, testing and launch preparation in one seamless process.",
  },
};

export const EN_TEAM = {
  frontend: {
    name: "Ali Farashiani",
    role: "Frontend & Full-Stack",
    bio: "Building modern, interactive interfaces and connecting the different parts of a product, with a focus on user experience, clean structure and complete web delivery.",
    links: [{ label: "GitHub" }],
  },
  backend: {
    name: "Reza Navidian",
    role: "Backend, Database & Security",
    bio: "Implementing server-side logic, APIs and database structure, aiming for an orderly, dependable infrastructure that fits the project's needs.",
  },
  design: {
    name: "Ashkan Arad",
    role: "Figma, Poster & Graphic Design",
    bio: "Designing visual interfaces, Figma pages, posters and graphic elements so a project doesn't just work correctly but also looks professional and distinctive.",
  },
};

export const EN_PROJECTS = {
  1: {
    title: "Freelance Platform",
    description:
      "A personal freelance portfolio site presenting services, projects and a direct line to clients, with a custom backend that has 3 user roles (client, freelancer and admin) and manages projects, payments and messages.",
    categoryLabel: "Website",
  },
  2: {
    title: "\"Sofreh\" Online Food Ordering",
    description:
      "A restaurant website with a categorized menu, a shopping cart and a simple online food-ordering flow.",
    categoryLabel: "Restaurant",
  },
  3: {
    title: "Hotel Booking App",
    description:
      "A hotel booking web app with room search, detail pages and reservations in one smooth, map-based experience.",
    categoryLabel: "Online Booking",
  },
  4: {
    title: "Food Showcase Website",
    description:
      "A vanilla JavaScript version of the Sofreh site, built at a client's request without any library or framework.",
    categoryLabel: "Restaurant",
  },
  5: {
    title: "Bookstore Website",
    description:
      "A vanilla JavaScript website built at a client's request without any library or framework.",
    categoryLabel: "Bookstore",
  },
};

export const EN_BLOG_CATEGORIES = {
  frontend: {
    name: "Frontend Development",
    short: "React, interfaces, performance and the browser experience",
    description:
      "Expert articles on frontend development: building interfaces with React, component architecture, performance optimization and the in-browser user experience.",
  },
  backend: {
    name: "Backend, API & Database",
    short: "Laravel, API design, security and databases",
    description:
      "Expert backend articles: API design, authentication and security, server architecture and working with databases in real projects.",
  },
  "ui-ux": {
    name: "UI/UX Design",
    short: "Interface design, user experience and visual identity",
    description:
      "Articles on interface and user experience design: design principles, design systems, visual identity and design decisions in digital products.",
  },
  "website-design": {
    name: "Website Design",
    short: "Choosing, designing and launching all kinds of websites",
    description:
      "Articles on designing and launching all kinds of websites — corporate, e-commerce, personal, landing pages and portals — from choosing a path to delivery.",
  },
  seo: {
    name: "SEO & Optimization",
    short: "Getting found on Google and technical site SEO",
    description:
      "Articles on SEO and site optimization: technical SEO, content structure, getting found in search engines and measuring results.",
  },
  performance: {
    name: "Speed & Performance",
    short: "Load speed, Core Web Vitals and reliability",
    description:
      "Articles on website speed and performance: load optimization, Core Web Vitals, caching and service reliability.",
  },
  "project-management": {
    name: "Project Management & Delivery",
    short: "From idea to deployment, maintenance and support",
    description:
      "Articles on managing and delivering software projects: estimation, collaboration process, staged delivery, deployment and maintenance.",
  },
};

export const EN_GROUPS = {
  main: {
    title: "Core Services",
    description:
      "The four main ways of working with Arano: from a single focused piece to full project delivery.",
  },
  "web-design": {
    title: "Website Design by Type",
    description:
      "For every kind of business, a site built around the needs of that field.",
  },
  extra: {
    title: "Complementary Services",
    description:
      "Services that make your site more visible and more reliable after it is built.",
  },
};
