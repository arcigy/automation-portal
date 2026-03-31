import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

/**
 * Admin layout - restricts access to users with the 'admin' role.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // User rule: Admin zone is only for role "admin"
  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50/10">
      <nav className="sticky top-0 z-10 w-full border-b border-red-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
             <span className="text-white text-xs font-black">AD</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">Arcigy Admin</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 leading-none">{session.user.name}</span>
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Super Administrator</span>
           </div>
           <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <span className="text-lg">🛡️</span>
           </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
           <span className="text-2xl">⚠️</span>
           <p className="text-sm text-amber-900 font-medium leading-relaxed">
             You are in the **Administration Zone**. Any changes made here to tenants, users, or automation access will take effect immediately for all client portals.
           </p>
        </div>
        {children}
      </main>
    </div>
  );
}
