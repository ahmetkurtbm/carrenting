import Link from "next/link";
import { listBookings } from "@/lib/rental";
import { formatDate } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { setBookingStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandi",
  cancelled: "Iptal",
  completed: "Tamamlandi",
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
};

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Tumu" },
  { value: "pending", label: "Bekleyen" },
  { value: "confirmed", label: "Onayli" },
  { value: "completed", label: "Tamamlanan" },
  { value: "cancelled", label: "Iptal" },
];

function isStatus(value: string): value is BookingStatus {
  return ["pending", "confirmed", "cancelled", "completed"].includes(value);
}

function StatusButtons({ booking }: { booking: Booking }) {
  const targets = (["confirmed", "completed", "cancelled"] as BookingStatus[]).filter(
    (status) => status !== booking.status
  );

  return (
    <div className="flex flex-wrap gap-2">
      {targets.map((status) => (
        <form action={setBookingStatus} key={status}>
          <input name="id" type="hidden" value={booking.id} />
          <input name="status" type="hidden" value={status} />
          <button
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
            type="submit"
          >
            {STATUS_LABEL[status]}
          </button>
        </form>
      ))}
    </div>
  );
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status && isStatus(status) ? status : undefined;

  const [bookings, allBookings] = await Promise.all([
    listBookings(filter),
    listBookings(),
  ]);

  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;

  const now = new Date();
  const thisMonthCount = allBookings.filter((b) => {
    const created = new Date(b.createdAt);
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth()
    );
  }).length;

  const summary = [
    { label: "Bekleyen talep", value: pendingCount },
    { label: "Onayli rezervasyon", value: confirmedCount },
    { label: "Bu ay gelen", value: thisMonthCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Rezervasyonlar</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {summary.map((item) => (
          <div className="rounded-lg border border-slate-200 bg-white p-5" key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const active = (filter ?? "all") === item.value;
          return (
            <Link
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
              }`}
              href={item.value === "all" ? "/admin" : `/admin?status=${item.value}`}
              key={item.value}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Bu filtreye uyan rezervasyon yok.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5"
              key={booking.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold">{booking.fullName}</h2>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[booking.status]}`}
                    >
                      {STATUS_LABEL[booking.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(booking.createdAt)} tarihinde olusturuldu
                  </p>
                </div>

                <a
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  href={`https://api.whatsapp.com/send?phone=${booking.phone.replace(/\D/g, "")}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {booking.phone}
                </a>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-slate-500">Arac</dt>
                  <dd className="mt-0.5 font-semibold">{booking.carModel ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tarih araligi</dt>
                  <dd className="mt-0.5 font-semibold">
                    {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Alis</dt>
                  <dd className="mt-0.5 font-semibold">{booking.pickupLocation}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Teslim</dt>
                  <dd className="mt-0.5 font-semibold">{booking.dropoffLocation}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <StatusButtons booking={booking} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
