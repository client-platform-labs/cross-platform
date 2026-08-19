import {
  ConfigError,
  loadProjectManifest,
  loadWorkspaceConfig,
  PROJECT_MANIFEST_FILENAME,
  WORKSPACE_CONFIG_FILENAME,
} from "@client-platform/kernel";
import { normalizeProductConfig } from "./config.js";

export type ValidateResult = {
  ok: boolean;
  checks: string[];
  errors: string[];
  warnings: string[];
};

export async function runValidate(cwd: string): Promise<ValidateResult> {
  const checks: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const workspace = await loadWorkspaceConfig(cwd);
    checks.push(
      `loaded ${WORKSPACE_CONFIG_FILENAME} (schemaVersion=${workspace.schemaVersion})`,
    );

    const manifest = await loadProjectManifest(cwd);
    checks.push(
      `loaded ${PROJECT_MANIFEST_FILENAME} (schemaVersion=${manifest.schemaVersion})`,
    );

    const product = normalizeProductConfig(workspace.products?.crossPlatform);
    if (!product) {
      errors.push(
        "products.crossPlatform missing or invalid (need preset, sharedCore, targets[])",
      );
      return { ok: false, checks, errors, warnings };
    }

    checks.push(`preset=${product.preset}`);
    checks.push(`sharedCore=${product.sharedCore}`);

    const ids = new Set<string>();
    for (const target of product.targets) {
      if (ids.has(target.id)) {
        errors.push(`duplicate target id: ${target.id}`);
      }
      ids.add(target.id);
      if (target.support === "experimental") {
        warnings.push(
          `target "${target.id}" is experimental — validate/preview may degrade`,
        );
      }
      checks.push(
        `target=${target.id} support=${target.support} capabilities=${target.capabilities.join(",") || "(none)"}`,
      );
    }

    if (!product.targets.some((t) => t.id === "h5" && t.support === "supported")) {
      warnings.push('no supported "h5" target — H5 preview path may be unavailable');
    }
  } catch (err) {
    const message =
      err instanceof ConfigError || err instanceof Error ? err.message : String(err);
    errors.push(message);
  }

  return { ok: errors.length === 0, checks, errors, warnings };
}
