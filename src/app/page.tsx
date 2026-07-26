"use client";

import { FormEvent, useMemo, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Weather from "./components/Weather";
import Map from "./components/Maps";
import { Language, LanguageSwitcher } from "./components/LanguageSwitcher";

type Car = {
  id: string;
  model: string;
  type: string;
  seats: string;
  transmission: string;
  price: string;
  accent: string;
};

type Copy = {
  navFleet: string;
  navServices: string;
  navBooking: string;
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  primaryCta: string;
  secondaryCta: string;
  fleetTitle: string;
  fleetText: string;
  servicesTitle: string;
  bookingTitle: string;
  bookingText: string;
  pickup: string;
  dropoff: string;
  date: string;
  vehicle: string;
  send: string;
  name: string;
  phone: string;
  locationTitle: string;
  footer: string;
  stats: string[];
  services: { icon: string; title: string; text: string }[];
};

const cars: Car[] = [
  {
    id: "economy",
    model: "Toyota Corolla",
    type: "Ekonomik Sedan",
    seats: "5 koltuk",
    transmission: "Otomatik",
    price: "1.350 TL / gun",
    accent: "border-sky-200 bg-sky-50 text-sky-600",
  },
  {
    id: "suv",
    model: "Volkswagen Tiguan",
    type: "SUV",
    seats: "5 koltuk",
    transmission: "Otomatik",
    price: "2.100 TL / gun",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  {
    id: "van",
    model: "Mercedes Vito",
    type: "Genis Aile Araci",
    seats: "8 koltuk",
    transmission: "Otomatik",
    price: "2.750 TL / gun",
    accent: "border-amber-200 bg-amber-50 text-amber-600",
  },
];

const copy: Record<Language, Copy> = {
  tr: {
    navFleet: "Araçlar",
    navServices: "Hizmetler",
    navBooking: "Rezervasyon",
    heroBadge: "Günlük ve haftalık araç kiralama",
    heroTitle: "Şehir içinde veya tatilde ihtiyacınıza uygun aracı kolayca kiralayın.",
    heroText:
      "Temiz araçlar, net fiyatlar ve hızlı rezervasyon süreciyle modern bir rent a car deneyimi sunuyoruz.",
    primaryCta: "Rezervasyon yap",
    secondaryCta: "Araçları incele",
    fleetTitle: "Popüler araç seçenekleri",
    fleetText:
      "Ekonomik sedan, SUV ve geniş aile araçlarıyla farklı yolculuk ihtiyaçlarına uygun seçenekler.",
    servicesTitle: "Kiralama sürecini kolaylaştıran hizmetler",
    bookingTitle: "Hızlı rezervasyon",
    bookingText:
      "Formu doldurun, talebinizi WhatsApp üzerinden hazır mesaj olarak gönderin.",
    pickup: "Alış yeri",
    dropoff: "Teslim yeri",
    date: "Tarih",
    vehicle: "Araç",
    send: "WhatsApp ile gönder",
    name: "Ad soyad",
    phone: "Telefon",
    locationTitle: "Ofis konumu",
    footer: "AutoRent. Tüm hakları saklıdır.",
    stats: ["Bakımlı filo", "7/24 destek", "Şeffaf fiyat"],
    services: [
      {
        icon: "fa-car-side",
        title: "Günlük kiralama",
        text: "Kısa süreli şehir içi kullanım ve tatil planları için pratik çözümler.",
      },
      {
        icon: "fa-plane-arrival",
        title: "Havalimanı teslimi",
        text: "Aracınızı belirlediğiniz havalimanı veya ofis noktasından teslim alın.",
      },
      {
        icon: "fa-shield-halved",
        title: "Güvenli süreç",
        text: "Rezervasyon, ödeme ve teslim adımları açık şekilde ilerler.",
      },
    ],
  },
  en: {
    navFleet: "Cars",
    navServices: "Services",
    navBooking: "Booking",
    heroBadge: "Daily and weekly car rental",
    heroTitle: "Rent the right car for city trips, business plans, or holidays.",
    heroText:
      "Clean vehicles, clear pricing, and a quick booking flow for a reliable rental experience.",
    primaryCta: "Book now",
    secondaryCta: "View cars",
    fleetTitle: "Popular vehicle options",
    fleetText:
      "Choose from economy sedans, SUVs, and spacious vans for different travel needs.",
    servicesTitle: "Services that make renting easier",
    bookingTitle: "Quick booking",
    bookingText:
      "Fill in the form and send your request as a prepared WhatsApp message.",
    pickup: "Pick-up location",
    dropoff: "Drop-off location",
    date: "Date",
    vehicle: "Vehicle",
    send: "Send via WhatsApp",
    name: "Full name",
    phone: "Phone",
    locationTitle: "Office location",
    footer: "AutoRent. All rights reserved.",
    stats: ["Maintained fleet", "24/7 support", "Clear pricing"],
    services: [
      {
        icon: "fa-car-side",
        title: "Daily rental",
        text: "Practical options for short city use and holiday plans.",
      },
      {
        icon: "fa-plane-arrival",
        title: "Airport delivery",
        text: "Pick up your car from the selected airport or office location.",
      },
      {
        icon: "fa-shield-halved",
        title: "Safe process",
        text: "Booking, payment, and delivery steps are handled transparently.",
      },
    ],
  },
  de: {
    navFleet: "Fahrzeuge",
    navServices: "Service",
    navBooking: "Buchung",
    heroBadge: "Tages- und Wochenmiete",
    heroTitle: "Mieten Sie bequem das passende Auto für Stadt, Arbeit oder Urlaub.",
    heroText:
      "Saubere Fahrzeuge, klare Preise und eine schnelle Reservierung.",
    primaryCta: "Reservieren",
    secondaryCta: "Fahrzeuge ansehen",
    fleetTitle: "Beliebte Fahrzeuge",
    fleetText: "Limousine, SUV und Van für unterschiedliche Reisepläne.",
    servicesTitle: "Services für eine einfache Anmietung",
    bookingTitle: "Schnelle Buchung",
    bookingText: "Formular ausfüllen und Anfrage per WhatsApp senden.",
    pickup: "Abholort",
    dropoff: "Rückgabeort",
    date: "Datum",
    vehicle: "Fahrzeug",
    send: "Per WhatsApp senden",
    name: "Name",
    phone: "Telefon",
    locationTitle: "Bürostandort",
    footer: "AutoRent. Alle Rechte vorbehalten.",
    stats: ["Gepflegte Flotte", "24/7 Support", "Klare Preise"],
    services: [
      { icon: "fa-car-side", title: "Tagesmiete", text: "Flexible Lösungen für kurze Fahrten." },
      { icon: "fa-plane-arrival", title: "Flughafenservice", text: "Abholung am Flughafen oder Büro." },
      { icon: "fa-shield-halved", title: "Sicherer Ablauf", text: "Klare Schritte von Anfrage bis Übergabe." },
    ],
  },
  es: {
    navFleet: "Coches",
    navServices: "Servicios",
    navBooking: "Reserva",
    heroBadge: "Alquiler diario y semanal",
    heroTitle: "Alquila el coche adecuado para ciudad, trabajo o vacaciones.",
    heroText: "Vehículos limpios, precios claros y reserva rápida.",
    primaryCta: "Reservar",
    secondaryCta: "Ver coches",
    fleetTitle: "Opciones populares",
    fleetText: "Sedanes, SUV y vans para distintas necesidades de viaje.",
    servicesTitle: "Servicios para alquilar con facilidad",
    bookingTitle: "Reserva rápida",
    bookingText: "Completa el formulario y envía tu solicitud por WhatsApp.",
    pickup: "Lugar de recogida",
    dropoff: "Lugar de entrega",
    date: "Fecha",
    vehicle: "Vehículo",
    send: "Enviar por WhatsApp",
    name: "Nombre completo",
    phone: "Teléfono",
    locationTitle: "Ubicación",
    footer: "AutoRent. Todos los derechos reservados.",
    stats: ["Flota cuidada", "Soporte 24/7", "Precio claro"],
    services: [
      { icon: "fa-car-side", title: "Alquiler diario", text: "Opciones prácticas para viajes cortos." },
      { icon: "fa-plane-arrival", title: "Entrega en aeropuerto", text: "Recoge el coche en aeropuerto u oficina." },
      { icon: "fa-shield-halved", title: "Proceso seguro", text: "Pasos claros hasta la entrega." },
    ],
  },
  fr: {
    navFleet: "Voitures",
    navServices: "Services",
    navBooking: "Réservation",
    heroBadge: "Location à la journée ou semaine",
    heroTitle: "Louez facilement la voiture adaptée à vos trajets.",
    heroText: "Véhicules propres, prix clairs et réservation rapide.",
    primaryCta: "Réserver",
    secondaryCta: "Voir les voitures",
    fleetTitle: "Options populaires",
    fleetText: "Berlines, SUV et vans pour différents besoins.",
    servicesTitle: "Des services simples pour votre location",
    bookingTitle: "Réservation rapide",
    bookingText: "Remplissez le formulaire et envoyez la demande via WhatsApp.",
    pickup: "Lieu de départ",
    dropoff: "Lieu de retour",
    date: "Date",
    vehicle: "Véhicule",
    send: "Envoyer via WhatsApp",
    name: "Nom complet",
    phone: "Téléphone",
    locationTitle: "Adresse",
    footer: "AutoRent. Tous droits réservés.",
    stats: ["Flotte entretenue", "Support 24/7", "Prix clairs"],
    services: [
      { icon: "fa-car-side", title: "Location journalière", text: "Solutions pratiques pour les courts trajets." },
      { icon: "fa-plane-arrival", title: "Livraison aéroport", text: "Retrait à l'aéroport ou au bureau." },
      { icon: "fa-shield-halved", title: "Processus sûr", text: "Étapes simples jusqu'à la remise." },
    ],
  },
};

function CarGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 21.5h2.8a5.2 5.2 0 0 1 9.4 0h19.6a5.2 5.2 0 0 1 9.4 0H51a3 3 0 0 0 3-3v-3a2 2 0 0 0-.8-1.6l-8.3-6.3a6 6 0 0 0-3.6-1.2H22.6a6 6 0 0 0-4 1.5l-6.2 5.5-4.6 2.6A3 3 0 0 0 6 18.2v0a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="M20 12.5h9M32 12.5h9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
      <circle cx="17.5" cy="21.5" fill="white" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="43.5" cy="21.5" fill="white" r="3.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CarPlaceholder({ car }: { car: Car }) {
  return (
    <div className={`flex aspect-[16/10] items-center justify-center rounded-lg border ${car.accent}`}>
      <CarGlyph className="h-16 w-32 sm:h-20 sm:w-40" />
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Home() {
  const [language, setLanguage] = useState<Language>("tr");
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    pickup: "Antalya Havalimani",
    dropoff: "Antalya Merkez",
    date: "",
    vehicle: cars[0].model,
  });

  const t = copy[language];

  const whatsappLink = useMemo(() => {
    const message = [
      "Merhaba, arac kiralama bilgisi almak istiyorum.",
      `Ad: ${booking.name || "-"}`,
      `Telefon: ${booking.phone || "-"}`,
      `Alis: ${booking.pickup || "-"}`,
      `Teslim: ${booking.dropoff || "-"}`,
      `Tarih: ${booking.date || "-"}`,
      `Arac: ${booking.vehicle}`,
    ].join("\n");

    return `https://api.whatsapp.com/send?phone=905511065227&text=${encodeURIComponent(message)}`;
  }, [booking]);

  function updateBooking(field: keyof typeof booking, value: string) {
    setBooking((current) => ({ ...current, [field]: value }));
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a className="flex items-center gap-3" href="#top">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900 text-sm font-bold tracking-tight text-slate-900">
              A
            </span>
            <span className="text-lg font-bold tracking-tight">AutoRent</span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-blue-700" href="#fleet">{t.navFleet}</a>
            <a className="hover:text-blue-700" href="#services">{t.navServices}</a>
            <a className="hover:text-blue-700" href="#booking">{t.navBooking}</a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Weather />
            </div>
            <LanguageSwitcher value={language} onChange={setLanguage} />
          </div>
        </div>
      </header>

      <section id="top" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[1fr_0.9fr] md:px-8">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {t.heroBadge}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              {t.heroText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700" href="#booking">
                {t.primaryCta}
              </a>
              <a className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-blue-300 hover:text-blue-700" href="#fleet">
                {t.secondaryCta}
              </a>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {t.stats.map((item) => (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700" key={item}>
                  <i className="fas fa-check-circle mr-2 text-blue-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-sm">
            <CarPlaceholder car={cars[1]} />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {cars.map((car) => (
                <button
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    booking.vehicle === car.model
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                  key={car.id}
                  onClick={() => updateBooking("vehicle", car.model)}
                  type="button"
                >
                  <span className="block font-semibold">{car.model}</span>
                  <span className="text-slate-500">{car.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-950">{t.fleetTitle}</h2>
            <p className="mt-3 leading-7 text-slate-600">{t.fleetText}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {cars.map((car) => (
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md" key={car.id}>
                <CarPlaceholder car={car} />
                <div className="mt-5">
                  <p className="text-sm font-medium text-blue-700">{car.type}</p>
                  <h3 className="mt-1 text-xl font-bold">{car.model}</h3>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{car.seats}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{car.transmission}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-bold text-slate-950">{car.price}</p>
                    <button
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      onClick={() => {
                        updateBooking("vehicle", car.model);
                        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      type="button"
                    >
                      {t.navBooking}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-2xl text-3xl font-bold text-slate-950">{t.servicesTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {t.services.map((service) => (
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-sm" key={service.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <i className={`fas ${service.icon}`} />
                </span>
                <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">{t.bookingTitle}</h2>
            <p className="mt-3 leading-7 text-slate-600">{t.bookingText}</p>
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-bold">{t.locationTitle}</h3>
              <Map address="Ataturk Mah. 100. Yil Bulvari No:120, Istanbul" />
            </div>
          </div>

          <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6" onSubmit={submitBooking}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {t.name}
                <input className={inputClass} value={booking.name} onChange={(event) => updateBooking("name", event.target.value)} placeholder={t.name} />
              </label>
              <label className="text-sm font-semibold">
                {t.phone}
                <input className={inputClass} value={booking.phone} onChange={(event) => updateBooking("phone", event.target.value)} placeholder="+90" />
              </label>
              <label className="text-sm font-semibold">
                {t.pickup}
                <input className={inputClass} value={booking.pickup} onChange={(event) => updateBooking("pickup", event.target.value)} />
              </label>
              <label className="text-sm font-semibold">
                {t.dropoff}
                <input className={inputClass} value={booking.dropoff} onChange={(event) => updateBooking("dropoff", event.target.value)} />
              </label>
              <label className="text-sm font-semibold">
                {t.date}
                <input className={inputClass} type="date" value={booking.date} onChange={(event) => updateBooking("date", event.target.value)} />
              </label>
              <label className="text-sm font-semibold">
                {t.vehicle}
                <select className={inputClass} value={booking.vehicle} onChange={(event) => updateBooking("vehicle", event.target.value)}>
                  {cars.map((car) => (
                    <option key={car.id} value={car.model}>{car.model}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" type="submit">
              <i className="fab fa-whatsapp" />
              {t.send}
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {t.footer}</p>
          <a className="font-semibold text-blue-700 hover:text-blue-900" href="#booking">
            {t.primaryCta}
          </a>
        </div>
      </footer>
    </main>
  );
}
