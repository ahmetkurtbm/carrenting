"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  address: string;
}

export default function Map({ address }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hasMap, setHasMap] = useState(false);
  const [failed, setFailed] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) {
      setFailed(true);
      return;
    }

    const mapApiKey = apiKey;
    let cancelled = false;

    async function loadMap() {
      try {
        const loader = new Loader({
          apiKey: mapApiKey,
          version: "weekly",
        });

        await loader.load();

        if (cancelled || !mapRef.current) {
          return;
        }

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
          if (cancelled || !mapRef.current) {
            return;
          }

          if (status !== "OK" || !results?.[0]) {
            setFailed(true);
            return;
          }

          const location = results[0].geometry.location;
          const map = new google.maps.Map(mapRef.current, {
            center: location,
            zoom: 13,
            disableDefaultUI: true,
            zoomControl: true,
          });

          new google.maps.Marker({
            map,
            position: location,
          });

          setHasMap(true);
        });
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, [address, apiKey]);

  return (
    <div className="relative h-full min-h-[260px] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
      <div ref={mapRef} className="h-full min-h-[260px] w-full" />
      {(failed || !hasMap) && (
        <div className="absolute inset-0 flex flex-col justify-center bg-slate-900 p-6 text-sm text-slate-200">
          <span className="mb-2 text-base font-semibold text-blue-400">
            Konum
          </span>
          <span>{address}</span>
          <a
            className="mt-4 text-blue-300 underline-offset-4 hover:underline"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Maps'te ac
          </a>
        </div>
      )}
    </div>
  );
}
