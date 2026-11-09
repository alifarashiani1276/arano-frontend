import { useQuery } from "@tanstack/react-query";
import { useLang } from "../i18n/LangContext";
import { getProjects } from "../services/portfolioService";

export default function useProjects() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["projects", lang],
    queryFn: () => getProjects(lang),
    staleTime: 5 * 60 * 1000,
  });
}
