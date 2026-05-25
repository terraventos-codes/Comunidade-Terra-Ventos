"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnimatedText from "./AnimatedText";
import LoadingScreen from "./LoadingScreen";
import ResizeLoading from "./ResizeLoading";
import { useResizeLoading } from "../hooks/useResizeLoading";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "./Logo";
import SignupForm from "./SignupForm";
import LanguageSelector from "./LanguageSelector";

// Interface para as props do componente Hero
interface HeroProps {
  onContactClick: () => void;
}

// Componente principal da seção Hero da Comunidade Terra Ventos
// Este componente contém o vídeo de fundo, animações e call-to-actions principais
export default function Hero({ onContactClick }: HeroProps) {
  const { t } = useLanguage();

  // Estados para controle de vídeos
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [previousVideo, setPreviousVideo] = useState<string>("");

  // ID do vídeo fixo do YouTube que será exibido como fundo
  const videoId = "ssKZTE7YTWU"; // Vídeo fixo do YouTube

  // Estados para controlar diferentes fases de carregamento
  const [isLoading, setIsLoading] = useState(true); // Loading screen inicial
  const [isVideoLoading, setIsVideoLoading] = useState(false); // Carregamento do vídeo
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Reprodução do vídeo
  const [videoError, setVideoError] = useState(false); // Erro no carregamento do vídeo
  const [videoKey, setVideoKey] = useState(0); // Chave para forçar reload do iframe
  const [isBlackScreen, setIsBlackScreen] = useState(false); // Detectar tela preta

  // Hook personalizado para detectar redimensionamento significativo da janela

  const isResizeLoading = useResizeLoading({
    threshold: 25, // 25% de mudança para triggerar o loading
    duration: 3000, // 3 segundos de duração do loading
  });

  // Função para finalizar o loading screen inicial
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Effect para carregar o vídeo fixo do YouTube ao montar o componente
  useEffect(() => {
    console.log("🎬 Carregando vídeo do YouTube:", videoId);
    setCurrentVideo(videoId);
    setIsVideoLoading(true);
    setIsVideoPlaying(false);
    setVideoError(false);
  }, []);

  // Funções para lidar com eventos do vídeo
  const handleVideoLoadStart = () => {
    console.log("🔄 Carregamento do iframe iniciado");
    setIsVideoLoading(true);
    setVideoError(false);
    // Simular carregamento completo após um tempo (para UX)
    setTimeout(() => {
      setIsVideoLoading(false);
      setIsVideoPlaying(true);
    }, 2000);
  };

  // Função para lidar com erros no carregamento do vídeo
  const handleVideoError = (
    e: React.SyntheticEvent<HTMLIFrameElement, Event>
  ) => {
    console.error("❌ Erro ao carregar vídeo do YouTube:", e);
    console.error("❌ ID do vídeo:", currentVideo);
    console.error(
      "❌ URL completa:",
      `https://www.youtube.com/embed/${currentVideo}`
    );
    setIsVideoLoading(false);
    setIsVideoPlaying(false);
    setVideoError(true);
  };

  // Função para recarregar o vídeo
  const reloadVideo = () => {
    console.log("🔄 Recarregando vídeo para evitar tela preta...");
    setVideoKey((prev) => prev + 1); // Força reload do iframe
    setIsVideoLoading(true);
    setIsVideoPlaying(false);
    setVideoError(false);
    setIsBlackScreen(false);

    // Simular carregamento
    setTimeout(() => {
      setIsVideoLoading(false);
      setIsVideoPlaying(true);
    }, 2000);
  };

  // Função para detectar tela preta e recarregar automaticamente
  const handleBlackScreen = () => {
    console.log("⚫ Tela preta detectada, recarregando vídeo...");
    setIsBlackScreen(true);
    setTimeout(() => {
      reloadVideo();
    }, 3000); // Aguarda 3 segundos antes de recarregar
  };

  return (
    <>
      {/* Tela de loading inicial */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Loading durante redimensionamento da janela */}
      <ResizeLoading isVisible={isResizeLoading} />

      {/* Seção principal do Hero */}
      <section className="relative min-h-screen flex items-center w-full max-w-full overflow-hidden">

        {/* Seletor de idioma — canto superior direito */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
          <LanguageSelector />
        </div>
        {/* Container do vídeo de fundo */}
        <div className="absolute inset-0 w-full h-full">
          {/* Fundo preto como fallback caso o vídeo não carregue */}
          <div className="absolute inset-0 bg-black"></div>

          {/* Iframe do vídeo do YouTube com configurações otimizadas */}
          {currentVideo && (
            <div className="absolute inset-0 w-full h-full z-5 overflow-hidden">
              {/* Gradiente sutil para suavizar bordas cortadas */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 z-10 pointer-events-none"></div>
              <iframe
                key={videoKey} // Força reload quando a chave muda
                className="absolute top-1/2 left-1/2 
                  w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2
                  md:w-[177.78vh] md:h-[56.25vw]
                  sm:w-[200vh] sm:h-[112.5vw] sm:scale-110
                  w-[250vh] h-[140.625vw] scale-125"
                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1&mute=1&loop=1&playlist=${currentVideo}&controls=0&showinfo=0&rel=0&modestbranding=1&fs=0&disablekb=1&enablejsapi=1&start=0`}
                title="Background Video"
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen={false}
                onLoad={handleVideoLoadStart}
                onError={handleVideoError}
                loading="eager"
              />
            </div>
          )}

          {/* Overlay para detectar tela preta */}
          {isVideoPlaying && (
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={handleBlackScreen}
              title="Clique para recarregar o vídeo se estiver com tela preta"
            />
          )}

          {/* Indicador de tela preta detectada */}
          {isBlackScreen && (
            <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              ⚫ Recarregando vídeo...
            </div>
          )}

          {/* Botão de reload manual */}
          {isVideoPlaying && !isBlackScreen && (
            <button
              onClick={reloadVideo}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
              title="Recarregar vídeo"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}

          {/* Overlay de loading durante carregamento do vídeo */}
          {isVideoLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-semibold mb-2">
                  {t("hero.loading")}
                </p>
                <p className="text-sm text-white/80">
                  {t("hero.loading.subtitle")}
                </p>
              </div>
            </div>
          )}

          {/* Tela de erro caso o vídeo não carregue */}
          {videoError && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
              <div className="text-center text-white max-w-md mx-auto px-4">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-xl font-semibold mb-2">
                  {t("hero.video.error")}
                </p>
                <p className="text-sm text-white/80 mb-2">
                  {t("hero.video.error.subtitle")}
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-accent-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-600 transition-colors text-sm"
                  >
                    🔄 Recarregar página
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* === OVERLAYS PREMIUM === */}
        {/* Escurecimento base sutil */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* Desktop: gradiente escuro da esquerda cobrindo ~60% da largura */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>

        {/* Mobile: vinheta de cima e de baixo para garantir legibilidade */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 z-10"></div>

        {/* Vinheta lateral esquerda extra para o texto */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/40 to-transparent z-10"></div>

        {/* Container principal do conteúdo */}
        <div id="hero-form" className="relative z-30 w-full flex items-center justify-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-8 sm:py-20 lg:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-12 mt-10 lg:mt-0">
            {/* Esquerda: Texto */}
            <motion.div
              className="text-white space-y-4 lg:space-y-6 lg:w-1/2 text-center lg:text-left w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.h1
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {/* Linha 1: "Terra Ventos Comunidade," — mais compacta para caber */}
                <div
                  className="font-breathing text-white block leading-none"
                  style={{ fontSize: "clamp(1.75rem, 6vw, 4.5rem)" }}
                >
                  {t("signup.title")}
                </div>

                {/* Linha 2: "Vento a Favor." — Inter regular, sem quebra */}
                <div
                  className="text-white block leading-none mt-1 sm:mt-3 font-normal tracking-tight"
                  style={{
                    fontSize: "clamp(1.75rem, 8vw, 6rem)",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 400,
                    whiteSpace: "normal",
                  }}
                >
                  {t("signup.title2")}
                </div>
              </motion.h1>

              <motion.div
                className="text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1,
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <p className="text-sm sm:text-lg md:text-xl font-semibold mb-1">
                  {t("signup.subtitle.line1")}
                </p>
                <p className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">
                  {t("signup.subtitle.line2")}
                </p>
                <p className="text-xs sm:text-base md:text-lg font-medium opacity-80">
                  {t("signup.subtitle.line3")}
                </p>
              </motion.div>

              {/* Trust bar: mini-stats embutidos abaixo do texto */}
              <motion.div
                className="flex flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1 sm:pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-accent-500" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>500+</div>
                  <div className="text-[10px] sm:text-xs text-white/70 font-medium">Investidores</div>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/25"></div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-accent-500" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{t("stats.value")}</div>
                  <div className="text-[10px] sm:text-xs text-white/70 font-medium">{t("stats.volume")}</div>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/25"></div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-accent-500" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>100%</div>
                  <div className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight max-w-[60px] sm:max-w-none mx-auto">Curadoria jurídica</div>
                </div>
              </motion.div>

              {/* Tags de nicho */}
              <motion.div
                className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {["imóveis", "kite", "wingfoil", "wellness", "lifestyle"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/25 bg-white/10 text-white/70 backdrop-blur-sm font-medium tracking-widest uppercase"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Direita: Formulário */}
            <motion.div
              className="w-full lg:w-1/2 max-w-md lg:max-w-lg mx-auto lg:mx-0 flex-shrink-0 pb-8 lg:pb-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 1.6,
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <SignupForm showHeader={false} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
