import { Link } from 'react-router-dom'
import { Globe, Smartphone, Layers, Check, ArrowRight } from 'lucide-react'
import { CodeTypingAnimation } from '../components/CodeTypingAnimation'
import { StatsSection } from '../components/AnimatedCounter'
import { TechStackSection } from '../components/TechOrbit'
import { FadeIn, GradientText } from '../components/ScrollAnimations'
import { MagneticButton } from '../components/MagneticButton'
import { TiltCard } from '../components/TiltCard'
import { TextScramble } from '../components/TextScramble'
import { ParallaxSection, FloatingElements } from '../components/ParallaxSection'

export function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20 px-20 overflow-hidden">
        {/* Floating decorative elements */}
        <FloatingElements />

        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg z-[1]"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-2 gap-16 items-center relative z-10">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-6">
            <FadeIn animation="fade-right" delay={0}>
              <div className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 rounded-full border border-neon-green/20 w-fit">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-neon-green text-sm font-medium">Software Development Agency</span>
              </div>
            </FadeIn>

            <FadeIn animation="fade-right" delay={100}>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                We Build Digital Products That{' '}
                <GradientText>Drive Growth</GradientText>
              </h1>
            </FadeIn>

            <FadeIn animation="fade-right" delay={200}>
              <p className="text-xl text-zinc-400 leading-relaxed">
                From simple websites to complex applications, we transform your ideas into powerful digital solutions that attract customers and scale your business.
              </p>
            </FadeIn>

            <FadeIn animation="fade-right" delay={300}>
              <div className="flex gap-4 mt-4">
                <MagneticButton strength={0.1}>
                  <Link
                    to="/services"
                    className="group px-8 py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover transition-all duration-300 flex items-center gap-2"
                  >
                    View Our Packages
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.15}>
                  <Link
                    to="/contact"
                    className="px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>

            {/* Trust Section */}
            <FadeIn animation="fade-up" delay={500}>
              <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-dark-border/50">
                <span className="text-xs font-semibold text-zinc-600 tracking-widest">TRUSTED BY BUSINESSES ACROSS EUROPE</span>
                <div className="flex gap-8 items-center">
                  {['TechStart', 'GrowthCo', 'InnovateLab', 'ScaleUp'].map((name) => (
                    <span key={name} className="text-lg font-semibold text-zinc-700 hover:text-neon-green transition-colors duration-300 cursor-pointer">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: Code Animation */}
          <FadeIn animation="fade-left" delay={400}>
            <ParallaxSection speed={0.3}>
              <div className="flex justify-center">
                <CodeTypingAnimation />
              </div>
            </ParallaxSection>
          </FadeIn>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 px-20 bg-dark-section relative overflow-hidden">
        <FloatingElements />

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-4 mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR SERVICES</span>
            <h2 className="text-5xl font-bold text-white text-center">
              <TextScramble text="What We Do Best" />
            </h2>
            <p className="text-lg text-zinc-500 text-center">We specialize in creating digital solutions tailored to your business needs</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-3 gap-6">
          <FadeIn animation="fade-up" delay={0}>
            <ServiceCard
              icon={<Globe className="w-7 h-7 text-neon-green" />}
              title="Web Development"
              description="Custom websites built with modern technologies that are fast, secure, and optimized for conversions."
            />
          </FadeIn>
          <FadeIn animation="fade-up" delay={150}>
            <ServiceCard
              icon={<Smartphone className="w-7 h-7 text-neon-green" />}
              title="Mobile Apps"
              description="Native and cross-platform mobile applications that provide seamless user experiences on any device."
            />
          </FadeIn>
          <FadeIn animation="fade-up" delay={300}>
            <ServiceCard
              icon={<Layers className="w-7 h-7 text-neon-green" />}
              title="Custom Software"
              description="Bespoke software solutions designed to automate processes and solve complex business challenges."
            />
          </FadeIn>
        </div>

        <FadeIn animation="fade-up" delay={450}>
          <div className="flex justify-center mt-12">
            <MagneticButton strength={0.15}>
              <Link
                to="/services"
                className="group px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center gap-2"
              >
                View All Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </MagneticButton>
          </div>
        </FadeIn>
      </section>

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Pricing Section */}
      <section className="py-24 px-20 bg-dark-section relative overflow-hidden">
        <FloatingElements />

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-4 mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">PRICING</span>
            <h2 className="text-5xl font-bold text-white text-center">
              <TextScramble text="Choose Your Package" delay={200} />
            </h2>
            <p className="text-lg text-zinc-500 text-center">Transparent pricing with no hidden fees. Pick the package that fits your needs.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-3 gap-6 items-start">
          <FadeIn animation="fade-up" delay={0}>
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
          </FadeIn>
          <FadeIn animation="fade-up" delay={150}>
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
          </FadeIn>
          <FadeIn animation="fade-up" delay={300}>
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
          </FadeIn>
        </div>
      </section>

      {/* Animated Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <section className="py-24 px-20 bg-dark-bg relative overflow-hidden">
        <FloatingElements />

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-4 mb-12">
            <span className="text-xs font-semibold text-neon-green tracking-widest">TESTIMONIALS</span>
            <h2 className="text-5xl font-bold text-white text-center">
              <TextScramble text="What Our Clients Say" delay={200} />
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 gap-6">
          <FadeIn animation="fade-up" delay={0}>
            <TestimonialCard
              quote="Bezikee transformed our online presence completely. Our new website increased leads by 300% in just 3 months. Highly recommended!"
              name="Maria García"
              role="CEO, TechStart Spain"
            />
          </FadeIn>
          <FadeIn animation="fade-up" delay={200}>
            <TestimonialCard
              quote="Professional team, excellent communication, and they delivered our mobile app on time and on budget. We've already started our second project with them."
              name="Thomas Mueller"
              role="Founder, GrowthCo"
            />
          </FadeIn>
        </div>

        <FadeIn animation="fade-up" delay={400}>
          <div className="flex justify-center mt-12">
            <MagneticButton strength={0.15}>
              <Link
                to="/work"
                className="group px-8 py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center gap-2"
              >
                View Our Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </MagneticButton>
          </div>
        </FadeIn>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-20 bg-neon-green relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <FadeIn animation="zoom-in">
          <div className="flex flex-col items-center gap-6 max-w-[700px] mx-auto relative z-10">
            <h2 className="text-5xl font-bold text-white text-center">Ready to Transform Your Business?</h2>
            <p className="text-lg text-white/90 text-center leading-relaxed">
              Let's discuss your project and find the perfect solution for your needs. Get a free consultation today.
            </p>
            <div className="flex gap-4 mt-4">
              <MagneticButton strength={0.1}>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-dark-bg font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Start Your Project
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <Link
                  to="/contact"
                  className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Schedule a Call
                </Link>
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}

// Service Card Component with Tilt
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <TiltCard className="h-full" tiltAmount={8} glareOpacity={0.15}>
      <Link
        to="/services"
        className="flex flex-col gap-5 p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 cursor-pointer group h-full"
      >
        <div className="w-14 h-14 flex items-center justify-center bg-neon-green/10 rounded-xl group-hover:bg-neon-green/20 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-[15px] text-zinc-500 leading-relaxed">{description}</p>
      </Link>
    </TiltCard>
  )
}

// Pricing Card Component with Tilt
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
    <TiltCard className="h-full" tiltAmount={6} glareOpacity={popular ? 0.2 : 0.1}>
      <div className={`flex flex-col gap-8 p-8 bg-dark-card rounded-2xl transition-all duration-300 h-full ${
        popular
          ? 'border-2 border-neon-green shadow-neon-md'
          : 'border border-dark-border shadow-neon'
      }`}>
        {popular && (
          <span className="self-start px-3 py-1.5 bg-neon-green text-white text-[11px] font-bold tracking-wider rounded-full animate-glow">
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

        <div className="flex flex-col gap-4 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
              <span className="text-[15px] text-zinc-200">{feature}</span>
            </div>
          ))}
        </div>

        <MagneticButton strength={0.1} className="w-full">
          <Link
            to="/contact"
            className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 text-center block ${
              buttonVariant === 'filled'
                ? 'bg-neon-green text-white shadow-neon-btn hover:shadow-neon-btn-hover'
                : 'border border-dark-border text-white hover:border-neon-green hover:shadow-neon'
            }`}
          >
            {buttonText}
          </Link>
        </MagneticButton>
      </div>
    </TiltCard>
  )
}

// Testimonial Card Component with Tilt
function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <TiltCard className="h-full" tiltAmount={5} glareOpacity={0.1}>
      <div className="flex flex-col gap-6 p-8 bg-dark-card rounded-2xl shadow-neon hover:shadow-neon-lg transition-all duration-300 border border-dark-border hover:border-neon-green/30 h-full">
        <p className="text-zinc-200 text-base leading-relaxed italic">"{quote}"</p>
        <div className="flex items-center gap-4 mt-auto">
          <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold">
            {name.charAt(0)}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold text-white">{name}</span>
            <span className="text-sm text-zinc-500">{role}</span>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
