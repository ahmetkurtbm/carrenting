"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "googtrans";
const languages: LanguageDescriptor[] = [
  { title: "Turkish", name: "tr" },
  { title: "English", name: "en" },
  { title: "Deutsch", name: "de" },
  { title: "Espanol", name: "es" },
  { title: "Francais", name: "fr" },
];

interface LanguageDescriptor {
  name: string;
  title: string;
}

function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function writeCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState("tr");

  useEffect(() => {
    const cookieLanguage = readCookie(COOKIE_NAME)?.split("/")[2];
    setCurrentLanguage(cookieLanguage || "tr");
  }, []);

  const selectedLanguage =
    languages.find((language) => language.name === currentLanguage) ?? languages[0];

  if (!selectedLanguage) {
    return null;
  }

  const switchLanguage = (language: string) => {
    writeCookie(COOKIE_NAME, `/auto/${language}`);
    setCurrentLanguage(language);
  };

  return (
    <div className="group relative notranslate">
      <button
        className="flex items-center gap-2 rounded-lg bg-zinc-800/80 px-3 py-2 text-sm text-white shadow-lg transition hover:bg-zinc-700"
        type="button"
      >
        <img
          src={`/images/${selectedLanguage.name}.svg`}
          alt=""
          className="h-4 w-4 rounded-sm"
        />
        <span className="hidden md:inline">{selectedLanguage.title}</span>
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 min-w-36 rounded-lg border border-zinc-700 bg-zinc-950 py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
        {languages.map((language) => (
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-800"
            key={language.name}
            onClick={() => switchLanguage(language.name)}
            type="button"
          >
            <img
              src={`/images/${language.name}.svg`}
              alt=""
              className="h-4 w-4 rounded-sm"
            />
            {language.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export { COOKIE_NAME };
