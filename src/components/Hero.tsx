"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnimatedText from "./AnimatedText";
import LoadingScreen from "./LoadingScreen";
import ResizeLoading from "./ResizeLoading";
import { useResizeLoading } from "../hooks/useResizeLoading";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "./Logo";

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

        {/* Overlay claro para melhorar a visibilidade do texto */}
        <div className="absolute inset-0 bg-black/5 z-10"></div>

        {/* Gradiente sutil para melhorar a legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/2 via-transparent to-black/8 z-15"></div>

        {/* Container principal do conteúdo */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-center py-8 md:py-0">
          <div className="text-center max-w-4xl mx-auto w-full">
            <motion.div
              className="text-white space-y-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.h1
                className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight font-breathing mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div className="space-y-6 sm:space-y-8 md:space-y-12">
                  <div className="text-white font-breathing w-full">
                    {t("signup.title")}
                  </div>
                  <div className="text-white font-breathing">
                    {t("signup.title2")}
                  </div>
                </div>
              </motion.h1>

              <motion.h2
                className="text-white font-bold leading-relaxed mb-12 mt-12 sm:mb-16 sm:mt-16 md:mb-16 md:mt-24 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1,
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div className="space-y-1 text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold">
                    {t("signup.subtitle.line1")}.
                  </div>
                  <div className="text-base sm:text-lg md:text-lg font-medium">
                    {t("signup.subtitle.line2")},
                  </div>
                  <div className="text-sm sm:text-base md:text-base">
                    {t("signup.subtitle.line3")}.
                  </div>
                </div>
              </motion.h2>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mt-16 sm:mt-20 md:mt-32 w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.6,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <motion.a
                  href="https://chat.whatsapp.com/IRDTyn0rKIXLVGQNqPkzQ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-accent-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-avenir w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("hero.cta")}
                </motion.a>
                <motion.a
                  href="#por-que-fazer-parte"
                  className="border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-avenir w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("hero.discover")}
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Estatísticas flutuantes - Ocultas no mobile para evitar sobreposição */}
        <motion.div
          className="hidden lg:block absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-center text-white">
            <div className="text-3xl font-bold text-accent-500">500+</div>
            <div className="text-sm text-white/80">Investidores Ativos</div>
          </div>
        </motion.div>

        {/* Segunda estatística flutuante */}
        <motion.div
          className="hidden lg:block absolute bottom-8 left-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-center text-white">
            <div className="text-3xl font-bold text-accent-500">
              {t("stats.value")}
            </div>
            <div className="text-sm text-white/80">{t("stats.volume")}</div>
          </div>
        </motion.div>

        {/* Elementos decorativos flutuantes - Ocultos no mobile */}
        <motion.div
          className="hidden lg:block absolute top-1/4 left-8 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>

        {/* Segundo elemento decorativo flutuante */}
        <motion.div
          className="hidden lg:block absolute bottom-1/4 right-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          whileHover={{ scale: 1.1, rotate: -10 }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </motion.div>
      </section>
    </>
  );
}
