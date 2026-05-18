import { Helmet } from "react-helmet-async";

const SITE_URL = "https://find-fab-spaces.lovable.app";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const Seo = ({ title, description, path, type = "website", image, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/favicon2.png`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;
