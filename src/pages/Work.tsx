import { ExternalLink } from 'lucide-react'
import { CtaSection } from '../components/CtaSection'
import { GradientText } from '../components/ScrollAnimations'

const projects = [
  {
    id: 1,
    title: "TechStart Platform",
    category: "Web Application",
    description: "A comprehensive SaaS platform for startup management, featuring investor relations, team collaboration, and financial tracking.",
    image: "TS",
    color: "#3B82F6",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    results: ["300% increase in user engagement", "50% reduction in onboarding time", "4.9/5 user satisfaction rating"]
  },
  {
    id: 2,
    title: "GrowthCo Mobile App",
    category: "Mobile Development",
    description: "Native iOS and Android apps for a fitness coaching company, with workout tracking, nutrition planning, and video streaming.",
    image: "GC",
    color: "#10B981",
    tags: ["React Native", "Firebase", "Video API", "Push Notifications"],
    results: ["100K+ downloads in first month", "4.8 App Store rating", "65% daily active users"]
  },
  {
    id: 3,
    title: "InnovateLab Website",
    category: "Web Development",
    description: "A modern corporate website for an innovation consultancy, featuring case studies, team profiles, and an interactive services explorer.",
    image: "IL",
    color: "#8B5CF6",
    tags: ["Next.js", "Tailwind CSS", "Sanity CMS", "Framer Motion"],
    results: ["200% increase in organic traffic", "45% improvement in lead generation", "2.5x average session duration"]
  },
  {
    id: 4,
    title: "ScaleUp E-commerce",
    category: "E-commerce",
    description: "A high-performance e-commerce platform for a fashion retailer, with advanced inventory management and multi-currency support.",
    image: "SU",
    color: "#F59E0B",
    tags: ["Shopify Plus", "Custom Theme", "ERP Integration", "Multi-language"],
    results: ["€2M+ in first year sales", "40% increase in conversion rate", "15 countries served"]
  },
  {
    id: 5,
    title: "DigitalFirst Dashboard",
    category: "Custom Software",
    description: "An internal business intelligence dashboard aggregating data from multiple sources with real-time analytics and reporting.",
    image: "DF",
    color: "#EC4899",
    tags: ["Vue.js", "Python", "BigQuery", "Data Visualization"],
    results: ["80% reduction in reporting time", "Real-time data access", "Custom KPI tracking"]
  },
  {
    id: 6,
    title: "MedCare Portal",
    category: "Healthcare",
    description: "A patient portal for a healthcare provider, featuring appointment booking, medical records, and telemedicine integration.",
    image: "MC",
    color: "#06B6D4",
    tags: ["React", "HIPAA Compliant", "Telehealth API", "Secure Messaging"],
    results: ["60% reduction in no-shows", "90% patient satisfaction", "HIPAA compliant"]
  }
]

export function Work() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow section-glow--hero">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">OUR WORK</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4 md:mb-6">Projects That Speak for Themselves</h1>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
            Explore our portfolio of successful projects. Each one represents a unique challenge we helped our clients overcome.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">CLIENT FEEDBACK</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">What They Say About Us</h2>
          </div>

          <div className="space-y-4 md:space-y-8">
            <TestimonialFull
              quote="Working with Bezikee was a game-changer for our business. They didn't just build us a website; they built us a lead-generating machine. The attention to detail and commitment to our success was evident in every interaction."
              name="Maria García"
              role="CEO"
              company="TechStart Spain"
            />
            <TestimonialFull
              quote="The mobile app Bezikee developed for us exceeded all expectations. They understood our vision from day one and delivered a product that our users love. We've already started planning our next project with them."
              name="Thomas Mueller"
              role="Founder"
              company="GrowthCo"
            />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">INDUSTRIES</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">Sectors We Serve</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { name: "Technology", count: "15+ projects" },
              { name: "E-commerce", count: "12+ projects" },
              { name: "Healthcare", count: "8+ projects" },
              { name: "Finance", count: "6+ projects" },
              { name: "Education", count: "5+ projects" },
              { name: "Real Estate", count: "4+ projects" },
              { name: "Hospitality", count: "3+ projects" },
              { name: "Non-profit", count: "3+ projects" }
            ].map((industry) => (
              <div
                key={industry.name}
                className="p-4 md:p-6 bg-dark-card border border-dark-border rounded-xl md:rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 text-center group cursor-pointer"
              >
                <h3 className="text-sm md:text-lg font-semibold text-white group-hover:text-neon-green transition-colors duration-300">
                  {industry.name}
                </h3>
                <p className="text-xs md:text-sm text-zinc-500 mt-1">{industry.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={<>Want to See Your Project <GradientText>Here</GradientText>?</>}
        description="Let's discuss how we can help bring your vision to life."
        primary={{ label: 'Start Your Project', to: '/contact' }}
      />
    </div>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <div className="group bg-dark-card border border-dark-border rounded-xl md:rounded-2xl overflow-hidden shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300">
      {/* Project Image/Header */}
      <div
        className="h-32 md:h-48 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: `${project.color}20` }}
      >
        <div
          className="text-4xl md:text-6xl font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ color: project.color }}
        >
          {project.image}
        </div>
        <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 md:w-10 h-8 md:h-10 flex items-center justify-center bg-white/10 backdrop-blur rounded-full">
            <ExternalLink className="w-4 md:w-5 h-4 md:h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <span className="px-2 md:px-3 py-0.5 md:py-1 bg-neon-green/10 text-neon-green text-[10px] md:text-xs font-medium rounded-full">
            {project.category}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-neon-green transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-3 md:mb-4">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-dark-bg text-zinc-400 text-[10px] md:text-xs rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Results */}
        <div className="pt-3 md:pt-4 border-t border-dark-border">
          <p className="text-[10px] md:text-xs text-zinc-500 mb-1 md:mb-2 uppercase tracking-wider">Key Results</p>
          <ul className="space-y-0.5 md:space-y-1">
            {project.results.map((result, index) => (
              <li key={index} className="text-xs md:text-sm text-zinc-300 flex items-center gap-1.5 md:gap-2">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-neon-green rounded-full flex-shrink-0"></span>
                {result}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function TestimonialFull({ quote, name, role, company }: { quote: string; name: string; role: string; company: string }) {
  return (
    <div className="p-5 md:p-8 bg-dark-card border border-dark-border rounded-xl md:rounded-2xl shadow-neon hover:shadow-neon-lg transition-all duration-300">
      <p className="text-base md:text-xl text-zinc-200 leading-relaxed italic mb-4 md:mb-6">"{quote}"</p>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 md:w-14 h-10 md:h-14 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green text-lg md:text-xl font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm md:text-base text-white font-semibold">{name}</p>
          <p className="text-xs md:text-sm text-zinc-500">{role}, {company}</p>
        </div>
      </div>
    </div>
  )
}
