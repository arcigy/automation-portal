"use server";

import { getAutomationModule } from "@/automations/registry";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function runAutomationAction(id: string, input: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const tenantId = session.user.tenantId;
  const module = getAutomationModule(id);

  if (!module) {
    throw new Error("Module not found");
  }

  // Execute on the server
  return await module.run(tenantId, input);
}
