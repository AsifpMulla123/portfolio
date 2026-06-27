import BlogList from "@/components/blog/BlogList";

export const metadata = {
  title: "Blog",
  description:
    "Articles on full stack development, Next.js, MongoDB, and software engineering best practices by Asif.",
};

export const dynamic = "force-static";

async function getAllPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="bg-background min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl text-foreground">
            Blog
          </h1>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Thoughts on web development, tools, and the craft of building
            software.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            {posts.length} {posts.length === 1 ? "article" : "articles"}{" "}
            published
          </p>
        </div>

        {posts.length > 0 ? (
          <BlogList posts={posts} />
        ) : (
          <p className="text-muted-foreground text-center py-12">
            No articles published yet. Check back soon.
          </p>
        )}
      </div>
    </main>
  );
}
