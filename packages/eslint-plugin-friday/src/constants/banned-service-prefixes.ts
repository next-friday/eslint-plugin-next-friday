export const BANNED_SERVICE_PREFIXES: Record<string, readonly string[]> = {
  delete: ["remove", "archive"],
  do: ["submit", "process"],
  handle: ["create", "verify"],
  set: ["update", "save", "patch"],
};
