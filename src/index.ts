import core from "@actions/core";
import { DO_NOT_TRACK_VARIABLES, setVariables, writeEnvFile } from "./env";

const main = async () => {
  const custom = core.getMultilineInput("custom");
  const outputFile = core.getInput("output");

  const envVariables = [
    ...DO_NOT_TRACK_VARIABLES.map(
      (dntVar) => dntVar.split("=") as [string, string],
    ),
    ...custom.map(
      (name) =>
        (name.indexOf("=") === -1
          ? [name.toUpperCase(), "1"]
          : name.split("=")) as [string, string],
    ),
  ];

  const tasks: Promise<any>[] = [
    outputFile
      ? writeEnvFile(outputFile, envVariables).then(() => {
          core.info(`Successfully wrote variables to: ${outputFile}`);
        })
      : null,
    setVariables(envVariables).then(() => {
      core.info("Successfully set ENV variables");
    }),
  ].filter((task) => !!task);

  await Promise.all(tasks);
};

main();
