import { createCli } from "@client-platform/kernel";
import { runDoctor } from "./doctor.js";
import { runInit } from "./init.js";
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
    .description("Register an additional client target (stub)")
    .argument("[name]", "target name")
    .action(async (name?: string) => {
      console.log(
        `[cross-platform] add-target: stub — target registration for "${name ?? "<name>"}" lands in a later milestone.`,
      );
    });

  program
    .command("generate")
    .description("Generate shared-core seams and adapters (stub)")
    .action(async () => {
      console.log(
        "[cross-platform] generate: stub — shared-core codegen lands in a later milestone.",
      );
    });

  program
    .command("preview")
    .description("Run local per-target preview (stub)")
    .action(async () => {
      console.log(
        "[cross-platform] preview: stub — H5 preview lands in a later milestone.",
      );
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
