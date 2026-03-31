import type { AutomationModule } from "@/automations/types";
import React from 'react';

interface Props {
  module: AutomationModule;
  tenantId: string;
}

export async function SettingsView({ module, tenantId }: Props) {
  const SettingsComponent = module.ui.settings;
  
  if (!SettingsComponent) return null;
  
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 border-b pb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Nastavenia "{module.name}"</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">Upravte parametre tejto automatizácie podľa potreby.</p>
      </header>
      
      <main className="grid grid-cols-1 gap-6">
        <SettingsComponent tenantId={tenantId} />
      </main>
    </div>
  );
}
