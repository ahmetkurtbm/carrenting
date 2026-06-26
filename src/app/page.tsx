"use client";

import { useEffect, useMemo, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Weather from "./components/Weather";
import Map from "./components/Maps";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

type Car = {
  name: string;
  image: string;
  category: string;
  price: string;
  description: string;
  features: string[];
};

const cars: Car[] = [
  {
    name: "Mercedes S-Class",
    image: "/images/mercedes.jpeg",
    category: "VIP Sedan",
    price: "2500 TL / gun",
    description:
      "Havalimani transferi, is seyahati ve ozel davetler icin sessiz, konforlu ve prestijli yolculuk.",
    features: ["Soforlu hizmet", "Genis ic hacim", "Deri koltuk", "Wifi"],
  },
  {
    name: "BMW 7 Series",
    image: "/images/car.svg",
    category: "Business Class",
    price: "2300 TL / gun",
    description:
      "Gunluk kiralama ve toplantilara zamaninda ulasim icin premium sedan deneyimi.",
    features: ["VIP transfer", "Klima", "Telefon sarj", "7/24 destek"],
  },
  {
    name: "Audi A8",
    image: "/images/lamborghini.svg",
    category: "Executive",
    price: "2400 TL / gun",
    description:
      "Ozel gunler, sehirler arasi yolculuklar ve misafir karsilama icin rafine secim.",
    features: ["Profesyonel surucu", "Temiz arac", "Esnek rota", "Mini ikram"],
  },
];

const services = [
  {
    icon: "fa-route",
    title: "Havalimani Transfer",
    text: "Ucus saatinize gore planlanan, gecikme takipli ve konforlu transfer.",
  },
  {
    icon: "fa-user-tie",
    title: "Soforlu Kiralama",
    text: "Deneyimli suruculerle is programlariniz ve ozel gunleriniz icin hazir ekip.",
  },
  {
    icon: "fa-headset",
    title: "7/24 Rezervasyon",
    text: "WhatsApp uzerinden hizli teklif, net fiyat ve anlik planlama destegi.",
  },
];

const stats = [
  ["14+", "Yil deneyim"],
  ["1200+", "Tamamlanan transfer"],
  ["4.9", "Musteri puani"],
];

export default function Home() {
  const [currentCar, setCurrentCar] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentCar((current) => (current + 1) % cars.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const selectedCar = cars[currentCar];
  const whatsAppLink = useMemo(() => {
    const message = `Merhaba, ${selectedCar.name} icin rezervasyon bilgisi almak istiyorum.`;
    return `https://api.whatsapp.com/send?phone=905511065227&text=${encodeURIComponent(
      message
    )}`;
  }, [selectedCar.name]);

  return (
    <main className="min-h-screen bg-[#101214] text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101214]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a className="flex items-center gap-3" href="#top">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-zinc-950">
              <img
                src="/images/lamborghini.svg"
                alt=""
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                VIP Rent
              </span>
              <span className="hidden text-xs text-zinc-400 sm:block">
                Premium arac kiralama
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a className="transition hover:text-yellow-300" href="#fleet">
              Filomuz
            </a>
            <a className="transition hover:text-yellow-300" href="#services">
              Hizmetler
            </a>
            <a className="transition hover:text-yellow-300" href="#contact">
              Iletisim
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Weather />
            </div>
            <LanguageSwitcher />
            <a
              className="hidden rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300 sm:inline-flex"
              href={whatsAppLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Teklif al
            </a>
          </div>
        </div>
      </header>

      <section
        className="relative overflow-hidden border-b border-white/10"
        id="top"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.22),transparent_34%),linear-gradient(135deg,rgba(16,18,20,0.9),rgba(20,28,32,0.78))]" />
        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-8">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
              Antalya ve Istanbul
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Soforlu VIP arac kiralama deneyimini net, hizli ve guvenli hale
              getirin.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              Is seyahati, havalimani transferi, ozel davet ve gunluk premium
              ulasim ihtiyaclariniz icin bakimli araclar ve profesyonel ekip.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-yellow-300"
                href={whatsAppLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fab fa-whatsapp" />
                WhatsApp ile rezervasyon
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-yellow-400/70 hover:text-yellow-300"
                href="#fleet"
              >
                Filoyu incele
                <i className="fas fa-arrow-right text-sm" />
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map(([value, label]) => (
                <div
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                  key={label}
                >
                  <p className="text-2xl font-bold text-yellow-300">{value}</p>
                  <p className="mt-1 text-xs text-zinc-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="overflow-hidden rounded-lg border border-yellow-500/30 bg-zinc-950 shadow-2xl shadow-black/40">
              <div className="relative aspect-[4/3] md:aspect-[16/11]">
                <img
                  className="h-full w-full object-cover"
                  src="/images/mercedes.jpeg"
                  alt="Mercedes VIP arac"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-yellow-300">
                    Hazir filo
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    Premium transfer ve gunluk kiralama
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#15191c] py-16" id="services">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">
                Hizmetler
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Yolculugu basitlestiren premium servisler
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              Fiyat, rota, arac ve zamanlama bilgisi rezervasyon oncesinde
              netlesir. Surpriz maliyet olmadan plan yaparsiniz.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article
                className="rounded-lg border border-white/10 bg-[#101214] p-6 transition hover:border-yellow-500/50"
                key={service.title}
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400 text-zinc-950">
                  <i className={`fas ${service.icon}`} />
                </span>
                <h3 className="text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" id="fleet">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">
                Filo
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Ihtiyaca gore secilen araclar
              </h2>
            </div>
            <div className="flex gap-2">
              {cars.map((car, index) => (
                <button
                  className={`h-3 rounded-full transition-all ${
                    currentCar === index
                      ? "w-9 bg-yellow-400"
                      : "w-3 bg-zinc-700 hover:bg-zinc-500"
                  }`}
                  key={car.name}
                  onClick={() => setCurrentCar(index)}
                  type="button"
                  aria-label={`${car.name} sec`}
                />
              ))}
            </div>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-white/10 bg-[#15191c] md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[320px] bg-zinc-950">
              <img
                className="h-full min-h-[320px] w-full object-contain p-8"
                src={selectedCar.image}
                alt={selectedCar.name}
              />
            </div>
            <div className="p-6 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">
                {selectedCar.category}
              </p>
              <h3 className="mt-3 text-3xl font-bold text-white">
                {selectedCar.name}
              </h3>
              <p className="mt-4 text-base leading-8 text-zinc-300">
                {selectedCar.description}
              </p>
              <p className="mt-6 text-2xl font-bold text-yellow-300">
                {selectedCar.price}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {selectedCar.features.map((feature) => (
                  <div
                    className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                    key={feature}
                  >
                    <i className="fas fa-check text-yellow-300" />
                    {feature}
                  </div>
                ))}
              </div>
              <a
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-yellow-300"
                href={whatsAppLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                Bu arac icin teklif al
                <i className="fas fa-arrow-right text-sm" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#15191c] py-16" id="contact">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">
              Iletisim
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Rezervasyon icin hizli iletisim
            </h2>
            <div className="mt-8 space-y-4 text-zinc-300">
              <p className="flex items-center gap-3">
                <i className="fas fa-phone text-yellow-300" />
                +90 551 106 5227
              </p>
              <p className="flex items-center gap-3">
                <i className="fas fa-envelope text-yellow-300" />
                info@viprentacar.com
              </p>
              <p className="flex items-center gap-3">
                <i className="fas fa-clock text-yellow-300" />
                Her gun 08:00 - 22:00
              </p>
            </div>
            <a
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 font-semibold text-zinc-950 transition hover:brightness-110"
              href={whatsAppLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-whatsapp" />
              WhatsApp'tan yaz
            </a>
          </div>

          <Map address="Ataturk Mah. 100. Yil Bulvari No:120, Istanbul" />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#101214] px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-zinc-400 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} VIP Rent. Tum haklari saklidir.</p>
          <div className="flex gap-4 text-lg text-yellow-300">
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/ahm4t_kurt/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              aria-label="LinkedIn"
              href="https://www.linkedin.com/in/ahmet-kurt-bm/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-linkedin" />
            </a>
            <a
              aria-label="Twitter"
              href="https://twitter.com/ahmet6kurt"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-twitter" />
            </a>
          </div>
        </div>
      </footer>

      <a
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition hover:scale-105"
        href={whatsAppLink}
        rel="noopener noreferrer"
        target="_blank"
        aria-label="WhatsApp"
      >
        <img src="/images/whatsapp.svg" alt="" className="h-8 w-8" />
      </a>
    </main>
  );
}
