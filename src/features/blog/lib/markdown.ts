import { marked } from 'marked'

export function renderMarkdown(body: string): string {
  const result = marked.parse(body, { async: false })
  return typeof result === 'string' ? result : ''
}