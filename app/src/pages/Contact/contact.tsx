import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

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
const MapComponent = React.lazy(() => import('~/src/components/contact/map'));

export const ContactPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Essas informações podem vir de uma API ou arquivo de configuração
  const contactInfo: ContactInfo = {
    companyName: "Fashion Store",
    address: {
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      postalCode: "01310-100",
      country: "Brasil"
    },
    coordinates: [-23.5653, -46.6543], // Coordenadas de São Paulo (exemplo)
    phone: "+55 (11) 91234-5678",
    email: "contato@fashionstore.com.br",
    businessHours: {
      weekdays: "09:00 - 18:00",
      saturday: "10:00 - 16:00",
      sunday: "Fechado"
    }
  };

  const fullAddress = `${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state}, ${contactInfo.address.postalCode}, ${contactInfo.address.country}`;

  return (
    <div className="contact-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">{contactInfo.companyName}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Endereço:</h3>
                  <p>{contactInfo.address.street}</p>
                  <p>{contactInfo.address.city}, {contactInfo.address.state}</p>
                  <p>{contactInfo.address.postalCode}, {contactInfo.address.country}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaPhone className="text-primary mr-3" />
                <div>
                  <h3 className="font-medium">Telefone:</h3>
                  <p>{contactInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaEnvelope className="text-primary mr-3" />
                <div>
                  <h3 className="font-medium">Email:</h3>
                  <p>{contactInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaClock className="text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Horário de Funcionamento:</h3>
                  <p>Segunda a Sexta: {contactInfo.businessHours.weekdays}</p>
                  <p>Sábado: {contactInfo.businessHours.saturday}</p>
                  <p>Domingo: {contactInfo.businessHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mapa - carregado condicionalmente apenas no cliente */}
          <div className="h-96 bg-gray-100 rounded-lg shadow-md overflow-hidden">
            {isClient ? (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full">Carregando mapa...</div>}>
                <MapComponent 
                  coordinates={contactInfo.coordinates}
                  companyName={contactInfo.companyName}
                  address={fullAddress}
                />
              </React.Suspense>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FaMapMarkerAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500">Mapa será carregado no navegador</p>
                </div>
              </div>
            )}
          </div>
        </div>
     
      </div>
    </div>
  );
};
