'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react'
import type { Dictionary, Locale } from '../i18n'

// Takes its copy as a prop rather than importing the dictionaries: this is a client
// component, and importing them would ship every language to every visitor.
export function Contact({ locale, t }: { locale: Locale; t: Dictionary['contact'] }) {
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
  const [submitError, setSubmitError] = useState('')
  // Hidden from people, visible to bots; a filled value means the submission is automated
  const [website, setWebsite] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = t.errors.nameRequired
    if (!formData.email.trim()) newErrors.email = t.errors.emailRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.errors.emailInvalid
    if (!formData.message.trim()) newErrors.message = t.errors.messageRequired
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website, locale }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setIsSubmitted(true)
    } catch {
      // Only claim the message was sent when it actually was; otherwise offer the address
      // directly so the enquiry isn't lost to a failure the visitor can't see
      setSubmitError(t.errors.sendFailed)
    } finally {
      setIsSubmitting(false)
    }
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
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-lg text-center">
          <div className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-neon-green/20 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-8 md:w-10 h-8 md:h-10 text-neon-green" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t.sentTitle}</h1>
          <p className="text-base md:text-lg text-zinc-400 mb-6 md:mb-8">
            {t.sentText}
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', company: '', phone: '', service: '', budget: '', message: '' })
            }}
            className="px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300"
          >
            {t.sendAnother}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 section-glow section-glow--hero">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-neon-green tracking-widest">{t.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4 md:mb-6">{t.title}</h1>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
            {t.text}
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6 md:space-y-8 lg:order-1 order-2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">{t.infoTitle}</h2>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
                {t.infoText}
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <ContactInfo
                icon={<Mail className="w-5 h-5" />}
                label={t.email}
                value="wearebezikee@gmail.com"
                href="mailto:wearebezikee@gmail.com"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 lg:order-2 order-1">
            <form onSubmit={handleSubmit} className="relative p-5 md:p-8 bg-dark-card rounded-xl md:rounded-2xl border border-dark-border shadow-neon">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">{t.formTitle}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <FormInput
                  label={t.fields.name}
                  name="name"
                  type="text"
                  placeholder={t.fields.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <FormInput
                  label={t.fields.email}
                  name="email"
                  type="email"
                  placeholder={t.fields.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <FormInput
                  label={t.fields.company}
                  name="company"
                  type="text"
                  placeholder={t.fields.companyPlaceholder}
                  value={formData.company}
                  onChange={handleChange}
                />
                <FormInput
                  label={t.fields.phone}
                  name="phone"
                  type="tel"
                  placeholder={t.fields.phonePlaceholder}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <FormSelect
                  label={t.fields.service}
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  // Values are the English names whatever the page language: the only consumer
                  // is the notification email, and a code like "web" tells the reader less
                  // than "Web Development"
                  options={[
                    { value: '', label: t.fields.servicePlaceholder },
                    ...Object.entries(t.serviceOptions).map(([value, label]) => ({ value, label })),
                  ]}
                />
                <FormSelect
                  label={t.fields.budget}
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  // Likewise the budget: the old values were the lower bound alone, so a
                  // €1,000-€5,000 enquiry arrived as "1000" and read as a flat €1,000
                  options={[
                    { value: '', label: t.fields.budgetPlaceholder },
                    ...Object.entries(t.budgetOptions).map(([value, label]) => ({ value, label })),
                  ]}
                />
              </div>

              <div className="mb-6 md:mb-8">
                <label className="block text-xs md:text-sm font-medium text-zinc-300 mb-1.5 md:mb-2">
                  {t.fields.message} <span className="text-neon-green">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.fields.messagePlaceholder}
                  rows={5}
                  className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-bg border rounded-lg text-sm md:text-base text-white placeholder-zinc-600 focus:outline-none focus:border-neon-green focus:shadow-neon transition-all duration-300 resize-none ${
                    errors.message ? 'border-red-500' : 'border-dark-border'
                  }`}
                />
                {errors.message && <p className="mt-1 text-xs md:text-sm text-red-500">{errors.message}</p>}
              </div>

              {/* Off-screen rather than display:none, which some bots skip. aria-hidden and
                  tabIndex keep it away from screen readers and keyboard users. */}
              <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                <label htmlFor="website">{t.honeypot}</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {submitError && (
                <div role="alert" className="mb-3 md:mb-4 p-3 md:p-4 rounded-lg border border-red-500/40 bg-red-500/10">
                  <p className="text-xs md:text-sm text-red-400">
                    {submitError}{' '}
                    {t.errors.emailUsDirectly}{' '}
                    <a href="mailto:wearebezikee@gmail.com" className="underline hover:text-red-300">
                      wearebezikee@gmail.com
                    </a>
                    .
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-4 md:w-5 h-4 md:h-5" />
                    {t.send}
                  </>
                )}
              </button>

              <p className="mt-3 md:mt-4 text-xs md:text-sm text-zinc-500 text-center">
                {t.consent}
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactInfo({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3 md:gap-4 group cursor-pointer">
      <div className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center bg-neon-green/10 rounded-lg md:rounded-xl text-neon-green group-hover:bg-neon-green/20 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-xs md:text-sm text-zinc-500">{label}</p>
        <p className="text-sm md:text-base text-white font-medium group-hover:text-neon-green transition-colors duration-300">{value}</p>
      </div>
    </div>
  )

  if (href) {
    // block, not the default inline: the list spaces its rows with space-y-*, which sets
    // margin-top, and an inline element ignores vertical margins
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
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
      <label className="block text-xs md:text-sm font-medium text-zinc-300 mb-1.5 md:mb-2">
        {label} {required && <span className="text-neon-green">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-bg border rounded-lg text-sm md:text-base text-white placeholder-zinc-600 focus:outline-none focus:border-neon-green focus:shadow-neon transition-all duration-300 ${
          error ? 'border-red-500' : 'border-dark-border'
        }`}
      />
      {error && <p className="mt-1 text-xs md:text-sm text-red-500">{error}</p>}
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
      <label className="block text-xs md:text-sm font-medium text-zinc-300 mb-1.5 md:mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-bg border border-dark-border rounded-lg text-sm md:text-base text-white focus:outline-none focus:border-neon-green focus:shadow-neon transition-all duration-300 appearance-none cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}
