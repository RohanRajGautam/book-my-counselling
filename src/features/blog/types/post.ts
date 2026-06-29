export type PostFrontmatter = {
  title: string
  date: string
  excerpt: string
  coverImage?: string
  author?: string
  authorAvatar?: string
}

export type Post = {
  slug: string
  frontmatter: PostFrontmatter
  bodyHtml: string
  readMinutes: number
}