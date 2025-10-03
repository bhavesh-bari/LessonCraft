import { google } from "googleapis";

/**
 * Base OAuth client (with redirect)
 */
export function getGoogleOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/google/callback`
  );
}

/**
 * URL used to kick off OAuth (manual flow)
 */
export function getGoogleAuthURL() {
  const client = getGoogleOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/forms.body", // create/update forms
    "https://www.googleapis.com/auth/drive.file",  // let your app create files in user Drive
    "openid",
  ];

  return client.generateAuthUrl({
    access_type: "offline", // get refresh_token
    prompt: "consent",      // force refresh_token the first time
    scope: scopes,
  });
}

/**
 * Build an OAuth2 client from a user’s stored tokens.
 * If the access token is (about to be) expired and we have a refresh token,
 * automatically refresh and return new credentials.
 *
 * @param {object} user - Mongoose User doc with google tokens
 * @returns {Promise<{auth: OAuth2Client, refreshed: null|{access_token, refresh_token, expiry_date}}>}
 */
export async function getAuthedGoogleClientFromUser(user) {
  const auth = getGoogleOAuthClient();

  const expiryMs = user.googleTokenExpiry ? new Date(user.googleTokenExpiry).getTime() : 0;
  const now = Date.now();
  const isExpired = !expiryMs || now >= (expiryMs - 60 * 1000); // refresh 60s early

  auth.setCredentials({
    access_token: user.googleAccessToken || undefined,
    refresh_token: user.googleRefreshToken || undefined,
    expiry_date: expiryMs || undefined,
  });

  // If we don't have a refresh token, just return as-is (caller should handle)
  if (!user.googleRefreshToken) {
    return { auth, refreshed: null };
  }

  // If token is expired/near-expired -> refresh
  if (isExpired) {
    const { credentials } = await auth.refreshAccessToken(); // returns new access + expiry (+ maybe refresh)
    return { auth, refreshed: credentials };
  }

  // still valid
  return { auth, refreshed: null };
}
