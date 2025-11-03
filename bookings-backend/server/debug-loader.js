// debug-loader.mjs
export function resolve(specifier, context, nextResolve) {
    console.log(`[DEBUG] Resolving: ${specifier}`);
    console.log(`[DEBUG] Parent: ${context.parentURL}`);
    return nextResolve(specifier);
  }