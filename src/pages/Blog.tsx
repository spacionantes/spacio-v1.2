import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const Blog = () => {
  const { data: articles, isLoading } = useArticles();

  return (
    <Layout>
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Blog</h1>
            <p className="text-muted-foreground">Conseils, guides et actualités pour les associations et propriétaires</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <Skeleton className="aspect-[16/10] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))
              : articles?.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link to={`/blog/${article.slug}`} className="group block">
                      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={article.image_url || ""}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-5">
                          <Badge variant="secondary" className="mb-3 rounded-lg text-xs font-medium">
                            {article.category}
                          </Badge>
                          <h3 className="mb-2 font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{article.author}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.read_time_min} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
