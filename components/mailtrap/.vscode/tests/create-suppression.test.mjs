// Manual test for actions/create-suppression. Mutates account state (adds a
// suppression entry) — not wired into run-all.test.mjs on purpose so repeated
// full runs don't pile up test suppressions.
//
// Get a domain id first via list-domains.test.mjs, then run from the mailtrap
// component root:
//
//   MAILTRAP_API_TOKEN=xxx\
//   MAILTRAP_DOMAIN_ID=<id> \
//   MAILTRAP_SUPPRESS_EMAIL=blocked@example.com \
//   node .vscode/tests/create-suppression.test.mjs
//
// Or use the "Debug: create-suppression" launch config (set the env vars in
// ./.env first).

import createSuppressionAction from "../../actions/create-suppression/create-suppression.mjs";
import {
  requireEnv, makeApp, makeStepContext,
} from "./_shared.mjs";

export async function testCreateSuppression({
  email, domainId, sendingStream = "transactional",
}) {
  console.log("\n=== create-suppression ===");
  const $ = makeStepContext("create-suppression");

  const ctx = {
    app: makeApp(),
    email,
    domainId,
    sendingStream,
  };

  const response = await createSuppressionAction.run.call(ctx, {
    $,
  });
  console.log("Response:", response);
  return response;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  requireEnv([
    "MAILTRAP_API_TOKEN",
    "MAILTRAP_DOMAIN_ID",
    "MAILTRAP_SUPPRESS_EMAIL",
  ]);
  testCreateSuppression({
    email: process.env.MAILTRAP_SUPPRESS_EMAIL,
    domainId: process.env.MAILTRAP_DOMAIN_ID,
  }).catch((err) => {
    console.error("\ncreate-suppression test failed:", err);
    process.exit(1);
  });
}
