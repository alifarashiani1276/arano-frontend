import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/portfolioService";

export default function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000,
  });
}
