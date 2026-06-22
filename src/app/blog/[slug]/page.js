import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiClock, FiCalendar, FiArrowLeft } from "react-icons/fi";
import CodeBlock from "@/components/blog/CodeBlock";

export const dynamic = "force-static";

// Formats an ISO date string into a readable date, e.g. "January 12, 2025"
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function getPost(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${slug}`,
      {
        cache: "force-cache",
      },
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

// Pre-render all blog slugs at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`);
    const { data } = await res.json();
    return (data || []).map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Failed to generate static params for blog:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

// Custom renderers for react-markdown so code blocks use our CodeBlock component
function getMarkdownComponents() {
  return {
    code(props) {
      const { children, className, node, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");

      // Fenced code blocks come through with a language class on the parent <pre>
      // react-markdown passes inline=false implicitly via the node structure,
      // so we treat any match with a language as a block-level code sample
      if (match) {
        return (
          <CodeBlock
            code={String(children).replace(/\n$/, "")}
            language={match[1]}
          />
        );
      }

      // Inline code (no language) renders as a simple styled span
      return (
        <code
          className="bg-secondary text-portfolio-accent rounded px-1.5 py-0.5 font-mono text-sm"
          {...rest}
        >
          {children}
        </code>
      );
    },
    pre(props) {
      // Avoid double-wrapping in a <pre> since CodeBlock already renders its own
      return <>{props.children}</>;
    },
    a(props) {
      const { href, children, ...rest } = props;
      const isExternal = href && href.startsWith("http");
      return (
        <a
          href={href}
          className="text-portfolio-accent hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    },
    img(props) {
      const { src, alt } = props;
      return (
        <span className="block relative w-full h-80 my-6 rounded-xl overflow-hidden">
          <Image src={src} alt={alt || ""} fill className="object-cover" />
        </span>
      );
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="bg-background min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mt-3">
            The article you are looking for does not exist or was unpublished.
          </p>
          <Link
            href="/blog"
            className="text-portfolio-accent hover:underline mt-6 inline-block"
          >
            ← Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    author: { "@type": "Person", name: "Asif" },
    datePublished: post.publishedAt,
  };

  return (
    <main className="bg-background min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-portfolio-accent hover:underline text-sm mb-8"
        >
          <FiArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Article header */}
        <header>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-muted-foreground text-xs rounded-full px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-heading font-bold text-4xl leading-tight text-foreground">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar size={14} />
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <hr className="border-border mt-6" />
        </header>

        {/* Article content */}
        <div className="prose prose-slate max-w-none leading-relaxed mt-8 prose-headings:font-heading prose-headings:font-bold">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={getMarkdownComponents()}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
