import { Link } from 'react-router-dom'
import { Target, Heart, Zap, Users, Award, Globe, ArrowRight } from 'lucide-react'

export function About() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">ABOUT US</span>
          <h1 className="text-5xl font-bold text-white mt-4 mb-6">We're a Team of Digital Craftspeople</h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Founded in 2019, Bezikee has grown from a small freelance operation to a full-service digital agency helping businesses across Europe achieve their digital goals.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-20 bg-dark-bg">
        <div className="grid grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR STORY</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-6">From Passion to Purpose</h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                Bezikee started with a simple belief: every business deserves access to high-quality digital solutions, regardless of size or budget.
              </p>
              <p>
                Our founder, after years of working with enterprise clients, noticed that small and medium businesses were often priced out of professional web development. That's when Bezikee was born.
              </p>
              <p>
                Today, we've helped over 50 businesses establish their digital presence, from local startups to international companies. Our team has grown, but our mission remains the same: deliver exceptional digital products that drive real business results.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatBox value="50+" label="Projects Completed" />
            <StatBox value="5+" label="Years Experience" />
            <StatBox value="98%" label="Client Satisfaction" />
            <StatBox value="12" label="Countries Served" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR VALUES</span>
            <h2 className="text-4xl font-bold text-white mt-4">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <ValueCard
              icon={<Target className="w-7 h-7" />}
              title="Results-Driven"
              description="We measure success by the results we deliver. Every line of code, every design decision is made with your business goals in mind."
            />
            <ValueCard
              icon={<Heart className="w-7 h-7" />}
              title="Client-Focused"
              description="Your success is our success. We build lasting relationships through transparency, communication, and genuine care for your project."
            />
            <ValueCard
              icon={<Zap className="w-7 h-7" />}
              title="Innovation"
              description="We stay ahead of the curve, constantly learning and adopting new technologies to give you a competitive edge."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-20 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR TEAM</span>
            <h2 className="text-4xl font-bold text-white mt-4">Meet the People Behind Bezikee</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <TeamMember
              name="Carlos Rodríguez"
              role="Founder & Lead Developer"
              initials="CR"
            />
            <TeamMember
              name="Elena Martínez"
              role="UI/UX Designer"
              initials="EM"
            />
            <TeamMember
              name="David Fernández"
              role="Full Stack Developer"
              initials="DF"
            />
            <TeamMember
              name="Ana García"
              role="Project Manager"
              initials="AG"
            />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-neon-green tracking-widest">WHY CHOOSE US</span>
            <h2 className="text-4xl font-bold text-white mt-4">What Sets Us Apart</h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <FeatureItem
              icon={<Users className="w-6 h-6" />}
              title="Dedicated Team"
              description="You get a dedicated team that knows your project inside and out, not a rotating cast of developers."
            />
            <FeatureItem
              icon={<Award className="w-6 h-6" />}
              title="Quality Guaranteed"
              description="We don't cut corners. Every project goes through rigorous testing before delivery."
            />
            <FeatureItem
              icon={<Globe className="w-6 h-6" />}
              title="European Expertise"
              description="We understand the European market, regulations, and business culture."
            />
            <FeatureItem
              icon={<Zap className="w-6 h-6" />}
              title="Fast Turnaround"
              description="Our streamlined processes mean you get your project delivered on time, every time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-20 bg-neon-green">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Let's Work Together</h2>
          <p className="text-lg text-white/90 mb-8">
            Ready to join our growing list of satisfied clients? Let's discuss your project.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start a Conversation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg transition-all duration-300 text-center group">
      <div className="text-4xl font-bold text-neon-green mb-2 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300">
        {value}
      </div>
      <div className="text-zinc-400">{label}</div>
    </div>
  )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 group">
      <div className="w-14 h-14 flex items-center justify-center bg-neon-green/10 rounded-xl text-neon-green mb-6 group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

function TeamMember({ name, role, initials }: { name: string; role: string; initials: string }) {
  return (
    <div className="p-6 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-[1.03] transition-all duration-300 text-center group">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green text-2xl font-bold group-hover:bg-neon-green/30 group-hover:shadow-neon transition-all duration-300">
        {initials}
      </div>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-zinc-500 text-sm mt-1">{role}</p>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-6 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-300 group">
      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-neon-green/10 rounded-xl text-neon-green group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
