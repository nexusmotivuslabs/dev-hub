import { notFound } from 'next/navigation'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Force dynamic rendering for serverless environments (Vercel)
// This ensures file system operations work correctly at runtime
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface PageProps {
  params: {
    slug: string[]
  }
}

async function getMarkdownContent(slug: string[]) {
  // Decode URL-encoded segments (handles spaces, special characters, etc.)
  const decodedSlug = slug.map(segment => decodeURIComponent(segment))
  
  try {
    const filePath = join(process.cwd(), 'content', ...decodedSlug) + '.md'
    const fileContents = await readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    return { frontmatter: data, content }
  } catch (error) {
    // Try as directory with README.md
    try {
      const filePath = join(process.cwd(), 'content', ...decodedSlug, 'README.md')
      const fileContents = await readFile(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      return { frontmatter: data, content }
    } catch (error2) {
      return null
    }
  }
}

export default async function MarkdownPage({ params }: PageProps) {
  const content = await getMarkdownContent(params.slug)

  if (!content) {
    notFound()
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 w-full max-w-none">
      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none w-full">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  // This would need to be implemented to generate static paths
  // For now, we'll use dynamic rendering
  return []
}




