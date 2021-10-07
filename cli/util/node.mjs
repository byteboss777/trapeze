import ionicFs from "@ionic/utils-fs";

import { resolve } from "path";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import ts from "typescript";

export function requireTS(p) {
  const id = resolve(p);

  delete require.cache[id];

  require.extensions[".ts"] = (module, fileName) => {
    let sourceText = ionicFs.readFileSync(fileName, "utf8");

    if (fileName.endsWith(".ts")) {
      const tsResults = ts.transpileModule(sourceText, {
        fileName,
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          esModuleInterop: true,
          strict: true,
          target: ts.ScriptTarget.ES2017,
        },
        reportDiagnostics: true,
      });
      sourceText = tsResults.outputText;
    } else {
      // quick hack to turn a modern es module
      // into and old school commonjs module
      sourceText = sourceText.replace(/export\s+\w+\s+(\w+)/gm, "exports.$1");
    }

    module._compile?.(sourceText, fileName);
  };

  const m = require(id); // eslint-disable-line @typescript-eslint/no-var-requires

  delete require.extensions[".ts"];

  return m;
}

export function resolveNode(root, ...pathSegments) {
  try {
    return require.resolve(pathSegments.join("/"), { paths: [root] });
  } catch (e) {
    return null;
  }
}
