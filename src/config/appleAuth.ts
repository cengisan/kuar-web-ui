export const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID?.trim() ?? "";

export const isAppleAuthConfigured = appleClientId.length > 0;

export function getAppleRedirectUri(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return appUrl.replace(/\/$/, "");
}
