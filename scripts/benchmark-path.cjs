// Usage: npm run bench:path -- [git-ref-to-compare]
// Uses compiler counters instead of timing, which varies with caches and machine load.
const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src/types.ts");
const fixturePath = path.join(root, "tests/path-benchmark.ts");
const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
if (parsed.errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(parsed.errors, {
    getCanonicalFileName: name => name,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n"
}));

// Virtual fixture: broad unions, optional fields, arrays, recursion, and generic inputs.
const fixture = `
import type { Path, InputProps } from '../src/types';
type Keys = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Leaf = { street: string; city: string; metadata: any; when: Date };
type Branch = { [K in Keys]: Leaf | readonly Leaf[] | undefined };
type Model = { [K in Keys]: Branch | readonly Branch[] | null };
type Recursive = { children: Recursive[]; metadata: any; value: string };
export let field: Path<Model> = 'a.0.b.0.street';
field = 'a.b.street';
// @ts-expect-error Unknown fields must still be rejected.
field = 'a.0.b.0.missing';
export let recursive: Path<Recursive> = 'children.0.children.0.value';
declare function input<T>(props: InputProps<string, T>): void;
export function generic<T>(props: InputProps<string, T>) { input<T>(props); }
`;

const versions = [];
if (process.argv[2]) versions.push([process.argv[2], execFileSync("git", [
    "show", `${process.argv[2]}:src/types.ts`
], { cwd: root, encoding: "utf8" })]);
versions.push(["working tree", fs.readFileSync(sourcePath, "utf8")]);

const results = [];
for (const [version, source] of versions) {
    for (const scenario of ["project", "large model"]) {
        const options = { ...parsed.options, noEmit: true };
        if (scenario === "large model") options.noUnusedLocals = false;
        const host = ts.createCompilerHost(options);
        const readFile = host.readFile.bind(host);
        host.readFile = name => path.resolve(name) === sourcePath ? source
            : path.resolve(name) === fixturePath ? fixture : readFile(name);
        // Exclude evolving regression tests so historical comparisons use the same workload.
        const files = scenario === "project"
            ? parsed.fileNames.filter(name => !name.endsWith("path.types.ts"))
            : [fixturePath];
        const program = ts.createProgram(files, options, host);
        const diagnostics = ts.getPreEmitDiagnostics(program);
        results.push({ version, scenario, types: program.getTypeCount(),
            instantiations: program.getInstantiationCount(), diagnostics: diagnostics.length });
        // Project diagnostics are reported because the repository has existing type errors.
        if (scenario === "large model" && diagnostics.length) process.exitCode = 1;
    }
}
console.table(results);
