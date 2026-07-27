import HomeContent from "./HomeContent";
import { listActiveCars } from "@/lib/rental";
import { siteUrl } from "@/lib/site";

// Cars come from the database, so the landing page must not be statically
// cached at build time — a price change in the admin panel should show up.
export const dynamic = "force-dynamic";

export default async function Home() {
  const cars = await listActiveCars();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "AutoRent",
    description:
      "Antalya ve Istanbul icin gunluk ve haftalik arac kiralama, havalimani teslimi ve hizli rezervasyon.",
    url: siteUrl(),
    telephone: "+90 551 106 52 27",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ataturk Mah. 100. Yil Bulvari No:120",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    priceRange: "₺₺",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    makesOffer: cars.map((car) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Car",
        name: car.model,
        vehicleTransmission: car.transmission,
        seatingCapacity: car.seats,
      },
      price: car.dailyPrice,
      priceCurrency: car.currency,
      availability: "https://schema.org/InStock",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent cars={cars} />
    </>
  );
}
