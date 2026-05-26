"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
// import ProblemSection from "@/components/ProblemSection";
// import SolutionSection from "@/components/SolutionSection";
// import FounderSection from "@/components/FounderSection";
// import FAQSection from "@/components/FAQSection";
// import SignupSection from "@/components/SignupSection";
// import Footer from "@/components/Footer";
import SignupModal from "@/components/SignupModal";
import DynamicMeta from "@/components/DynamicMeta";


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <motion.main
      className="min-h-screen w-full max-w-full overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DynamicMeta />
      {/* <Navbar onContactClick={openModal} /> */}
      <Hero onContactClick={openModal} />
      {/* <ProblemSection /> */}
      {/* <SolutionSection /> */}
      {/* <FounderSection /> */}
      {/* <FAQSection /> */}
      {/* <SignupSection /> */}
      {/* <Footer /> */}

      <SignupModal isOpen={isModalOpen} onClose={closeModal} />

    </motion.main>
  );
}
