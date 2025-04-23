import React, { useState, useEffect, useMemo } from "react";

import BlogBanner from "~/src/components/common/Banner/banner";
import Carousel from "~/src/components/common/Carousel/carousel";
import Container from "~/src/components/layout/Container/container";

import { MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";

import { DataCarousel } from "~/src/data/carousel/carousel";

import { motion } from "framer-motion";
import { cn } from "~/src/lib/utils";
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
  import("~/src/components/contact/Map/map").then((module) => ({
    default: module.default as React.ComponentType<{
      coordinates: [number, number];
      companyName: string;
      address: string;
    }>,
  }))
);

export default function ContactPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This information could come from an API or configuration file
  const contactInfo: ContactInfo = {
    companyName: "Ecliptica - Novos Horizontes - Hoje",
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
      sunday: "Fechado",
    },
  };

  const fullAddress = useMemo(() => {
    const { street, city, state, postalCode, country } = contactInfo.address;
    return `${street}, ${city}, ${state}, ${postalCode}, ${country}`;
  }, [contactInfo]);

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  };

  const contactSections = [
    {
      id: "address",
      icon: MapPin,
      title: "Endereço",
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
      title: "Telefone",
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
      title: "Horário de Funcionamento",
      content: (
        <>
          <p className="text-neutral-600">
            Segunda a Sexta: {contactInfo.businessHours.weekdays}
          </p>
          <p className="text-neutral-600">
            Sábado: {contactInfo.businessHours.saturday}
          </p>
          <p className="text-neutral-600">
            Domingo: {contactInfo.businessHours.sunday}
          </p>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="full" padding={false}>
      <div className="container max-w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-full mb-20 text-center"
        >
          <Carousel
              items={DataCarousel}
              variant="minimal"
              contentPosition="center"
              showDots={true}
              showProgress={false}
              height="h-[80vh]"
              className="absolute inset-0"
            />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform">
              <button
                onClick={scrollToContent}
                className="flex flex-col items-center justify-center text-white transition-opacity duration-300 hover:opacity-70"
                aria-label="Scroll to content"
              >
                <span className="mb-2 font-serif text-sm tracking-widest">
                  DESCUBRA
                </span>
                <ChevronDown className="h-6 mb-16 w-6 animate-bounce" />
              </button>
            </div>
        </motion.div>

        <div className="mx-auto max-w-full">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
            >
              <motion.div
                variants={itemVariants}
                className="border-b border-neutral-100 pb-4"
              >
                <h2 className="text-xl font-light text-neutral-900 sm:text-2xl">
                  {contactInfo.companyName}
                </h2>
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
                            : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
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
                  Email
                </a>
                <a
                  href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Telefone
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
              <div className="h-[400px] sm:h-[500px] w-full">
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
                      <p className="text-neutral-500">
                        Mapa Em Seu Browser
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
        <BlogBanner/>
      </div>
    </Container>
  );
}
