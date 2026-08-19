import http from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadProject } from "./config.js";
import { runValidate } from "./validate.js";
import { PREVIEW_DIR } from "./types.js";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPreviewHtml(
  sharedCore: string,
  targets: Array<{ id: string; support: string; capabilities: string[] }>,
): string {
  const rows = targets
    .map((t) => {
      const badge =
        t.support === "experimental"
          ? `<span style="color:#a15c00">experimental</span>`
          : `<span style="color:#1b7f4a">supported</span>`;
      return `<tr><td><code>${escapeHtml(t.id)}</code></td><td>${badge}</td><td><code>${escapeHtml(t.capabilities.join(", ") || "(none)")}</code></td></tr>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>cross-platform preview</title>
  <style>
    :root { color-scheme: light; font-family: ui-sans-serif, system-ui, sans-serif; }
    body { margin: 2rem; background: #f7f8fa; color: #17212b; }
    table { border-collapse: collapse; width: 100%; background: white; }
    th, td { border: 1px solid #d7dde5; padding: 0.6rem 0.75rem; text-align: left; }
    th { background: #eef2f6; }
    .note { color: #5b6b7c; }
  </style>
</head>
<body>
  <h1>H5 preview</h1>
  <p class="note">sharedCore: <code>${escapeHtml(sharedCore)}</code></p>
  <p class="note">Experimental targets are listed but not executed in v1.</p>
  <table>
    <thead><tr><th>Target</th><th>Support</th><th>Capabilities</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>
`;
}

export async function runPreview(
  cwd: string,
  options: { port?: number; writeOnly?: boolean } = {},
): Promise<{ url?: string; htmlPath: string; warnings: string[] }> {
  const validation = await runValidate(cwd);
  for (const warning of validation.warnings) {
    console.warn(`warn: ${warning}`);
  }
  if (!validation.ok) {
    throw new Error(
      `validate failed:\n${validation.errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }

  const project = await loadProject(cwd);
  if (!project.product) {
    throw new Error("products.crossPlatform missing or invalid");
  }

  const h5 = project.product.targets.find((t) => t.id === "h5");
  if (!h5 || h5.support !== "supported") {
    throw new Error('preview requires a supported "h5" target');
  }

  const outDir = path.join(cwd, PREVIEW_DIR);
  await mkdir(outDir, { recursive: true });
  const htmlPath = path.join(outDir, "index.html");
  const html = renderPreviewHtml(project.product.sharedCore, project.product.targets);
  await writeFile(htmlPath, html, "utf8");
  console.log(`[cross-platform] wrote ${path.relative(cwd, htmlPath)}`);

  if (options.writeOnly) {
    return { htmlPath, warnings: validation.warnings };
  }

  const port = options.port ?? 4175;
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve());
  });

  const url = `http://127.0.0.1:${port}/`;
  console.log(`[cross-platform] preview serving ${url}`);
  console.log("[cross-platform] press Ctrl+C to stop");

  await new Promise<void>((resolve) => {
    const stop = () => {
      server.close(() => resolve());
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });

  return { url, htmlPath, warnings: validation.warnings };
}
