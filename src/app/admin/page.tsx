import { select } from "@/lib/db";
import React from 'react';

/**
 * Admin Panel for managing tenants and automation assignments.
 */
export default async function AdminPage() {
  const tenants = await select<{ id: string; name: string; created_at: string }>(
    `SELECT * FROM tenants ORDER BY created_at DESC`
  );

  const users = await select<{ id: string; name: string; email: string; role: string; tenant_id: string }>(
    `SELECT id, name, email, role, tenant_id FROM "user" ORDER BY created_at DESC`
  );

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-700 slide-in-from-bottom-5">
      <header className="flex flex-col gap-2">
         <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">System Administration</h1>
         <p className="text-lg text-gray-500 font-medium max-w-3xl leading-relaxed">Manage individual client tenants, assign automation permissions, and monitor active user accounts.</p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              All Tenants
           </h2>
           <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-gray-900/10 hover:bg-black transition-all active:scale-[0.98]">
              Create New Tenant
           </button>
        </div>
        
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden ring-1 ring-black/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Tenant Name</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Unique ID</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center text-gray-400 font-bold tracking-tight">No tenants found. Start by creating one.</td>
                </tr>
              ) : (
                tenants.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">{t.name}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-mono">{t.id}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
           <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
           Active Users
        </h2>
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden ring-1 ring-black/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Username & Identity</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Permission Role</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Assigned Tenant ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{u.name}</span>
                       <span className="text-[11px] text-gray-400 font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                      u.role === 'admin' ? "bg-red-50 text-red-700 ring-red-600/20" : "bg-blue-50 text-blue-700 ring-blue-600/20"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-mono">{u.tenant_id || 'unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
