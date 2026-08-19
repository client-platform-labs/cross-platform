import { createCli } from "@client-platform/kernel";
import { runAddTarget } from "./add-target.js";
import { runDoctor } from "./doctor.js";
import { runGenerate } from "./generate.js";
import { runInit } from "./init.js";
import { runPreview } from "./preview.js";
import { DEFAULT_PRESET } from "./types.js";
import { runValidate } from "./validate.js";

function fail(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}

export async function run(argv: string[]): Promise<void> {
  const program = createCli({
    name: "cross-platform",
    version: "0.0.0",
    description: "Client platform cross-platform toolkit",
  });

  program
    .command("init")
    .description("Initialize cross-platform with default preset h5-react-vite")
    .option("--preset <name>", "preset name", DEFAULT_PRESET)
    .action(async (opts: { preset: string }) => {
      try {
        const written = await runInit(process.cwd(), opts.preset);
        for (const file of written) {
          console.log(`wrote ${file}`);
        }
        console.log(`init complete (preset=${opts.preset})`);
      } catch (err) {
        fail(err);
      }
    });

  program
    .command("add-target")
    .description("Register an additional client target")
    .argument("<name>", "target id")
    .option("--capabilities <list>", "comma-separated capabilities")
    .action(async (name: string, opts: { capabilities?: string }) => {
      try {
        const caps = opts.capabilities
          ? opts.capabilities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;
        const result = await runAddTarget(process.cwd(), name, caps);
        console.log(
          `added target ${result.target.id} support=${result.target.support} capabilities=[${result.target.capabilities.join(", ")}]`,
        );
        if (result.warning) {
          console.warn(`warn: ${result.warning}`);
        }
        console.log(`updated ${result.configPath} (targets=${result.targets.length})`);
      } catch (err) {
        fail(err);
      }
    });

  program
    .command("generate")
    .description("Generate shared-core capability types and per-target seams")
    .action(async () => {
      try {
        const written = await runGenerate(process.cwd());
        console.log(`[cross-platform] generate ok — wrote ${written.length} file(s)`);
        for (const file of written) {
          console.log(`  + ${file}`);
        }
      } catch (err) {
        fail(err);
      }
    });

  program
    .command("preview")
    .description("Run local H5 preview (experimental targets warn only)")
    .option("--port <n>", "port", "4175")
    .option("--write-only", "write preview HTML and exit")
    .action(async (opts: { port: string; writeOnly?: boolean }) => {
      try {
        await runPreview(process.cwd(), {
          port: Number(opts.port) || 4175,
          writeOnly: Boolean(opts.writeOnly),
        });
      } catch (err) {
        fail(err);
      }
    });

  program
    .command("validate")
    .description("Validate target config and capability contracts")
    .action(async () => {
      try {
        const result = await runValidate(process.cwd());
        for (const check of result.checks) {
          console.log(`ok: ${check}`);
        }
        for (const warning of result.warnings) {
          console.warn(`warn: ${warning}`);
        }
        for (const error of result.errors) {
          console.error(`error: ${error}`);
        }
        if (!result.ok) {
          process.exit(1);
        }
        console.log("validate complete");
      } catch (err) {
        fail(err);
      }
    });

  program
    .command("doctor")
    .description("Product diagnostics")
    .action(async () => {
      const findings = await runDoctor(process.cwd());
      let failed = false;
      for (const finding of findings) {
        console.log(`[${finding.severity}] ${finding.code}: ${finding.message}`);
        if (finding.severity === "error") {
          failed = true;
        }
      }
      if (failed) {
        process.exit(1);
      }
    });

  await program.parseAsync(argv);
}
