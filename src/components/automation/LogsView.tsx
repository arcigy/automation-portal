import React from "react";
import type { AutomationModule } from "@/automations/types";

interface Props {
  module: AutomationModule;
  tenantId: string;
}

export async function LogsView({ module, tenantId }: Props) {
  const logs = await module.getLogs(tenantId);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">História behov (Logs)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/30 border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-bold text-gray-400 upper tracking-widest">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 upper tracking-widest">Dátum</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 upper tracking-widest">Výstup / Chyba</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">Žiadne záznamy.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      log.status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {log.status === "success" ? "ÚSPECH" : "CHYBA"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[200px]">{log.error || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
