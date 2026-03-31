"use client";

import React from "react";
import { Log, Stats } from "../../automations/types";

export const DashboardView = ({ tenantId, stats }: { tenantId: string; stats: Stats }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Automation Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <p className="text-sm">Total Runs</p>
          <p className="text-2xl font-bold">{stats.totalRuns}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm">Success Rate</p>
          <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Last Run</p>
          <p className="text-sm font-semibold">{stats.lastRun ? new Date(stats.lastRun).toLocaleString() : "Never"}</p>
        </div>
      </div>
    </div>
  );
};

export const LogsView = ({ logs }: { logs: Log[] }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Logs</h3>
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">{log.status.toUpperCase()}</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 italic">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {log.error && <p className="mt-2 text-sm text-red-600">{log.error}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const SettingsView = ({ tenantId, schema }: { tenantId: string; schema: any }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 font-mono">Settings</h2>
      <p className="text-sm text-gray-500">Configure your automation settings here.</p>
      {/* Dynamic form would go here based on schema */}
    </div>
  );
};

export const FormView = ({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Manual Input Form</h2>
      <button 
        onClick={() => onSubmit({ action: 'trigger' })}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Execute Automation
      </button>
    </div>
  );
};
