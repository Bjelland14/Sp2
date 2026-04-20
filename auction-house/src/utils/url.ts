export function getParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export function buildUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {}
): string {
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

export function redirect(path: string): void {
  window.location.href = path;
}
