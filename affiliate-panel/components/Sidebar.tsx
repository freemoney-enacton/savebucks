"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Config } from "@/utils/config";
import { AppRoutes } from "@/utils/routes";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="sidebar fixed top-0 left-0 z-20 flex h-[100dvh] w-[280px] flex-col overflow-y-auto border-r border-gray-200 bg-white px-6 transition-all duration-300 lg:static lg:translate-x-0 -translate-x-full">
        <div className="sidebar-header flex items-center gap-2 py-5 justify-between">
          <Link
            href={AppRoutes.dashboard}
            className="max-lg:invisible h-16 flex items-center mx-auto"
          >
            <Image
              src="/images/savebucks-logo.png"
              alt="Logo"
              height={100}
              width={100}
              className="max-h-12 w-auto mx-auto"
            />
          </Link>
        </div>

        <div className="no-scrollbar -mt-2 lg:mt-0 flex flex-col overflow-y-auto duration-300 ease-linear">
          <p className="mb-6 text-xs leading-[20px] text-gray-500 uppercase font-semibold tracking-wider">
            AFFILIATE
          </p>
          <nav className="mb-6 flex flex-col gap-2">
            {Config.env.app.sidebar.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors",
                  pathname === item.href
                    ? "bg-brand-500 text-white "
                    : "hover:bg-brand-200 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div
        id="overlay"
        className="hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-[19+] lg:hidden"
      ></div>
    </>
  );
}
