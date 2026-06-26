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
      <div className="rounded-lg bg-zinc-800/80 px-3 py-2 text-xs text-zinc-200">
        Hava durumu yukleniyor
      </div>
    );
  }

  if (weather.status === "unavailable") {
    return (
      <div className="rounded-lg bg-zinc-800/80 px-3 py-2 text-xs text-zinc-200">
        Antalya 24 saat hizmet
      </div>
    );
  }

  const current = weather.data.weather[0];

  return (
    <div className="flex w-fit items-center gap-2 rounded-lg bg-zinc-800/80 px-3 py-2 text-white shadow-lg">
      <div>
        <p className="text-xs font-semibold">{weather.data.name}</p>
        <p className="text-xs capitalize text-zinc-300">{current.description}</p>
      </div>
      <p className="text-sm font-bold">{Math.round(weather.data.main.temp)}C</p>
      <img
        className="h-8 w-8"
        src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
        alt=""
      />
    </div>
  );
}
