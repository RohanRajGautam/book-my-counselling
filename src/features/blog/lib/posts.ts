import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

import matter from 'gray-matter'

import type { Post, PostFrontmatter } from '../types/post'
import { renderMarkdown } from './markdown'

export { DEFAULT_AUTHOR_AVATAR, DEFAULT_AUTHOR_NAME } from './constants'

const CONTENT_DIR = join(process.cwd(), 'content', 'blog')
const WORDS_PER_MINUTE = 200

type RawFrontmatter = {
  title?: unknown
  date?: unknown
  excerpt?: unknown
  coverImage?: unknown
  author?: unknown
  authorAvatar?: unknown
}

function readStringField(value: unknown, field: string, fileName: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Missing or invalid frontmatter field "${field}" in content/blog/${fileName}`,
    )
  }
  return value
}

function readOptionalStringField(
  value: unknown,
  field: string,
  fileName: string,
): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') {
    throw new Error(
      `Frontmatter field "${field}" must be a string in content/blog/${fileName}`,
    )
  }
  return value.length > 0 ? value : undefined
}

function readDateField(value: unknown, fileName: string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return readStringField(value, 'date', fileName)
}

function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

async function readPostFile(fileName: string): Promise<Post> {
  const slug = fileName.replace(/\.md$/, '')
  const filePath = join(CONTENT_DIR, fileName)
  const raw = await readFile(filePath, 'utf-8')
  const parsed = matter(raw)
  const fm = parsed.data as RawFrontmatter

  const frontmatter: PostFrontmatter = {
    title: readStringField(fm.title, 'title', fileName),
    date: readDateField(fm.date, fileName),
    excerpt: readStringField(fm.excerpt, 'excerpt', fileName),
    coverImage: readOptionalStringField(fm.coverImage, 'coverImage', fileName),
    author: readOptionalStringField(fm.author, 'author', fileName),
    authorAvatar: readOptionalStringField(fm.authorAvatar, 'authorAvatar', fileName),
  }

  return {
    slug,
    frontmatter,
    bodyHtml: renderMarkdown(parsed.content),
    readMinutes: estimateReadMinutes(parsed.content),
  }
}

export async function getAllPosts(): Promise<Post[]> {
  let files: string[]
  try {
    files = await readdir(CONTENT_DIR)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  const mdFiles = files.filter((f) => f.endsWith('.md') && f !== 'README.md')
  const posts = await Promise.all(mdFiles.map(readPostFile))
  return posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fileName = `${slug}.md`
  try {
    return await readPostFile(fileName)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw err
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((p) => p.slug)
}