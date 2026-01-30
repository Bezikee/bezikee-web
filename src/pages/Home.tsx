import { Link } from 'react-router-dom'
import { Globe, Smartphone, Layers, Check, ArrowRight } from 'lucide-react'

export function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center py-28 px-20 gap-10">
        <div className="flex flex-col items-center gap-6 max-w-[900px]">
          <div className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 rounded-full border border-neon-green/20">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-neon-green text-sm font-medium">Software Development Agency</span>
          </div>
          <h1 className="text-6xl font-bold text-white text-center leading-tight">
            We Build Digital Products That <span className="text-neon-green">Drive Growth</span>
          </h1>
          <p className="text-xl text-zinc-400 text-center max-w-[700px] leading-relaxed">
            From simple websites to complex applications, we transform your ideas into powerful digital solutions that attract customers and scale your business.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              to="/services"
              className="px-8 py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              View Our Packages
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Trust Section */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <span className="text-xs font-semibold text-zinc-600 tracking-widest">TRUSTED BY BUSINESSES ACROSS EUROPE</span>
          <div className="flex gap-12 items-center">
            {['TechStart', 'GrowthCo', 'InnovateLab', 'ScaleUp', 'DigitalFirst'].map((name) => (
              <span key={name} className="text-lg font-semibold text-zinc-700 hover:text-neon-green transition-colors duration-300 cursor-pointer">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 px-20 bg-dark-section">
        <div className="flex flex-col items-center gap-4 mb-16">
          <span className="text-xs font-semibold text-neon-green tracking-widest">OUR SERVICES</span>
          <h2 className="text-5xl font-bold text-white text-center">What We Do Best</h2>
          <p className="text-lg text-zinc-500 text-center">We specialize in creating digital solutions tailored to your business needs</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <ServiceCard
            icon={<Globe className="w-7 h-7 text-neon-green" />}
            title="Web Development"
            description="Custom websites built with modern technologies that are fast, secure, and optimized for conversions."
          />
          <ServiceCard
            icon={<Smartphone className="w-7 h-7 text-neon-green" />}
            title="Mobile Apps"
            description="Native and cross-platform mobile applications that provide seamless user experiences on any device."
          />
          <ServiceCard
            icon={<Layers className="w-7 h-7 text-neon-green" />}
            title="Custom Software"
            description="Bespoke software solutions designed to automate processes and solve complex business challenges."
          />
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/services"
            className="px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center gap-2"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-20 bg-dark-bg">
        <div className="flex flex-col items-center gap-4 mb-16">
          <span className="text-xs font-semibold text-neon-green tracking-widest">PRICING</span>
          <h2 className="text-5xl font-bold text-white text-center">Choose Your Package</h2>
          <p className="text-lg text-zinc-500 text-center">Transparent pricing with no hidden fees. Pick the package that fits your needs.</p>
        </div>

        <div className="grid grid-cols-3 gap-6 items-start">
          <PricingCard
            name="Starter"
            price="€500"
            suffix="one-time"
            description="Perfect for small businesses and startups who need a professional online presence."
            features={[
              "Up to 5 pages",
              "Responsive design",
              "Contact form integration",
              "SEO optimization",
              "2 weeks delivery"
            ]}
            buttonText="Get Started"
            buttonVariant="outline"
          />
          <PricingCard
            name="Professional"
            price="€1,000"
            suffix="one-time"
            description="For growing businesses that need a custom website with advanced functionality."
            features={[
              "Up to 15 pages",
              "Custom design & branding",
              "CMS integration",
              "Blog functionality",
              "Analytics dashboard",
              "3 months support",
              "4 weeks delivery"
            ]}
            buttonText="Get Started"
            buttonVariant="filled"
            popular
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            suffix="pricing"
            description="For complex applications, mobile apps, and enterprise-level projects with custom requirements."
            features={[
              "Unlimited pages & features",
              "Mobile app development",
              "Custom backend & APIs",
              "Database architecture",
              "Third-party integrations",
              "Dedicated project manager",
              "12 months priority support"
            ]}
            buttonText="Contact Us"
            buttonVariant="outline"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-20 bg-dark-section">
        <div className="flex flex-col items-center gap-4 mb-16">
          <span className="text-xs font-semibold text-neon-green tracking-widest">WHY BEZIKEE</span>
          <h2 className="text-5xl font-bold text-white text-center">Built for Results</h2>
          <p className="text-lg text-zinc-500 text-center">We don't just build websites — we build growth engines for your business</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <StatCard value="50+" label="Projects Delivered" />
          <StatCard value="98%" label="Client Satisfaction" />
          <StatCard value="5+" label="Years Experience" />
          <StatCard value="24h" label="Response Time" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-20 bg-dark-bg">
        <div className="flex flex-col items-center gap-4 mb-12">
          <span className="text-xs font-semibold text-neon-green tracking-widest">TESTIMONIALS</span>
          <h2 className="text-5xl font-bold text-white text-center">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <TestimonialCard
            quote="Bezikee transformed our online presence completely. Our new website increased leads by 300% in just 3 months. Highly recommended!"
            name="Maria García"
            role="CEO, TechStart Spain"
          />
          <TestimonialCard
            quote="Professional team, excellent communication, and they delivered our mobile app on time and on budget. We've already started our second project with them."
            name="Thomas Mueller"
            role="Founder, GrowthCo"
          />
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/work"
            className="px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center gap-2"
          >
            View Our Work
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-20 bg-neon-green">
        <div className="flex flex-col items-center gap-6 max-w-[700px] mx-auto">
          <h2 className="text-5xl font-bold text-white text-center">Ready to Transform Your Business?</h2>
          <p className="text-lg text-white/90 text-center leading-relaxed">
            Let's discuss your project and find the perfect solution for your needs. Get a free consultation today.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Your Project
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Service Card Component
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link
      to="/services"
      className="flex flex-col gap-5 p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-[1.02] hover:border-neon-green/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="w-14 h-14 flex items-center justify-center bg-neon-green/10 rounded-xl group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-[15px] text-zinc-500 leading-relaxed">{description}</p>
    </Link>
  )
}

// Pricing Card Component
function PricingCard({
  name,
  price,
  suffix,
  description,
  features,
  buttonText,
  buttonVariant,
  popular
}: {
  name: string
  price: string
  suffix: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: 'filled' | 'outline'
  popular?: boolean
}) {
  return (
    <div className={`flex flex-col gap-8 p-8 bg-dark-card rounded-2xl transition-all duration-300 group hover:scale-[1.03] ${
      popular
        ? 'border-2 border-neon-green shadow-neon-md hover:shadow-neon-xl'
        : 'border border-dark-border shadow-neon hover:shadow-neon-lg hover:border-neon-green/50'
    }`}>
      {popular && (
        <span className="self-start px-3 py-1.5 bg-neon-green text-white text-[11px] font-bold tracking-wider rounded-full">
          MOST POPULAR
        </span>
      )}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <div className="flex items-end gap-1">
          <span className="text-5xl font-bold text-white">{price}</span>
          <span className="text-zinc-500 mb-1">{suffix}</span>
        </div>
        <p className="text-[15px] text-zinc-500 leading-relaxed">{description}</p>
      </div>

      <div className="w-full h-px bg-dark-border"></div>

      <div className="flex flex-col gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
            <span className="text-[15px] text-zinc-200">{feature}</span>
          </div>
        ))}
      </div>

      <Link
        to="/contact"
        className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 text-center ${
          buttonVariant === 'filled'
            ? 'bg-neon-green text-white shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-[1.02]'
            : 'border border-dark-border text-white hover:border-neon-green hover:shadow-neon'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  )
}

// Stat Card Component
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-10 bg-dark-card rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-[1.05] transition-all duration-300 cursor-pointer group">
      <span className="text-5xl font-bold text-neon-green group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">
        {value}
      </span>
      <span className="text-zinc-400 font-medium">{label}</span>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="flex flex-col gap-6 p-8 bg-dark-card rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-[1.02] transition-all duration-300">
      <p className="text-zinc-200 text-base leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold">
          {name.charAt(0)}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-white">{name}</span>
          <span className="text-sm text-zinc-500">{role}</span>
        </div>
      </div>
    </div>
  )
}
