"use client";
import { useState, useEffect, useRef } from "react";
import Weather from "./components/Weather";
import Map from "./components/Maps";
import { LanguageSwitcher } from "./components/language-switcher";

import "@fortawesome/fontawesome-free/css/all.min.css";

type Car = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
  features: string[];
};

export default function Home() {
  // Renk paleti - metalik gold eklemesi
  const colors = {
    primary: "#141414",
    secondary: "#D4AF37",
    accent: "#8B7D39",
    light: "#F5F5F5",
    dark: "#0A0A0A",
    goldGradient: "linear-gradient(45deg, #A67C00, #D4AF37, #FFDF00, #D4AF37)",
    goldShine:
      "linear-gradient(90deg, rgba(212,175,55,0.1) 0%, rgba(255,223,0,0.8) 50%, rgba(212,175,55,0.1) 100%)",
  };

  // State tanımlamaları
  const [currentCar, setCurrentCar] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Ref tanımlamaları
  const headerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Animasyon için
  useEffect(() => {
    setIsLoaded(true);

    // İlk yükleme animasyonu
    const timer = setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.classList.add("translate-y-0", "opacity-100");
      }

      const featureCards =
        featuresRef.current?.querySelectorAll(".feature-card");
      featureCards?.forEach((card, index) => {
        setTimeout(() => {
          (card as HTMLElement).classList.add("translate-y-0", "opacity-100");
        }, 200 * index);
      });

      setTimeout(() => {
        if (footerRef.current) {
          footerRef.current.classList.add("translate-y-0", "opacity-100");
        }
      }, 800);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Araç verileri
  const cars: Car[] = [
    {
      id: 1,
      name: "Mercedes S-Class",
      image: "/api/placeholder/800/450", // Gerçek projede: "/images/mercedes-s-class.jpg"
      description: "Lüks ve konforu bir arada sunan özel şoförlü VIP araç",
      price: "₺2500/gün",
      features: ["Deri koltuklar", "Klima", "Wifi", "Mini bar"],
    },
    {
      id: 2,
      name: "BMW 7 Series",
      image: "/api/placeholder/800/450", // Gerçek projede: "/images/bmw-7-series.jpg"
      description: "Premium iş seyahatleri için ideal VIP sedan",
      price: "₺2300/gün",
      features: [
        "Masaj koltukları",
        "Panoramik tavan",
        "Apple CarPlay",
        "Şoför hizmeti",
      ],
    },
    {
      id: 3,
      name: "Audi A8",
      image: "/images/mercedes.jpeg",
      description: "Son teknoloji ile donatılmış lüks araç deneyimi",
      price: "₺2400/gün",
      features: [
        "Ambiyans aydınlatma",
        "Bang & Olufsen ses sistemi",
        "Özel şoför",
        "VIP hizmet",
      ],
    },
  ];

  // Otomatik değişim için
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextCar();
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [currentCar, isAnimating]);

  // Sonraki araca geçiş
  const nextCar = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCar((prev) => (prev + 1) % cars.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // Önceki araca geçiş
  const prevCar = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCar((prev) => (prev - 1 + cars.length) % cars.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // Direkt belirli bir araca geçiş
  const goToCar = (index: number) => {
    if (isAnimating || index === currentCar) return;

    setIsAnimating(true);
    setCurrentCar(index);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div
      className="grid min-h-screen grid-rows-[auto_1fr_auto] w-full"
      style={{ backgroundColor: colors.primary, color: colors.light }}
    >
      {/* Header - Yukarıdan kayarak geliyor */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 flex flex-row justify-between items-center p-2 md:p-4 transform -translate-y-12 opacity-0 transition-all duration-1000"
        style={{ backgroundColor: colors.dark }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/lamborghini.svg" // Minimal bir logo ekleyin
            alt="VIP Logo"
            className="h-10 md:h-16 pulse-animation"
          />
        </div>

        {/* Sağ Menü */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Sosyal Medya İkonları - Mobile'da gizle */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.instagram.com/ahm4t_kurt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-yellow-400 transition-colors metallic-hover"
              style={{ color: colors.secondary }}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/ahmet-kurt-bm/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-yellow-400 transition-colors metallic-hover"
              style={{ color: colors.secondary }}
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://twitter.com/ahmet6kurt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-yellow-400 transition-colors metallic-hover"
              style={{ color: colors.secondary }}
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>

          {/* Ayraç - Mobile'da gizle */}
          <div className="hidden md:block h-6 w-px bg-accent"></div>

          {/* WhatsApp - Sadece ikon */}
          <a
            href="https://api.whatsapp.com/send?phone=+905511065227&text=Merhaba, bilgi alacaktım."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <img
              src="/images/wp-logo.svg"
              alt="WhatsApp"
              className="h-5 md:h-6 pulse-animation"
            />
          </a>

          {/* Ayraç */}
          <div className="h-6 w-px bg-accent"></div>

          {/* Hava Durumu - Küçültülmüş versiyon */}
          <div className="flex items-center text-sm md:text-base">
            <Weather /> {/* Weather komponentine compact prop'u ekleyin */}
          </div>

          {/* Ayraç */}
          <div className="h-6 w-px bg-accent"></div>

          {/* Dil Seçici */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {/* Başlık - Fade in animasyonu */}
          <div className="text-center mb-12 fade-in-animation">
            <h1
              className="text-4xl font-bold mb-4 metallic-text glowing-text"
              style={{ color: colors.secondary }}
            >
              VIP Araç Kiralama
            </h1>
            <p
              className="text-xl fade-in-animation"
              style={{ animationDelay: "0.3s" }}
            >
              Lüks ve konforu bir arada yaşayın
            </p>
          </div>

          {/* Araç Carousel - Parıldayan sınırlar */}
          <div
            className="relative mb-16 overflow-hidden rounded-lg shadow-2xl gold-shining-border"
            style={{ border: `2px solid ${colors.secondary}` }}
          >
            <div className="relative h-96 md:h-128">
              {/* Carousel Ana Görünüm */}
              {cars.map((car, index) => (
                <div
                  key={car.id}
                  className={`absolute top-0 left-0 w-full h-full flex transition-all duration-500 ease-in-out ${
                    index === currentCar
                      ? "opacity-100 transform scale-100 z-10"
                      : "opacity-0 hidden"
                  }`}
                  style={{ backgroundColor: colors.dark }}
                >
                  <div className="w-1/2 h-full relative overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className={`object-cover w-full h-full transform transition-transform duration-700 ${
                        index === currentCar ? "scale-100" : "scale-110"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-30"></div>
                  </div>
                  <div className="w-1/2 p-8 flex flex-col justify-center items-start space-y-4">
                    <div
                      className={`transition-all duration-700 delay-200 transform ${
                        index === currentCar
                          ? "translate-x-0 opacity-100"
                          : "translate-x-8 opacity-0"
                      }`}
                    >
                      <h2
                        className="text-3xl font-bold mb-2 metallic-text glowing-text"
                        style={{ color: colors.secondary }}
                      >
                        {car.name}
                      </h2>
                      <p className="text-lg mb-4">{car.description}</p>
                      <p
                        className="text-2xl font-semibold mb-6 metallic-text"
                        style={{ color: colors.secondary }}
                      >
                        {car.price}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {car.features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 fade-in-animation"
                            style={{ animationDelay: `${0.4 + i * 0.15}s` }}
                          >
                            <i
                              className="fas fa-check-circle pulse-animation"
                              style={{ color: colors.secondary }}
                            ></i>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 metallic-button"
                        style={{
                          background: colors.goldGradient,
                          color: colors.dark,
                        }}
                      >
                        Hemen Rezervasyon Yap
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Önceki/Sonraki Butonları */}
              <button
                onClick={prevCar}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-20 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all hover:scale-110"
              >
                <i
                  className="fas fa-chevron-left text-xl"
                  style={{ color: colors.secondary }}
                ></i>
              </button>
              <button
                onClick={nextCar}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-20 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all hover:scale-110"
              >
                <i
                  className="fas fa-chevron-right text-xl"
                  style={{ color: colors.secondary }}
                ></i>
              </button>
            </div>
            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCar(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentCar ? "w-8" : "w-3"
                  } metallic-button-small`}
                  style={{
                    background:
                      index === currentCar ? colors.goldGradient : colors.light,
                    opacity: index === currentCar ? 1 : 0.5,
                  }}
                ></button>
              ))}
            </div>
          </div>

          {/* Özellikleri - Aşağıdan yukarıya kayarak gelecek */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          >
            <div
              className="p-4 rounded-lg text-center transition-all duration-700 hover:scale-105 feature-card transform translate-y-16 opacity-0 gold-shining-border"
              style={{
                backgroundColor: colors.dark,
                border: `1px solid ${colors.accent}`,
              }}
            >
              <i
                className="fas fa-car text-4xl mb-4 metallic-text pulse-animation"
                style={{ color: colors.secondary }}
              ></i>
              <h3
                className="text-xl font-bold mb-2 metallic-text"
                style={{ color: colors.secondary }}
              >
                Premium Araçlar
              </h3>
              <p>En lüks araçlarla VIP hizmet deneyimi yaşayın.</p>
            </div>
            <div
              className="p-4 rounded-lg text-center transition-all duration-700 hover:scale-105 feature-card transform translate-y-16 opacity-0 gold-shining-border"
              style={{
                backgroundColor: colors.dark,
                border: `1px solid ${colors.accent}`,
                transitionDelay: "0.2s",
              }}
            >
              <i
                className="fas fa-user-tie text-4xl mb-4 metallic-text pulse-animation"
                style={{ color: colors.secondary }}
              ></i>
              <h3
                className="text-xl font-bold mb-2 metallic-text"
                style={{ color: colors.secondary }}
              >
                Profesyonel Şoförler
              </h3>
              <p>Deneyimli ve profesyonel şoförlerimizle güvenli yolculuk.</p>
            </div>
            <div
              className="p-4 rounded-lg text-center transition-all duration-700 hover:scale-105 feature-card transform translate-y-16 opacity-0 gold-shining-border"
              style={{
                backgroundColor: colors.dark,
                border: `1px solid ${colors.accent}`,
                transitionDelay: "0.4s",
              }}
            >
              <i
                className="fas fa-headset text-4xl mb-4 metallic-text pulse-animation"
                style={{ color: colors.secondary }}
              ></i>
              <h3
                className="text-xl font-bold mb-2 metallic-text"
                style={{ color: colors.secondary }}
              >
                7/24 Destek
              </h3>
              <p>İhtiyaç duyduğunuz her an yanınızdayız.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Aşağıdan yukarı kayarak gelecek */}
      <footer
        ref={footerRef}
        className="p-8 transform translate-y-12 opacity-0 transition-all duration-1000"
        style={{ backgroundColor: colors.dark }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* İletişim Bilgileri */}
          <div className="flex flex-col">
            <h3
              className="text-xl font-bold mb-4 metallic-text"
              style={{ color: colors.secondary }}
            >
              İletişim
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 hover-slide">
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: colors.secondary }}
                ></i>
                <span>Atatürk Mah. 100. Yıl Bulvarı No:120, İstanbul</span>
              </li>
              <li className="flex items-center gap-3 hover-slide">
                <i
                  className="fas fa-phone"
                  style={{ color: colors.secondary }}
                ></i>
                <span>+90 551 106 5227</span>
              </li>
              <li className="flex items-center gap-3 hover-slide">
                <i
                  className="fas fa-envelope"
                  style={{ color: colors.secondary }}
                ></i>
                <span>info@viprentacar.com</span>
              </li>
              <li className="flex items-center gap-3 hover-slide">
                <i
                  className="fas fa-clock"
                  style={{ color: colors.secondary }}
                ></i>
                <span>Pazartesi - Pazar: 08:00 - 22:00</span>
              </li>
            </ul>
          </div>
          {/* Hızlı Linkler */}
          <div className="flex flex-col">
            <h3
              className="text-xl font-bold mb-4 metallic-text"
              style={{ color: colors.secondary }}
            >
              Hızlı Linkler
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-colors flex items-center gap-2 hover-slide"
                >
                  <i
                    className="fas fa-chevron-right text-xs"
                    style={{ color: colors.secondary }}
                  ></i>
                  Araç Filomuz
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-colors flex items-center gap-2 hover-slide"
                >
                  <i
                    className="fas fa-chevron-right text-xs"
                    style={{ color: colors.secondary }}
                  ></i>
                  Hizmetlerimiz
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-colors flex items-center gap-2 hover-slide"
                >
                  <i
                    className="fas fa-chevron-right text-xs"
                    style={{ color: colors.secondary }}
                  ></i>
                  Rezervasyon
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-colors flex items-center gap-2 hover-slide"
                >
                  <i
                    className="fas fa-chevron-right text-xs"
                    style={{ color: colors.secondary }}
                  ></i>
                  Hakkımızda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-colors flex items-center gap-2 hover-slide"
                >
                  <i
                    className="fas fa-chevron-right text-xs"
                    style={{ color: colors.secondary }}
                  ></i>
                  İletişim
                </a>
              </li>
            </ul>
          </div>
          {/* Harita */}
          <div className="flex flex-col h-full">
            <h3
              className="text-xl font-bold mb-4 metallic-text"
              style={{ color: colors.secondary }}
            >
              Konumumuz
            </h3>
            <div
              className="flex-1 rounded-lg overflow-hidden relative min-h-[300px]"
              style={{ borderColor: colors.accent }}
            >
              <div className="absolute inset-0">
                <Map address="Atatürk Mah. 100. Yıl Bulvarı No:120, İstanbul" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-8 pt-4 text-center border-t shine-border"
          style={{ borderColor: colors.accent }}
        >
          <p>
            &copy; {new Date().getFullYear()} VIP Araç Kiralama. Tüm hakları
            saklıdır.
          </p>
        </div>
      </footer>

      {/* WhatsApp butonu - Pulse animasyonu */}
      <a
        href="https://api.whatsapp.com/send?phone=+905511065227&text=Merhaba, bilgi alacaktım."
        className="fixed right-6 bottom-6 p-3 rounded-full shadow-lg transition-transform hover:scale-110 z-50 pulse-animation-strong"
        target="_blank"
        rel="noopener noreferrer"
        style={{ background: colors.goldGradient }}
      >
        <img src="/images/whatsapp.svg" alt="Wp-Logo" className="h-8 w-8" />
      </a>

      {/* CSS Animations */}
      <style jsx global>{`
        /* Parıldayan sınırlar için animasyon */
        .gold-shining-border {
          position: relative;
          overflow: hidden;
        }

        .gold-shining-border::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: ${colors.goldShine};
          transform-origin: 0 0;
          animation: rotate 4s linear infinite;
          z-index: -1;
          opacity: 0.6;
          pointer-events: none;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Metalik efektler */
        .metallic-text {
          background: ${colors.goldGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 3s linear infinite;
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
        }

        .glowing-text {
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.5),
            0 0 15px rgba(212, 175, 55, 0.3), 0 0 30px rgba(212, 175, 55, 0.1);
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          0% {
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5),
              0 0 15px rgba(212, 175, 55, 0.3);
          }
          100% {
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.8),
              0 0 20px rgba(212, 175, 55, 0.5), 0 0 30px rgba(212, 175, 55, 0.3);
          }
        }

        .metallic-button {
          background-size: 200% auto;
          animation: shine 3s linear infinite;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }

        .metallic-button:hover {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }

        .metallic-button-small {
          animation: shine 3s linear infinite;
        }

        .metallic-hover:hover {
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.8),
            0 0 20px rgba(212, 175, 55, 0.5);
        }

        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Parıldayan çizgiler */
        .shine-border {
          position: relative;
          overflow: hidden;
        }

        .shine-border::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: ${colors.goldShine};
          animation: shine-border 3s infinite;
        }

        @keyframes shine-border {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Pulse animasyonu */
        .pulse-animation {
          animation: pulse 2s infinite;
        }

        .pulse-animation-strong {
          animation: pulse-strong 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-strong {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 15px rgba(212, 175, 55, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
          }
        }

        /* Fade-in animasyonu */
        .fade-in-animation {
          animation: fadeIn 1.2s ease-in-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* Hover efektleri */
        .hover-slide {
          position: relative;
          transition: transform 0.3s ease;
        }

        .hover-slide:hover {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}
