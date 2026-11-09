// English text of the 22 service pages, keyed by slug (matches src/data/servicePages.js).
// Only text lives here: icon, group, path, related, projects and tech come from the Persian source.
// faq is written as [question, answer] pairs and expanded below.
// tech: only the entries that were Persian are overridden (full list replaces the Persian one).

const RAW = {
  frontend: {
    name: "Frontend Design & Development",
    short: "Modern, fast and fully responsive interfaces — from landing pages and company sites to professional, interactive web apps.",
    description: "Frontend design and development with React and Tailwind: fast, responsive, SEO-friendly interfaces for your website or web app. Free consultation.",
    about: "The frontend is what users see and touch. We build component-based, responsive interfaces that feel smooth on mobile and desktop, load fast and stay crawlable for search engines.",
    faq: [
      ["Which technologies do you use for the frontend?", "Mostly React, Tailwind CSS and Vite, plus supporting tools such as React Router and TanStack Query depending on the project."],
      ["Can you implement a Figma design?", "Yes. We implement your Figma design precisely and responsively; if you don't have a design, our design team can prepare one."],
      ["Does the frontend connect to a backend?", "Yes. API integration, authentication and error handling are part of the job; the backend can be built by us or by your own team."],
    ],
  },
  "backend-api": {
    name: "Backend, API & Database",
    short: "Project logic, APIs, authentication, service integration and database design that fit the real needs of your product.",
    description: "Backend, API and database design and development with Laravel and Node.js: secure authentication, a sound data structure and easy frontend integration.",
    about: "The backend is the brain of a project: business logic, user access and data storage all happen there. We write documented, extensible APIs and design the database around the real needs of your product.",
    faq: [
      ["Do you use Laravel or Node.js for the backend?", "We work with both. The choice depends on the type of project, the maintenance team and whether you need development speed or future scale."],
      ["How are API security and authentication handled?", "With standard methods: tokens, role-based access, input validation and rate limiting."],
      ["Do you document the API?", "Yes. Endpoint documentation is delivered with the project so frontend and maintenance teams can use it easily."],
    ],
  },
  "ui-ux-graphic": {
    name: "UI/UX & Graphic Design",
    short: "User interface and experience design in Figma, plus posters and graphic elements with a focus on a professional look and visual identity.",
    description: "UI/UX design, Figma interfaces, posters and graphics: a professional look and smooth user experience that reflects your brand identity.",
    about: "Good design isn't just beautiful; it shortens the user's path and makes decisions easy. We design everything from page structure to visual details in Figma and hand it over ready for developers.",
    faq: [
      ["What is the deliverable of UI/UX design?", "A tidy Figma file with defined components, colors and fonts for mobile and desktop, ready to hand over to the development team."],
      ["Do you do design only, without implementation?", "Yes, design can be ordered on its own. If you like, we can implement the same design too."],
      ["Do you also design posters and graphic elements?", "Yes. Posters, banners and graphic elements consistent with the project's visual identity are part of this service."],
    ],
  },
  "full-project": {
    name: "Full Project Delivery, 0 to 100",
    short: "Just an idea is enough: discovery, design, development, integration, testing and launch preparation in one seamless process.",
    description: "Project delivery from 0 to 100: discovery, design, frontend, backend, testing and deployment in one seamless process — just bring your idea.",
    about: "If you only have an idea, you don't need to coordinate several teams. We clarify the requirements, move design and development forward together, and launch a tested product on your server or a suitable host.",
    faq: [
      ["What stages does a full 0-to-100 project include?", "Discovery, UI/UX design, frontend and backend development, testing, deployment and documentation handover, with reports and demos at each stage."],
      ["Can I start with just a rough idea?", "Yes. In the consultation session we turn the idea into clear, prioritized requirements."],
      ["Do you offer support after delivery?", "Yes, you can add the support and maintenance service so fixes and updates continue."],
    ],
  },
  store: {
    name: "E-commerce Website Design",
    short: "A fast online store with a cart, online payment and an admin panel for products and orders.",
    description: "E-commerce website design with a shopping cart, payment gateway and product management panel: fast, responsive and SEO-ready to grow online sales.",
    about: "An online store must show products in seconds and make buying easy. We design categories, search, cart and checkout so that users drop off less along the purchase path.",
    tech: ["React", "Laravel", "Payment Gateway", "MySQL"],
    faq: [
      ["Does e-commerce design include a payment gateway?", "Yes, integration with reputable Iranian payment gateways is part of building the store."],
      ["Can I manage the products myself?", "Yes, an admin panel for adding products, prices and stock and tracking orders is included."],
      ["Is the store optimized for SEO?", "URL structure, titles and descriptions for each product and category, schema and site speed are designed with SEO in mind from the start."],
    ],
  },
  corporate: {
    name: "Corporate Website Design",
    short: "An official, credible site that introduces your company, services and portfolio and attracts customers.",
    description: "Professional corporate website design with services, portfolio and a contact form: it raises your brand's credibility and brings in new customers.",
    about: "A corporate site is the first thing customers see before contacting you. We arrange content and design so that your services, track record and contact options are clear within a few scrolls.",
    faq: [
      ["What pages does a corporate site usually have?", "Home, About, Services, Portfolio, Team and Contact; depending on your needs, a blog and specialized pages can be added."],
      ["Is a logo and visual identity designed too?", "If needed, we offer logo and brand identity design as a separate service alongside the project."],
      ["Do I have to write the site content myself?", "You can provide the text yourself or we can coordinate with a content team; page structures are prepared for the text in advance."],
    ],
  },
  personal: {
    name: "Personal Website & Online Resume",
    short: "A personal website or online resume to showcase your skills, projects and ways to contact you.",
    description: "Personal website and online resume design to present your skills, portfolio and contact details; ideal for freelancers, specialists and job seekers.",
    about: "A personal site means full control over the image of you that appears online. We present skills and projects in a tidy, fast way so a client or visitor can decide without extra searching.",
    faq: [
      ["How is a personal website different from a social profile?", "You have full control over its look, structure and address, and it can rank on Google for your name and expertise."],
      ["Can I update the portfolio myself?", "Yes, the data structure is prepared so adding a new project is simple."],
      ["Can my PDF resume be placed on the site?", "Yes, a resume download button and sections for skills and work history are planned in the design."],
    ],
  },
  wordpress: {
    name: "WordPress Website Design",
    short: "A manageable, fast and secure WordPress site, ideal for people who want to update content themselves.",
    description: "Fast, secure WordPress website design with a simple content management panel; suited to content, corporate and small store websites.",
    about: "WordPress suits people who want to manage posts and pages themselves without technical knowledge. We keep plugins to a minimum so the site stays light and secure.",
    tech: ["WordPress", "PHP", "Elementor", "MySQL"],
    faq: [
      ["Which businesses is a WordPress site suited to?", "Content, corporate and service sites and small stores that need simple content management."],
      ["Do you use a ready-made theme or a custom one?", "Both are possible. For a unique look you can choose the custom WordPress theme service."],
      ["How are WordPress security and speed maintained?", "With a limited set of trusted plugins, regular updates, proper caching and image optimization."],
    ],
  },
  custom: {
    name: "Custom Website Design",
    short: "A custom site or web app built exactly around your needs, without the limits of ready-made templates.",
    description: "Custom website design coded from scratch: high speed, tailor-made features and a scalable architecture without the limits of ready-made templates.",
    about: "When your needs don't fit ready-made templates, a custom site is the right choice. We write the design and code from the ground up around your business process so no feature is limited or unnecessary.",
    faq: [
      ["How is a custom site different from a ready-made template?", "Design and features are built exactly to your needs, with no extra code and no template limits."],
      ["Can a custom site grow later?", "Yes, a clean architecture and documentation let new features be added without a full rewrite."],
      ["Is an admin panel built as well?", "If needed, we design a custom admin panel with different access levels."],
    ],
  },
  landing: {
    name: "Landing Page Design",
    short: "A focused landing page that introduces a product or campaign and turns visitors into customers.",
    description: "Professional landing page design with a conversion-focused structure; suited to ads, product launches, sign-ups and lead collection.",
    about: "A landing page has one goal, and every element is arranged for it: sign-up, contact or purchase. Fast loading and a clear message are the most important success factors.",
    faq: [
      ["When is a landing page useful?", "For advertising, introducing a specific product or service, and registering for a course or event."],
      ["How long does a landing page take to build?", "It depends on the amount of content and design; after the consultation session we give an exact schedule."],
      ["Does it have a sign-up or contact form?", "Yes, forms and call-to-action (CTA) buttons are placed at the right spots on the page."],
    ],
  },
  clinic: {
    name: "Medical & Clinic Website Design",
    short: "A website for practices, clinics and medical centers, with doctor profiles, services and online appointment booking.",
    description: "Medical and clinic website design with doctor profiles, services, online appointments and an articles section; trustworthy and suited to local SEO.",
    about: "Patients check a website before visiting. We present doctors, services and contact options clearly and respectfully, and put appointment booking in the most accessible spot.",
    tech: ["React", "Laravel", "Appointments", "Local SEO"],
    faq: [
      ["Does a clinic site have online appointments?", "Yes, a form or booking system suited to your center's needs is added."],
      ["How are doctors and services presented?", "Each doctor and service gets its own page or card, so it's clear to both users and Google."],
      ["Is the site optimized for local search?", "Address, map and contact details are placed with a structure suited to local SEO."],
    ],
  },
  "real-estate": {
    name: "Real Estate Website Design",
    short: "A website for real estate agents and agencies with property listings, advanced search and price and area filters.",
    description: "Real estate website design with property listings, advanced filters, a map and a consultation request form; suited to agents and property agencies.",
    about: "Property buyers filter and compare quickly. We design search, image galleries and each property's details so finding the right option is easy for the user.",
    tech: ["React", "Laravel", "MySQL", "Map"],
    faq: [
      ["Can I manage the property listings myself?", "Yes, an admin panel for adding, editing and deleting properties with their images is included."],
      ["Are there property search and filters?", "Filtering by type, price, area and neighborhood can be implemented."],
      ["Can a property's location be shown on a map?", "Yes, each property's location is shown on a map."],
    ],
  },
  education: {
    name: "Education & Online Course Website Design",
    short: "An education platform with a course catalog, user registration, video and a student or instructor panel.",
    description: "Education and online course website design with registration, payment, video playback and a user panel; suited to instructors, academies and training centers.",
    about: "Online education needs a smooth learning experience as well as content. We design registration, course access and progress tracking in a simple, dependable user panel.",
    tech: ["React", "Laravel", "MySQL", "Online Payment"],
    faq: [
      ["Are online registration and course payment possible?", "Yes, user registration and payment gateway integration for selling courses are implemented."],
      ["What features do the student and instructor panels have?", "Students see their courses and instructors manage content and users; details are decided together."],
      ["Where are the course videos stored?", "Depending on budget and traffic, on a dedicated server or a video hosting service; we recommend one in the consultation."],
    ],
  },
  restaurant: {
    name: "Restaurant & Cafe Website Design",
    short: "A restaurant or cafe site with a categorized menu, online ordering, and an introduction to the space and location.",
    description: "Restaurant and cafe website design with a digital menu, online ordering and an image gallery; attractive, fast and mobile-friendly.",
    about: "Restaurant customers mostly look up the menu and address on their phones. We show the menu in a readable, fast way and keep the path to ordering or booking a table short.",
    faq: [
      ["Is a QR-code digital menu possible?", "Yes, the menu is optimized for mobile and can be made available to customers via a QR code."],
      ["Can online food ordering be implemented?", "Yes, a cart and order placement can be implemented, like our \"Sofreh\" portfolio project."],
      ["Can I change menu prices and availability myself?", "Yes, a simple admin panel lets you update items and prices."],
    ],
  },
  industrial: {
    name: "Industrial & Factory Website Design",
    short: "A manufacturing and industrial site with a product catalog, production line overview and a price inquiry form.",
    description: "Industrial and factory website design with a product catalog, capability overview and a price inquiry form; suited to manufacturers and suppliers.",
    about: "Industrial customers look for assurance and precise technical information. We present products, certificates and production capabilities in an orderly way and make requesting a quote simple.",
    faq: [
      ["Can a product catalog be placed on the site?", "Yes, each product is shown with technical specifications and images, and the catalog file can be downloaded."],
      ["Is there a price inquiry form?", "Yes, an inquiry form is planned for each product or as a general form."],
      ["Can the site be multilingual?", "For exports and foreign customers, a multilingual version can be built."],
    ],
  },
  "portal-automation": {
    name: "Portal & Automation System Design",
    short: "Corporate portals and automation systems for managing users, requests and internal processes.",
    description: "Portal and office/organizational automation design with a user panel, access levels and reporting; it digitizes manual processes.",
    about: "Portals and automation remove repetitive work and make the request path clear. We design roles, permissions and reports around your organization's real structure.",
    faq: [
      ["What features can a corporate portal have?", "User management, request submission and tracking, notifications and reporting, based on the organization's needs."],
      ["Can user access levels be defined?", "Yes, roles and permissions are defined separately for each section."],
      ["Does it connect to existing systems?", "If there is an API or a connectable database, integration is reviewed and implemented."],
    ],
  },
  multilingual: {
    name: "Multilingual Website Design",
    short: "A multilingual site with right-to-left and left-to-right support and a separate URL and metadata for each language.",
    description: "Multilingual website design with RTL and LTR support, simple language switching and a separate SEO structure for each language; suited to export markets.",
    about: "A multilingual site is not just translated text; direction, font, URL and metadata must be set correctly for each language. We plan this into the project architecture from the start.",
    tech: ["React", "i18n", "RTL / LTR", "SEO"],
    faq: [
      ["Which languages can be supported?", "Any language whose font and translation are ready; both right-to-left and left-to-right directions are supported."],
      ["Is SEO set up separately for each language?", "Yes, the title, description and URL of each language are defined separately so it is indexed properly on Google."],
      ["Do you also translate the texts?", "We prepare the translation structure; the text can be supplied by you or a translator."],
    ],
  },
  seo: {
    name: "SEO & Website Optimization",
    short: "Technical and content SEO so your site gets found on Google with keywords relevant to your business.",
    description: "SEO and website optimization covering technical SEO, URL structure, schema, speed and content, to help your site rank in Google results.",
    about: "SEO starts with a sound site structure: stable URLs, unique titles and descriptions, internal linking and good mobile speed. We implement technical SEO and also define the path for content production.",
    faq: [
      ["What does technical SEO include?", "Title and meta setup, canonical tags, sitemap, schema, internal linking and speed optimization."],
      ["When will SEO results show?", "SEO is gradual; timing depends on keyword competition and the site's current state, and we don't promise a fixed number."],
      ["Do you register the site in Search Console?", "Yes, registering the site and submitting the sitemap in Google Search Console is part of the job."],
    ],
  },
  "branding-logo": {
    name: "Logo & Brand Identity Design",
    short: "Logo, brand colors and fonts, and a consistent visual identity set for web and print.",
    description: "Logo and brand identity design including logo, color palette, fonts and usage guidelines; consistent across your site, social media and print.",
    about: "Visual identity means the same feeling wherever your name appears. We design the logo and color palette around your brand's personality and deliver versions suited to web and print.",
    faq: [
      ["Which files does logo design deliver?", "Color and single-color versions, in vector and image formats for web and print."],
      ["Is brand identity just a logo?", "No; besides the logo, a color palette, fonts and guidelines for using them are defined."],
      ["Is the logo aligned with the website design?", "Yes, if you order both, the site's colors and design style are unified with the brand identity."],
    ],
  },
  maintenance: {
    name: "Website Support & Maintenance",
    short: "Support, updates, backups and bug fixing to keep your site stable and secure at all times.",
    description: "Website support and maintenance including updates, backups, bug fixing and security monitoring; your site stays available and secure.",
    about: "A site needs care after launch too: dependency updates, backups and fixes for sudden problems. With regular maintenance we prevent costly breakdowns.",
    faq: [
      ["What does website maintenance include?", "Updates, backups, bug fixing, uptime monitoring and minor changes."],
      ["Do you support sites you didn't build?", "After reviewing the code and infrastructure, in many cases yes; we'll check in the consultation session."],
      ["Is support monthly?", "The engagement model (monthly or one-off) is set based on your needs."],
    ],
  },
  "speed-optimization": {
    name: "Website Speed Optimization",
    short: "Load-speed and Core Web Vitals optimization for a better user experience and better Google rankings.",
    description: "Website speed optimization through image, code, caching and Core Web Vitals improvements; faster loading on mobile and better Google rankings.",
    about: "A mobile user waits a few seconds and then leaves. We measure and optimize images, fonts, scripts and caching so the site opens fast on phones too.",
    faq: [
      ["How is site speed measured?", "With tools such as PageSpeed Insights and Lighthouse and Core Web Vitals metrics, before and after optimization."],
      ["How does speed affect SEO?", "Speed and mobile experience are a ranking factor and directly affect the bounce rate."],
      ["Does optimization change the site's appearance?", "No; the look is preserved and only the loading method, image sizes and code get better."],
    ],
  },
  "wordpress-theme": {
    name: "Custom WordPress Theme Design",
    short: "A custom, light and fast WordPress theme built exactly to your design and brand identity.",
    description: "Custom WordPress theme design: light, fast and responsive to match your brand identity, with no extra code and SEO-friendly.",
    about: "Ready-made themes usually carry extra code and features that make the site heavy. A custom theme contains only what your brand needs, so the result is lighter and easier to manage.",
    faq: [
      ["How is a custom theme different from a ready-made one?", "It has no extra code, is lighter, and its look and structure are built exactly to your design."],
      ["Is content management like regular WordPress?", "Yes, with custom fields and a tidy structure, editing text and images stays simple for you."],
      ["Does theme design start from Figma?", "Yes, the design is approved first and then converted into a WordPress theme."],
    ],
  },
};

export const EN_SERVICE_PAGES = Object.fromEntries(
  Object.entries(RAW).map(([slug, { faq, ...rest }]) => [
    slug,
    { ...rest, faq: faq.map(([q, a]) => ({ q, a })) },
  ]),
);
