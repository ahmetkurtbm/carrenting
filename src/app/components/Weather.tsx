"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!; // buraya kendi key'ini gir
  const CITY = "Antalya"; // hava durumu almak istediğin şehir
  const UNITS = "metric"; // sıcaklık birimi

  // gelen 01n değeri için logo tanımlanacak

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}&lang=tr`
      )
      .then((res) => {
        setWeather(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Veri alınamadı.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error || !weather) return <p>Hata: {error}</p>;

  return (
    <div className="bg-[#5D6D7E] text-white p-1 shadow-lg w-fit rounded-lg flex flex-col items-center">
      <h2 className="text-xs font-semibold">{weather.name} Hava Durumu</h2>
      <div className="flex flex-row items-center justify-between gap-2">
        <p className="text-xs">{weather.main.temp}°C</p>
        <p className="text-xs capitalize">{weather.weather[0].description}</p>
        <img
          className="w-8 h-8"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Weather Icon"
        />
      </div>
    </div>
  );
}
