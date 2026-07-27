import { redirect } from "next/navigation";
import { auth, isGateHubConfigured, signIn } from "@/auth";

export const metadata = {
  title: "Yonetici girisi",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const configured = isGateHubConfigured();

  async function signInWithGateHub() {
    "use server";
    await signIn("gatehub", { redirectTo: "/admin" });
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-100 p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-slate-300/40 blur-3xl" />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-blue-700 p-12 text-white md:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-sm font-bold">
              A
            </span>
            <span className="text-lg font-bold tracking-tight">AutoRent</span>
          </div>

          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em]">
              Yonetim paneli
            </p>
            <h1 className="max-w-sm text-4xl font-bold leading-[1.08] tracking-tight">
              Rezervasyonlari ve filonu tek ekrandan yonet.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
              Gelen talepleri onayla, arac musaitligini takip et ve fiyatlari
              kod degistirmeden guncelle.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Erisim GateHub kimlik dogrulamasi ile korunur.
          </p>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900 text-sm font-bold text-slate-900">
              A
            </span>
            <span className="text-lg font-bold tracking-tight">AutoRent</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Hos geldiniz
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Devam etmek icin GateHub hesabinizla giris yapin.
          </p>

          <form action={signInWithGateHub} className="mt-8">
            <button
              className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 shadow-sm transition hover:-translate-y-px hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!configured}
              type="submit"
            >
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
                <path d="m9.2 12 2 2 3.6-3.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              </svg>
              GateHub ile giris yap
            </button>
          </form>

          {!configured && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              GATEHUB_CLIENT_ID ve GATEHUB_CLIENT_SECRET tanimli degil. GateHub
              panelinden bu uygulamayi kaydedip degerleri .env.local dosyasina
              ekleyin.
            </p>
          )}

          <p className="mt-auto pt-10 text-[10px] text-slate-400">
            Bu alan yalnizca yetkili yoneticiler icindir.
          </p>
        </div>
      </div>
    </div>
  );
}
