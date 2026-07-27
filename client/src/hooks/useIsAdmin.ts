import { useQuery } from "@tanstack/react-query";

export function useIsAdmin() {
  const { data, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const res = await fetch("/api/auth/is-admin", { credentials: "include" });
      if (!res.ok) return { isAdmin: false };
      return res.json() as Promise<{ isAdmin: boolean }>;
    },
    staleTime: 60_000,
    retry: false,
  });

  return { isAdmin: data?.isAdmin ?? false, isLoading };
}
