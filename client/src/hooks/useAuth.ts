import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useAuth() {
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").catch(() => null),
    retry: false,
  });

  const login = useMutation({
    mutationFn: (d: { phone: string; password: string }) =>
      api.post("/auth/login", d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  const register = useMutation({
    mutationFn: (d: { name: string; phone: string; password: string }) =>
      api.post("/auth/register", d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  const logout = useMutation({
    mutationFn: () => api.post("/auth/logout", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  return { user, isLoading, login, register, logout };
}
