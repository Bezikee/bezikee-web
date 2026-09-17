import { Link } from 'react-router-dom'
import { Globe, Smartphone, Layers, Check, ArrowRight } from 'lucide-react'
import { CodeTypingAnimation } from '../components/CodeTypingAnimation'
import { TechStackSection } from '../components/TechOrbit'
import { FadeIn, GradientText } from '../components/ScrollAnimations'
import { MagneticButton } from '../components/MagneticButton'
import { TiltCard } from '../components/TiltCard'
import { TextScramble } from '../components/TextScramble'
import { ParallaxSection, FloatingElements } from '../components/ParallaxSection'
import { CtaSection } from '../components/CtaSection'

export function Home() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Floating decorative elements */}
        <FloatingElements />

        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg z-[1]"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-4 md:gap-6">
            <FadeIn animation="fade-right" delay={0}>
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-neon-green/10 rounded-full border border-neon-green/20 w-fit">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-neon-green text-xs md:text-sm font-medium">Software Development Agency</span>
              </div>
            </FadeIn>

            <FadeIn animation="fade-right" delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                We Build Digital Products That{' '}
                <GradientText>Drive Growth</GradientText>
              </h1>
            </FadeIn>

            <FadeIn animation="fade-right" delay={200}>
              <p className="text-base md:text-xl text-zinc-400 leading-relaxed">
                From simple websites to complex applications, we transform your ideas into powerful digital solutions that attract customers and scale your business.
              </p>
            </FadeIn>

            <FadeIn animation="fade-right" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 mt-2 md:mt-4">
                <MagneticButton strength={0.1}>
                  <Link
                    to="/services"
                    className="group px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View Our Packages
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.15}>
                  <Link
                    to="/contact"
                    className="px-6 md:px-8 py-3 md:py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 text-center"
                  >
                    Contact Us
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>

          {/* Right: Code Animation - Hidden on mobile */}
          <FadeIn animation="fade-left" delay={400}>
            <ParallaxSection speed={0.3}>
              <div className="hidden lg:flex justify-center">
                <CodeTypingAnimation />
              </div>
            </ParallaxSection>
          </FadeIn>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 section-glow relative overflow-hidden">
        <FloatingElements />

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-3 md:gap-4 mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR SERVICES</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
              <TextScramble text="What We Do Best" />
            </h2>
            <p className="text-base md:text-lg text-zinc-500 text-center max-w-xl">We specialize in creating digital solutions tailored to your business needs</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <FadeIn animation="fade-up" delay={0}>
            <ServiceCard
              icon={<Globe className="w-6 md:w-7 h-6 md:h-7 text-neon-green" />}
              title="Web Development"
              description="Custom websites built with modern technologies that are fast, secure, and optimized for conversions."
            />
          </FadeIn>
          <FadeIn animation="fade-up" delay={150}>
            <ServiceCard
              icon={<Smartphone className="w-6 md:w-7 h-6 md:h-7 text-neon-green" />}
              title="Mobile Apps"
              description="Native and cross-platform mobile applications that provide seamless user experiences on any device."
            />
          </FadeIn>
          <FadeIn animation="fade-up" delay={300}>
            <ServiceCard
              icon={<Layers className="w-6 md:w-7 h-6 md:h-7 text-neon-green" />}
              title="Custom Software"
              description="Bespoke software solutions designed to automate processes and solve complex business challenges."
            />
          </FadeIn>
        </div>

        <FadeIn animation="fade-up" delay={450}>
          <div className="flex justify-center mt-8 md:mt-12">
            <MagneticButton strength={0.15}>
              <Link
                to="/services"
                className="group px-6 md:px-8 py-3 md:py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center gap-2"
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
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 section-glow relative overflow-hidden">
        <FloatingElements />

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-3 md:gap-4 mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">PRICING</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
              <TextScramble text="Choose Your Package" delay={200} />
            </h2>
            <p className="text-base md:text-lg text-zinc-500 text-center max-w-xl">Transparent pricing with no hidden fees. Pick the package that fits your needs.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start max-w-5xl mx-auto">
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

      {/* CTA Section */}
      <CtaSection
        title={<>Ready to <GradientText>Transform</GradientText> Your Business?</>}
        description="Let's discuss your project and find the perfect solution for your needs. Get a free consultation today."
        primary={{ label: 'Start Your Project', to: '/contact' }}
        secondary={{ label: 'Schedule a Call', to: '/contact' }}
      />
    </div>
  )
}

// Service Card Component with Tilt
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <TiltCard className="h-full" tiltAmount={8} glareOpacity={0.15}>
      <Link
        to="/services"
        className="flex flex-col gap-4 md:gap-5 p-6 md:p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 cursor-pointer group h-full"
      >
        <div className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center bg-neon-green/10 rounded-xl group-hover:bg-neon-green/20 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm md:text-[15px] text-zinc-500 leading-relaxed">{description}</p>
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
      <div className={`flex flex-col gap-6 md:gap-8 p-6 md:p-8 bg-dark-card rounded-2xl transition-all duration-300 h-full ${
        popular
          ? 'border-2 border-neon-green shadow-neon-md'
          : 'border border-dark-border shadow-neon'
      }`}>
        {popular && (
          <span className="self-start px-3 py-1.5 bg-neon-green text-white text-[11px] font-bold tracking-wider rounded-full animate-glow">
            MOST POPULAR
          </span>
        )}
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="text-lg md:text-xl font-semibold text-white">{name}</h3>
          <div className="flex items-end gap-1">
            <span className="text-4xl md:text-5xl font-bold text-white">{price}</span>
            <span className="text-zinc-500 mb-1">{suffix}</span>
          </div>
          <p className="text-sm md:text-[15px] text-zinc-500 leading-relaxed">{description}</p>
        </div>

        <div className="w-full h-px bg-dark-border"></div>

        <div className="flex flex-col gap-3 md:gap-4 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
              <span className="text-sm md:text-[15px] text-zinc-200">{feature}</span>
            </div>
          ))}
        </div>

        <MagneticButton strength={0.1} className="w-full">
          <Link
            to="/contact"
            className={`w-full py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 text-center block ${
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
