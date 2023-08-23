import type { Plugin } from 'unified'
import type { Html, Root, Text } from 'mdast'
import { visit } from 'unist-util-visit'

const remarkXHtml: Plugin<[], Root> = () => {
  return (tree) => {
    // Covert HTML like tags to HTML nodes
    visit(tree, 'text', (node: Text | Html) => {
      if (node.value?.match(/^<\/?[\w_.]+(\s|>)/))
        node.type = 'html'
    })
    // Expand self-closing tags
    visit(tree, 'html', (node: Html) => {
      node.value = node.value.replace(/<([\w_.]+\b)(.*?)(\/\s*>)/sg, (_, name, args) => {
        return `<${name}${args}></${name}>`
      })
    })
    return tree
  }
}

export default remarkXHtml
