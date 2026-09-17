import { Target, Heart, Zap, Users, Award, Globe } from 'lucide-react'
import { CtaSection } from '../components/CtaSection'
import { GradientText } from '../components/ScrollAnimations'

export function About() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow section-glow--hero">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">ABOUT US</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4 md:mb-6">We're a Team of Digital Craftspeople</h1>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
            Bezikee is a new software development agency built on a simple idea: every business deserves digital products that are well designed, well built and actually help it grow.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">OUR STORY</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 mb-4 md:mb-6">From Passion to Purpose</h2>
          <div className="space-y-3 md:space-y-4 text-sm md:text-base text-zinc-400 leading-relaxed">
            <p>
              Bezikee started with a simple belief: every business deserves access to high-quality digital solutions, regardless of size or budget.
            </p>
            <p>
              Too often, small and medium businesses are priced out of professional development or handed a template that doesn't fit how they work. We started Bezikee to close that gap.
            </p>
            <p>
              We're just getting started, and our first clients get the most out of it: our full attention on every project, clear pricing agreed upfront, and a team determined to prove what it can build.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR VALUES</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <ValueCard
              icon={<Target className="w-6 md:w-7 h-6 md:h-7" />}
              title="Results-Driven"
              description="We measure success by the results we deliver. Every line of code, every design decision is made with your business goals in mind."
            />
            <ValueCard
              icon={<Heart className="w-6 md:w-7 h-6 md:h-7" />}
              title="Client-Focused"
              description="Your success is our success. We build lasting relationships through transparency, communication, and genuine care for your project."
            />
            <ValueCard
              icon={<Zap className="w-6 md:w-7 h-6 md:h-7" />}
              title="Innovation"
              description="We stay ahead of the curve, constantly learning and adopting new technologies to give you a competitive edge."
            />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">WHY CHOOSE US</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4">What Sets Us Apart</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <FeatureItem
              icon={<Users className="w-5 md:w-6 h-5 md:h-6" />}
              title="Dedicated Team"
              description="You get a dedicated team that knows your project inside and out, not a rotating cast of developers."
            />
            <FeatureItem
              icon={<Award className="w-5 md:w-6 h-5 md:h-6" />}
              title="Quality Guaranteed"
              description="We don't cut corners. Every project goes through rigorous testing before delivery."
            />
            <FeatureItem
              icon={<Globe className="w-5 md:w-6 h-5 md:h-6" />}
              title="European Expertise"
              description="We understand the European market, regulations, and business culture."
            />
            <FeatureItem
              icon={<Zap className="w-5 md:w-6 h-5 md:h-6" />}
              title="Fast Turnaround"
              description="Clear milestones and realistic timelines agreed before we start, so you always know when to expect delivery."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={<>Let's Work <GradientText>Together</GradientText></>}
        description="Have an idea or a project in mind? Let's talk about how we can build it together."
        primary={{ label: 'Start a Conversation', to: '/contact' }}
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
