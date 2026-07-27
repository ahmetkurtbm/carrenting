"use server";

import { createBooking, findConflictingBookings } from "@/lib/rental";
import { sendBookingNotification } from "@/lib/mail";

export type BookingResult =
  | { ok: true; conflict: boolean }
  | { ok: false; error: "validation" | "server" };

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function submitBooking(formData: FormData): Promise<BookingResult> {
  const carId = String(formData.get("carId") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const pickupLocation = String(formData.get("pickupLocation") ?? "").trim();
  const dropoffLocation = String(formData.get("dropoffLocation") ?? "").trim();
  const pickupDate = String(formData.get("pickupDate") ?? "");
  const returnDate = String(formData.get("returnDate") ?? "");

  const valid =
    carId &&
    fullName &&
    phone &&
    pickupLocation &&
    dropoffLocation &&
    isIsoDate(pickupDate) &&
    isIsoDate(returnDate) &&
    returnDate >= pickupDate;

  if (!valid) return { ok: false, error: "validation" };

  try {
    // Requests are always recorded as `pending`; an overlap with a confirmed
    // booking is surfaced to the visitor as a warning but the admin decides.
    const conflicts = await findConflictingBookings(carId, pickupDate, returnDate);

    const booking = await createBooking({
      carId,
      fullName,
      phone,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      returnDate,
    });

    // Deliberately not awaited into the failure path: the booking is already
    // stored, so a mail problem must not be reported to the visitor as an error.
    await sendBookingNotification({
      fullName,
      phone,
      carModel: booking.carModel ?? "-",
      pickupLocation,
      dropoffLocation,
      pickupDate,
      returnDate,
    });

    return { ok: true, conflict: conflicts.length > 0 };
  } catch (error) {
    console.error("Rezervasyon kaydedilemedi", error);
    return { ok: false, error: "server" };
  }
}
