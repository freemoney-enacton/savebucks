import { AppRoutes } from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Gradient Background - Top half of screen */}
      <div className="w-full min-h-[350px] pt-40 pb-24 bg-gradient-to-br from-[#4B39BF] via-[#7A45A2] to-[#C2556A] rounded-b-3xl">
        {/* Welcome Text */}
        <div className="flex items-center justify-center h-full px-4">
          <h1 className="text-white text-2xl sm:text-3xl font-semibold text-center mb-2">
            Welcome to the Savebucks Affiliate Dashboard
          </h1>
        </div>
      </div>

      {/* Top Logo Container - Positioned on top of gradient */}
      <div className="absolute top-0 left-0 w-full bg-white rounded-b-3xl p-6 shadow-lg z-20 h-24">
        <div className="flex justify-center">
          <Link href={AppRoutes.dashboard}>
            <Image
              src="/images/savebucks-logo.png"
              alt="Savebucks Logo"
              height={200}
              width={400}
              className="h-auto w-auto max-h-12"
            />
          </Link>
        </div>
      </div>

      {/* Auth Form Container - Positioned below welcome text and on top of everything */}
      <div className="px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-[480px] mx-auto -my-28 mb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
