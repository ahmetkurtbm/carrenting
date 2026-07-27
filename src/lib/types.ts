/** Shared domain types. Kept free of server-only imports so client components can use them. */

export type Car = {
  id: string;
  slug: string;
  model: string;
  type: string;
  seats: string;
  transmission: string;
  dailyPrice: number;
  currency: string;
  accent: string;
  sortOrder: number;
  active: boolean;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  id: string;
  carId: string;
  carModel: string | null;
  fullName: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  status: BookingStatus;
  adminNote: string;
  createdAt: string;
};
