"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: WeatherData }
  | { status: "unavailable" };

export default function Weather() {
  const [weather, setWeather] = useState<WeatherState>({ status: "idle" });
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setWeather({ status: "unavailable" });
      return;
    }

    const weatherApiKey = apiKey;
    const controller = new AbortController();

    async function loadWeather() {
      try {
        setWeather({ status: "loading" });

        const params = new URLSearchParams({
          q: "Antalya",
          appid: weatherApiKey,
          units: "metric",
          lang: "tr",
        });

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = (await response.json()) as WeatherData;
        setWeather({ status: "ready", data });
      } catch (error) {
        if (!controller.signal.aborted) {
          setWeather({ status: "unavailable" });
        }
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [apiKey]);

  if (weather.status === "loading" || weather.status === "idle") {
    return (
      <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-200">
        Hava durumu yukleniyor
      </div>
    );
  }

  if (weather.status === "unavailable") {
    return (
      <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-200">
        Antalya 24 saat hizmet
      </div>
    );
  }

  const current = weather.data.weather[0];

  return (
    <div className="flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-white shadow-sm">
      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
        />
      </svg>
      <div>
        <p className="text-xs font-semibold">{weather.data.name}</p>
        <p className="text-xs capitalize text-slate-300">{current.description}</p>
      </div>
      <p className="text-sm font-bold">{Math.round(weather.data.main.temp)}C</p>
    </div>
  );
}
