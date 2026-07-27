export { auth as middleware } from "@/auth";

// Only the admin area is gated; the rest of the site is public marketing.
// The login page itself is excluded so unauthenticated users can reach it.
export const config = {
  runtime: "nodejs",
  matcher: ["/admin", "/admin/((?!login).*)"],
};
