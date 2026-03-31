"use server";

import { getAutomationModule } from "@/automations/registry";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function runAutomationAction(id: string, input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const tenantId = session.user.tenantId;
  if (!tenantId) {
    throw new Error("User has no associated tenant");
  }
  const automationModule = getAutomationModule(id);

  if (!automationModule) {
    throw new Error("Module not found");
  }

  // Execute on the server
  return await automationModule.run(tenantId, input);
}
