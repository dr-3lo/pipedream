// Manual test for actions/list-domains. Run from the mailtrap component root:
//
//   MAILTRAP_API_TOKEN=xxx node .vscode/tests/list-domains.test.mjs
//
// Or use the "Debug: list-domains" launch config (reads ./.env via envFile).

import listDomainsAction from "../../actions/list-domains/list-domains.mjs";
import {
  requireEnv, makeApp, makeStepContext,
} from "./_shared.mjs";

export async function testListDomains() {
  console.log("\n=== list-domains ===");
  const $ = makeStepContext("list-domains");

  const ctx = {
    app: makeApp(),
  };

  const response = await listDomainsAction.run.call(ctx, {
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
  testListDomains().catch((err) => {
    console.error("\nlist-domains test failed:", err);
    process.exit(1);
  });
}
