import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import BlogCard from "@/components/blog/BlogCard";

// This section is statically generated. New published blog posts
// appear here after you click Publish in the admin panel.

async function getLatestPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`, {
      // Homepage is force-static, so this fetch only runs at build time
      // or when the Publish button triggers revalidation
      cache: "force-cache",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const posts = json?.data || [];

    return posts.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export default async function Blog() {
  const posts = await getLatestPosts();

  return (
    <section id="blog" className="bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Latest Articles"
          subtitle="Thoughts on web development, tools, and the craft of building software"
        />

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="/blog"
                className="border border-portfolio-accent text-portfolio-accent rounded-lg px-6 py-3 font-medium transition-colors duration-200 hover:bg-portfolio-accent hover:text-white"
              >
                View All Articles →
              </Link>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center mt-12">
            No articles published yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
