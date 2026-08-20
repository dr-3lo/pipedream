// Manual test for actions/send-email. Run from the mailtrap component root:
//
//   MAILTRAP_API_TOKEN=xxx \
//   MAILTRAP_FROM_EMAIL=sender@yourdomain.com \
//   MAILTRAP_TO_EMAIL=you@example.com \
//   MAILTRAP_REPLY_TO=reply@yourdomain.com \
//   node .vscode/tests/send-email.test.mjs
//
// Or use the "Debug: send-email" launch config (reads ./.env via envFile).
// Never hardcode the token here or paste it into chat — pass it via env var only.

import sendEmailAction from "../../actions/send-email/send-email.mjs";
import {
  requireEnv, makeApp, makeStepContext,
} from "./_shared.mjs";

async function testSendEmailValidationError() {
  console.log("\n=== send-email: should reject when html and text are both missing ===");
  const $ = makeStepContext("send-email-validation");

  const ctx = {
    ...sendEmailAction.methods,
    app: makeApp(),
    fromEmail: process.env.MAILTRAP_FROM_EMAIL,
    to: [
      process.env.MAILTRAP_TO_EMAIL,
    ],
    subject: "Should never send",
    text: undefined,
    html: undefined,
  };

  try {
    await sendEmailAction.run.call(ctx, {
      $,
    });
    console.error("FAILED: expected a ConfigurationError but the call succeeded");
  } catch (err) {
    console.log("OK, got expected error:", err.message);
  }
}

export async function testSendEmail() {
  console.log("\n=== send-email: send a real email ===");
  const $ = makeStepContext("send-email");

  const ctx = {
    ...sendEmailAction.methods,
    app: makeApp(),
    fromEmail: process.env.MAILTRAP_FROM_EMAIL,
    fromName: "Mailtrap Component Test",
    to: [
      process.env.MAILTRAP_TO_EMAIL,
    ],
    subject: "Pipedream Mailtrap component - manual test",
    text: "Hello from the manual test script.",
    html: undefined,
    cc: undefined,
    bcc: undefined,
    replyTo: process.env.MAILTRAP_REPLY_TO,
    category: "pipedream-manual-test",
    attachmentFiles: undefined,
    attachmentsBase64: undefined,
    base64AttachmentFilenames: undefined,
  };

  const response = await sendEmailAction.run.call(ctx, {
    $,
  });
  console.log("Response:", response);
  return response;
}

async function main() {
  await testSendEmailValidationError();
  const response = await testSendEmail();
  const messageId = response?.message_ids?.[0];
  if (messageId) {
    console.log(`\nmessage_id: ${messageId}`);
    console.log("Use it with: MAILTRAP_MESSAGE_ID=<id> node .vscode/tests/get-email-state.test.mjs");
  }
}

// Only run standalone when this file is executed directly (not when
// run-all.test.mjs imports testSendEmail).
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  requireEnv([
    "MAILTRAP_API_TOKEN",
    "MAILTRAP_FROM_EMAIL",
    "MAILTRAP_TO_EMAIL",
  ]);
  main().catch((err) => {
    console.error("\nsend-email test failed:", err);
    process.exit(1);
  });
}
