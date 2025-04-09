import React, { useState, useEffect, useMemo } from 'react';

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "~/src/lib/utils"
// Configure tipos para suas informações de contato
interface ContactInfo {
  companyName: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates: [number, number]; // [latitude, longitude]
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

// Componente para o mapa que será carregado apenas no cliente
const MapComponent = React.lazy(() =>
  import('~/src/components/contact/map').then((module) => ({
    default: module.default as React.ComponentType<{
      coordinates: [number, number]
      companyName: string
      address: string
    }>
  }))
)

export default function ContactPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // This information could come from an API or configuration file
  const contactInfo: ContactInfo = {
    companyName: "Fashion Store",
    address: {
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      postalCode: "01310-100",
      country: "Brasil",
    },
    coordinates: [-23.5653, -46.6543], // São Paulo coordinates (example)
    phone: "+55 (11) 91234-5678",
    email: "contato@fashionstore.com.br",
    businessHours: {
      weekdays: "09:00 - 18:00",
      saturday: "10:00 - 16:00",
      sunday: "Closed",
    },
  }

  const fullAddress = useMemo(() => {
    const { street, city, state, postalCode, country } = contactInfo.address
    return `${street}, ${city}, ${state}, ${postalCode}, ${country}`
  }, [contactInfo])
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const contactSections = [
    {
      id: "address",
      icon: MapPin,
      title: "Address",
      content: (
        <>
          <p className="text-neutral-600">{contactInfo.address.street}</p>
          <p className="text-neutral-600">
            {contactInfo.address.city}, {contactInfo.address.state}
          </p>
          <p className="text-neutral-600">
            {contactInfo.address.postalCode}, {contactInfo.address.country}
          </p>
        </>
      ),
    },
    {
      id: "phone",
      icon: Phone,
      title: "Phone",
      content: <p className="text-neutral-600">{contactInfo.phone}</p>,
    },
    {
      id: "email",
      icon: Mail,
      title: "Email",
      content: <p className="text-neutral-600">{contactInfo.email}</p>,
    },
    {
      id: "hours",
      icon: Clock,
      title: "Business Hours",
      content: (
        <>
          <p className="text-neutral-600">Monday to Friday: {contactInfo.businessHours.weekdays}</p>
          <p className="text-neutral-600">Saturday: {contactInfo.businessHours.saturday}</p>
          <p className="text-neutral-600">Sunday: {contactInfo.businessHours.sunday}</p>
        </>
      ),
    },
  ]

  return (
    <div className="bg-neutral-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-neutral-600">We'd love to hear from you. Here's how you can reach us.</p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
            >
              <motion.div variants={itemVariants} className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-light text-neutral-900 sm:text-2xl">{contactInfo.companyName}</h2>
              </motion.div>

              <div className="space-y-8">
                {contactSections.map((section) => (
                  <motion.div
                    key={section.id}
                    variants={itemVariants}
                    className="group"
                    onMouseEnter={() => setActiveSection(section.id)}
                    onMouseLeave={() => setActiveSection(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                          activeSection === section.id
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200",
                        )}
                      >
                        <section.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-neutral-500">
                          {section.title}
                        </h3>
                        <div className="space-y-1">{section.content}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap items-center justify-start gap-4 border-t border-neutral-100 pt-6"
              >
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
                <a
                  href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </a>
              </motion.div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="h-[400px] sm:h-[500px]">
                {isClient ? (
                  <MapComponent
                    coordinates={contactInfo.coordinates}
                    companyName={contactInfo.companyName}
                    address={fullAddress}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-neutral-50">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                      <p className="text-neutral-500">Map will load in browser</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Contact Form Section - Optional, can be uncommented if needed */}
          {/* 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="mb-6 text-xl font-light text-neutral-900 sm:text-2xl">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-neutral-200 p-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-neutral-200 p-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-neutral-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-lg border border-neutral-200 p-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-lg border border-neutral-200 p-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </motion.div>
          */}
        </div>
      </div>
    </div>
  )
}
