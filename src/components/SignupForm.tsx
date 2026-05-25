"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import emailjs from "@emailjs/browser";

interface SignupFormProps {
  onSubmit?: () => void;
  showHeader?: boolean;
  className?: string;
}

export default function SignupForm({
  onSubmit,
  showHeader = false,
  className = "",
}: SignupFormProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_phone: "",
    paisEstado: "",
    faixaInvestimento: "",
    interessePrincipal: "",
    aceitoComunicacoes: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const serviceId = "gmailMessage";
    const templateId = "template_4m13d9p";
    const publicKey = "qBifyS-ncgTggC0Co";

    const templateParams = {
      to_email: "rimesleo@gmail.com",
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.mobile_phone,
      country: formData.paisEstado || "Não informado",
      investment_range: getInvestmentRange(formData.faixaInvestimento),
      main_interest: getMainInterest(formData.interessePrincipal),
      message: `
Nova Inscrição - Terra Ventos

Informações Pessoais:
- Nome: ${formData.name}
- Email: ${formData.email}
- Telefone/WhatsApp: ${formData.mobile_phone}
- País/Estado: ${formData.paisEstado || "Não informado"}

Informações de Investimento:
- Faixa de Investimento: ${getInvestmentRange(formData.faixaInvestimento)}
- Interesse Principal: ${getMainInterest(formData.interessePrincipal)}

Origem: Comunidade Terra Ventos
Data/Hora: ${new Date().toLocaleString("pt-BR")}
      `.trim(),
    };

    try {
      // ⛔ 1 — Envia Email via EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // 🚀 2 — Envia Lead para o RD Station Marketing
      if (typeof window !== "undefined" && (window as any).RdIntegration) {
        (window as any).RdIntegration.post({
          name: formData.name,
          email: formData.email,
          mobile_phone: formData.mobile_phone,
          country: formData.paisEstado,
          investment_range: getInvestmentRange(formData.faixaInvestimento),
          main_interest: getMainInterest(formData.interessePrincipal),
          traffic_source: "Comunidade Terra Ventos",
          cf_origem_do_lead: "Comunidade Terra Ventos",
        });
      }

      // UI de sucesso
      setSubmitStatus("success");

      setTimeout(() => {
        setSubmitStatus("idle");
        setFormData({
          name: "",
          email: "",
          mobile_phone: "",
          paisEstado: "",
          faixaInvestimento: "",
          interessePrincipal: "",
          aceitoComunicacoes: false,
        });
        onSubmit?.();
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInvestmentRange = (code: string): string => {
    const ranges: { [key: string]: string } = {
      up100k: "Até R$ 100.000",
      "100k500k": "R$ 100.000 - R$ 500.000",
      "500k1m": "R$ 500.000 - R$ 1.000.000",
      "1m5m": "R$ 1.000.000 - R$ 5.000.000",
      above5m: "Acima de R$ 5.000.000",
    };
    return ranges[code] || code;
  };

  const getMainInterest = (code: string): string => {
    const interests: { [key: string]: string } = {
      investment: "Investimento",
      lifestyle: "Lifestyle",
      kitesurf: "Kitesurf",
      tourism: "Turismo",
      business: "Negócios",
    };
    return interests[code] || code;
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {showHeader && (
        <div className="text-center mb-8">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-primary-500 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            {t("signup.title")}
          </motion.h2>
        </div>
      )}

      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{t("signup.success")}</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{t("signup.error")}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <input
            type="hidden"
            name="traffic_source"
            value="Comunidade Terra Ventos"
          />

          {/* Nome + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
                {t("signup.name")} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                {t("signup.email")} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Telefone + País */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mobile_phone" className="block text-sm font-semibold text-gray-800 mb-1">
                {t("signup.phone")} *
              </label>
              <input
                type="tel"
                id="mobile_phone"
                name="mobile_phone"
                value={formData.mobile_phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="paisEstado" className="block text-sm font-semibold text-gray-800 mb-1">
                {t("signup.country")}
              </label>
              <input
                type="text"
                id="paisEstado"
                name="paisEstado"
                value={formData.paisEstado}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Faixa de investimento + Interesse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="faixaInvestimento" className="block text-sm font-semibold text-gray-800 mb-1">
                {t("signup.budget")} *
              </label>
              <select
                id="faixaInvestimento"
                name="faixaInvestimento"
                value={formData.faixaInvestimento}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
              >
                <option value="">{t("signup.select")}</option>
                <option value="up100k">{t("signup.range.up100k")}</option>
                <option value="100k500k">{t("signup.range.100k500k")}</option>
                <option value="500k1m">{t("signup.range.500k1m")}</option>
                <option value="1m5m">{t("signup.range.1m5m")}</option>
                <option value="above5m">{t("signup.range.above5m")}</option>
              </select>
            </div>

            <div>
              <label htmlFor="interessePrincipal" className="block text-sm font-semibold text-gray-800 mb-1">
                {t("signup.interest")} *
              </label>
              <select
                id="interessePrincipal"
                name="interessePrincipal"
                value={formData.interessePrincipal}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
              >
                <option value="">{t("signup.select")}</option>
                <option value="investment">{t("signup.option.investment")}</option>
                <option value="lifestyle">{t("signup.option.lifestyle")}</option>
                <option value="kitesurf">{t("signup.option.kitesurf")}</option>
                <option value="tourism">{t("signup.option.tourism")}</option>
                <option value="business">{t("signup.option.business")}</option>
              </select>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="aceitoComunicacoes"
              name="aceitoComunicacoes"
              checked={formData.aceitoComunicacoes}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 rounded border-gray-400 text-accent-500 focus:ring-accent-500 flex-shrink-0"
            />
            <label htmlFor="aceitoComunicacoes" className="ml-3 text-sm text-gray-700 font-medium leading-snug">
              {t("signup.accept")}
            </label>
          </div>

          {/* Botão */}
          <div className="text-center pt-1">
            <motion.button
              type="submit"
              disabled={isSubmitting || !formData.aceitoComunicacoes}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:text-gray-500 text-white px-8 py-3 rounded-lg text-base font-semibold transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? t("signup.submitting") : t("signup.join")}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
