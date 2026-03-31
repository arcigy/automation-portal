"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { runAutomationAction } from "@/app/actions/automation";

interface AutomationFormContextType {
  run: (data: any) => Promise<void>;
  submitting: boolean;
  result: any;
  error: string | null;
}

const AutomationFormContext = createContext<AutomationFormContextType | undefined>(undefined);

export function AutomationFormProvider({ id, children }: { id: string; children: ReactNode }) {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const run = async (data: any) => {
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const runResult = await runAutomationAction(id, data);
      if (runResult.success) {
        setResult(runResult.data);
      } else {
        setError(runResult.error || "Execution failed");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AutomationFormContext.Provider value={{ run, submitting, result, error }}>
      {children}
    </AutomationFormContext.Provider>
  );
}

export function useAutomationForm() {
  const context = useContext(AutomationFormContext);
  if (context === undefined) {
    throw new Error("useAutomationForm must be used within an AutomationFormProvider");
  }
  return context;
}
