import { useQuery } from "@tanstack/react-query";
import { getInitialPosts, getPosts } from "../services/blogService";

export default function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: getPosts,
    initialData: getInitialPosts,
    staleTime: 5 * 60 * 1000,
  });
}
