import { proxyActivities } from "@temporalio/workflow";

import type * as activities from "./activities";

import { User } from "../models/users";

export async function birthdayWorkflow(user: User): Promise<void> {
  const { addBirthdayMessageScheduler } = proxyActivities<typeof activities>({
    startToCloseTimeout: "10s",
    retry: {
      initialInterval: "10s",
      maximumInterval: "24h",
      maximumAttempts: 8640, // 8640 attempts * 10s/attempt = 24 hours
    },
  });

  await addBirthdayMessageScheduler(user);
}
