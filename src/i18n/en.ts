// Every string the public site shows, in English. es.ts must have the same shape; the
// Dictionary type below makes the compiler hold it to that.
//
// Headings with a highlighted phrase are split into before / highlight / after so each
// language can put the emphasis where its own word order needs it.

export const en = {
  meta: {
    home: {
      title: 'Bezikee - Software Development Agency',
      description:
        'Bezikee is a software development agency building websites, mobile apps and custom software that help businesses across Europe grow.',
    },
    services: {
      title: 'Services & Pricing - Bezikee',
      description:
        'Web development, mobile apps, custom software and UI/UX design. See how we work and choose the package that fits your business.',
    },
    about: {
      title: 'About Us - Bezikee',
      description:
        'Bezikee is a new software development agency helping businesses get well-built websites, apps and custom software. Learn what drives us.',
    },
    contact: {
      title: 'Contact - Bezikee',
      description:
        'Tell us about your project. Get in touch with Bezikee to discuss websites, apps and custom software for your business.',
    },
    notFound: {
      title: 'Page Not Found - Bezikee',
      description: "The page you're looking for doesn't exist or has been moved.",
    },
    ogTagline: 'Software Development Agency',
  },

  nav: {
    home: 'Home',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    getStarted: 'Get Started',
    toggleMenu: 'Toggle menu',
    language: 'Language',
  },

  footer: {
    tagline: 'Building digital products that drive growth for businesses across Europe.',
    services: 'Services',
    webDevelopment: 'Web Development',
    mobileApps: 'Mobile Apps',
    customSoftware: 'Custom Software',
    uiux: 'UI/UX Design',
    company: 'Company',
    aboutUs: 'About Us',
    contact: 'Contact',
    contactHeading: 'Contact',
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },

  common: {
    mostPopular: 'MOST POPULAR',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
  },

  home: {
    badge: 'Software Development Agency',
    hero: { before: 'We Build Digital Products That ', highlight: 'Drive Growth', after: '' },
    heroText:
      'From simple websites to complex applications, we transform your ideas into powerful digital solutions that attract customers and scale your business.',
    viewPackages: 'View Our Packages',
    servicesEyebrow: 'OUR SERVICES',
    servicesTitle: 'What We Do Best',
    servicesText: 'We specialize in creating digital solutions tailored to your business needs',
    services: [
      {
        title: 'Web Development',
        description: 'Custom websites built with modern technologies that are fast, secure, and optimized for conversions.',
      },
      {
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile applications that provide seamless user experiences on any device.',
      },
      {
        title: 'Custom Software',
        description: 'Bespoke software solutions designed to automate processes and solve complex business challenges.',
      },
    ],
    viewAllServices: 'View All Services',
    pricingEyebrow: 'PRICING',
    pricingTitle: 'Choose Your Package',
    pricingText: 'Transparent pricing with no hidden fees. Pick the package that fits your needs.',
    packages: [
      {
        name: 'Starter',
        price: '€500',
        suffix: 'one-time',
        description: 'Perfect for small businesses and startups who need a professional online presence.',
        features: ['Up to 5 pages', 'Responsive design', 'Contact form integration', 'SEO optimization', '2 weeks delivery'],
      },
      {
        name: 'Professional',
        price: '€1,000',
        suffix: 'one-time',
        description: 'For growing businesses that need a custom website with advanced functionality.',
        features: [
          'Up to 15 pages',
          'Custom design & branding',
          'CMS integration',
          'Blog functionality',
          'Analytics dashboard',
          '3 months support',
          '4 weeks delivery',
        ],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        suffix: 'pricing',
        description: 'For complex applications, mobile apps, and enterprise-level projects with custom requirements.',
        features: [
          'Unlimited pages & features',
          'Mobile app development',
          'Custom backend & APIs',
          'Database architecture',
          'Third-party integrations',
          'Dedicated project manager',
          '12 months priority support',
        ],
      },
    ],
    cta: {
      title: { before: 'Ready to ', highlight: 'Transform', after: ' Your Business?' },
      description: "Let's discuss your project and find the perfect solution for your needs. Get a free consultation today.",
      primary: 'Start Your Project',
      secondary: 'Schedule a Call',
    },
  },

  standards: {
    orbit: ['Performance', 'Security', 'Responsive', 'SEO-ready', 'Accessibility', 'Scalability', 'Clean code', 'Support'],
    eyebrow: 'OUR APPROACH',
    title: 'Any Stack. Same Standards.',
    text:
      "We're not tied to one framework or platform. We choose the technologies that fit your project, your team and your budget, and hold every build to the same standards.",
    points: [
      { label: 'Right fit', text: 'Tools chosen for your goals, not our habits' },
      { label: 'Fast', text: 'Quick to load and smooth to use on any device' },
      { label: 'Secure', text: 'Best practices built in from the first commit' },
      { label: 'Maintainable', text: 'Clean, documented code any developer can pick up' },
    ],
  },

  services: {
    eyebrow: 'OUR SERVICES',
    title: 'Digital Solutions for Every Business Need',
    text: 'From concept to launch, we provide end-to-end development services that help businesses thrive in the digital age.',
    details: [
      {
        title: 'Web Development',
        description: 'We build fast, responsive, and SEO-optimized websites that convert visitors into customers.',
        features: [
          'Custom website design & development',
          'E-commerce platforms',
          'Progressive Web Apps (PWA)',
          'Content Management Systems',
          'Landing pages & marketing sites',
          'Website optimization & performance',
        ],
      },
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications that provide exceptional user experiences.',
        features: [
          'iOS app development',
          'Android app development',
          'Cross-platform solutions (React Native)',
          'App Store optimization',
          'Push notifications & analytics',
          'Ongoing maintenance & updates',
        ],
      },
      {
        title: 'Custom Software',
        description: 'Bespoke software solutions designed to streamline your operations and solve complex challenges.',
        features: [
          'Enterprise applications',
          'Business process automation',
          'API development & integration',
          'Database design & management',
          'Cloud solutions & migration',
          'Legacy system modernization',
        ],
      },
      {
        title: 'UI/UX Design',
        description: 'Beautiful, intuitive designs that delight users and drive engagement.',
        features: [
          'User research & personas',
          'Wireframing & prototyping',
          'Visual design & branding',
          'Interaction design',
          'Usability testing',
          'Design systems',
        ],
      },
      {
        title: 'Backend Development',
        description: 'Robust, scalable backend systems that power your applications reliably.',
        features: [
          'RESTful API development',
          'GraphQL implementations',
          'Microservices architecture',
          'Real-time applications',
          'Third-party integrations',
          'Performance optimization',
        ],
      },
      {
        title: 'Consulting & Strategy',
        description: 'Expert guidance to help you make informed technology decisions.',
        features: [
          'Technical consulting',
          'Digital transformation strategy',
          'Technology stack assessment',
          'Security audits',
          'Code reviews',
          'Team augmentation',
        ],
      },
    ],
    processEyebrow: 'OUR PROCESS',
    processTitle: 'How We Work',
    process: [
      {
        title: 'Discovery',
        description:
          'We start by understanding your business, goals, and target audience. This phase includes stakeholder interviews, market research, and requirement gathering.',
      },
      {
        title: 'Planning',
        description:
          "Based on our findings, we create a detailed project plan, technical specifications, and timeline. You'll know exactly what to expect and when.",
      },
      {
        title: 'Design',
        description:
          "Our designers create wireframes and visual designs that align with your brand. We iterate based on your feedback until you're completely satisfied.",
      },
      {
        title: 'Development',
        description:
          'Our engineers bring the designs to life using clean, maintainable code. We follow best practices and industry standards throughout.',
      },
      {
        title: 'Testing',
        description:
          'Rigorous testing ensures your product works flawlessly across all devices and scenarios. We catch and fix issues before launch.',
      },
      {
        title: 'Launch & Support',
        description:
          'We handle deployment and provide ongoing support to ensure your product continues to perform optimally post-launch.',
      },
    ],
    pricingEyebrow: 'PRICING',
    pricingTitle: 'Transparent Pricing',
    pricingText: 'Choose the package that fits your needs',
    packages: [
      {
        name: 'Starter',
        price: '€500',
        description: 'Simple static website',
        features: ['Up to 5 pages', 'Responsive design', 'Contact form', 'SEO optimization', '2 weeks delivery'],
      },
      {
        name: 'Professional',
        price: '€1,000',
        description: 'Custom website with CMS',
        features: ['Up to 15 pages', 'Custom design', 'CMS integration', 'Blog functionality', 'Analytics', '3 months support'],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Complex applications',
        features: ['Unlimited features', 'Mobile app development', 'Custom backend', 'Database architecture', '12 months support'],
      },
    ],
    cta: {
      title: { before: 'Ready to Start Your ', highlight: 'Project', after: '?' },
      description: "Let's discuss how we can help bring your vision to life.",
      primary: 'Get a Free Quote',
    },
  },

  about: {
    eyebrow: 'ABOUT US',
    title: "We're a Team of Digital Craftspeople",
    text:
      'Bezikee is a new software development agency built on a simple idea: every business deserves digital products that are well designed, well built and actually help it grow.',
    storyEyebrow: 'OUR STORY',
    storyTitle: 'From Passion to Purpose',
    story: [
      'Bezikee started with a simple belief: every business deserves access to high-quality digital solutions, regardless of size or budget.',
      "Too often, small and medium businesses are priced out of professional development or handed a template that doesn't fit how they work. We started Bezikee to close that gap.",
      "We're just getting started, and our first clients get the most out of it: our full attention on every project, clear pricing agreed upfront, and a team determined to prove what it can build.",
    ],
    valuesEyebrow: 'OUR VALUES',
    valuesTitle: 'What Drives Us',
    values: [
      {
        title: 'Results-Driven',
        description:
          'We measure success by the results we deliver. Every line of code, every design decision is made with your business goals in mind.',
      },
      {
        title: 'Client-Focused',
        description:
          'Your success is our success. We build lasting relationships through transparency, communication, and genuine care for your project.',
      },
      {
        title: 'Innovation',
        description:
          'We stay ahead of the curve, constantly learning and adopting new technologies to give you a competitive edge.',
      },
    ],
    whyEyebrow: 'WHY CHOOSE US',
    whyTitle: 'What Sets Us Apart',
    why: [
      {
        title: 'Dedicated Team',
        description: 'You get a dedicated team that knows your project inside and out, not a rotating cast of developers.',
      },
      {
        title: 'Quality Guaranteed',
        description: "We don't cut corners. Every project goes through rigorous testing before delivery.",
      },
      {
        title: 'European Expertise',
        description: 'We understand the European market, regulations, and business culture.',
      },
      {
        title: 'Fast Turnaround',
        description:
          'Clear milestones and realistic timelines agreed before we start, so you always know when to expect delivery.',
      },
    ],
    cta: {
      title: { before: "Let's Work ", highlight: 'Together', after: '' },
      description: "Have an idea or a project in mind? Let's talk about how we can build it together.",
      primary: 'Start a Conversation',
    },
  },

  contact: {
    eyebrow: 'GET IN TOUCH',
    title: "Let's Build Something Amazing Together",
    text:
      "Have a project in mind? We'd love to hear about it. Fill out the form below and we'll get back to you within 24 hours.",
    infoTitle: 'Contact Information',
    infoText: 'Ready to start your project? Get in touch with us through any of these channels.',
    email: 'Email',
    formTitle: 'Send Us a Message',
    fields: {
      name: 'Full Name',
      namePlaceholder: 'John Doe',
      email: 'Email Address',
      emailPlaceholder: 'john@example.com',
      company: 'Company Name',
      companyPlaceholder: 'Your Company',
      phone: 'Phone Number',
      phonePlaceholder: '+34 612 345 678',
      service: 'Service Interested In',
      servicePlaceholder: 'Select a service',
      budget: 'Estimated Budget',
      budgetPlaceholder: 'Select budget range',
      message: 'Project Details',
      messagePlaceholder: 'Tell us about your project, goals, and timeline...',
    },
    // Labels only. The values the form sends stay in English whatever the page language
    // (see Contact.tsx), because they end up in our own inbox.
    serviceOptions: {
      'Web Development': 'Web Development',
      'Mobile App Development': 'Mobile App Development',
      'Custom Software': 'Custom Software',
      'UI/UX Design': 'UI/UX Design',
      Consulting: 'Consulting',
      Other: 'Other',
    },
    budgetOptions: {
      '€500 - €1,000': '€500 - €1,000',
      '€1,000 - €5,000': '€1,000 - €5,000',
      '€5,000 - €10,000': '€5,000 - €10,000',
      '€10,000 - €25,000': '€10,000 - €25,000',
      '€25,000+': '€25,000+',
    },
    errors: {
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      messageRequired: 'Message is required',
      sendFailed: "We couldn't send your message just now.",
      emailUsDirectly: 'Please email us directly at',
    },
    honeypot: 'Leave this field empty',
    sending: 'Sending...',
    send: 'Send Message',
    consent: 'By submitting this form, you agree to our Privacy Policy and Terms of Service.',
    sentTitle: 'Message Sent!',
    sentText: "Thank you for reaching out! We've received your message and will get back to you within 24 hours.",
    sendAnother: 'Send Another Message',
  },

  notFound: {
    title: 'Page Not Found',
    text: "The page you're looking for doesn't exist or has been moved.",
    goHome: 'Go Home',
  },
}

export type Dictionary = typeof en
