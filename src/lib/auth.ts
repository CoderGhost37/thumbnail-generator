import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "./env";
import { db } from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  baseUrl: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 15 * 60, // 15 minutes
    password: {
      hash: async (password: string) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      },
      verify: async ({
        password,
        hash,
      }: {
        password: string;
        hash: string;
      }) => {
        return await bcrypt.compare(password, hash);
      },
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Cinnavo <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: <a href="${url}">${url}</a></p><p>This link will expire in 15 minutes.</p>`,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
    },
  },

  emailVerification: {
    expiresIn: 60 * 60, // 1 hour
    sendVerificationEmail: async ({ user, url, token }) => {
      await resend.emails.send({
        from: "Cinnavo <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email address: <a href="${url}?token=${token}">${url}?token=${token}</a></p><p>This link will expire in 24 hours.</p>`,
      });
    },
  },
});
