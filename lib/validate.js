// skillgen validation rules

export const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const TYPES = ['basic', 'cli', 'workflow', 'mcp'];
export const LANGS = ['zh', 'en', 'both'];

export function validateName(name) {
  return typeof name === 'string' && name.length <= 64 && NAME_RE.test(name);
}
