// Minimal {{placeholder}} template renderer (zero-dependency)

export function render(template, vars) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  );
}
