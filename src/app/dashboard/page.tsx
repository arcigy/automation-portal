import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { select } from "@/lib/db";
import { getAllAutomations } from "@/automations/registry";
import Link from "next/link";
import React from 'react';

/**
 * Dashboard listing only relevant automations for the tenant.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const tenantId = session?.user.tenantId;
  
  // Rule #3: Always get tenantId from session
  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-amber-50 border border-amber-200 rounded-3xl">
        <h2 className="text-2xl font-black text-amber-900 tracking-tight">No Tenant Assigned</h2>
        <p className="mt-2 text-amber-800 font-medium">Please contact an administrator to assign your account to a tenant.</p>
      </div>
    );
  }

  // Get only enabled automations for this tenant from DB
  const tenantAutomations = await select<{ automation_id: string }>(
    `SELECT automation_id FROM tenant_automations WHERE tenant_id = $1 AND is_active = TRUE`,
    [tenantId]
  );
  
  const activeIds = new Set(tenantAutomations.map(ta => ta.automation_id));
  const availableAutomations = getAllAutomations().filter(a => activeIds.has(a.id));

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
         <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">Welcome to your Portal</h1>
         <p className="text-lg text-gray-500 font-medium max-w-3xl leading-relaxed">Here are the active automations available for your organization. Manage operations and view real-time data logs.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableAutomations.length === 0 ? (
          <div className="col-span-full py-20 border border-dashed border-gray-300 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
               <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Setup Pending</h3>
            <p className="mt-2 text-gray-500 font-medium max-w-md">Your organization doesn&apos;t have any active automations yet. They&apos;ll appear here once configured by our team.</p>
          </div>
        ) : (
          availableAutomations.map((automation) => (
            <Link 
              key={automation.id} 
              href={`/dashboard/${automation.id}`}
              className="group relative flex flex-col gap-5 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/[0.08] hover:-translate-y-1 ring-1 ring-black/5"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                  {automation.type === 'automatic' ? '⚡' : automation.type === 'manual' ? '🛠️' : '📝'}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                    "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                  }`}>
                    {automation.type}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{automation.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">{automation.description}</p>
              </div>
              <div className="mt-2 flex items-center text-xs font-bold text-blue-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                 Explore Module <span>→</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
