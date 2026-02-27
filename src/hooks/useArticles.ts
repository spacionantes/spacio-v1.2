import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  author: string;
  read_time_min: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const useArticles = () =>
  useQuery<BlogArticle[]>({
    queryKey: ["blog-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogArticle[];
    },
  });

export const useArticle = (slug: string | undefined) =>
  useQuery<BlogArticle | null>({
    queryKey: ["blog-article", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data as BlogArticle | null;
    },
  });
