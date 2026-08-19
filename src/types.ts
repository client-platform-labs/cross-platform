export type TargetSupport = "supported" | "experimental";

export type CrossPlatformTarget = {
  id: string;
  capabilities: string[];
  support: TargetSupport;
};

export type CrossPlatformConfig = {
  preset: string;
  sharedCore: string;
  targets: CrossPlatformTarget[];
};

export type WorkspaceConfigFile = {
  schemaVersion: string;
  products?: {
    crossPlatform?: Partial<CrossPlatformConfig> & Record<string, unknown>;
    [product: string]: unknown;
  };
  plugins?: string[];
};

export type ProjectManifestFile = {
  schemaVersion: string;
  targets?: string[];
  tooling?: string[];
};

export const CONFIG_FILE_NAME = "client-platform.config.jsonc";
export const MANIFEST_FILE_NAME = "client-platform.manifest.jsonc";
export const SCHEMA_VERSION = "1";
export const DEFAULT_PRESET = "h5-react-vite";
export const DEFAULT_SHARED_CORE = "./src/shared";
export const DEFAULT_H5_TARGET: CrossPlatformTarget = {
  id: "h5",
  capabilities: ["dom", "fetch", "storage"],
  support: "supported",
};
export const EXPERIMENTAL_TARGET_IDS = new Set(["mini-program"]);
export const GENERATED_DIR = "cross-platform/generated";
export const PREVIEW_DIR = ".client-platform/cross-platform/preview";
