import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/types/userModel";

/**
 * NextAuth configuration options
 * Sets up authentication with credentials provider
 */
export const authOptions: NextAuthOptions = {
  // Use JWT for session management
  session: {
    strategy: "jwt",
  },
  // Custom sign in page
  pages: {
    signIn: "/auth/signin",
  },
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorize user credentials
       * Validates email and password against database
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials format");
        }

        try {
          // Connect to database and find user
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Verify password
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user data without password
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  // Configure session and JWT callbacks
  callbacks: {
    /**
     * Modify session data
     * Adds user ID and role to session
     */
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    /**
     * Modify JWT token
     * Adds user ID and role to token
     */
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
  },
}; 