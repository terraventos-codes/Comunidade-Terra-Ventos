"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "pt" | "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translations
const translations = {
  pt: {
    // Navigation
    "nav.why-join": "Por que fazer parte",
    "nav.mission": "A Comunidade",
    "nav.founder": "Fundador",
    "nav.faq": "FAQ",
    "nav.join-community": "Junte-se à Comunidade",

    // Hero Section
    "hero.exclusive": "Comunidade Exclusiva",
    "hero.community": "Comunidade",
    "hero.title": "Terra Ventos",
    "hero.subtitle": "Onde investir é viver",
    "hero.description":
      "Junte-se a uma rede exclusiva de investidores, kitesurfistas e amantes do litoral nordestino. Acesso antecipado a oportunidades imobiliárias, curadoria jurídica e um lifestyle conectado ao vento e ao mar.",
    "hero.cta": "Junte-se à Comunidade",
    "hero.discover": "Conheça as Oportunidades",
    "hero.loading": "Carregando Vídeo",
    "hero.loading.subtitle": "Aguarde...",
    "hero.video.error": "Erro ao carregar vídeo",
    "hero.video.error.subtitle": "Verifique sua conexão e tente novamente",

    // Problem Section
    "problem.title": "O Problema",
    "problem.subtitle": "Oportunidades perdidas no litoral cearense",
    "problem.description":
      "O mercado imobiliário no litoral do Ceará está em expansão, mas muitas oportunidades são perdidas por falta de informação, conexões e curadoria especializada.",

    // Solution Section
    "solution.title": "A Solução",
    "solution.subtitle": "Terra Ventos: Sua ponte para o litoral nordestino",
    "solution.description":
      "Uma comunidade exclusiva que conecta investidores qualificados a oportunidades imobiliárias curadas no litoral cearense, com foco em lifestyle e sustentabilidade.",
    "solution.connections.title": "Conexões",
    "solution.connections.description":
      "Na Terra Ventos, o litoral do Ceará se torna um ponto de encontro sem fronteiras. Aqui, você se conecta com pessoas que buscam unir oportunidades com o lifestyle do litoral, criando relações autênticas que vão além dos negócios.",
    "solution.see.how": "Entre agora na comunidade",

    // Benefits Section
    "benefits.title": "Benefícios Exclusivos",
    "benefits.subtitle": "Por que fazer parte da Terra Ventos",

    // Stats Section
    "stats.investors": "Investidores Ativos",
    "stats.properties": "Propriedades Curadas",
    "stats.community": "Anos de Experiência",
    "stats.volume": "Volume Investido",
    "stats.value": "R$ 50M+",

    // FAQ Section
    "faq.title": "Dúvidas Frequentes",
    "faq.subtitle": "Tire suas dúvidas sobre a Terra Ventos",

    // Contact
    "contact.title": "Entre em Contato",
    "contact.subtitle": "Pronto para fazer parte da comunidade?",

    // Footer
    "footer.rights": "Todos os direitos reservados.",
    "footer.company": "Terra Ventos",
    "footer.description":
      "Comunidade exclusiva de investidores e amantes do litoral nordestino.",
    "footer.about": "Sobre",
    "footer.opportunities": "Oportunidades",
    "footer.lifestyle": "Lifestyle",
    "footer.privacy": "Política de Privacidade",
    "footer.accessibility": "Acessibilidade",
    "footer.address.preá":
      "Rua Antônio Chagas, nº 857 - Preá, Cruz - CE, 62595-000",
    "footer.address.fortaleza":
      "Rua Monsenhor Bruno, nº 1153, sala 608, Aldeota, Fortaleza - CE, 60115-191",
    "whatsapp.talk": "Fale com nossa equipe",

    // Signup Modal
    "signup.title": "Terra Ventos Comunidade,",
    "signup.title2": "Vento a Favor.",
    "signup.subtitle":
      "Uma comunidade para quem busca investir na costa com segurança, bem-estar e um novo estilo de vida.",
    "signup.subtitle.line1":
      "Os ventos do nordeste, casas e terrenos costeiros:",
    "signup.subtitle.line2": "você construindo o futuro do litoral brasileiro.",
    "signup.subtitle.line3":
      "Uma comunidade para quem busca investir na costa com segurança, bem-estar e um novo estilo de vida.",
    "signup.name": "Nome completo",
    "signup.email": "E-mail",
    "signup.phone": "Telefone/WhatsApp",
    "signup.budget": "Faixa de investimento",
    "signup.interest": "Interesse principal",
    "signup.kitesurf": "Kitesurf",
    "signup.investment": "Investimento",
    "signup.lifestyle": "Lifestyle",
    "signup.other": "Outro",
    "signup.message": "Conte-nos sobre seus interesses",
    "signup.submit": "Enviar Cadastro",
    "signup.success": "Cadastro realizado com sucesso!",
    "signup.error": "Erro ao enviar cadastro. Tente novamente.",
    "signup.country": "País/Estado",
    "signup.calendar": "Data/Hora do Calendário",
    "signup.accept":
      "Aceito receber comunicações da Terra Ventos sobre oportunidades",
    "signup.privacy": "Seus dados estão protegidos, conforme nossa",
    "signup.privacy.link": "Política de Privacidade",
    "signup.submitting": "Enviando...",
    "signup.join": "Quero fazer parte",
    "signup.select": "Selecione",
    "signup.option.houses": "Casas",
    "signup.option.lands": "Terrenos",
    "signup.option.condos": "Condominios",
    "signup.option.hotels": "Hotéis e Pousadas",
    "signup.option.other": "Outro:",
    "signup.range.up100k": "Até R$ 100.000",
    "signup.range.100k500k": "R$ 100.000 - R$ 500.000",
    "signup.range.500k1m": "R$ 500.000 - R$ 1.000.000",
    "signup.range.1m5m": "R$ 1.000.000 - R$ 5.000.000",
    "signup.range.above5m": "Acima de R$ 5.000.000",

    // FAQ Section
    "faq.question1": "Como funciona a comunidade Terra Ventos?",
    "faq.answer1":
      "A Terra Ventos é uma comunidade exclusiva que conecta investidores qualificados a oportunidades imobiliárias curadas no litoral cearense, com foco em lifestyle e sustentabilidade.",
    "faq.question2": "Quais são os benefícios de fazer parte?",
    "faq.answer2":
      "Acesso antecipado a oportunidades, curadoria jurídica especializada, network exclusivo e lifestyle conectado ao vento e ao mar.",
    "faq.question3": "Qual o valor mínimo para investir?",
    "faq.answer3":
      "Trabalhamos com diferentes faixas de investimento. Entre em contato para conhecer as oportunidades disponíveis.",
    "faq.question4": "Como posso participar de eventos?",
    "faq.answer4":
      "Membros da comunidade recebem convites exclusivos para eventos, workshops e encontros relacionados ao lifestyle e investimentos.",

    // Benefits Section
    "benefits.exclusive": "Acesso Exclusivo",
    "benefits.exclusive.free": "100% Gratuito",
    "benefits.exclusive.desc":
      "Receba as oportunidades do mercado de forma antecipada",
    "benefits.network": "Networking Global",
    "benefits.network.desc":
      "Se conecte com investidores e atletas do Brasil e do mundo",
    "benefits.legal": "Segurança Jurídica",
    "benefits.legal.desc":
      "Terrenos e imóveis 100% regularizados e matriculas verificadas para investimento",
    "benefits.events": "Eventos e Experiências",
    "benefits.events.desc":
      "Participe de eventos onlines, presenciais e ativações da comunidade",
    "benefits.concierge": "Atendimento Consultivo",
    "benefits.concierge.desc": "Concierge de investimento e suporte bilingue.",

    // Stats Section
    "stats.experience": "Anos de Experiência",
    "stats.properties.sold": "Propriedades Vendidas",
    "stats.satisfaction": "Taxa de Satisfação",

    // Founder Section
    "founder.name": "Bernardo Carvalho Wertheim",
    "founder.title": "Fundador e CEO",
    "founder.heading": "Idealizador do Projeto",
    "founder.description":
      "Empreendedor com carreira internacional (ex-Bloomberg e Accenture), fundou a Terra Ventos com a missão de remodelar o mercado imobiliário litorâneo unindo impacto social, lifestyle e segurança.",
    "founder.experience.title": "Nossa experiência",
    "founder.experience.description":
      "15+ anos em scouting e desenvolvimento no litoral cearense, com parcerias locais e curadoria rigorosa.",

    // Language Selector
    "language.pt": "Português",
    "language.en": "English",
    "language.es": "Español",
  },
  en: {
    // Navigation
    "nav.why-join": "Why Join",
    "nav.mission": "The Community",
    "nav.founder": "Founder",
    "nav.faq": "FAQ",
    "nav.join-community": "Join the Community",

    // Hero Section
    "hero.exclusive": "Exclusive Community",
    "hero.community": "Community",
    "hero.title": "Terra Ventos",
    "hero.subtitle": "Where investing is living",
    "hero.description":
      "Join an exclusive network of investors, kitesurfers and lovers of the northeastern coast. Early access to real estate opportunities, legal curation and lifestyle connected to wind and sea.",
    "hero.cta": "Join the Community",
    "hero.discover": "Discover Opportunities",
    "hero.loading": "Loading Video",
    "hero.loading.subtitle": "Please wait...",
    "hero.video.error": "Error loading video",
    "hero.video.error.subtitle": "Check your connection and try again",

    // Problem Section
    "problem.title": "The Problem",
    "problem.subtitle": "Lost opportunities on the Ceará coast",
    "problem.description":
      "The real estate market on the Ceará coast is expanding, but many opportunities are lost due to lack of information, connections and specialized curation.",

    // Solution Section
    "solution.title": "The Solution",
    "solution.subtitle": "Terra Ventos: Your bridge to the northeastern coast",
    "solution.description":
      "An exclusive community that connects qualified investors to curated real estate opportunities on the Ceará coast, focusing on lifestyle and sustainability.",
    "solution.connections.title": "Connections",
    "solution.connections.description":
      "In Terra Ventos, the coast of Ceará becomes a borderless meeting point. Here, you connect with people who seek to unite opportunities with coastal lifestyle, creating authentic relationships that go beyond business.",
    "solution.see.how": "Join the community now",

    // Benefits Section
    "benefits.title": "Exclusive Benefits",
    "benefits.subtitle": "Why join Terra Ventos",

    // Stats Section
    "stats.investors": "Active Investors",
    "stats.properties": "Curated Properties",
    "stats.community": "Years of Experience",
    "stats.volume": "Volume Invested",
    "stats.value": "$9M+",

    // FAQ Section
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Get your questions answered about Terra Ventos",

    // Contact
    "contact.title": "Get in Touch",
    "contact.subtitle": "Ready to join the community?",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.company": "Terra Ventos",
    "footer.description":
      "Exclusive community of investors and lovers of the northeastern coast.",
    "footer.about": "About",
    "footer.opportunities": "Opportunities",
    "footer.lifestyle": "Lifestyle",
    "footer.privacy": "Privacy Policy",
    "footer.accessibility": "Accessibility",
    "footer.address.preá":
      "Rua Antônio Chagas, nº 857 - Preá, Cruz - CE, 62595-000",
    "footer.address.fortaleza":
      "Rua Monsenhor Bruno, nº 1153, sala 608, Aldeota, Fortaleza - CE, 60115-191",
    "whatsapp.talk": "Talk to our team",

    // Signup Modal
    "signup.title": "Terra Ventos Community,",
    "signup.title2": "Wind in Your Favor.",
    "signup.subtitle":
      "A community for those who seek to invest on the coast with safety, well-being and a new lifestyle.",
    "signup.subtitle.line1": "The northeastern winds, coastal homes and land:",
    "signup.subtitle.line2": "you building the future of the Brazilian coast.",
    "signup.subtitle.line3":
      "A community for those who seek to invest on the coast with safety, well-being and a new lifestyle.",
    "signup.name": "Full name",
    "signup.email": "Email",
    "signup.phone": "Phone/WhatsApp",
    "signup.budget": "Investment range",
    "signup.interest": "Main interest",
    "signup.kitesurf": "Kitesurfing",
    "signup.investment": "Investment",
    "signup.lifestyle": "Lifestyle",
    "signup.other": "Other",
    "signup.message": "Tell us about your interests",
    "signup.submit": "Submit Registration",
    "signup.success": "Registration successful!",
    "signup.error": "Error submitting registration. Please try again.",
    "signup.country": "Country/State",
    "signup.calendar": "Calendar date/time",
    "signup.accept":
      "I accept receiving communications from Terra Ventos about opportunities",
    "signup.privacy": "Your data is protected, according to our",
    "signup.privacy.link": "Privacy Policy",
    "signup.submitting": "Submitting...",
    "signup.join": "I want to join",
    "signup.select": "Select",
    "signup.option.houses": "Houses",
    "signup.option.lands": "Lands",
    "signup.option.condos": "Condos",
    "signup.option.hotels": "Hotels and Inns",
    "signup.option.other": "Other:",
    "signup.range.up100k": "Up to $18,000",
    "signup.range.100k500k": "$18,000 - $90,000",
    "signup.range.500k1m": "$90,000 - $180,000",
    "signup.range.1m5m": "$180,000 - $900,000",
    "signup.range.above5m": "Above $900,000",

    // FAQ Section
    "faq.question1": "How does the Terra Ventos community work?",
    "faq.answer1":
      "Terra Ventos is an exclusive community that connects qualified investors to curated real estate opportunities on the Ceará coast, focusing on lifestyle and sustainability.",
    "faq.question2": "What are the benefits of joining?",
    "faq.answer2":
      "Early access to opportunities, specialized legal curation, exclusive network and lifestyle connected to wind and sea.",
    "faq.question3": "What is the minimum investment amount?",
    "faq.answer3":
      "We work with different investment ranges. Contact us to learn about available opportunities.",
    "faq.question4": "How can I participate in events?",
    "faq.answer4":
      "Community members receive exclusive invitations to events, workshops and meetings related to lifestyle and investments.",

    // Benefits Section
    "benefits.exclusive": "Exclusive Access",
    "benefits.exclusive.free": "100% Free",
    "benefits.exclusive.desc": "Receive market opportunities in advance",
    "benefits.network": "Global Networking",
    "benefits.network.desc":
      "Connect with investors and athletes from Brazil and around the world",
    "benefits.legal": "Legal Security",
    "benefits.legal.desc":
      "100% regularized lands and properties with verified registrations for investment",
    "benefits.events": "Events and Experiences",
    "benefits.events.desc":
      "Participate in online, in-person events and community activations",
    "benefits.concierge": "Consultive Service",
    "benefits.concierge.desc": "Investment concierge and bilingual support.",

    // Stats Section
    "stats.experience": "Years of Experience",
    "stats.properties.sold": "Properties Sold",
    "stats.satisfaction": "Satisfaction Rate",

    // Founder Section
    "founder.name": "Bernardo Carvalho Wertheim",
    "founder.title": "Founder and CEO",
    "founder.heading": "Project Idealizer",
    "founder.description":
      "Entrepreneur with international career (ex-Bloomberg and Accenture), founded Terra Ventos with the mission to reshape the coastal real estate market by combining social impact, lifestyle and security.",
    "founder.experience.title": "Our experience",
    "founder.experience.description":
      "15+ years in scouting and development on the Ceará coast, with local partnerships and rigorous curation.",

    // Language Selector
    "language.pt": "Português",
    "language.en": "English",
    "language.es": "Español",
  },
  es: {
    // Navigation
    "nav.why-join": "Por qué unirse",
    "nav.mission": "La Comunidad",
    "nav.founder": "Fundador",
    "nav.faq": "FAQ",
    "nav.join-community": "Únete a la Comunidad",

    // Hero Section
    "hero.exclusive": "Comunidad Exclusiva",
    "hero.community": "Comunidad",
    "hero.title": "Terra Ventos",
    "hero.subtitle": "Donde invertir es vivir",
    "hero.description":
      "Únete a una red exclusiva de inversionistas, kitesurfistas y amantes de la costa noreste. Acceso anticipado a oportunidades inmobiliarias, curaduría legal y estilo de vida conectado al viento y al mar.",
    "hero.cta": "Únete a la Comunidad",
    "hero.discover": "Descubre las Oportunidades",
    "hero.loading": "Cargando Video",
    "hero.loading.subtitle": "Espera...",
    "hero.video.error": "Error al cargar video",
    "hero.video.error.subtitle": "Verifica tu conexión e intenta de nuevo",

    // Problem Section
    "problem.title": "El Problema",
    "problem.subtitle": "Oportunidades perdidas en la costa de Ceará",
    "problem.description":
      "El mercado inmobiliario en la costa de Ceará está en expansión, pero muchas oportunidades se pierden por falta de información, conexiones y curaduría especializada.",

    // Solution Section
    "solution.title": "La Solución",
    "solution.subtitle": "Terra Ventos: Tu puente hacia la costa noreste",
    "solution.description":
      "Una comunidad exclusiva que conecta inversionistas calificados con oportunidades inmobiliarias curadas en la costa de Ceará, enfocándose en estilo de vida y sostenibilidad.",
    "solution.connections.title": "Conexiones",
    "solution.connections.description":
      "En Terra Ventos, la costa de Ceará se convierte en un punto de encuentro sin fronteras. Aquí, te conectas con personas que buscan unir oportunidades con el estilo de vida costero, creando relaciones auténticas que van más allá de los negocios.",
    "solution.see.how": "Únete a la comunidad ahora",

    // Benefits Section
    "benefits.title": "Beneficios Exclusivos",
    "benefits.subtitle": "Por qué unirse a Terra Ventos",

    // Stats Section
    "stats.investors": "Inversionistas Activos",
    "stats.properties": "Propiedades Curadas",
    "stats.community": "Años de Experiencia",
    "stats.volume": "Volumen Invertido",
    "stats.value": "$9M+",

    // FAQ Section
    "faq.title": "Dudas Frecuentes",
    "faq.subtitle": "Resuelve tus dudas sobre Terra Ventos",

    // Contact
    "contact.title": "Ponte en Contacto",
    "contact.subtitle": "¿Listo para unirte a la comunidad?",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.company": "Terra Ventos",
    "footer.description":
      "Comunidad exclusiva de inversionistas y amantes de la costa noreste.",
    "footer.about": "Acerca de",
    "footer.opportunities": "Oportunidades",
    "footer.lifestyle": "Estilo de vida",
    "footer.privacy": "Política de Privacidad",
    "footer.accessibility": "Accesibilidad",
    "footer.address.preá":
      "Rua Antônio Chagas, nº 857 - Preá, Cruz - CE, 62595-000",
    "footer.address.fortaleza":
      "Rua Monsenhor Bruno, nº 1153, sala 608, Aldeota, Fortaleza - CE, 60115-191",
    "whatsapp.talk": "Habla con nuestro equipo",

    // Signup Modal
    "signup.title": "Comunidad Terra Ventos,",
    "signup.title2": "Viento a Favor.",
    "signup.subtitle":
      "Una comunidad para quienes buscan invertir en la costa con seguridad, bienestar y un nuevo estilo de vida.",
    "signup.subtitle.line1":
      "Los vientos del noreste, casas y terrenos costeros:",
    "signup.subtitle.line2": "tú construyendo el futuro del litoral brasileño.",
    "signup.subtitle.line3":
      "Una comunidad para quienes buscan invertir en la costa con seguridad, bienestar y un nuevo estilo de vida.",
    "signup.name": "Nombre completo",
    "signup.email": "Correo electrónico",
    "signup.phone": "Teléfono/WhatsApp",
    "signup.budget": "Rango de inversión",
    "signup.interest": "Interés principal",
    "signup.kitesurf": "Kitesurf",
    "signup.investment": "Inversión",
    "signup.lifestyle": "Estilo de vida",
    "signup.other": "Otro",
    "signup.message": "Cuéntanos sobre tus intereses",
    "signup.submit": "Enviar Registro",
    "signup.success": "¡Registro exitoso!",
    "signup.error": "Error al enviar el registro. Inténtalo de nuevo.",
    "signup.country": "País/Estado",
    "signup.calendar": "Fecha/Hora del calendario",
    "signup.accept":
      "Acepto recibir comunicaciones de Terra Ventos sobre oportunidades",
    "signup.privacy": "Tus datos están protegidos, según nuestra",
    "signup.privacy.link": "Política de Privacidad",
    "signup.submitting": "Enviando...",
    "signup.join": "Quiero formar parte",
    "signup.select": "Selecciona",
    "signup.option.houses": "Casas",
    "signup.option.lands": "Terrenos",
    "signup.option.condos": "Condominios",
    "signup.option.hotels": "Hoteles y Posadas",
    "signup.option.other": "Otro:",
    "signup.range.up100k": "Hasta $18,000",
    "signup.range.100k500k": "$18,000 - $90,000",
    "signup.range.500k1m": "$90,000 - $180,000",
    "signup.range.1m5m": "$180,000 - $900,000",
    "signup.range.above5m": "Más de $900,000",

    // FAQ Section
    "faq.question1": "¿Cómo funciona la comunidad Terra Ventos?",
    "faq.answer1":
      "Terra Ventos es una comunidad exclusiva que conecta inversionistas calificados con oportunidades inmobiliarias curadas en la costa de Ceará, enfocándose en estilo de vida y sostenibilidad.",
    "faq.question2": "¿Cuáles son los beneficios de unirse?",
    "faq.answer2":
      "Acceso anticipado a oportunidades, curaduría legal especializada, red exclusiva y estilo de vida conectado al viento y al mar.",
    "faq.question3": "¿Cuál es el monto mínimo para invertir?",
    "faq.answer3":
      "Trabajamos con diferentes rangos de inversión. Contáctanos para conocer las oportunidades disponibles.",
    "faq.question4": "¿Cómo puedo participar en eventos?",
    "faq.answer4":
      "Los miembros de la comunidad reciben invitaciones exclusivas a eventos, talleres y reuniones relacionados con el estilo de vida y las inversiones.",

    // Benefits Section
    "benefits.exclusive": "Acceso Exclusivo",
    "benefits.exclusive.free": "100% Gratuito",
    "benefits.exclusive.desc":
      "Recibe las oportunidades del mercado de forma anticipada",
    "benefits.network": "Networking Global",
    "benefits.network.desc":
      "Conéctate con inversionistas y atletas de Brasil y del mundo",
    "benefits.legal": "Seguridad Jurídica",
    "benefits.legal.desc":
      "Terrenos e inmuebles 100% regularizados y matrículas verificadas para inversión",
    "benefits.events": "Eventos y Experiencias",
    "benefits.events.desc":
      "Participa en eventos en línea, presenciales y activaciones de la comunidad",
    "benefits.concierge": "Servicio Consultivo",
    "benefits.concierge.desc": "Concierge de inversión y soporte bilingüe.",

    // Stats Section
    "stats.experience": "Años de Experiencia",
    "stats.properties.sold": "Propiedades Vendidas",
    "stats.satisfaction": "Tasa de Satisfacción",

    // Founder Section
    "founder.name": "Bernardo Carvalho Wertheim",
    "founder.title": "Fundador y CEO",
    "founder.heading": "Idealizador del Proyecto",
    "founder.description":
      "Emprendedor con carrera internacional (ex-Bloomberg y Accenture), fundó Terra Ventos con la misión de remodelar el mercado inmobiliario costero uniendo impacto social, estilo de vida y seguridad.",
    "founder.experience.title": "Nuestra experiencia",
    "founder.experience.description":
      "15+ años en scouting y desarrollo en la costa de Ceará, con asociaciones locales y curaduría rigurosa.",

    // Language Selector
    "language.pt": "Português",
    "language.en": "English",
    "language.es": "Español",
  },
};

// Meta tags translations
export const metaTranslations = {
  pt: {
    title: "Terra Ventos - Investimento Imobiliário no Litoral do Ceará",
    description:
      "Comunidade exclusiva de investidores, kitesurfistas e amantes do litoral nordestino. Acesso antecipado a oportunidades imobiliárias, curadoria jurídica e lifestyle conectado ao vento e ao mar.",
    keywords:
      "investimento imobiliário, litoral cearense, kitesurf, praia, terreno, casa, Ceará, Preá, Jericoacoara, investimento, lifestyle, mar, vento",
    locale: "pt_BR",
  },
  en: {
    title: "Terra Ventos - Real Estate Investment on the Ceará Coast",
    description:
      "Exclusive community of investors, kitesurfers and lovers of the northeastern coast. Early access to real estate opportunities, legal curation and lifestyle connected to wind and sea.",
    keywords:
      "real estate investment, Ceará coast, kitesurf, beach, land, house, Ceará, Preá, Jericoacoara, investment, lifestyle, sea, wind",
    locale: "en_US",
  },
  es: {
    title: "Terra Ventos - Inversión Inmobiliaria en la Costa de Ceará",
    description:
      "Comunidad exclusiva de inversionistas, kitesurfistas y amantes de la costa noreste. Acceso anticipado a oportunidades inmobiliarias, curaduría legal y estilo de vida conectado al viento y al mar.",
    keywords:
      "inversión inmobiliaria, costa de Ceará, kitesurf, playa, terreno, casa, Ceará, Preá, Jericoacoara, inversión, estilo de vida, mar, viento",
    locale: "es_ES",
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("pt");

  // Function to detect language based on user's location
  const detectLanguageFromLocation = async (): Promise<Language> => {
    try {
      // Try to get user's location using a free geolocation API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      const countryCode = data.country_code?.toLowerCase();

      // Spanish-speaking countries
      const spanishCountries = [
        "es",
        "mx",
        "ar",
        "co",
        "pe",
        "ve",
        "cl",
        "ec",
        "gt",
        "cu",
        "bo",
        "do",
        "hn",
        "py",
        "sv",
        "ni",
        "cr",
        "pa",
        "uy",
        "pr",
        "gq",
        "py",
        "uy",
      ];

      // Portuguese-speaking countries
      const portugueseCountries = [
        "br",
        "pt",
        "ao",
        "mz",
        "cv",
        "gw",
        "st",
        "tl",
      ];

      if (spanishCountries.includes(countryCode)) {
        return "es";
      } else if (portugueseCountries.includes(countryCode)) {
        return "pt";
      } else {
        return "en"; // Default to English for rest of the world
      }
    } catch (error) {
      console.log(
        "Could not detect location, using fallback language detection:",
        error,
      );

      // Fallback to browser language detection
      try {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("pt")) return "pt";
        if (browserLang.startsWith("es")) return "es";
        return "en";
      } catch (browserError) {
        console.log(
          "Browser language detection failed, using Portuguese default:",
          browserError,
        );
        return "pt"; // Default to Portuguese as requested
      }
    }
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check localStorage for saved language preference first
        const savedLanguage = localStorage.getItem("language") as Language;

        if (savedLanguage && ["pt", "en", "es"].includes(savedLanguage)) {
          setLanguageState(savedLanguage);
          document.documentElement.lang =
            savedLanguage === "pt"
              ? "pt-BR"
              : savedLanguage === "en"
                ? "en-US"
                : "es-ES";
          return;
        }

        // For now, default to Portuguese to avoid API issues
        setLanguageState("pt");
        document.documentElement.lang = "pt-BR";
      } catch (error) {
        console.error("LanguageContext - Error initializing language:", error);
        setLanguageState("pt");
        document.documentElement.lang = "pt-BR";
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    // Update document language attribute
    document.documentElement.lang =
      lang === "pt" ? "pt-BR" : lang === "en" ? "en-US" : "es-ES";
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
