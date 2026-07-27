/**
 * Shown instead of crashing when the Supabase credentials are missing — most
 * often a deployment where the environment variables were added after the last
 * build, or only scoped to Preview instead of Production.
 */
export default function DatabaseWarning() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <h2 className="text-lg font-bold text-amber-900">
        Veritabani baglantisi yapilandirilmamis
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-800">
        <code className="font-mono">SUPABASE_URL</code> ve{" "}
        <code className="font-mono">SUPABASE_SECRET_KEY</code> tanimli degil, bu
        yuzden rezervasyon ve filo verileri okunamiyor.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-amber-800">
        <li>Yerelde: bu iki degeri .env.local dosyasina ekleyin.</li>
        <li>
          Vercel&apos;de: Project Settings &rarr; Environment Variables bolumune{" "}
          <strong>Production</strong> kapsamiyla ekleyin.
        </li>
        <li>
          Vercel&apos;de env degiskeni eklemek mevcut deployment&apos;i
          etkilemez; ekledikten sonra <strong>yeniden deploy edin</strong>.
        </li>
      </ul>
    </div>
  );
}
