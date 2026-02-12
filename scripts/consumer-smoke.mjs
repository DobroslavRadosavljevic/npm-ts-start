import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

const run = (cmd, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `Command failed (${cmd} ${args.join(" ")}): ${stderr || stdout || `exit code ${code}`}`
        )
      );
    });

    child.on("error", (error) => {
      reject(error);
    });
  });

const commandExists = async (command) => {
  try {
    await run(command, ["--version"], repoRoot);
    return true;
  } catch {
    return false;
  }
};

const getNpmCommand = async () => {
  if (await commandExists("npm")) {
    return ["npm"];
  }

  if (await commandExists("bunx")) {
    return ["bunx", "--bun", "npm"];
  }

  throw new Error(
    "Unable to find npm. Install Node.js/npm, or install Bun so `bunx --bun npm` is available."
  );
};

const runNpm = async (npmCommand, args, cwd) => {
  const [command, ...prefixArgs] = npmCommand;
  return run(command, [...prefixArgs, ...args], cwd);
};

const runWithNode20 = (npmCommand, nodeArgs, cwd) =>
  runNpm(
    npmCommand,
    ["exec", "--yes", "--package=node@20", "--", "node", ...nodeArgs],
    cwd
  );

const main = async () => {
  const packageJsonPath = join(repoRoot, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const packageName = packageJson.name;

  if (!packageName) {
    throw new Error("package.json is missing a package name.");
  }

  const npmCommand = await getNpmCommand();
  const packResult = await runNpm(npmCommand, ["pack", "--json"], repoRoot);
  const packOutput = JSON.parse(packResult.stdout);
  const tarballName = packOutput?.[0]?.filename;

  if (!tarballName) {
    throw new Error(
      "Could not determine tarball filename from `npm pack --json` output."
    );
  }

  const tarballPath = join(repoRoot, tarballName);
  const tempDir = await mkdtemp(join(tmpdir(), "npm-ts-start-consumer-"));

  try {
    await writeFile(
      join(tempDir, "package.json"),
      JSON.stringify(
        {
          name: "consumer-smoke",
          private: true,
          type: "commonjs",
        },
        null,
        2
      )
    );

    await runNpm(
      npmCommand,
      ["install", "--no-audit", "--no-fund", tarballPath],
      tempDir
    );

    await runWithNode20(
      npmCommand,
      [
        "--input-type=module",
        "-e",
        `const mod = await import(${JSON.stringify(packageName)}); if (typeof mod.fn !== "function") throw new Error("Expected 'fn' export to be a function.");`,
      ],
      tempDir
    );

    await runWithNode20(
      npmCommand,
      [
        "-e",
        `try { require(${JSON.stringify(packageName)}); throw new Error("Expected require() to fail for ESM-only package."); } catch (error) { const allowed = new Set(["ERR_REQUIRE_ESM", "ERR_PACKAGE_PATH_NOT_EXPORTED"]); if (!allowed.has(error?.code)) throw error; }`,
      ],
      tempDir
    );

    console.log("Consumer smoke test passed.");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
    try {
      await unlink(tarballPath);
    } catch {
      // Ignore cleanup errors for the temporary tarball.
    }
  }
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
