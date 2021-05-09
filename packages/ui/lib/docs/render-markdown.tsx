import React from "react";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import remarkGfm from "remark-gfm";

function transformLinkUri(relativeBase: string = '/docs/') {
  return function(uri: string) {
    if (uri.startsWith('./')) {
      const relativePath = uri.substr(2);
      uri = relativeBase + relativePath;
    }

    return uriTransformer(uri);
  }
}

export function renderMarkdown(markdown: string, baseUrl: string = '/docs/') {
  return <ReactMarkdown plugins={[remarkGfm]} children={markdown} transformLinkUri={transformLinkUri(baseUrl)}></ReactMarkdown>;
}