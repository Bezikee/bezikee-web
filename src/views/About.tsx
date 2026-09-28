import { Target, Heart, Zap, Users, Award, Globe } from 'lucide-react'
import { CtaSection } from '../components/CtaSection'
import { GradientText } from '../components/ScrollAnimations'
import { getDictionary, localePath, type Locale } from '../i18n'

export function About({ locale }: { locale: Locale }) {
  const a = getDictionary(locale).about
  const valueIcons = [Target, Heart, Zap]
  const whyIcons = [Users, Award, Globe, Zap]

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow section-glow--hero">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">{a.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4 md:mb-6">{a.title}</h1>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
            {a.text}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">{a.storyEyebrow}</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 mb-4 md:mb-6">{a.storyTitle}</h2>
          <div className="space-y-3 md:space-y-4 text-sm md:text-base text-zinc-400 leading-relaxed">
            {a.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">{a.valuesEyebrow}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">{a.valuesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {a.values.map((value, i) => {
              const Icon = valueIcons[i]
              return (
                <ValueCard
                  key={value.title}
                  icon={<Icon className="w-6 md:w-7 h-6 md:h-7" />}
                  title={value.title}
                  description={value.description}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">{a.whyEyebrow}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">{a.whyTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {a.why.map((item, i) => {
              const Icon = whyIcons[i]
              return (
                <FeatureItem
                  key={item.title}
                  icon={<Icon className="w-5 md:w-6 h-5 md:h-6" />}
                  title={item.title}
                  description={item.description}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={<>{a.cta.title.before}<GradientText>{a.cta.title.highlight}</GradientText>{a.cta.title.after}</>}
        description={a.cta.description}
        primary={{ label: a.cta.primary, to: localePath(locale, '/contact') }}
      />
    </div>
  )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-5 md:p-8 bg-dark-card border border-dark-border rounded-xl md:rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 group">
      <div className="w-11 md:w-14 h-11 md:h-14 flex items-center justify-center bg-neon-green/10 rounded-lg md:rounded-xl text-neon-green mb-4 md:mb-6 group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{title}</h3>
      <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3 md:gap-4 p-4 md:p-6 bg-dark-card border border-dark-border rounded-xl md:rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 group">
      <div className="w-10 md:w-12 h-10 md:h-12 flex-shrink-0 flex items-center justify-center bg-neon-green/10 rounded-lg md:rounded-xl text-neon-green group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">{title}</h3>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
