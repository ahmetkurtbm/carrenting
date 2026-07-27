import "server-only";

import { Resend } from "resend";
import { formatDate } from "./format";

// Resend's shared sender only delivers to the address that owns the Resend
// account, which is exactly what we need here (admin notifications). Set
// BOOKING_MAIL_FROM to an address on your own verified domain to lift that.
const DEFAULT_FROM = "AutoRent <onboarding@resend.dev>";

function recipients() {
  return (process.env.BOOKING_MAIL_TO ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && recipients().length > 0);
}

type BookingMail = {
  fullName: string;
  phone: string;
  carModel: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
};

/**
 * Notifies the admin about a new request. Never throws: a mail outage must not
 * lose a booking that is already safely stored in the database.
 */
export async function sendBookingNotification(booking: BookingMail) {
  if (!isMailConfigured()) {
    console.warn("Mail yapilandirilmamis, bildirim gonderilmedi.");
    return { sent: false as const };
  }

  const rows: [string, string][] = [
    ["Ad soyad", booking.fullName],
    ["Telefon", booking.phone],
    ["Arac", booking.carModel],
    ["Alis yeri", booking.pickupLocation],
    ["Teslim yeri", booking.dropoffLocation],
    ["Alis tarihi", formatDate(booking.pickupDate)],
    ["Donus tarihi", formatDate(booking.returnDate)],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a">
      <h2 style="margin:0 0 4px;font-size:20px">Yeni rezervasyon talebi</h2>
      <p style="margin:0 0 20px;color:#64748b;font-size:14px">AutoRent web sitesi</p>
      <table style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:6px 24px 6px 0;color:#64748b">${label}</td>
            <td style="padding:6px 0;font-weight:600">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#64748b">
        Talep yonetim panelinde "Bekliyor" durumunda listelendi.
      </p>
    </div>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.BOOKING_MAIL_FROM ?? DEFAULT_FROM,
      to: recipients(),
      subject: `Yeni rezervasyon: ${booking.fullName} - ${booking.carModel}`,
      replyTo: undefined,
      html,
    });

    if (error) {
      console.error("Rezervasyon bildirimi gonderilemedi", error);
      return { sent: false as const };
    }

    return { sent: true as const };
  } catch (error) {
    console.error("Rezervasyon bildirimi gonderilemedi", error);
    return { sent: false as const };
  }
}
