/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'
import rehypeRaw from 'rehype-raw'
import rehypeFormat from 'rehype-format'
import rehypeVueSfc from 'rehype-vue-sfc'
import remarkXHtml from '../src'

describe('should', async () => {
  const files = import.meta.glob('./fixtures/*.md', { as: 'raw' })

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkXHtml)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShikiji, { themes: { dark: 'vitesse-dark', light: 'vitesse-light' } })
    .use(rehypeFormat)
    .use(rehypeVueSfc)
    .use(rehypeFormat)
    .use(rehypeStringify, { allowDangerousHtml: true })

  for (const [file, read] of Object.entries(files)) {
    it(file, async () => {
      const content = await read()
      const result = await processor.process(content)

      await expect(String(result)).toMatchFileSnapshot(
        file.replace(/\.md$/, '.output.vue'),
      )
    })
  }
})
