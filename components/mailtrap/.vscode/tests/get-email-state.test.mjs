// Manual test for actions/get-email-state. Run from the mailtrap component root:
//
//   MAILTRAP_API_TOKEN=xxx \
//   MAILTRAP_MESSAGE_ID=<id from send-email.test.mjs> \
//   node .vscode/tests/get-email-state.test.mjs
//
// Or use the "Debug: get-email-state" launch config (reads ./.env via envFile,
// set MAILTRAP_MESSAGE_ID there or edit it inline before debugging).

import getEmailStateAction from "../../actions/get-email-state/get-email-state.mjs";
import {
  requireEnv, makeApp, makeStepContext,
} from "./_shared.mjs";

export async function testGetEmailState(messageId) {
  console.log("\n=== get-email-state ===");
  const $ = makeStepContext("get-email-state");

  const ctx = {
    app: makeApp(),
    sendingMessageId: messageId,
  };

  const response = await getEmailStateAction.run.call(ctx, {
    $,
  });
  console.log("Response:", response);
  return response;
}

// Only run standalone when this file is executed directly (not when
// run-all.test.mjs imports testGetEmailState with a dynamically obtained id).
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  requireEnv([
    "MAILTRAP_API_TOKEN",
    "MAILTRAP_MESSAGE_ID",
  ]);
  testGetEmailState(process.env.MAILTRAP_MESSAGE_ID).catch((err) => {
    console.error("\nget-email-state test failed:", err);
    process.exit(1);
  });
}
