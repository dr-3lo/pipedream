// Manual test for actions/list-suppressions. Run from the mailtrap component root:
//
//   MAILTRAP_API_TOKEN=xxx node .vscode/tests/list-suppressions.test.mjs
//
// Or use the "Debug: list-suppressions" launch config (reads ./.env via envFile).
// Optional: set MAILTRAP_SUPPRESSION_EMAIL to filter by a specific address.

import listSuppressionsAction from "../../actions/list-suppressions/list-suppressions.mjs";
import {
  requireEnv, makeApp, makeStepContext,
} from "./_shared.mjs";

export async function testListSuppressions(email) {
  console.log("\n=== list-suppressions ===");
  const $ = makeStepContext("list-suppressions");

  const ctx = {
    app: makeApp(),
    email,
  };

  const response = await listSuppressionsAction.run.call(ctx, {
    $,
  });
  console.log("Response:", response);
  return response;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  requireEnv([
    "MAILTRAP_API_TOKEN",
  ]);
  testListSuppressions(process.env.MAILTRAP_SUPPRESSION_EMAIL).catch((err) => {
    console.error("\nlist-suppressions test failed:", err);
    process.exit(1);
  });
}
