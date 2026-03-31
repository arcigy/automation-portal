"use client";

import React, { ReactNode } from "react";
import { AutomationFormProvider, useAutomationForm } from "./FormContext";

interface Props {
  id: string;
  tenantId: string;
  name: string;
  children: ReactNode;
}

/**
 * Visual wrapper for the automation execution area.
 * Uses the inner FormDisplay component to access the context.
 */
export function FormView({ id, tenantId, name, children }: Props) {
  return (
    <AutomationFormProvider id={id}>
      <div className="bg-white border border-gray-200 rounded-[40px] shadow-2xl shadow-gray-200/20 overflow-hidden mb-12">
        <div className="p-10 border-b border-gray-50 bg-gray-50/10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spúšťač automatizácie</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Vykonať: {name}</h2>
        </div>
        
        <div className="p-10">
          <FormDisplay>{children}</FormDisplay>
        </div>
      </div>
    </AutomationFormProvider>
  );
}

function FormDisplay({ children }: { children: ReactNode }) {
  const { submitting, result, error } = useAutomationForm();

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Custom Form Logic (Injected children) */}
      <div className="relative">
        {submitting && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-xl" />
          </div>
        )}
        {children}
      </div>

      {/* 2. Feedback Message Layer */}
      {result && (
        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-600 text-lg">✅</span>
              <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Spracovanie úspešné</h3>
           </div>
           <pre className="text-xs font-mono text-emerald-900 overflow-auto max-h-60 whitespace-pre-wrap leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-2 mb-4">
              <span className="text-rose-600 text-lg">❌</span>
              <h3 className="text-sm font-black text-rose-800 uppercase tracking-widest">Chyba pri behu</h3>
           </div>
           <p className="text-sm text-rose-900 font-bold leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
