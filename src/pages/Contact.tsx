import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call - In production, connect to Formspree, EmailJS, or your backend
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-20">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-10 h-10 text-neon-green" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Message Sent!</h1>
          <p className="text-lg text-zinc-400 mb-8">
            Thank you for reaching out! We've received your message and will get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', company: '', phone: '', service: '', budget: '', message: '' })
            }}
            className="px-8 py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">GET IN TOUCH</span>
          <h1 className="text-5xl font-bold text-white mt-4 mb-6">Let's Build Something Amazing Together</h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Have a project in mind? We'd love to hear about it. Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-20 bg-dark-bg">
        <div className="grid grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <p className="text-zinc-400 leading-relaxed">
                Ready to start your project? Get in touch with us through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              <ContactInfo
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value="hello@bezikee.com"
                href="mailto:hello@bezikee.com"
              />
              <ContactInfo
                icon={<Phone className="w-5 h-5" />}
                label="Phone"
                value="+34 612 345 678"
                href="tel:+34612345678"
              />
              <ContactInfo
                icon={<MapPin className="w-5 h-5" />}
                label="Location"
                value="Madrid, Spain"
              />
              <ContactInfo
                icon={<Clock className="w-5 h-5" />}
                label="Response Time"
                value="Within 24 hours"
              />
            </div>

            <div className="p-6 bg-dark-card rounded-2xl border border-dark-border shadow-neon">
              <h3 className="text-lg font-semibold text-white mb-3">Office Hours</h3>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>Monday - Friday: 9:00 AM - 6:00 PM (CET)</p>
                <p>Saturday: 10:00 AM - 2:00 PM (CET)</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="p-8 bg-dark-card rounded-2xl border border-dark-border shadow-neon">
              <h2 className="text-2xl font-bold text-white mb-8">Send Us a Message</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <FormInput
                  label="Company Name"
                  name="company"
                  type="text"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+34 612 345 678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <FormSelect
                  label="Service Interested In"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select a service' },
                    { value: 'web', label: 'Web Development' },
                    { value: 'mobile', label: 'Mobile App Development' },
                    { value: 'software', label: 'Custom Software' },
                    { value: 'design', label: 'UI/UX Design' },
                    { value: 'consulting', label: 'Consulting' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
                <FormSelect
                  label="Estimated Budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select budget range' },
                    { value: '500', label: '€500 - €1,000' },
                    { value: '1000', label: '€1,000 - €5,000' },
                    { value: '5000', label: '€5,000 - €10,000' },
                    { value: '10000', label: '€10,000 - €25,000' },
                    { value: '25000', label: '€25,000+' }
                  ]}
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Project Details <span className="text-neon-green">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, goals, and timeline..."
                  rows={5}
                  className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-neon-green focus:shadow-neon transition-all duration-300 resize-none ${
                    errors.message ? 'border-red-500' : 'border-dark-border'
                  }`}
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              <p className="mt-4 text-sm text-zinc-500 text-center">
                By submitting this form, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-20 bg-dark-section">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-neon-green tracking-widest">FAQ</span>
            <h2 className="text-4xl font-bold text-white mt-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="How long does a typical project take?"
              answer="Project timelines vary based on complexity. A simple website takes 2-4 weeks, while custom applications can take 2-6 months. We'll provide a detailed timeline during our initial consultation."
            />
            <FAQItem
              question="What is your payment structure?"
              answer="We typically work with a 50% upfront deposit and 50% upon completion. For larger projects, we can arrange milestone-based payments. We accept bank transfers and major credit cards."
            />
            <FAQItem
              question="Do you provide ongoing support?"
              answer="Yes! All our packages include a support period. We also offer maintenance packages for long-term support, updates, and improvements to keep your digital products running smoothly."
            />
            <FAQItem
              question="Can you work with our existing team?"
              answer="Absolutely. We frequently collaborate with in-house teams and can adapt our workflow to integrate seamlessly with your existing processes and tools."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactInfo({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 group cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center bg-neon-green/10 rounded-xl text-neon-green group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="text-white font-medium group-hover:text-neon-green transition-colors duration-300">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }
  return content
}

function FormInput({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  required
}: {
  label: string
  name: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        {label} {required && <span className="text-neon-green">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-neon-green focus:shadow-neon transition-all duration-300 ${
          error ? 'border-red-500' : 'border-dark-border'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  options
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-green focus:shadow-neon transition-all duration-300 appearance-none cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`p-6 bg-dark-card rounded-2xl border transition-all duration-300 cursor-pointer ${
        isOpen ? 'border-neon-green shadow-neon' : 'border-dark-border hover:border-neon-green/50'
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{question}</h3>
        <span className={`text-neon-green transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <p className="mt-4 text-zinc-400 leading-relaxed">{answer}</p>
      )}
    </div>
  )
}
