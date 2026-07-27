"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateBookingStatus, upsertCar } from "@/lib/rental";
import type { BookingStatus } from "@/lib/types";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

/**
 * Middleware already gates /admin, but server actions are reachable by their own
 * endpoint, so every mutation re-checks the session itself.
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Yetkisiz islem.");
}

export async function setBookingStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;

  if (!id || !STATUSES.includes(status)) throw new Error("Gecersiz istek.");

  await updateBookingStatus(id, status);
  revalidatePath("/admin");
}

export async function saveCar(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const dailyPrice = Number(formData.get("dailyPrice"));

  if (!Number.isFinite(dailyPrice) || dailyPrice < 0) {
    throw new Error("Gecersiz fiyat.");
  }

  await upsertCar({
    id: id || undefined,
    slug: String(formData.get("slug") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim(),
    seats: String(formData.get("seats") ?? "").trim(),
    transmission: String(formData.get("transmission") ?? "").trim(),
    dailyPrice,
    accent: String(formData.get("accent") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    active: formData.get("active") === "on",
  });

  revalidatePath("/admin/cars");
  revalidatePath("/");
}
