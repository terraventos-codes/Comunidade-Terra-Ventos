"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SignupFormProps {
  onSubmit?: () => void;
  showHeader?: boolean;
  className?: string;
}

// ─── Lista de países com DDI ───────────────────────────────────────────────
const COUNTRIES = [
  { code: "BR", name: "Brasil",          ddi: "+55",   flag: "🇧🇷", mask: "(##) #####-####" },
  { code: "US", name: "Estados Unidos",  ddi: "+1",    flag: "🇺🇸", mask: "(###) ###-####" },
  { code: "PT", name: "Portugal",        ddi: "+351",  flag: "🇵🇹", mask: "### ### ###" },
  { code: "AR", name: "Argentina",       ddi: "+54",   flag: "🇦🇷", mask: "(##) ####-####" },
  { code: "UY", name: "Uruguai",         ddi: "+598",  flag: "🇺🇾", mask: "## ### ####" },
  { code: "PY", name: "Paraguai",        ddi: "+595",  flag: "🇵🇾", mask: "(##) ###-####" },
  { code: "CL", name: "Chile",           ddi: "+56",   flag: "🇨🇱", mask: "# ####-####" },
  { code: "CO", name: "Colômbia",        ddi: "+57",   flag: "🇨🇴", mask: "### ### ####" },
  { code: "MX", name: "México",          ddi: "+52",   flag: "🇲🇽", mask: "## #### ####" },
  { code: "ES", name: "Espanha",         ddi: "+34",   flag: "🇪🇸", mask: "### ## ## ##" },
  { code: "IT", name: "Itália",          ddi: "+39",   flag: "🇮🇹", mask: "### ### ####" },
  { code: "DE", name: "Alemanha",        ddi: "+49",   flag: "🇩🇪", mask: "#### ########" },
  { code: "FR", name: "França",          ddi: "+33",   flag: "🇫🇷", mask: "## ## ## ## ##" },
  { code: "GB", name: "Reino Unido",     ddi: "+44",   flag: "🇬🇧", mask: "#### ######" },
  { code: "CN", name: "China",           ddi: "+86",   flag: "🇨🇳", mask: "### #### ####" },
  { code: "JP", name: "Japão",           ddi: "+81",   flag: "🇯🇵", mask: "##-####-####" },
  { code: "AU", name: "Austrália",       ddi: "+61",   flag: "🇦🇺", mask: "#### ### ###" },
  { code: "CA", name: "Canadá",          ddi: "+1",    flag: "🇨🇦", mask: "(###) ###-####" },
  { code: "OTHER", name: "Outro",        ddi: "+",     flag: "🌍", mask: "###############" },
];

/**
 * Aplica máscara de telefone dinamicamente.
 * '#' = dígito, qualquer outro char é literal.
 */
function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, "");
  let result = "";
  let di = 0;
  for (let mi = 0; mi < mask.length && di < digits.length; mi++) {
    if (mask[mi] === "#") {
      result += digits[di++];
    } else {
      result += mask[mi];
    }
  }
  return result;
}

