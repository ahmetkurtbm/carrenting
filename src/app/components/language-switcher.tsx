"use client";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = "googtrans";

// We should know a predefined nickname of a language and provide its title (the name for displaying)
interface LanguageDescriptor {
  name: string;
  title: string;
}

// Types for JS-based declarations in public/assets/scripts/lang-config.js
declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: {
      languages: LanguageDescriptor[];
      defaultLanguage: string;
    };
  }
}
const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>();
  const [languageConfig, setLanguageConfig] = useState<any>();

  // Initialize translation engine
  useEffect(() => {
    // 1. Read the cookie
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue;
    if (existingLanguageCookieValue) {
      // 2. If the cookie is defined, extract a language nickname from there.
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still not decided about languageValue - use default one
    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }
    if (languageValue) {
      // 4. Set the current language if we have a related decision.
      setCurrentLanguage(languageValue);
    } // 5. Set the language config.
    if (global.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
    }
  }, []);

  // Don't display anything if current language information is unavailable.
  if (!currentLanguage || !languageConfig) {
    return null;
  }

  // The following function switches the current language
  const switchLanguage = (lang: string) => () => {
    // We just need to set the related cookie and reload the page
    // "/auto/" prefix is Google's definition as far as a cookie name
    setCookie(null, COOKIE_NAME, "/auto/" + lang);
    window.location.reload();
  };
  return (
    <div className="text-center notranslate text-sm bg-[#5D6D7E] text-white p-1 shadow-lg w-fit rounded-lg flex flex-col items-center">
      {languageConfig.languages.map((ld: LanguageDescriptor, i: number) => (
        <span
          key={`l_s_${ld.name}`}
          className="inline-flex items-center mx-2 relative group"
        >
          {/* Seçili olan dili göster */}
          {currentLanguage === ld.name ||
          (currentLanguage === "auto" &&
            languageConfig.defaultLanguage === ld) ? (
            <span className="text-orange-300 flex items-center gap-1 cursor-pointer">
              <img
                src={`/images/${ld.name}.svg`} // Bu yolu sen kendine göre ayarla
                alt={`${ld.title} flag`}
                className="w-4 h-4 rounded"
              />
              {ld.title}

              {/* Dillerin dropdown'u */}
              <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-lg mt-65 py-2">
                {languageConfig.languages
                  .filter((language: any) => language.name !== ld.name) // Diğer dilleri göster
                  .map((ld2: LanguageDescriptor) => (
                    <a
                      key={ld2.name}
                      onClick={switchLanguage(ld2.name)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <img
                        src={`/images/${ld2.name}.svg`} // Dil bayrağı
                        alt={`${ld2.title}-flag`}
                        className="w-4 h-4 inline-block mr-2"
                      />
                      {ld2.title}
                    </a>
                  ))}
              </div>
            </span>
          ) : (
            // Seçili olmayan dili gizle
            <span className="hidden">
              <a
                onClick={switchLanguage(ld.name)}
                className="text-blue-300 cursor-pointer hover:underline flex items-center gap-1"
              >
                <img
                  src={`/images/${ld.name}.svg`} // Aynı şekilde bu da senin yapına göre değişebilir
                  alt={`${ld.title}-flag`}
                  className="w-4 h-4 rounded"
                />
                {ld.title}
              </a>
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };
