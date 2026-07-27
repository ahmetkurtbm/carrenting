import { listAllCars } from "@/lib/rental";
import { isDatabaseConfigured } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";
import type { Car } from "@/lib/types";
import { saveCar } from "../actions";
import DatabaseWarning from "../DatabaseWarning";

export const dynamic = "force-dynamic";

const ACCENT_OPTIONS = [
  { value: "border-sky-200 bg-sky-50 text-sky-600", label: "Mavi" },
  { value: "border-emerald-200 bg-emerald-50 text-emerald-600", label: "Yesil" },
  { value: "border-amber-200 bg-amber-50 text-amber-600", label: "Turuncu" },
  { value: "border-violet-200 bg-violet-50 text-violet-600", label: "Mor" },
  { value: "border-slate-200 bg-slate-50 text-slate-600", label: "Gri" },
];

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function CarForm({ car }: { car?: Car }) {
  return (
    <form action={saveCar} className="grid gap-4 sm:grid-cols-2">
      {car && <input name="id" type="hidden" value={car.id} />}

      <label className="text-sm font-semibold">
        Model
        <input className={fieldClass} defaultValue={car?.model} name="model" required />
      </label>
      <label className="text-sm font-semibold">
        Kisa kod (slug)
        <input className={fieldClass} defaultValue={car?.slug} name="slug" required />
      </label>
      <label className="text-sm font-semibold">
        Tip
        <input className={fieldClass} defaultValue={car?.type} name="type" placeholder="SUV" required />
      </label>
      <label className="text-sm font-semibold">
        Koltuk
        <input className={fieldClass} defaultValue={car?.seats} name="seats" placeholder="5 koltuk" required />
      </label>
      <label className="text-sm font-semibold">
        Vites
        <input className={fieldClass} defaultValue={car?.transmission} name="transmission" placeholder="Otomatik" required />
      </label>
      <label className="text-sm font-semibold">
        Gunluk fiyat (TL)
        <input className={fieldClass} defaultValue={car?.dailyPrice} min="0" name="dailyPrice" step="50" type="number" required />
      </label>
      <label className="text-sm font-semibold">
        Kart rengi
        <select className={fieldClass} defaultValue={car?.accent ?? ACCENT_OPTIONS[0].value} name="accent">
          {ACCENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Siralama
        <input className={fieldClass} defaultValue={car?.sortOrder ?? 0} name="sortOrder" type="number" />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
        <input className="h-4 w-4" defaultChecked={car?.active ?? true} name="active" type="checkbox" />
        Sitede yayinda
      </label>

      <div className="sm:col-span-2">
        <button
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          type="submit"
        >
          {car ? "Guncelle" : "Arac ekle"}
        </button>
      </div>
    </form>
  );
}

export default async function AdminCarsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Filo</h1>
        <DatabaseWarning />
      </div>
    );
  }

  const cars = await listAllCars();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Filo</h1>
      <p className="mt-2 text-sm text-slate-500">
        Buradaki degisiklikler ana sayfada aninda gorunur.
      </p>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-bold">Yeni arac ekle</h2>
        <CarForm />
      </section>

      <section className="mt-8 space-y-4">
        {cars.map((car) => (
          <details className="rounded-lg border border-slate-200 bg-white p-5" key={car.id}>
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className={`h-8 w-12 rounded border ${car.accent}`} />
                <span>
                  <span className="block font-bold">{car.model}</span>
                  <span className="text-sm text-slate-500">{car.type}</span>
                </span>
              </span>
              <span className="flex items-center gap-3 text-sm">
                <span className="font-semibold">
                  {formatPrice(car.dailyPrice, car.currency)}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    car.active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-100 text-slate-500"
                  }`}
                >
                  {car.active ? "Yayinda" : "Pasif"}
                </span>
              </span>
            </summary>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <CarForm car={car} />
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
