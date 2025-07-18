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
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-[#4B39BF] via-[#7A45A2] to-[#C2556A] rounded-b-3xl">
        {/* Welcome Text */}
        <div className="flex items-center justify-center h-full pt-24">
          <h1 className="text-white text-3xl font-semibold text-center">
            Welcome to Your Affiliate Portal
          </h1>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
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
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-30">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}