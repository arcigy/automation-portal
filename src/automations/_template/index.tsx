import { z } from "zod";
import type { AutomationModule, RunResult, Log, Stats } from "../types";
import React from "react";

/**
 * Empty template for a new automation module.
 */
export const templateModule: AutomationModule = {
  id: "template",
  name: "Automation Template",
  description: "A blank template for creating new automations.",
  type: "manual",
  settings: z.object({
    enabled: z.boolean().default(true),
  }),

  async run(_tenantId: string, _input?: unknown): Promise<RunResult> {
    return { success: true, data: { status: "OK" } };
  },

  async getLogs(_tenantId: string): Promise<Log[]> {
    return [];
  },

  async getStats(_tenantId: string): Promise<Stats> {
    return { total_runs: 0, success_rate: 100 };
  },

  ui: {
    dashboard: ({ tenantId }) => (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-2">Automation Dashboard</h2>
        <p className="text-gray-500 text-sm">Tenant: {tenantId}</p>
      </div>
    ),
    form: ({ onSubmit }) => (
      <div className="p-4">
        <button 
          onClick={() => onSubmit({ action: "test" })} 
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold"
        >
          Spustiť test
        </button>
      </div>
    ),
    settings: () => (
      <div className="p-4"><p className="text-gray-400">Žiadne nastavenia.</p></div>
    ),
  },
};

export default templateModule;
