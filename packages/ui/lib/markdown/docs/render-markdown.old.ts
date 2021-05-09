import remark from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export async function renderMarkdown(markdown: string): Promise<string> {
  const processedContent = await remark()
    .use(html)
    .use(remarkGfm)
    .process(markdown);

  return processedContent.toString();
}