import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Normalize imports to support both ESM (default export) and CommonJS interop
const NextAuthFn = (NextAuth && NextAuth.__esModule)
  ? NextAuth.default || NextAuth
  : NextAuth;

const Credentials = (CredentialsProvider && CredentialsProvider.__esModule)
  ? CredentialsProvider.default || CredentialsProvider
  : CredentialsProvider;

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.BACKEND_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        const data = await res.json();
        if (!res.ok || !data.user) {
          throw new Error("Invalid email or password");
        }

        return {
          id: data.user._id || data.user.id || null,
          name: data.user.name,
          email: data.user.email,
          token: data.token
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || null;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuthFn(authOptions);
export { handler as GET, handler as POST };
