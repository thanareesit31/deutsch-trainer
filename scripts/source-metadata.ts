import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { sourceCatalog, sourceEvidence, isRegisteredSourceId } from "../src/lib/source-catalog";
import { l13L14MetadataSubjects, l13L14SourceMetadata, findSourceMetadata } from "../src/lib/l13-l14-source-metadata";
import { validateLegacyCatalogSources, validateSourceRegistry } from "../src/lib/source-metadata";

async function main() {
  const [command = "check", ...args] = process.argv.slice(2);
  if (command === "verify-file") {
    const [sourceId, path] = args;
    if (!isRegisteredSourceId(sourceId) || !path) throw new Error("Usage: npm run sources:verify-file -- SOURCE_ID PDF_PATH");
    const document = sourceCatalog[sourceId];
    if (!document.sha256) throw new Error(`No inspected file fingerprint for ${sourceId}`);
    const actual = createHash("sha256").update(await readFile(path)).digest("hex");
    if (actual !== document.sha256) throw new Error(`Document fingerprint mismatch for ${sourceId}; recheck page evidence before using this edition.`);
    console.log(`${sourceId}: file matches inspected SHA-256 ${actual}`);
    return;
  }
  const legacyCatalog: unknown = JSON.parse(await readFile(new URL("../supabase/seed/catalog.json", import.meta.url), "utf8"));
  const issues = [...validateSourceRegistry(l13L14SourceMetadata, l13L14MetadataSubjects), ...validateLegacyCatalogSources(legacyCatalog)];
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  if (command === "report") {
    const idIndex = args.indexOf("--id");
    const id = idIndex < 0 ? undefined : args[idIndex + 1];
    if (idIndex >= 0 && !id) throw new Error("--id requires an existing activityId or metadata recordKey");
    const records = id ? findSourceMetadata(id) : l13L14SourceMetadata;
    if (id && !records.length) throw new Error(`No metadata for ${id}; legacy content is not automatically assigned invented references.`);
    console.log(JSON.stringify({ schemaVersion: 1, sources: sourceCatalog, evidence: sourceEvidence,
      metadata: records, issues: id ? issues.filter((issue) => records.some((entry) => entry.recordKey === issue.recordKey)) : issues }, null, 2));
  } else if (command === "check") {
    console.log(`Source metadata: ${l13L14SourceMetadata.length} records; ${errors.length} errors; ${warnings.length} review warnings.`);
    for (const issue of errors) console.error(`ERROR ${issue.recordKey} [${issue.code}]: ${issue.message}`);
    for (const issue of warnings.slice(0, 3)) console.warn(`REVIEW ${issue.recordKey}: ${issue.message}`);
    if (warnings.length > 3) console.warn(`Another ${warnings.length - 3} review warnings are listed by sources:report. Use --strict to require full review.`);
  } else throw new Error(`Unknown command ${command}; use check, report or verify-file.`);
  if (errors.length || (args.includes("--strict") && warnings.length)) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Source metadata check failed");
  process.exitCode = 1;
});
