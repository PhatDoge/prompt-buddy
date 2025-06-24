"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusSquare,
  Star,
  Users,
  BotMessageSquare,
  History as HistoryIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// navItems will be mapped with translated labels inside the component
const baseNavItems = [
  { href: "/dashboard", labelKey: "sidebarDashboard" as const, icon: Home },
  {
    href: "/dashboard/create-prompt",
    labelKey: "sidebarCreatePrompt" as const,
    icon: PlusSquare,
  },
  {
    href: "/dashboard/history",
    labelKey: "sidebarHistory" as const,
    icon: HistoryIcon,
  },
  {
    href: "/dashboard/favorites",
    labelKey: "sidebarFavorites" as const,
    icon: Star,
  },
  {
    href: "/dashboard/community",
    labelKey: "sidebarCommunity" as const,
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { translate } = useLanguage(); // Added

  const navItems = baseNavItems.map((item) => ({
    ...item,
    label: translate(item.labelKey),
  }));

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col fixed h-full">
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <BotMessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {translate("appConfigName")} {/* Reusing existing key */}
            </h2>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.labelKey} // Use labelKey for a stable key
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group
                ${
                  isActive ?
                    "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        {/* User profile section or sign out can go here */}
        <p className="text-xs text-gray-500 text-center">
          {translate("sidebarCopyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </aside>
  );
}
