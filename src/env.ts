import core from "@actions/core";
import { exec } from "@actions/exec";
import { mkdirP } from "@actions/io";
import path from "node:path";
import fs from "node:fs/promises";

// Common archetype
function TD(names: string[], value = "1") {
  return names.map((name) => `${name}_TELEMETRY_DISABLED=${value}`);
}

export const DO_NOT_TRACK_VARIABLES = [
  "DO_NOT_TRACK=1",
  ...TD(["GATSBY", "NEXT", "ASTRO"]),
  "GH_TELEMETRY=false",
];

export async function writeEnvFile(
  filePath: string,
  envVariables: [string, string][],
) {
  await mkdirP(path.dirname(filePath));
  await fs.writeFile(
    filePath,
    envVariables.map((entry) => entry.join("=")).join("\n"),
  );
}

export async function setVariables(envVariables: [string, string][]) {
  const platform = await core.platform.getDetails();
  if (platform.isWindows) {
    const tasks = envVariables.map(([name, value]) =>
      exec(`$Env:${name}=${value}`),
    );

    await Promise.all(tasks);
    return;
  }

  await exec(
    "export",
    envVariables.map(([name, value]) => `${name}=${value}`),
  );
}
