// Workspace packages compile with moduleResolution "Bundler", which allows
// extensionless relative imports (e.g. "./manifest"). Bundlers resolve those
// fine, but plain Node ESM (this build script) requires the ".js" suffix and
// throws ERR_MODULE_NOT_FOUND otherwise. This hook retries with ".js" appended
// instead of requiring every workspace package to change its build output.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err?.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !specifier.endsWith(".js")) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw err;
  }
}
