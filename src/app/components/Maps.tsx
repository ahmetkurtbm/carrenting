"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  address: string;
}

const Map: React.FC<MapProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAP_API_KEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      const _geocoder = new google.maps.Geocoder();
      setGeocoder(_geocoder);
    });
  }, []);

  useEffect(() => {
    if (!geocoder || !mapRef.current) return;

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: results[0].geometry.location,
          zoom: 8,
        });

        new google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });
      } else {
        console.error("Geocode error:", status);
      }
    });
  }, [address, geocoder]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "200px",
        width: "300px",
        borderRadius: "10px",
      }}
    />
  );
};

export default Map;
