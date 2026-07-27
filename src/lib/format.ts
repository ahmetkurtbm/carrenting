/** Shared by server and client components — must stay free of server-only imports. */

export function formatPrice(amount: number, currency: string) {
  const value = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${value} ${currency === "TRY" ? "TL" : currency}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
