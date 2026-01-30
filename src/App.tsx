import { Globe, Smartphone, Layers, Check, Linkedin, Twitter, Github } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-dark-bg font-inter">
      {/* Header */}
      <header className="flex items-center justify-between h-20 px-20 bg-dark-bg">
        <span className="text-2xl font-bold text-white">bezikee</span>
        <nav className="flex items-center gap-10">
          <a href="#services" className="text-zinc-400 hover:text-neon-green transition-colors duration-300">Services</a>
          <a href="#pricing" className="text-zinc-400 hover:text-neon-green transition-colors duration-300">Pricing</a>
          <a href="#about" className="text-zinc-400 hover:text-neon-green transition-colors duration-300">About</a>
          <a href="#contact" className="text-zinc-400 hover:text-neon-green transition-colors duration-300">Contact</a>
          <button className="px-6 py-3 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center py-28 px-20 gap-10">
        <div className="flex flex-col items-center gap-6 max-w-[900px]">
          <div className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 rounded-full">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-neon-green text-sm font-medium">Software Development Agency</span>
          </div>
          <h1 className="text-6xl font-bold text-white text-center leading-tight">
            We Build Digital Products That Drive Growth
          </h1>
          <p className="text-xl text-zinc-400 text-center max-w-[700px] leading-relaxed">
            From simple websites to complex applications, we transform your ideas into powerful digital solutions that attract customers and scale your business.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="px-8 py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300">
              View Our Packages
            </button>
            <button className="px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300">
              Contact Us
            </button>
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

      {/* Services Section */}
      <section id="services" className="py-24 px-20 bg-dark-section">
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
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-20 bg-dark-bg">
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

      {/* Why Section */}
      <section id="about" className="py-24 px-20 bg-dark-section">
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
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-20 bg-neon-green">
        <div className="flex flex-col items-center gap-6 max-w-[700px] mx-auto">
          <h2 className="text-5xl font-bold text-white text-center">Ready to Transform Your Business?</h2>
          <p className="text-lg text-white/90 text-center leading-relaxed">
            Let's discuss your project and find the perfect solution for your needs. Get a free consultation today.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="px-8 py-4 bg-white text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
              Start Your Project
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-20 bg-dark-bg">
        <div className="flex justify-between mb-12">
          <div className="flex flex-col gap-4 max-w-[280px]">
            <span className="text-2xl font-bold text-white">bezikee</span>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Building digital products that drive growth for businesses across Europe.
            </p>
            <div className="flex gap-4">
              <Linkedin className="w-5 h-5 text-zinc-500 hover:text-neon-green cursor-pointer transition-colors duration-300" />
              <Twitter className="w-5 h-5 text-zinc-500 hover:text-neon-green cursor-pointer transition-colors duration-300" />
              <Github className="w-5 h-5 text-zinc-500 hover:text-neon-green cursor-pointer transition-colors duration-300" />
            </div>
          </div>

          <div className="flex gap-20">
            <FooterColumn
              title="Services"
              links={["Web Development", "Mobile Apps", "Custom Software", "UI/UX Design"]}
            />
            <FooterColumn
              title="Company"
              links={["About Us", "Our Work", "Careers", "Blog"]}
            />
            <FooterColumn
              title="Contact"
              links={["hello@bezikee.com", "+34 612 345 678", "Madrid, Spain"]}
            />
          </div>
        </div>

        <div className="border-t border-dark-border pt-8 flex justify-between items-center">
          <span className="text-sm text-zinc-600">© 2025 Bezikee. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="text-sm text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-sm text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Service Card Component with neon hover effects
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-5 p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-[1.02] hover:border-neon-green/50 transition-all duration-300 cursor-pointer group">
      <div className="w-14 h-14 flex items-center justify-center bg-neon-green/10 rounded-xl group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-[15px] text-zinc-500 leading-relaxed">{description}</p>
    </div>
  )
}

// Pricing Card Component with neon hover effects
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
    <div className={`flex flex-col gap-8 p-8 bg-dark-card rounded-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.03] ${
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

      <button className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
        buttonVariant === 'filled'
          ? 'bg-neon-green text-white shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-[1.02]'
          : 'border border-dark-border text-white hover:border-neon-green hover:shadow-neon'
      }`}>
        {buttonText}
      </button>
    </div>
  )
}

// Stat Card Component with neon hover effects
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

// Testimonial Card Component with neon hover effects
function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="flex flex-col gap-6 p-8 bg-dark-card rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <p className="text-zinc-200 text-base leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-neon-green/20"></div>
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-white">{name}</span>
          <span className="text-sm text-zinc-500">{role}</span>
        </div>
      </div>
    </div>
  )
}

// Footer Column Component
function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-semibold text-white">{title}</span>
      {links.map((link, index) => (
        <span key={index} className="text-sm text-zinc-500 hover:text-neon-green cursor-pointer transition-colors duration-300">
          {link}
        </span>
      ))}
    </div>
  )
}

export default App
