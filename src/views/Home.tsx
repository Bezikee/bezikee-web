import Link from 'next/link'
import { Globe, Smartphone, Layers, Check, ArrowRight } from 'lucide-react'
import { CodeTypingAnimation } from '../components/CodeTypingAnimation'
import { StandardsSection } from '../components/StandardsOrbit'
import { FadeIn, GradientText } from '../components/ScrollAnimations'
import { MagneticButton } from '../components/MagneticButton'
import { TiltCard } from '../components/TiltCard'
import { TextScramble } from '../components/TextScramble'
import { ParallaxSection } from '../components/ParallaxSection'
import { CtaSection } from '../components/CtaSection'
import { getDictionary, localePath, type Locale } from '../i18n'

export function Home({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const h = t.home
  const to = (path: string) => localePath(locale, path)
  const serviceIcons = [Globe, Smartphone, Layers]

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Floating decorative elements */}

        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg z-[1]"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-4 md:gap-6">
            <FadeIn animation="fade-right" delay={0}>
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-neon-green/10 rounded-full border border-neon-green/20 w-fit">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-neon-green text-xs md:text-sm font-medium">{h.badge}</span>
              </div>
            </FadeIn>

            <FadeIn animation="fade-right" delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {h.hero.before}
                <GradientText>{h.hero.highlight}</GradientText>
                {h.hero.after}
              </h1>
            </FadeIn>

            <FadeIn animation="fade-right" delay={200}>
              <p className="text-base md:text-xl text-zinc-400 leading-relaxed">
                {h.heroText}
              </p>
            </FadeIn>

            <FadeIn animation="fade-right" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 mt-2 md:mt-4">
                <MagneticButton strength={0.1}>
                  <Link
                    href={to('/services')}
                    className="group px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {h.viewPackages}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.15}>
                  <Link
                    href={to('/contact')}
                    className="px-6 md:px-8 py-3 md:py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 text-center"
                  >
                    {t.common.contactUs}
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

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-3 md:gap-4 mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">{h.servicesEyebrow}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
              <TextScramble text={h.servicesTitle} />
            </h2>
            <p className="text-base md:text-lg text-zinc-500 text-center max-w-xl">{h.servicesText}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {h.services.map((service, i) => {
            const Icon = serviceIcons[i]
            return (
              <FadeIn key={service.title} animation="fade-up" delay={i * 150}>
                <ServiceCard
                  href={to('/services')}
                  icon={<Icon className="w-6 md:w-7 h-6 md:h-7 text-neon-green" />}
                  title={service.title}
                  description={service.description}
                />
              </FadeIn>
            )
          })}
        </div>

        <FadeIn animation="fade-up" delay={450}>
          <div className="flex justify-center mt-8 md:mt-12">
            <MagneticButton strength={0.15}>
              <Link
                href={to('/services')}
                className="group px-6 md:px-8 py-3 md:py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center gap-2"
              >
                {h.viewAllServices}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </MagneticButton>
          </div>
        </FadeIn>
      </section>

      {/* Standards Section */}
      <StandardsSection t={t.standards} />

      {/* Pricing Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 section-glow relative overflow-hidden">

        <FadeIn animation="fade-up">
          <div className="flex flex-col items-center gap-3 md:gap-4 mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">{h.pricingEyebrow}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
              <TextScramble text={h.pricingTitle} delay={200} />
            </h2>
            <p className="text-base md:text-lg text-zinc-500 text-center max-w-xl">{h.pricingText}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start max-w-5xl mx-auto">
          {h.packages.map((pkg, i) => {
            // The middle package is the one to steer people to; the last is quoted per project
            const popular = i === 1
            const isCustom = i === h.packages.length - 1
            return (
              <FadeIn key={pkg.name} animation="fade-up" delay={i * 150}>
                <PricingCard
                  href={to('/contact')}
                  name={pkg.name}
                  price={pkg.price}
                  suffix={pkg.suffix}
                  description={pkg.description}
                  features={pkg.features}
                  buttonText={isCustom ? t.common.contactUs : t.common.getStarted}
                  buttonVariant={popular ? 'filled' : 'outline'}
                  popularLabel={popular ? t.common.mostPopular : undefined}
                />
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={<>{h.cta.title.before}<GradientText>{h.cta.title.highlight}</GradientText>{h.cta.title.after}</>}
        description={h.cta.description}
        primary={{ label: h.cta.primary, to: to('/contact') }}
        secondary={{ label: h.cta.secondary, to: to('/contact') }}
      />
    </div>
  )
}

// Service Card Component with Tilt
function ServiceCard({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <TiltCard className="h-full" tiltAmount={8} glareOpacity={0.15}>
      <Link
        href={href}
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
  href,
  name,
  price,
  suffix,
  description,
  features,
  buttonText,
  buttonVariant,
  popularLabel
}: {
  href: string
  name: string
  price: string
  suffix: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: 'filled' | 'outline'
  popularLabel?: string
}) {
  const popular = Boolean(popularLabel)
  return (
    <TiltCard className="h-full" tiltAmount={6} glareOpacity={popular ? 0.2 : 0.1}>
      <div className={`flex flex-col gap-6 md:gap-8 p-6 md:p-8 bg-dark-card rounded-2xl transition-all duration-300 h-full ${
        popular
          ? 'border-2 border-neon-green shadow-neon-md'
          : 'border border-dark-border shadow-neon'
      }`}>
        {popular && (
          <span className="self-start px-3 py-1.5 bg-neon-green text-white text-[11px] font-bold tracking-wider rounded-full animate-glow">
            {popularLabel}
          </span>
        )}
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="text-lg md:text-xl font-semibold text-white">{name}</h3>
          {/* The price never breaks ("1.000 €" has a space in it); the suffix drops to its
              own line instead when the card is too narrow for both */}
          <div className="flex flex-wrap items-end gap-x-1">
            <span className="text-4xl md:text-5xl font-bold text-white whitespace-nowrap">{price}</span>
            {suffix && <span className="text-zinc-500 mb-1">{suffix}</span>}
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
            href={href}
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
