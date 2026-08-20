// Shared helpers for manual action tests under .vscode/tests/.
// Not part of the PR — .vscode/ is gitignored. New action tests should
// import from here instead of duplicating this boilerplate.

import mailtrapApp from "../../mailtrap.app.mjs";

export function requireEnv(keys) {
  for (const key of keys) {
    if (!process.env[key]) {
      console.error(`Missing required env var: ${key}`);
      process.exit(1);
    }
  }
}

export function makeApp() {
  return {
    ...mailtrapApp.methods,
    $auth: {
      api_token: process.env.MAILTRAP_API_TOKEN,
    },
  };
}

export function makeStepContext(label) {
  return {
    export(key, value) {
      console.log(`[$.export] ${label} ${key} =`, value);
    },
  };
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
