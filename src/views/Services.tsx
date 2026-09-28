import Link from 'next/link'
import { Globe, Smartphone, Layers, Palette, Server, Shield, Check } from 'lucide-react'
import { CtaSection } from '../components/CtaSection'
import { GradientText } from '../components/ScrollAnimations'
import { getDictionary, localePath, type Locale } from '../i18n'

export function Services({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const sv = t.services
  const to = (path: string) => localePath(locale, path)
  const icons = [Globe, Smartphone, Layers, Palette, Server, Shield]

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow section-glow--hero">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">{sv.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4 md:mb-6">{sv.title}</h1>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
            {sv.text}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {sv.details.map((service, i) => {
            const Icon = icons[i]
            return (
              <ServiceDetail
                key={service.title}
                icon={<Icon className="w-7 md:w-8 h-7 md:h-8" />}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            )
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">{sv.processEyebrow}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">{sv.processTitle}</h2>
          </div>

          <div className="space-y-0">
            {sv.process.map((step, i) => (
              <ProcessStep
                key={step.title}
                number={String(i + 1).padStart(2, '0')}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-xs font-semibold text-neon-green tracking-widest">{sv.pricingEyebrow}</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">{sv.pricingTitle}</h2>
          <p className="text-base md:text-lg text-zinc-500 mt-4">{sv.pricingText}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {sv.packages.map((pkg, i) => (
            <PricingCard
              key={pkg.name}
              href={to('/contact')}
              name={pkg.name}
              price={pkg.price}
              description={pkg.description}
              features={pkg.features}
              buttonText={t.common.getStarted}
              // The middle package is the one to steer people to
              popularLabel={i === 1 ? t.common.mostPopular : undefined}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={<>{sv.cta.title.before}<GradientText>{sv.cta.title.highlight}</GradientText>{sv.cta.title.after}</>}
        description={sv.cta.description}
        primary={{ label: sv.cta.primary, to: to('/contact') }}
      />
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
    <div className="p-5 md:p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 group">
      <div className="w-12 md:w-16 h-12 md:h-16 flex items-center justify-center bg-neon-green/10 rounded-xl md:rounded-2xl text-neon-green mb-4 md:mb-6 group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{title}</h3>
      <p className="text-sm md:text-base text-zinc-400 leading-relaxed mb-4 md:mb-6">{description}</p>
      <ul className="space-y-2 md:space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-zinc-300">
            <Check className="w-4 md:w-5 h-4 md:h-5 text-neon-green flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 md:gap-8 pb-8 md:pb-12 relative group">
      <div className="flex flex-col items-center">
        <div className="w-12 md:w-16 h-12 md:h-16 flex items-center justify-center bg-neon-green/10 rounded-xl md:rounded-2xl text-neon-green font-bold text-lg md:text-xl border border-neon-green/30 group-hover:bg-neon-green/20 group-hover:shadow-neon transition-all duration-300">
          {number}
        </div>
        <div className="w-0.5 h-full bg-dark-border mt-4 group-last:hidden"></div>
      </div>
      <div className="pt-2 md:pt-3 flex-1">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-neon-green transition-colors duration-300">{title}</h3>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function PricingCard({
  href,
  name,
  price,
  description,
  features,
  buttonText,
  popularLabel
}: {
  href: string
  name: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popularLabel?: string
}) {
  const popular = Boolean(popularLabel)
  return (
    <div className={`p-5 md:p-8 rounded-2xl transition-all duration-300 hover:scale-[1.03] ${
      popular
        ? 'bg-dark-card border-2 border-neon-green shadow-neon-md hover:shadow-neon-xl'
        : 'bg-dark-card border border-dark-border shadow-neon hover:shadow-neon-lg'
    }`}>
      {popular && (
        <span className="inline-block px-3 py-1 bg-neon-green text-white text-xs font-bold rounded-full mb-4">
          {popularLabel}
        </span>
      )}
      <h3 className="text-lg md:text-xl font-bold text-white">{name}</h3>
      <p className="text-3xl md:text-4xl font-bold text-white mt-2 whitespace-nowrap">{price}</p>
      <p className="text-sm md:text-base text-zinc-500 mt-2 mb-4 md:mb-6">{description}</p>
      <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-xs md:text-sm text-zinc-300">
            <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full py-3 text-center rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
          popular
            ? 'bg-neon-green text-white shadow-neon-btn hover:shadow-neon-btn-hover'
            : 'border border-dark-border text-white hover:border-neon-green hover:shadow-neon'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  )
}
