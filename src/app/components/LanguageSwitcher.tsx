"use client";

export type Language = "tr" | "en" | "de" | "es" | "fr";

const languages: { name: Language; title: string }[] = [
  { title: "TR", name: "tr" },
  { title: "EN", name: "en" },
  { title: "DE", name: "de" },
  { title: "ES", name: "es" },
  { title: "FR", name: "fr" },
];

type LanguageSwitcherProps = {
  value: Language;
  onChange: (language: Language) => void;
};

export function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
      {languages.map((language) => (
        <button
          aria-pressed={value === language.name}
          className={`min-w-10 rounded-md px-2 py-1.5 text-xs font-bold transition ${
            value === language.name
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
          key={language.name}
          onClick={() => onChange(language.name)}
          type="button"
        >
          {language.title}
        </button>
      ))}
    </div>
  );
}
