"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SolutionSection() {
  const { t } = useLanguage();
  const [currentBackground, setCurrentBackground] = useState(0);

  // Array de backgrounds que se alternam (imagens locais)
  const backgrounds = [
    "/images/conections/01.jpg",
    "/images/conections/02.jpg",
    "/images/conections/03.jpg",
    "/images/conections/04.jpg",
    "/images/conections/05.jpg",
  ];

  // Função para trocar background automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 4000); // Troca a cada 4 segundos

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Função para scroll suave até o formulário
  const scrollToForm = () => {
    const formSection = document.getElementById("signup-section");
    if (formSection) {
      formSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.section
      id="nossa-missao"
      className="py-20 relative overflow-hidden min-h-screen flex items-center"
      style={{ backgroundColor: "#142431" }}
      initial={{ y: -200, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
    >
      {/* Background Images com Transição Suave */}
      <div className="absolute inset-0">
        {backgrounds.map((bg, index) => (
          <motion.img
            key={index}
            src={bg}
            alt="Comunidade Terra Ventos"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentBackground === index ? 1 : 0,
              scale: currentBackground === index ? 1 : 1.1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              opacity: { duration: 1.5 },
              scale: { duration: 1.5 },
            }}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Geometric overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neutral-950 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-500/90 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary-500 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 font-breathing text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {t("solution.connections.title")}
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 font-avenir"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {t("solution.connections.description")}
          </motion.p>

          <motion.a
            href="https://chat.whatsapp.com/IRDTyn0rKIXLVGQNqPkzQ8"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-avenir cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("solution.see.how")}
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}
