"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Altura aproximada do navbar
      const elementPosition = element.offsetTop - navbarHeight;

      // Pequeno delay para suavizar a transição
      setTimeout(() => {
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }, 50);
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20 w-full max-w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo size="lg" />

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {[
                { id: "por-que-fazer-parte", text: t("nav.why-join") },
                { id: "nossa-missao", text: t("nav.mission") },
                { id: "fundador", text: t("nav.founder") },
                { id: "faq", text: t("nav.faq") },
              ].map((link, index) => (
                <motion.button
                  key={link.text}
                  onClick={() => scrollToSection(link.id)}
                  className="text-primary-500 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.text}
                </motion.button>
              ))}
              <motion.a
                href="https://chat.whatsapp.com/IRDTyn0rKIXLVGQNqPkzQ8"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-600 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("nav.join-community")}
              </motion.a>
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-500 hover:text-accent-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md border-t border-white/20">
              {[
                { id: "por-que-fazer-parte", text: t("nav.why-join") },
                { id: "nossa-missao", text: t("nav.mission") },
                { id: "fundador", text: t("nav.founder") },
                { id: "faq", text: t("nav.faq") },
              ].map((link, index) => (
                <motion.button
                  key={link.text}
                  onClick={() => scrollToSection(link.id)}
                  className="text-primary-500 hover:text-accent-500 block px-3 py-2 text-base font-medium w-full text-left transition-all duration-300 ease-in-out hover:bg-neutral-50 rounded-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.text}
                </motion.button>
              ))}
              <motion.a
                href="https://chat.whatsapp.com/IRDTyn0rKIXLVGQNqPkzQ8"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-500 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-accent-600 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t("nav.join-community")}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
