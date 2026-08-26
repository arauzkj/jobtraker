import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "./nodemailer";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 1,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.name || (user as { username?: string }).username,
        resetUrl: url,
      });
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hora
  },
  plugins: [username(), nextCookies()],
  /*
  socialProviders:{

  }*/

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
      },
    },
  },
});
