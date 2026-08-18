import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathExists } from "./fs-utils.js";
import { parseJsonc, stringifyJsonc } from "./jsonc.js";
import {
  CONFIG_FILE_NAME,
  DEFAULT_PRESET,
  DEFAULT_TARGETS,
  MANIFEST_FILE_NAME,
  SCHEMA_VERSION,
  type CrossPlatformConfig,
  type ProjectManifestFile,
  type WorkspaceConfigFile,
} from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function loadJsoncFile(filePath: string): Promise<unknown> {
  const text = await readFile(filePath, "utf8");
  try {
    return parseJsonc(text);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(`invalid JSONC: ${filePath} (${reason})`);
  }
}

export function parseWorkspaceConfig(value: unknown): WorkspaceConfigFile {
  if (!isRecord(value) || typeof value.schemaVersion !== "string") {
    throw new Error(`${CONFIG_FILE_NAME} must include string schemaVersion`);
  }
  return value as WorkspaceConfigFile;
}

export function parseProjectManifest(value: unknown): ProjectManifestFile {
  if (!isRecord(value) || typeof value.schemaVersion !== "string") {
    throw new Error(`${MANIFEST_FILE_NAME} must include string schemaVersion`);
  }
  return value as ProjectManifestFile;
}

async function writeJsoncFile(
  filePath: string,
  value: unknown,
  header: string,
): Promise<void> {
  await writeFile(filePath, stringifyJsonc(value, header), "utf8");
}

export async function writeWorkspaceConfig(
  cwd: string,
  patch: CrossPlatformConfig,
): Promise<string> {
  const configPath = path.join(cwd, CONFIG_FILE_NAME);
  const existing = (await pathExists(configPath))
    ? parseWorkspaceConfig(await loadJsoncFile(configPath))
    : { schemaVersion: SCHEMA_VERSION };
  const next: WorkspaceConfigFile = {
    ...existing,
    schemaVersion: existing.schemaVersion || SCHEMA_VERSION,
    products: {
      ...existing.products,
      crossPlatform: {
        ...(isRecord(existing.products?.crossPlatform)
          ? existing.products.crossPlatform
          : {}),
        preset: patch.preset,
        targets: patch.targets ?? [...DEFAULT_TARGETS],
      },
    },
  };
  await writeJsoncFile(
    configPath,
    next,
    "// Client Platform workspace config",
  );
  return configPath;
}

export async function writeProjectManifest(
  cwd: string,
  patch: Pick<ProjectManifestFile, "targets" | "tooling" | "entry">,
): Promise<string> {
  const manifestPath = path.join(cwd, MANIFEST_FILE_NAME);
  const existing = (await pathExists(manifestPath))
    ? parseProjectManifest(await loadJsoncFile(manifestPath))
    : { schemaVersion: SCHEMA_VERSION };
  const next: ProjectManifestFile = {
    ...existing,
    schemaVersion: existing.schemaVersion || SCHEMA_VERSION,
    targets: patch.targets ?? existing.targets,
    tooling: patch.tooling ?? existing.tooling,
    entry: patch.entry ?? existing.entry,
  };
  await writeJsoncFile(
    manifestPath,
    next,
    "// Client Platform project manifest",
  );
  return manifestPath;
}

export type LoadedProject = {
  cwd: string;
  configPath: string;
  manifestPath: string;
  workspace: WorkspaceConfigFile;
  project: ProjectManifestFile;
};

export async function loadProject(cwd: string): Promise<LoadedProject> {
  const configPath = path.join(cwd, CONFIG_FILE_NAME);
  const manifestPath = path.join(cwd, MANIFEST_FILE_NAME);
  if (!(await pathExists(configPath))) {
    throw new Error(`missing ${CONFIG_FILE_NAME}; run \`cross-platform init\``);
  }
  if (!(await pathExists(manifestPath))) {
    throw new Error(`missing ${MANIFEST_FILE_NAME}; run \`cross-platform init\``);
  }
  return {
    cwd,
    configPath,
    manifestPath,
    workspace: parseWorkspaceConfig(await loadJsoncFile(configPath)),
    project: parseProjectManifest(await loadJsoncFile(manifestPath)),
  };
}

export function defaultProductConfig(preset: string): CrossPlatformConfig {
  return {
    preset: preset || DEFAULT_PRESET,
    targets: [...DEFAULT_TARGETS],
  };
}
