import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useArticle } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";
import Seo from "@/components/Seo";

const URL_REGEX = /(https?:\/\/spacionantes\.fr(\/[^\s,.)]*)?)/g;

const renderTextWithLinks = (text: string, navigate: ReturnType<typeof useNavigate>) => {
  const parts = text.split(URL_REGEX);
  if (parts.length === 1) return text;
  
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(URL_REGEX);
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    const path = match[2] || "/";
    result.push(
      <button
        key={match.index}
        onClick={() => navigate(path)}
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        {url}
      </button>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
};

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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
      <Seo
        title={`${article.title} – Blog Spacio`}
        description={article.content.slice(0, 155).replace(/\s+/g, " ").trim()}
        path={`/blog/${article.slug}`}
        type="article"
        image={article.image_url || undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          datePublished: article.published_at,
          author: { "@type": "Person", name: article.author },
          image: article.image_url || undefined,
          mainEntityOfPage: `https://find-fab-spaces.lovable.app/blog/${article.slug}`,
        }}
      />
      <article className="py-12">
        <div className="container max-w-3xl">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>

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

          <div className="prose prose-lg max-w-none font-sans text-base text-foreground whitespace-pre-line leading-relaxed text-justify space-y-6">
            {renderTextWithLinks(article.content, navigate)}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogArticle;
