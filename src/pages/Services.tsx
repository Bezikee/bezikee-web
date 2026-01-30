import { Link } from 'react-router-dom'
import { Globe, Smartphone, Layers, Palette, Server, Shield, Check, ArrowRight } from 'lucide-react'

export function Services() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">OUR SERVICES</span>
          <h1 className="text-5xl font-bold text-white mt-4 mb-6">Digital Solutions for Every Business Need</h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            From concept to launch, we provide end-to-end development services that help businesses thrive in the digital age.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-20 bg-dark-bg">
        <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ServiceDetail
            icon={<Globe className="w-8 h-8" />}
            title="Web Development"
            description="We build fast, responsive, and SEO-optimized websites that convert visitors into customers."
            features={[
              "Custom website design & development",
              "E-commerce platforms",
              "Progressive Web Apps (PWA)",
              "Content Management Systems",
              "Landing pages & marketing sites",
              "Website optimization & performance"
            ]}
          />
          <ServiceDetail
            icon={<Smartphone className="w-8 h-8" />}
            title="Mobile App Development"
            description="Native and cross-platform mobile applications that provide exceptional user experiences."
            features={[
              "iOS app development",
              "Android app development",
              "Cross-platform solutions (React Native)",
              "App Store optimization",
              "Push notifications & analytics",
              "Ongoing maintenance & updates"
            ]}
          />
          <ServiceDetail
            icon={<Layers className="w-8 h-8" />}
            title="Custom Software"
            description="Bespoke software solutions designed to streamline your operations and solve complex challenges."
            features={[
              "Enterprise applications",
              "Business process automation",
              "API development & integration",
              "Database design & management",
              "Cloud solutions & migration",
              "Legacy system modernization"
            ]}
          />
          <ServiceDetail
            icon={<Palette className="w-8 h-8" />}
            title="UI/UX Design"
            description="Beautiful, intuitive designs that delight users and drive engagement."
            features={[
              "User research & personas",
              "Wireframing & prototyping",
              "Visual design & branding",
              "Interaction design",
              "Usability testing",
              "Design systems"
            ]}
          />
          <ServiceDetail
            icon={<Server className="w-8 h-8" />}
            title="Backend Development"
            description="Robust, scalable backend systems that power your applications reliably."
            features={[
              "RESTful API development",
              "GraphQL implementations",
              "Microservices architecture",
              "Real-time applications",
              "Third-party integrations",
              "Performance optimization"
            ]}
          />
          <ServiceDetail
            icon={<Shield className="w-8 h-8" />}
            title="Consulting & Strategy"
            description="Expert guidance to help you make informed technology decisions."
            features={[
              "Technical consulting",
              "Digital transformation strategy",
              "Technology stack assessment",
              "Security audits",
              "Code reviews",
              "Team augmentation"
            ]}
          />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR PROCESS</span>
            <h2 className="text-4xl font-bold text-white mt-4">How We Work</h2>
          </div>

          <div className="space-y-0">
            <ProcessStep
              number="01"
              title="Discovery"
              description="We start by understanding your business, goals, and target audience. This phase includes stakeholder interviews, market research, and requirement gathering."
            />
            <ProcessStep
              number="02"
              title="Planning"
              description="Based on our findings, we create a detailed project plan, technical specifications, and timeline. You'll know exactly what to expect and when."
            />
            <ProcessStep
              number="03"
              title="Design"
              description="Our designers create wireframes and visual designs that align with your brand. We iterate based on your feedback until you're completely satisfied."
            />
            <ProcessStep
              number="04"
              title="Development"
              description="Our engineers bring the designs to life using clean, maintainable code. We follow best practices and industry standards throughout."
            />
            <ProcessStep
              number="05"
              title="Testing"
              description="Rigorous testing ensures your product works flawlessly across all devices and scenarios. We catch and fix issues before launch."
            />
            <ProcessStep
              number="06"
              title="Launch & Support"
              description="We handle deployment and provide ongoing support to ensure your product continues to perform optimally post-launch."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-20 bg-dark-bg">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-neon-green tracking-widest">PRICING</span>
          <h2 className="text-4xl font-bold text-white mt-4">Transparent Pricing</h2>
          <p className="text-lg text-zinc-500 mt-4">Choose the package that fits your needs</p>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Starter"
            price="€500"
            description="Simple static website"
            features={["Up to 5 pages", "Responsive design", "Contact form", "SEO optimization", "2 weeks delivery"]}
          />
          <PricingCard
            name="Professional"
            price="€1,000"
            description="Custom website with CMS"
            features={["Up to 15 pages", "Custom design", "CMS integration", "Blog functionality", "Analytics", "3 months support"]}
            popular
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            description="Complex applications"
            features={["Unlimited features", "Mobile app development", "Custom backend", "Database architecture", "12 months support"]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-20 bg-neon-green">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
          <p className="text-lg text-white/90 mb-8">
            Let's discuss how we can help bring your vision to life.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get a Free Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function ServiceDetail({
  icon,
  title,
  description,
  features
}: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 group">
      <div className="w-16 h-16 flex items-center justify-center bg-neon-green/10 rounded-2xl text-neon-green mb-6 group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-zinc-300">
            <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-8 pb-12 relative group">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 flex items-center justify-center bg-neon-green/10 rounded-2xl text-neon-green font-bold text-xl border border-neon-green/30 group-hover:bg-neon-green/20 group-hover:shadow-neon transition-all duration-300">
          {number}
        </div>
        <div className="w-0.5 h-full bg-dark-border mt-4 group-last:hidden"></div>
      </div>
      <div className="pt-3">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-green transition-colors duration-300">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  popular
}: {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}) {
  return (
    <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-[1.03] ${
      popular
        ? 'bg-dark-card border-2 border-neon-green shadow-neon-md hover:shadow-neon-xl'
        : 'bg-dark-card border border-dark-border shadow-neon hover:shadow-neon-lg'
    }`}>
      {popular && (
        <span className="inline-block px-3 py-1 bg-neon-green text-white text-xs font-bold rounded-full mb-4">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="text-4xl font-bold text-white mt-2">{price}</p>
      <p className="text-zinc-500 mt-2 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-zinc-300">
            <Check className="w-4 h-4 text-neon-green" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        className={`block w-full py-3 text-center rounded-lg font-semibold transition-all duration-300 ${
          popular
            ? 'bg-neon-green text-white shadow-neon-btn hover:shadow-neon-btn-hover'
            : 'border border-dark-border text-white hover:border-neon-green hover:shadow-neon'
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}
