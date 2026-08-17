import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "@/auth.config";
import dbConnect from "@/middleware/db-connect";
import User from "@/mongoose/users/model";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      try {
        await dbConnect();

        let dbUser = await User.findOne({ email: user.email.toLowerCase() });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || "Anonymous",
            email: user.email.toLowerCase(),
            image: user.image || "",
            accounts: [
              {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            ],
          });
        } else {
          const hasAccount = dbUser.accounts.some(
            (acc: { provider: string }) => acc.provider === account.provider
          );

          if (!hasAccount) {
            dbUser.accounts.push({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            });
            await dbUser.save();
          }
        }

        user.id = dbUser._id.toString();
        return true;
      } catch (error) {
        console.error("Error saving user during sign-in:", error);
        return false;
      }
    },
  },
});
