import { auth } from "@/app/api/(auth)/auth/auth";

export const getAuthSession = async () => {
  try {
    const user = (await auth()) as any;
    return user;
  } catch (error) {
    return null;
  }
};
