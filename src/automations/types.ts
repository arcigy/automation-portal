import { z } from "zod";

export type AutomationType = "automatic" | "manual" | "form";

export interface Log {
  id: string;
  tenant_id: string;
  automation_id: string;
  status: "success" | "error" | "running";
  input?: any;
  output?: any;
  error?: string;
  duration_ms?: number;
  created_at: string;
}

export interface Stats {
  total_runs: number;
  success_rate: number;
  last_run_at?: string;
}

export interface RunResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AutomationModule {
  id: string;
  name: string;
  description?: string;
  type: AutomationType;
  settings: z.ZodSchema<any>;
  run(tenantId: string, input?: any): Promise<RunResult>;
  getLogs(tenantId: string): Promise<Log[]>;
  getStats(tenantId: string): Promise<Stats>;
  ui: {
    dashboard: React.ComponentType<{ tenantId: string }>;
    form?: React.ComponentType<{ tenantId: string; onSubmit: (data: any) => Promise<void> }>;
    settings?: React.ComponentType<{ tenantId: string }>;
  };
}
