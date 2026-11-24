#!/usr/bin/env node
// \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
let _actions_core = require("@actions/core");
let _actions_exec = require("@actions/exec");
let _actions_io = require("@actions/io");
let node_path = require("node:path");
let node_fs_promises = require("node:fs/promises");
_actions_core = __toESM(_actions_core, 1);
node_path = __toESM(node_path, 1);
node_fs_promises = __toESM(node_fs_promises, 1);
// src/env.ts
function TD(names, value = "1") {
	return names.map((name) => `${name}_TELEMETRY_DISABLED=${value}`);
}
const DO_NOT_TRACK_VARIABLES = [
	"DO_NOT_TRACK=1",
	...TD([
		"GATSBY",
		"NEXT",
		"ASTRO"
	]),
	"GH_TELEMETRY=false"
];
async function writeEnvFile(filePath, envVariables) {
	await (0, _actions_io.mkdirP)(node_path.default.dirname(filePath));
	await node_fs_promises.default.writeFile(filePath, envVariables.map((entry) => entry.join("=")).join("\n"));
}
async function setVariables(envVariables) {
	if ((await _actions_core.default.platform.getDetails()).isWindows) {
		const tasks = envVariables.map(([name, value]) => (0, _actions_exec.exec)(`$Env:${name}=${value}`));
		await Promise.all(tasks);
		return;
	}
	await (0, _actions_exec.exec)("export", envVariables.map(([name, value]) => `${name}=${value}`));
}
// src/index.ts
const main = async () => {
	const custom = _actions_core.default.getMultilineInput("custom");
	const outputFile = _actions_core.default.getInput("output");
	const envVariables = [...DO_NOT_TRACK_VARIABLES.map((dntVar) => dntVar.split("=")), ...custom.map((name) => name.indexOf("=") === -1 ? [name.toUpperCase(), "1"] : name.split("="))];
	const tasks = [outputFile ? writeEnvFile(outputFile, envVariables).then(() => {
		_actions_core.default.info(`Successfully wrote variables to: ${outputFile}`);
	}) : null, setVariables(envVariables).then(() => {
		_actions_core.default.info("Successfully set ENV variables");
	})].filter((task) => !!task);
	await Promise.all(tasks);
};
main();

//# sourceMappingURL=index.cjs.map