import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/features/blog/components/BlogPost'
import { getPostBySlug, getPostSlugs } from '@/features/blog/lib/posts'

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.frontmatter.title} | BYC Blog`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: 'article',
      ...(post.frontmatter.coverImage ? { images: [{ url: post.frontmatter.coverImage }] } : {}),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8ff] pt-28">
      <BlogPost post={post} />
    </main>
  )
}