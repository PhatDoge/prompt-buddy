import { Sidebar } from "@/components/layout/Sidebar";
import { SignOutButton, SignedIn, useUser } from "@clerk/nextjs";
import { LogOut, UserCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        {" "}
        {/* Adjust ml-64 to match sidebar width */}
        <header className="bg-white shadow-sm p-4 border-b border-gray-200">
          <div className="flex justify-end items-center">
            <SignedIn>
              <div className="flex items-center gap-3">
                {/* <UserNav /> component could go here if we make one */}
                <SignOutButton>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