/** Valida e-mail com regex padrão RFC-like */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignupForm({
  onSubmit,
  showHeader = false,
  className = "",
}: SignupFormProps) {
  const { t } = useLanguage();

  // País selecionado (padrão: Brasil)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_phone: "",  // valor mascarado exibido ao usuário
    paisEstado: "",
    faixaInvestimento: "",
    interessePrincipal: "",
    regiaoInteresse: "",
    aceitoComunicacoes: false,
  });

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "email_exists" | "phone_exists" | "already_registered"
  >("idle");

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtro de busca no dropdown
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.ddi.includes(countrySearch)
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "email") {
      setEmailError("");
    }
    if (name === "mobile_phone") {
      setPhoneError("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  /** Aplica máscara no campo telefone conforme o país selecionado */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneError("");
    const masked = applyMask(e.target.value, selectedCountry.mask);
    setFormData((prev) => ({ ...prev, mobile_phone: masked }));
  };

  /** Quando troca de país, limpa o telefone e reaplica máscara vazia */
  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setFormData((prev) => ({ ...prev, mobile_phone: "" }));
    setDropdownOpen(false);
    setCountrySearch("");
  };

  const handleEmailBlur = () => {
    if (formData.email && !isValidEmail(formData.email)) {
      setEmailError("E-mail inválido. Verifique se possui @ e domínio.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações client-side
    let hasError = false;

    if (!isValidEmail(formData.email)) {
      setEmailError("E-mail inválido. Verifique se possui @ e domínio.");
      hasError = true;
    }

    // Conta apenas dígitos do telefone digitado
    const phoneDigits = formData.mobile_phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setPhoneError("Telefone inválido. Digite pelo menos 7 dígitos.");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Monta o número completo com DDI para enviar ao backend
    const ddiDigits = selectedCountry.ddi.replace(/\D/g, "");
    const fullPhone =
      selectedCountry.code === "OTHER"
        ? formData.mobile_phone          // usuário já digitou DDI manualmente
        : `+${ddiDigits}${phoneDigits}`; // DDI selecionado + dígitos locais

    const now = new Date();
    const calendar_date = now.toISOString().slice(0, 16);

    const brevoPayload = {
      name: formData.name,
      email: formData.email.trim(),
      mobile_phone: fullPhone,
      paisEstado: formData.paisEstado || selectedCountry.name,
      investment_range: getInvestmentRange(formData.faixaInvestimento),
      main_interest: getMainInterest(formData.interessePrincipal),
      region_interest: formData.regiaoInteresse || "Não informado",
      calendar_date,
    };

    try {
      const brevoRes = await fetch("/api/brevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brevoPayload),
      });

      const data = await brevoRes.json();

      if (data.emailAlreadyExists && data.phoneAlreadyExists) {
        setSubmitStatus("already_registered");
      } else if (data.emailAlreadyExists) {
        setSubmitStatus("email_exists");
      } else if (data.phoneAlreadyExists) {
        setSubmitStatus("phone_exists");
      } else {
        setSubmitStatus("success");
      }

      setTimeout(() => {
        setSubmitStatus("idle");
        setFormData({
          name: "",
          email: "",
          mobile_phone: "",
          paisEstado: "",
          faixaInvestimento: "",
          interessePrincipal: "",
          regiaoInteresse: "",
          aceitoComunicacoes: false,
        });
        setSelectedCountry(COUNTRIES[0]);
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
      houses: "Casas",
      lands: "Terrenos",
      condos: "Condominios",
      hotels: "Hotéis e Pousadas",
      other: "Outro:",
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
        {/* ── Feedback de status ── */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <span className="text-green-500 text-xl mt-0.5">✅</span>
            <p className="text-green-700 font-medium">{t("signup.success")}</p>
          </div>
        )}

        {submitStatus === "email_exists" && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3">
            <span className="text-amber-500 text-xl mt-0.5">📧</span>
            <div>
              <p className="text-amber-800 font-semibold">Este e-mail já está cadastrado!</p>
              <p className="text-amber-700 text-sm mt-1">Seus dados foram atualizados com sucesso. Em breve nossa equipe entrará em contato.</p>
            </div>
          </div>
        )}

        {submitStatus === "phone_exists" && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3">
            <span className="text-amber-500 text-xl mt-0.5">📱</span>
            <div>
              <p className="text-amber-800 font-semibold">Este telefone já está cadastrado!</p>
              <p className="text-amber-700 text-sm mt-1">Seus dados foram atualizados com sucesso. Em breve nossa equipe entrará em contato.</p>
            </div>
          </div>
        )}

        {submitStatus === "already_registered" && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg flex items-start gap-3">
            <span className="text-blue-500 text-xl mt-0.5">ℹ️</span>
            <div>
              <p className="text-blue-800 font-semibold">Você já faz parte da comunidade!</p>
              <p className="text-blue-700 text-sm mt-1">Seu e-mail e telefone já estão cadastrados. Seus dados foram atualizados e nossa equipe já tem seu contato.</p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <span className="text-red-500 text-xl mt-0.5">❌</span>
            <p className="text-red-700 font-medium">{t("signup.error")}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6" noValidate>
          <input type="hidden" name="traffic_source" value="Comunidade Terra Ventos" />

          {/* ── Nome + Email ── */}
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
                autoComplete="name"
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
                onBlur={handleEmailBlur}
                required
                autoComplete="email"
                inputMode="email"
                placeholder="exemplo@email.com"
                className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white focus:ring-1 outline-none transition-colors ${
                  emailError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-400 focus:border-accent-500 focus:ring-accent-500"
                }`}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {emailError}
                </p>
              )}
            </div>
          </div>

          {/* ── Telefone com seletor de DDI ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              {t("signup.phone")} *
            </label>
            <div className="flex gap-2 items-start">
              {/* Seletor de país */}
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  id="country-ddi-selector"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 border rounded-lg bg-white text-gray-900 focus:outline-none transition-colors whitespace-nowrap ${
                    dropdownOpen
                      ? "border-accent-500 ring-1 ring-accent-500"
                      : "border-gray-400 hover:border-gray-500"
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  aria-label="Selecionar país"
                >
                  <span className="text-lg leading-none">{selectedCountry.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{selectedCountry.ddi}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute z-50 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    role="listbox"
                    aria-label="Lista de países"
                  >
                    {/* Busca */}
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Buscar país ou DDI..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-accent-500"
                        autoFocus
                      />
                    </div>
                    {/* Lista */}
                    <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                      {filteredCountries.map((country) => (
                        <li key={country.code}>
                          <button
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                              selectedCountry.code === country.code ? "bg-accent-50 font-semibold" : ""
                            }`}
                            role="option"
                            aria-selected={selectedCountry.code === country.code}
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-sm text-gray-800 flex-1">{country.name}</span>
                            <span className="text-sm text-gray-500 font-mono">{country.ddi}</span>
                          </button>
                        </li>
                      ))}
                      {filteredCountries.length === 0 && (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                          Nenhum país encontrado.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Campo de telefone com máscara */}
              <div className="flex-1">
                <input
                  type="tel"
                  id="mobile_phone"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handlePhoneChange}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={selectedCountry.mask.replace(/#/g, "0")}
                  maxLength={selectedCountry.mask.length}
                  className={`w-full px-3 py-2.5 border rounded-lg text-gray-900 bg-white focus:ring-1 outline-none transition-colors ${
                    phoneError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:border-accent-500 focus:ring-accent-500"
                  }`}
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {phoneError}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Formato aceito: com ou sem parênteses, traço ou espaços — normalizamos automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* ── País/Estado ── */}
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
              placeholder={selectedCountry.name !== "Outro" ? selectedCountry.name : "Informe seu país/estado"}
              className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
            />
          </div>

          {/* ── Faixa de investimento + Interesse ── */}
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
                <option value="houses">{t("signup.option.houses")}</option>
                <option value="lands">{t("signup.option.lands")}</option>
                <option value="condos">{t("signup.option.condos")}</option>
                <option value="hotels">{t("signup.option.hotels")}</option>
                <option value="other">{t("signup.option.other")}</option>
              </select>
            </div>
          </div>

          {/* ── Região de interesse ── */}
          <div>
            <label htmlFor="regiaoInteresse" className="block text-sm font-semibold text-gray-800 mb-1">
              Região de interesse
            </label>
            <select
              id="regiaoInteresse"
              name="regiaoInteresse"
              value={formData.regiaoInteresse}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-gray-900 bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-colors"
            >
              <option value="">Selecione uma região</option>
              <option value="Tatajuba">Tatajuba</option>
              <option value="Bitupita">Bitupita</option>
              <option value="Prea">Prea</option>
              <option value="Várias">Várias</option>
            </select>
          </div>

          {/* ── Checkbox ── */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="aceitoComunicacoes"
              name="aceitoComunicacoes"
              checked={formData.aceitoComunicacoes}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 rounded border-gray-400 text-accent-500 focus:ring-accent-500 flex-shrink-0"
            />
            <label
              htmlFor="aceitoComunicacoes"
              className="ml-3 text-sm text-gray-700 font-medium leading-snug"
            >
              {t("signup.accept")}
            </label>
          </div>

          {/* ── Botão ── */}
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
