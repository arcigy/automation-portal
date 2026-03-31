import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAutomationModule } from "@/automations/registry";
import { DashboardView } from "@/components/automation/DashboardView";
import { FormView } from "@/components/automation/FormView";
import { LogsView } from "@/components/automation/LogsView";
import { SettingsView } from "@/components/automation/SettingsView";
import { notFound, redirect } from "next/navigation";
import { select } from "@/lib/db";
import React from 'react';

/**
 * Dynamic page for individual automation modules (Server Component).
 * Manages access control, module loading, and multi-view composition.
 */
export default async function AutomationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) redirect("/login");
  const tenantId = session.user.tenantId;
  const { id } = await params;
  
  const automationModule = getAutomationModule(id);
  if (!automationModule) notFound();

  // Security layer: Verify tenant access permissions
  const access = await select(
    `SELECT 1 FROM tenant_automations WHERE tenant_id = $1 AND automation_id = $2 AND is_active = TRUE`,
    [tenantId, id]
  );
  
  if (access.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-8 text-center bg-white border border-rose-100 rounded-[40px] shadow-2xl shadow-rose-200/10">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <span className="text-4xl text-rose-600">🚫</span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Prístup zamietnutý</h2>
        <p className="mt-4 text-gray-500 font-medium max-w-sm">Organizácia nemá pridelenú automatizáciu: <span className="font-bold text-gray-800">&quot;{automationModule.name}&quot;</span>. Kontaktujte administrátora.</p>
        <button className="mt-10 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:shadow-lg transition-all">Žiadosť o prístup</button>
      </div>
    );
  }

  // Helper to render the form UI if present
  const FormUI = automationModule.ui.form;

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* 1. Main Dashboard View (Always at the top) */}
      <DashboardView module={automationModule} tenantId={tenantId!} />

      {/* 2. Interactive Execution Layer (Composition Pattern) */}
      { (automationModule.type === "manual" || automationModule.type === "form") && FormUI && (
        <FormView id={automationModule.id} tenantId={tenantId!} name={automationModule.name}>
           {/* Passing as a function component or simple render since it's server-to-client boundary */}
           <FormUI tenantId={tenantId!} onSubmit={async () => {}} />
        </FormView>
      )}

      {/* 3. Monitoring & Configuration (Side-by-side or stacked grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        <LogsView module={automationModule} tenantId={tenantId!} />
        <SettingsView module={automationModule} tenantId={tenantId!} />
      </div>
    </div>
  );
}
