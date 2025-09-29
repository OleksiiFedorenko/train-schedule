import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {LoginSchema} from "@/lib/schemas";

const API_BASE_SERVER = process.env.BACKEND_API_URL!;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const parsed = LoginSchema.safeParse(creds);
        if (!parsed.success) return null;

        // IMPORTANT: absolute URL on server
        const res = await fetch(`${API_BASE_SERVER}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const accessToken =
          data.accessToken || data.token || data.access_token;
        const user = data.user ?? {
          id: data.id,
          name: data.name,
          email: data.email,
        };

        if (!accessToken || !user?.id) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          accessToken,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).userId = token.userId;
      (session as any).accessToken = token.accessToken;
      if (token.name) session.user!.name = token.name as string;
      if (token.email) session.user!.email = token.email as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
};