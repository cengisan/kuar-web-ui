export const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

export const isGoogleAuthConfigured = googleClientId.length > 0;
