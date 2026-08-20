// Manual test for actions/delete-suppression. DESTRUCTIVE — permanently removes
// a suppression entry. Never wired into run-all.test.mjs on purpose.
//
// Get an id first via list-suppressions.test.mjs, then run from the mailtrap
// component root:
//
//   MAILTRAP_API_TOKEN=xxx MAILTRAP_SUPPRESSION_ID=<id> \
//   node .vscode/tests/delete-suppression.test.mjs
//
// Or use the "Debug: delete-suppression" launch config (set MAILTRAP_SUPPRESSION_ID
// in ./.env first).

import deleteSuppressionAction from "../../actions/delete-suppression/delete-suppression.mjs";
import {
  requireEnv, makeApp, makeStepContext,
} from "./_shared.mjs";

export async function testDeleteSuppression(suppressionId) {
  console.log("\n=== delete-suppression ===");
  const $ = makeStepContext("delete-suppression");

  const ctx = {
    app: makeApp(),
    suppressionId,
  };

  const response = await deleteSuppressionAction.run.call(ctx, {
    $,
  });
  console.log("Response:", response);
  return response;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  requireEnv([
    "MAILTRAP_API_TOKEN",
    "MAILTRAP_SUPPRESSION_ID",
  ]);
  testDeleteSuppression(process.env.MAILTRAP_SUPPRESSION_ID).catch((err) => {
    console.error("\ndelete-suppression test failed:", err);
    process.exit(1);
  });
}
