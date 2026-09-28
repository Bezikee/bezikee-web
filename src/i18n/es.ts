import type { Dictionary } from './en'

// Spanish copy. Written to read naturally rather than word for word from en.ts: neutral
// Spanish that works in Spain and Latin America, addressing the reader as "tú", and
// avoiding words and forms only one side of the Atlantic uses ("una web", vosotros,
// celular...).
// Prices use the Spanish format: the symbol after the amount and a dot for thousands.

export const es: Dictionary = {
  meta: {
    home: {
      title: 'Bezikee - Agencia de desarrollo de software',
      description:
        'Bezikee es una agencia de desarrollo de software. Creamos sitios web, apps móviles y software a medida que ayudan a crecer a empresas de toda Europa.',
    },
    services: {
      title: 'Servicios y precios - Bezikee',
      description:
        'Desarrollo web, apps móviles, software a medida y diseño UI/UX. Descubre cómo trabajamos y elige el paquete que mejor encaja con tu negocio.',
    },
    about: {
      title: 'Sobre nosotros - Bezikee',
      description:
        'Bezikee es una agencia de desarrollo de software nueva que ayuda a las empresas a tener sitios web, apps y software bien hechos. Conoce lo que nos mueve.',
    },
    contact: {
      title: 'Contacto - Bezikee',
      description:
        'Cuéntanos tu proyecto. Ponte en contacto con Bezikee para hablar de sitios web, apps y software a medida para tu negocio.',
    },
    notFound: {
      title: 'Página no encontrada - Bezikee',
      description: 'La página que buscas no existe o se ha movido.',
    },
    ogTagline: 'Agencia de desarrollo de software',
  },

  nav: {
    home: 'Inicio',
    services: 'Servicios',
    about: 'Nosotros',
    contact: 'Contacto',
    getStarted: 'Empezar',
    toggleMenu: 'Abrir o cerrar el menú',
    language: 'Idioma',
  },

  footer: {
    tagline: 'Creamos productos digitales que hacen crecer a empresas de toda Europa.',
    services: 'Servicios',
    webDevelopment: 'Desarrollo web',
    mobileApps: 'Apps móviles',
    customSoftware: 'Software a medida',
    uiux: 'Diseño UI/UX',
    company: 'Empresa',
    aboutUs: 'Sobre nosotros',
    contact: 'Contacto',
    contactHeading: 'Contacto',
    rights: 'Todos los derechos reservados.',
    privacy: 'Política de privacidad',
    terms: 'Términos del servicio',
  },

  common: {
    mostPopular: 'EL MÁS ELEGIDO',
    getStarted: 'Empezar',
    contactUs: 'Contáctanos',
  },

  home: {
    badge: 'Agencia de desarrollo de software',
    hero: { before: 'Creamos productos digitales que ', highlight: 'impulsan tu negocio', after: '' },
    heroText:
      'Desde sitios web sencillos hasta aplicaciones complejas, convertimos tus ideas en soluciones digitales que atraen clientes y hacen crecer tu negocio.',
    viewPackages: 'Ver nuestros paquetes',
    servicesEyebrow: 'SERVICIOS',
    servicesTitle: 'Lo que mejor hacemos',
    servicesText: 'Creamos soluciones digitales adaptadas a lo que tu negocio necesita',
    services: [
      {
        title: 'Desarrollo web',
        description: 'Sitios web a medida con tecnología actual: rápidos, seguros y pensados para convertir visitas en clientes.',
      },
      {
        title: 'Apps móviles',
        description: 'Aplicaciones nativas y multiplataforma que ofrecen una experiencia fluida en cualquier dispositivo.',
      },
      {
        title: 'Software a medida',
        description: 'Software hecho a medida para automatizar procesos y resolver los retos más complejos de tu negocio.',
      },
    ],
    viewAllServices: 'Ver todos los servicios',
    pricingEyebrow: 'PRECIOS',
    pricingTitle: 'Elige tu paquete',
    pricingText: 'Precios claros y sin costes ocultos. Elige el paquete que mejor se adapta a ti.',
    packages: [
      {
        name: 'Básico',
        price: '500 €',
        suffix: 'pago único',
        description: 'Ideal para pequeños negocios y startups que necesitan una presencia online profesional.',
        features: ['Hasta 5 páginas', 'Diseño adaptable a móvil', 'Formulario de contacto', 'Optimización SEO', 'Entrega en 2 semanas'],
      },
      {
        name: 'Profesional',
        price: '1.000 €',
        suffix: 'pago único',
        description: 'Para negocios en crecimiento que necesitan un sitio web a medida con funciones avanzadas.',
        features: [
          'Hasta 15 páginas',
          'Diseño e imagen de marca a medida',
          'Gestor de contenidos (CMS)',
          'Blog',
          'Panel de analítica',
          '3 meses de soporte',
          'Entrega en 4 semanas',
        ],
      },
      {
        name: 'Empresa',
        price: 'A medida',
        suffix: '',
        description: 'Para aplicaciones complejas, apps móviles y proyectos de empresa con requisitos específicos.',
        features: [
          'Páginas y funciones ilimitadas',
          'Desarrollo de apps móviles',
          'Backend y APIs a medida',
          'Arquitectura de bases de datos',
          'Integraciones con terceros',
          'Jefe de proyecto dedicado',
          '12 meses de soporte prioritario',
        ],
      },
    ],
    cta: {
      title: { before: '¿Listo para ', highlight: 'transformar', after: ' tu negocio?' },
      description: 'Hablemos de tu proyecto y encontremos la mejor solución para ti. Pide hoy tu consulta gratuita.',
      primary: 'Empieza tu proyecto',
      secondary: 'Reserva una llamada',
    },
  },

  standards: {
    orbit: ['Rendimiento', 'Seguridad', 'Adaptable', 'SEO', 'Accesibilidad', 'Escalabilidad', 'Código limpio', 'Soporte'],
    eyebrow: 'NUESTRO ENFOQUE',
    title: 'Cualquier tecnología. El mismo nivel.',
    text:
      'No estamos atados a ningún framework ni plataforma. Elegimos la tecnología que encaja con tu proyecto, tu equipo y tu presupuesto, y exigimos a cada proyecto el mismo nivel de calidad.',
    points: [
      { label: 'A tu medida', text: 'Herramientas elegidas por tus objetivos, no por costumbre' },
      { label: 'Rápido', text: 'Carga al instante y funciona con fluidez en cualquier dispositivo' },
      { label: 'Seguro', text: 'Buenas prácticas desde la primera línea de código' },
      { label: 'Mantenible', text: 'Código limpio y documentado que cualquier desarrollador puede retomar' },
    ],
  },

  services: {
    eyebrow: 'SERVICIOS',
    title: 'Soluciones digitales para cada necesidad de tu negocio',
    text: 'De la idea al lanzamiento, nos encargamos de todo el desarrollo para que tu negocio crezca en el mundo digital.',
    details: [
      {
        title: 'Desarrollo web',
        description: 'Creamos sitios web rápidos, adaptables y optimizados para SEO que convierten visitas en clientes.',
        features: [
          'Diseño y desarrollo web a medida',
          'Tiendas online',
          'Aplicaciones web progresivas (PWA)',
          'Gestores de contenidos (CMS)',
          'Landing pages y sitios de marketing',
          'Optimización y rendimiento web',
        ],
      },
      {
        title: 'Desarrollo de apps móviles',
        description: 'Aplicaciones nativas y multiplataforma con una experiencia de usuario excelente.',
        features: [
          'Desarrollo de apps para iOS',
          'Desarrollo de apps para Android',
          'Apps multiplataforma (React Native)',
          'Posicionamiento en tiendas de apps (ASO)',
          'Notificaciones push y analítica',
          'Mantenimiento y actualizaciones continuas',
        ],
      },
      {
        title: 'Software a medida',
        description: 'Software hecho a medida para agilizar tu operativa y resolver retos complejos.',
        features: [
          'Aplicaciones empresariales',
          'Automatización de procesos',
          'Desarrollo e integración de APIs',
          'Diseño y gestión de bases de datos',
          'Soluciones y migración a la nube',
          'Modernización de sistemas heredados',
        ],
      },
      {
        title: 'Diseño UI/UX',
        description: 'Diseños atractivos e intuitivos que enamoran a los usuarios y aumentan su implicación.',
        features: [
          'Investigación de usuarios y perfiles (personas)',
          'Wireframes y prototipos',
          'Diseño visual e imagen de marca',
          'Diseño de interacción',
          'Pruebas de usabilidad',
          'Sistemas de diseño',
        ],
      },
      {
        title: 'Desarrollo backend',
        description: 'Sistemas backend robustos y escalables que hacen funcionar tus aplicaciones sin fallos.',
        features: [
          'Desarrollo de APIs REST',
          'Implementaciones con GraphQL',
          'Arquitectura de microservicios',
          'Aplicaciones en tiempo real',
          'Integraciones con terceros',
          'Optimización del rendimiento',
        ],
      },
      {
        title: 'Consultoría y estrategia',
        description: 'Asesoramiento experto para que tomes decisiones tecnológicas con criterio.',
        features: [
          'Consultoría técnica',
          'Estrategia de transformación digital',
          'Evaluación de tu stack tecnológico',
          'Auditorías de seguridad',
          'Revisiones de código',
          'Refuerzo de equipos',
        ],
      },
    ],
    processEyebrow: 'NUESTRO PROCESO',
    processTitle: 'Cómo trabajamos',
    process: [
      {
        title: 'Descubrimiento',
        description:
          'Empezamos por entender tu negocio, tus objetivos y tu público. En esta fase hablamos con las personas clave, analizamos el mercado y recogemos los requisitos.',
      },
      {
        title: 'Planificación',
        description:
          'Con lo aprendido, preparamos un plan de proyecto detallado, las especificaciones técnicas y un calendario. Sabrás exactamente qué esperar y cuándo.',
      },
      {
        title: 'Diseño',
        description:
          'Nuestros diseñadores crean wireframes y diseños visuales alineados con tu marca. Iteramos con tus comentarios hasta que estés totalmente satisfecho.',
      },
      {
        title: 'Desarrollo',
        description:
          'Nuestros desarrolladores dan vida a los diseños con código limpio y fácil de mantener, siguiendo en todo momento las buenas prácticas y los estándares del sector.',
      },
      {
        title: 'Pruebas',
        description:
          'Probamos a fondo para que tu producto funcione a la perfección en todos los dispositivos y situaciones. Detectamos y corregimos los fallos antes del lanzamiento.',
      },
      {
        title: 'Lanzamiento y soporte',
        description:
          'Nos encargamos de la puesta en marcha y te damos soporte continuo para que tu producto siga funcionando al máximo después del lanzamiento.',
      },
    ],
    pricingEyebrow: 'PRECIOS',
    pricingTitle: 'Precios transparentes',
    pricingText: 'Elige el paquete que mejor se adapta a ti',
    packages: [
      {
        name: 'Básico',
        price: '500 €',
        description: 'Sitio web estático sencillo',
        features: ['Hasta 5 páginas', 'Diseño adaptable a móvil', 'Formulario de contacto', 'Optimización SEO', 'Entrega en 2 semanas'],
      },
      {
        name: 'Profesional',
        price: '1.000 €',
        description: 'Sitio web a medida con gestor de contenidos',
        features: ['Hasta 15 páginas', 'Diseño a medida', 'Gestor de contenidos (CMS)', 'Blog', 'Analítica', '3 meses de soporte'],
      },
      {
        name: 'Empresa',
        price: 'A medida',
        description: 'Aplicaciones complejas',
        features: ['Funciones ilimitadas', 'Desarrollo de apps móviles', 'Backend a medida', 'Arquitectura de bases de datos', '12 meses de soporte'],
      },
    ],
    cta: {
      title: { before: '¿Listo para empezar tu ', highlight: 'proyecto', after: '?' },
      description: 'Hablemos de cómo podemos ayudarte a hacer realidad tu idea.',
      primary: 'Pide un presupuesto gratis',
    },
  },

  about: {
    eyebrow: 'SOBRE NOSOTROS',
    title: 'Somos artesanos de lo digital',
    text:
      'Bezikee es una agencia de desarrollo de software nueva que nace de una idea sencilla: todo negocio merece productos digitales bien diseñados, bien construidos y que de verdad le ayuden a crecer.',
    storyEyebrow: 'NUESTRA HISTORIA',
    storyTitle: 'De la pasión al propósito',
    story: [
      'Bezikee nació de una convicción sencilla: cualquier negocio, sea cual sea su tamaño o presupuesto, merece acceder a soluciones digitales de calidad.',
      'Con demasiada frecuencia, las pequeñas y medianas empresas no pueden pagar un desarrollo profesional o acaban con una plantilla que no se ajusta a su forma de trabajar. Creamos Bezikee para cambiar eso.',
      'Estamos empezando, y eso juega a favor de nuestros primeros clientes: toda nuestra atención en cada proyecto, precios claros acordados desde el principio y un equipo con muchas ganas de demostrar lo que sabe hacer.',
    ],
    valuesEyebrow: 'NUESTROS VALORES',
    valuesTitle: 'Lo que nos mueve',
    values: [
      {
        title: 'Orientados a resultados',
        description:
          'Medimos el éxito por los resultados que conseguimos. Cada línea de código y cada decisión de diseño se toman pensando en los objetivos de tu negocio.',
      },
      {
        title: 'El cliente en el centro',
        description:
          'Tu éxito es el nuestro. Construimos relaciones duraderas basadas en la transparencia, la comunicación y un interés real por tu proyecto.',
      },
      {
        title: 'Innovación',
        description:
          'Nos mantenemos a la vanguardia: aprendemos sin parar y adoptamos nuevas tecnologías para darte ventaja frente a tu competencia.',
      },
    ],
    whyEyebrow: 'POR QUÉ ELEGIRNOS',
    whyTitle: 'Qué nos hace diferentes',
    why: [
      {
        title: 'Equipo dedicado',
        description: 'Trabajas con un equipo dedicado que conoce tu proyecto a fondo, no con desarrolladores que cambian cada semana.',
      },
      {
        title: 'Calidad garantizada',
        description: 'No tomamos atajos. Cada proyecto pasa por pruebas exhaustivas antes de la entrega.',
      },
      {
        title: 'Experiencia europea',
        description: 'Conocemos el mercado europeo, su normativa y su cultura empresarial.',
      },
      {
        title: 'Entregas ágiles',
        description:
          'Hitos claros y plazos realistas acordados antes de empezar, para que siempre sepas cuándo llega cada entrega.',
      },
    ],
    cta: {
      title: { before: 'Trabajemos ', highlight: 'juntos', after: '' },
      description: '¿Tienes una idea o un proyecto en mente? Hablemos de cómo hacerlo realidad juntos.',
      primary: 'Hablemos',
    },
  },

  contact: {
    eyebrow: 'CONTACTO',
    title: 'Construyamos algo increíble juntos',
    text:
      '¿Tienes un proyecto en mente? Nos encantaría conocerlo. Completa el formulario y te responderemos en menos de 24 horas.',
    infoTitle: 'Datos de contacto',
    infoText: '¿Listo para empezar tu proyecto? Escríbenos y hablamos.',
    email: 'Email',
    formTitle: 'Envíanos un mensaje',
    fields: {
      name: 'Nombre completo',
      namePlaceholder: 'Ana García',
      email: 'Correo electrónico',
      emailPlaceholder: 'ana@ejemplo.com',
      company: 'Empresa',
      companyPlaceholder: 'Nombre de tu empresa',
      phone: 'Teléfono',
      phonePlaceholder: '+34 612 345 678',
      service: '¿Qué servicio te interesa?',
      servicePlaceholder: 'Elige un servicio',
      budget: 'Presupuesto estimado',
      budgetPlaceholder: 'Elige un rango',
      message: 'Detalles del proyecto',
      messagePlaceholder: 'Cuéntanos sobre tu proyecto, tus objetivos y tus plazos...',
    },
    serviceOptions: {
      'Web Development': 'Desarrollo web',
      'Mobile App Development': 'Desarrollo de apps móviles',
      'Custom Software': 'Software a medida',
      'UI/UX Design': 'Diseño UI/UX',
      Consulting: 'Consultoría',
      Other: 'Otro',
    },
    budgetOptions: {
      '€500 - €1,000': '500 € - 1.000 €',
      '€1,000 - €5,000': '1.000 € - 5.000 €',
      '€5,000 - €10,000': '5.000 € - 10.000 €',
      '€10,000 - €25,000': '10.000 € - 25.000 €',
      '€25,000+': 'Más de 25.000 €',
    },
    errors: {
      nameRequired: 'Escribe tu nombre',
      emailRequired: 'Escribe tu correo electrónico',
      emailInvalid: 'El correo electrónico no es válido',
      messageRequired: 'Cuéntanos algo sobre tu proyecto',
      sendFailed: 'No hemos podido enviar tu mensaje en este momento.',
      emailUsDirectly: 'Escríbenos directamente a',
    },
    honeypot: 'Deja este campo vacío',
    sending: 'Enviando...',
    send: 'Enviar mensaje',
    consent: 'Al enviar este formulario, aceptas nuestra Política de privacidad y los Términos del servicio.',
    sentTitle: '¡Mensaje enviado!',
    sentText: '¡Gracias por escribirnos! Hemos recibido tu mensaje y te responderemos en menos de 24 horas.',
    sendAnother: 'Enviar otro mensaje',
  },

  notFound: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o se ha movido.',
    goHome: 'Volver al inicio',
  },
}
