import path from "node:path";
import {
  defaultProductConfig,
  inferSupport,
  loadProject,
  writeProjectManifest,
  writeWorkspaceConfig,
} from "./config.js";
import type { CrossPlatformTarget } from "./types.js";

const DEFAULT_CAPABILITIES: Record<string, string[]> = {
  h5: ["dom", "fetch", "storage"],
  "mini-program": ["storage"],
};

export type AddTargetResult = {
  target: CrossPlatformTarget;
  targets: CrossPlatformTarget[];
  configPath: string;
  warning?: string;
};

export async function runAddTarget(
  cwd: string,
  id: string,
  capabilities?: string[],
): Promise<AddTargetResult> {
  if (!id || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(id)) {
    throw new Error(`invalid target id "${id}"`);
  }

  const project = await loadProject(cwd);
  const product = project.product ?? defaultProductConfig("h5-react-vite");
  if (product.targets.some((t) => t.id === id)) {
    throw new Error(`target already registered: ${id}`);
  }

  const target: CrossPlatformTarget = {
    id,
    capabilities: capabilities ?? DEFAULT_CAPABILITIES[id] ?? [],
    support: inferSupport(id),
  };

  const next = {
    ...product,
    targets: [...product.targets, target],
  };
  const configPath = await writeWorkspaceConfig(cwd, next);
  await writeProjectManifest(cwd, {
    targets: next.targets.map((t) => t.id),
    tooling: project.project.tooling ?? ["vite"],
  });

  return {
    target,
    targets: next.targets,
    configPath: path.relative(cwd, configPath) || path.basename(configPath),
    warning:
      target.support === "experimental"
        ? `target "${id}" is experimental`
        : undefined,
  };
}
