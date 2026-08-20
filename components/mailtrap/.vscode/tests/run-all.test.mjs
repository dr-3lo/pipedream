// Full smoke test: sends an email, then polls its delivery state.
// Run from the mailtrap component root:
//
//   MAILTRAP_API_TOKEN=xxx \
//   MAILTRAP_FROM_EMAIL=sender@yourdomain.com \
//   MAILTRAP_TO_EMAIL=you@example.com \
//   node .vscode/tests/run-all.test.mjs
//
// As new actions are added, chain their test functions here too.

import { testSendEmail } from "./send-email.test.mjs";
import { testGetEmailState } from "./get-email-state.test.mjs";
import {
  requireEnv, wait,
} from "./_shared.mjs";

requireEnv([
  "MAILTRAP_API_TOKEN",
  "MAILTRAP_FROM_EMAIL",
  "MAILTRAP_TO_EMAIL",
]);

async function main() {
  const sendResponse = await testSendEmail();
  const messageId = sendResponse?.message_ids?.[0];

  if (!messageId) {
    console.warn("\nNo message_id returned, skipping get-email-state test.");
    return;
  }

  // Mailtrap needs a moment to index the log before it's queryable.
  console.log("\nWaiting 5s before checking email state...");
  await wait(5000);

  await testGetEmailState(messageId);
}

main().catch((err) => {
  console.error("\nrun-all test failed:", err);
  process.exit(1);
});
