const { spawnSync } = require("node:child_process");
const path = require("node:path");

delete process.env.ELECTRON_RUN_AS_NODE;

const cypressCli = path.join(
  __dirname,
  "..",
  "node_modules",
  "cypress",
  "bin",
  "cypress",
);
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [cypressCli, ...args], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
