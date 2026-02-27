import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useArticle } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) {
    return (
      <Layout>
        <article className="py-12">
          <div className="container max-w-3xl space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Article non trouvé</h1>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
            Retour au blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-12">
        <div className="container max-w-3xl">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>

          <Badge variant="secondary" className="mb-4 rounded-lg">
            {article.category}
          </Badge>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">{article.title}</h1>

          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{article.author}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.read_time_min} min de lecture</span>
            <span>{new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>

          {article.image_url && (
            <div className="mb-10 overflow-hidden rounded-2xl">
              <img src={article.image_url} alt={article.title} className="w-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground space-y-6">
            {article.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return <h2 key={i} className="mt-10 mb-4 text-2xl font-bold">{paragraph.replace(/^## /,"").replace(/ ##$/,"")}</h2>;
              }
              // Bold the first sentence (up to first period, colon, or newline)
              const match = paragraph.match(/^([^.:\n]+[.:]?)\s*([\s\S]*)$/);
              if (match && match[2]) {
                return (
                  <p key={i} className="leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">{match[1]}</strong>{" "}{match[2]}
                  </p>
                );
              }
              return <p key={i} className="leading-relaxed text-muted-foreground">{paragraph}</p>;
            })}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogArticle;
