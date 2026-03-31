import type { AutomationModule } from "@/automations/types";
import React from 'react';

interface Props {
  module: AutomationModule;
  tenantId: string;
}

export function DashboardView({ module, tenantId }: Props) {
  const Dashboard = module.ui.dashboard;
  
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{module.name} Dashboard</h1>
        {module.description && <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{module.description}</p>}
      </header>
      
      <main className="grid grid-cols-1 gap-6">
        <Dashboard tenantId={tenantId} />
      </main>
    </div>
  );
}
