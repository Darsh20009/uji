export async function apiRequest(method: string, path: string, body?: any) {
  const res = await fetch(`/api${path}`, {
    method, headers: { "Content-Type": "application/json" },
    credentials: "include", body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "خطأ في الشبكة" }));
    throw new Error(err.message || "حدث خطأ");
  }
  return res.json();
}
export const api = {
  get: (path: string) => apiRequest("GET", path),
  post: (path: string, body: any) => apiRequest("POST", path, body),
  put: (path: string, body: any) => apiRequest("PUT", path, body),
  delete: (path: string) => apiRequest("DELETE", path),
};