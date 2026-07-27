import Link from "next/link";
import { auth, signOut } from "@/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // The login page renders inside this layout too, so the chrome is only shown
  // once there is a session. Route protection itself lives in middleware.
  if (!session?.user) return <>{children}</>;

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-3" href="/admin">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900 text-sm font-bold">
                A
              </span>
              <span className="text-base font-bold tracking-tight">
                AutoRent <span className="text-slate-400">yonetim</span>
              </span>
            </Link>

            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link className="hover:text-blue-700" href="/admin">
                Rezervasyonlar
              </Link>
              <Link className="hover:text-blue-700" href="/admin/cars">
                Filo
              </Link>
              <Link className="hover:text-blue-700" href="/" target="_blank">
                Siteyi gor
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">
              {session.user.email}
            </span>
            <form action={signOutAction}>
              <button
                className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700"
                type="submit"
              >
                Cikis
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
