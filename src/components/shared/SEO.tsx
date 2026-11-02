import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_DESCRIPTION = 'BS Papelería: cursos online y recursos digitales para aprender papelería creativa y emprender.';

export function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const fullTitle = `${title} | BS Papelería`;
  const defaultImage = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&h=630&q=80';
  const siteUrl = url ?? 'https://bspapeleria.com';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? DEFAULT_DESCRIPTION} />
      <link rel="canonical" href={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description ?? DEFAULT_DESCRIPTION} />
      <meta property="og:image" content={image ?? defaultImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description ?? DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={image ?? defaultImage} />
    </Helmet>
  );
}
