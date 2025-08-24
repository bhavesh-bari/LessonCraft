// src/lib/google.js
import { google } from "googleapis";

export function getGoogleOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/google/callback`
  );
}

export function getGoogleAuthURL() {
  const client = getGoogleOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/forms.body",   // required to create Google Forms
  ];

  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
}
