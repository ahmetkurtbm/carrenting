import "server-only";

import { getSupabase, isDatabaseConfigured } from "./supabase";
import type { Booking, BookingStatus, Car } from "./types";

export type { Booking, BookingStatus, Car };

type CarRow = {
  id: string;
  slug: string;
  model: string;
  type: string;
  seats: string;
  transmission: string;
  daily_price: string | number;
  currency: string;
  accent: string;
  sort_order: number;
  active: boolean;
};

type BookingRow = {
  id: string;
  car_id: string;
  full_name: string;
  phone: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  return_date: string;
  status: BookingStatus;
  admin_note: string;
  created_at: string;
  // PostgREST returns a single object for a to-one relation, but the generated
  // types widen it to an array — accept both shapes.
  rental_cars: { model: string } | { model: string }[] | null;
};

const CAR_COLUMNS =
  "id, slug, model, type, seats, transmission, daily_price, currency, accent, sort_order, active";

const BOOKING_COLUMNS =
  "id, car_id, full_name, phone, pickup_location, dropoff_location, pickup_date, return_date, status, admin_note, created_at, rental_cars ( model )";

function toCar(row: CarRow): Car {
  return {
    id: row.id,
    slug: row.slug,
    model: row.model,
    type: row.type,
    seats: row.seats,
    transmission: row.transmission,
    dailyPrice: Number(row.daily_price),
    currency: row.currency,
    accent: row.accent,
    sortOrder: row.sort_order,
    active: row.active,
  };
}

function toBooking(row: BookingRow): Booking {
  const car = Array.isArray(row.rental_cars) ? row.rental_cars[0] : row.rental_cars;

  return {
    id: row.id,
    carId: row.car_id,
    carModel: car?.model ?? null,
    fullName: row.full_name,
    phone: row.phone,
    pickupLocation: row.pickup_location,
    dropoffLocation: row.dropoff_location,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
  };
}

/**
 * Cars shown on the public site. Falls back to an empty list when the database
 * is not configured yet so a fresh clone still renders instead of crashing.
 */
export async function listActiveCars(): Promise<Car[]> {
  if (!isDatabaseConfigured()) return [];

  const { data, error } = await getSupabase()
    .from("rental_cars")
    .select(CAR_COLUMNS)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Araclar okunamadi: ${error.message}`);

  return (data as CarRow[]).map(toCar);
}

/** Every car including passive ones — used by the admin fleet screen. */
export async function listAllCars(): Promise<Car[]> {
  const { data, error } = await getSupabase()
    .from("rental_cars")
    .select(CAR_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Araclar okunamadi: ${error.message}`);

  return (data as CarRow[]).map(toCar);
}

/**
 * Confirmed bookings for the same car whose date range overlaps the requested
 * one. Two ranges overlap when each starts on or before the other one ends.
 */
export async function findConflictingBookings(
  carId: string,
  pickupDate: string,
  returnDate: string
): Promise<Booking[]> {
  const { data, error } = await getSupabase()
    .from("rental_bookings")
    .select(BOOKING_COLUMNS)
    .eq("car_id", carId)
    .eq("status", "confirmed")
    .lte("pickup_date", returnDate)
    .gte("return_date", pickupDate);

  if (error) throw new Error(`Musaitlik kontrol edilemedi: ${error.message}`);

  return (data as BookingRow[]).map(toBooking);
}

export async function createBooking(input: {
  carId: string;
  fullName: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
}): Promise<Booking> {
  const { data, error } = await getSupabase()
    .from("rental_bookings")
    .insert({
      car_id: input.carId,
      full_name: input.fullName,
      phone: input.phone,
      pickup_location: input.pickupLocation,
      dropoff_location: input.dropoffLocation,
      pickup_date: input.pickupDate,
      return_date: input.returnDate,
    })
    .select(BOOKING_COLUMNS)
    .single();

  if (error) throw new Error(`Rezervasyon kaydedilemedi: ${error.message}`);

  return toBooking(data as BookingRow);
}

export async function listBookings(status?: BookingStatus): Promise<Booking[]> {
  let query = getSupabase()
    .from("rental_bookings")
    .select(BOOKING_COLUMNS)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) throw new Error(`Rezervasyonlar okunamadi: ${error.message}`);

  return (data as BookingRow[]).map(toBooking);
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { error } = await getSupabase()
    .from("rental_bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Durum guncellenemedi: ${error.message}`);
}

export async function upsertCar(input: {
  id?: string;
  slug: string;
  model: string;
  type: string;
  seats: string;
  transmission: string;
  dailyPrice: number;
  accent: string;
  sortOrder: number;
  active: boolean;
}) {
  const payload = {
    slug: input.slug,
    model: input.model,
    type: input.type,
    seats: input.seats,
    transmission: input.transmission,
    daily_price: input.dailyPrice,
    accent: input.accent,
    sort_order: input.sortOrder,
    active: input.active,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  const { error } = input.id
    ? await supabase.from("rental_cars").update(payload).eq("id", input.id)
    : await supabase.from("rental_cars").insert(payload);

  if (error) throw new Error(`Arac kaydedilemedi: ${error.message}`);
}
