import type { Metadata } from 'next'

import { BlogList } from '@/features/blog/components/BlogList'
import { getAllPosts } from '@/features/blog/lib/posts'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Blog | Book Your Counselling',
  description:
    'Insights, guidance, and stories from the BYC team on applications, scholarships, and study abroad decisions.',
}

export default async function BlogPage() {
  redirect('/')
  const posts = await getAllPosts()

  // return (
  //   <main className="m-auto min-h-screen max-w-7xl overflow-hidden bg-[#f7f8ff] px-4 pt-28 pb-20">
  //     <BlogList posts={posts} />
  //   </main>
  // )
}
