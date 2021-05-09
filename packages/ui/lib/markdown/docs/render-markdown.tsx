import { inspect } from "util";
import React, { ReactElement } from "react";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import { Components, ReactBaseProps, ReactMarkdownProps } from "react-markdown/src/ast-to-react";
import remarkGfm from "remark-gfm";
import { first, fromPairs } from "lodash";
import { Button } from "@material-ui/core";

function transformLinkUri(relativeBase: string = '/docs/') {
  return function(uri: string) {
    if (uri.startsWith('./')) {
      const relativePath = uri.substr(2);
      uri = relativeBase + relativePath;
    }

    return uriTransformer(uri);
  }
}

const components: Components = {
  a: ({
    node,
    children,
    href,
    title,
    ...props
  }: ReactBaseProps & ReactMarkdownProps & { href: string; title: string }) => {
    // if the first child of the button is a bold element, make this a CTA button
    if ((first(children) as ReactElement)?.type === "strong") {
      const splitTitle = (title ?? '').split(' ');
      const titleAttrEntries = splitTitle.filter(t => t.includes(':'));
      const remainingTitleEntries = splitTitle.filter(t => !t.includes(':'));
      const finalTitle = remainingTitleEntries.join(' ');
      const titleAttrPairs = titleAttrEntries.map(te => te.split(':'))
      const titleAttrs = fromPairs(titleAttrPairs);
      return (
        <Button variant="contained" href={href} title={finalTitle} {...props} {...titleAttrs}>
          {children}
        </Button>
      );
    }

    return <a href={href} title={title} children={children} {...props}></a>;
  },
};

export function renderDocsMarkdown(markdown: string) {
  return (
    <ReactMarkdown
      className="markdown"
      plugins={[remarkGfm]}
      children={markdown}
      components={components}
      transformLinkUri={transformLinkUri()}/>
  );
}