import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useArticle } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

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

          <div className="prose prose-lg max-w-none space-y-6 font-sans text-base text-foreground">
            {article.content.replace(/\r\n/g, "\n").split("\n\n").map((block, i) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Heading
              if (trimmed.startsWith("## ") || trimmed.endsWith(" ##")) {
                return (
                  <h2 key={i} className="mt-12 mb-2 text-2xl tracking-tight text-justify font-semibold text-foreground">
                    {trimmed.replace(/^##\s*/, "").replace(/\s*##$/, "")}
                  </h2>
                );
              }

              // Check if block contains line-break-separated items (list-like)
              const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);

              if (lines.length > 1) {
                // If lines look like a list (short items), render as list
                const looksLikeList = lines.every((l) => l.length < 200);
                if (looksLikeList) {
                  return (
                    <ul key={i} className="space-y-2 pl-5 list-disc text-base text-foreground font-sans">
                      {lines.map((line, j) => {
                        const colonMatch = line.match(/^([^:]+)\s*:\s*(.+)$/);
                        if (colonMatch) {
                          return (
                            <li key={j} className="leading-relaxed">
                              <strong className="text-foreground">{colonMatch[1]}</strong> : {renderTextWithLinks(colonMatch[2], navigate)}
                            </li>
                          );
                        }
                        return <li key={j} className="leading-relaxed">{line}</li>;
                      })}
                    </ul>
                  );
                }
                // Otherwise render lines as separate paragraphs
                return (
                  <div key={i} className="space-y-3">
                    {lines.map((line, j) => (
                      <p key={j} className="leading-relaxed text-foreground">{line}</p>
                    ))}
                  </div>
                );
              }

              // Single paragraph — bold first sentence
              const match = trimmed.match(/^([^.:\n]+[.:]?)\s*([\s\S]*)$/);
              if (match && match[2]) {
                return (
                  <p key={i} className="leading-[1.8] text-base font-sans text-foreground">
                    <strong>{match[1]}</strong>{" "}{match[2]}
                  </p>
                );
              }
              return <p key={i} className="leading-[1.8] text-base font-sans text-foreground">{trimmed}</p>;
            })}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogArticle;
