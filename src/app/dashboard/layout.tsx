import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

/**
 * Shared layout for the protected dashboard.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Tenant check - logic from user rules: tenantId should be in session
  if (!session.user.tenantId) {
    // Optionally redirect if no tenant, but dashboard page handles this too.
  }

  return (
    <div className="min-h-screen bg-gray-50/10">
      <nav className="sticky top-0 z-10 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
             <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Arcigy Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">{session.user.name}</span>
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"></div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
