import type { AutomationModule } from "./types";
import { templateModule } from "./_template/index";

export const automationRegistry: Record<string, AutomationModule> = {
  [templateModule.id]: templateModule,
};

export function getAutomationModule(id: string): AutomationModule | undefined {
  return automationRegistry[id];
}

export function getAllAutomations(): AutomationModule[] {
  return Object.values(automationRegistry);
}
