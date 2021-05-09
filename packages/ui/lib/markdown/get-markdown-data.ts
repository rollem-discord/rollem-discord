import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { chain, flatMapDeep, sortBy } from "lodash";


const markdownDirectory = path.join(process.cwd(), "markdown");

export interface MarkdownData {
  id: string;
  route: string[];
  layout: "default";
  title: string;
  parent: string;
  nav_order: number;
  permalink: string;
}

export interface MarkdownDataTree {
  id: string;
  route: string[];
  item: MarkdownData;
  children?: MarkdownDataTree[];
}

/** Gets the markdown data. Sorted. Recursive. */
export function getSortedMarkdownData(): MarkdownDataTree[] {
  const markdown = getSortedMarkdownDataInternal(markdownDirectory);
  markdown.forEach(v => v.route.unshift('markdown'));
  return markdown;
}

/** Gets the markdown data from a specific folder. Sorted. Recursive. */
function getSortedMarkdownDataInternal(
  directoryName: string,
  parentRoute: string[] = []
): MarkdownDataTree[] {
  const fileNames = fs.readdirSync(directoryName);
  // console.log(fileNames);
  return fileNames
    .map((fileName) => {
      const pathId = fileName.replace(/\.md$/, "");
      const fullPath = path.join(directoryName, fileName);
      const pathStats = fs.lstatSync(fullPath);
      const route = [...parentRoute, pathId];
      if (pathStats.isDirectory()) {
        const children = getSortedMarkdownDataInternal(fullPath, route);
        const childrenSorted = sortBy(children, (d) => d.item.nav_order);
        const indexDoc = tryGetSingleMarkdownData(
          path.join(directoryName, fileName),
          route
        );
        return {
          id: pathId,
          route: route,
          item: indexDoc,
          children: childrenSorted,
        };
      } else {
        if (parentRoute.length > 0 && pathId === "index") {
          // the root index route
          return null;
        }

        return {
          id: pathId,
          route: route,
          item: tryGetSingleMarkdownData(directoryName, parentRoute, fileName),
          children: null,
        };
      }
    })
    .filter((v) => !!v);
}

export function tryGetSingleMarkdownData(
  directoryName: string,
  parentRoute: string[] = [],
  fileName: string = "index.md"
): MarkdownData {
  const pathId = fileName.replace(/\.md$/, "");
  const fullRoute = [
    ...parentRoute,
    ...(fileName !== "index.md" ? [pathId] : []),
  ];
  const fullFilePath = path.join(directoryName, fileName);
  const pathStats = fs.lstatSync(fullFilePath);
  if (!pathStats.isFile()) {
    return null;
  }

  const fileContents = fs.readFileSync(fullFilePath, "utf8");
  const matterResult = matter(fileContents);

  return <MarkdownData>(<undefined>{
    id: pathId,
    route: fullRoute,
    fullFilePath: fullFilePath,
    ...(matterResult.data as { date: string; title: string }),
  });
}

export function getAllMarkdownIds() {
  const docData = getSortedMarkdownData();
  const flattenedDocData = flatMapDeep(docData);
  const flat2 = [
    ...chain(flattenedDocData)
      .map((v) => v?.item)
      .filter((v) => !!v)
      .value(),
    ...chain(flattenedDocData)
      .flatMap((v) => v?.children)
      .map((v) => v?.item)
      .filter(v => !!v)
      .value(),
  ];
  return flat2
    .filter((v) => !!v)
    .map((docData) => {
      return {
        params: {
          id: docData.route,
        },
      };
    });
}

export async function getMarkdownData(id: string[]) {
  id = id.filter((v) => v !== "." && v !== "..");
  const fileContents = getPathContents(id);

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id and contentReact
  const result = {
    id,
    content: matterResult.content,
    ...(matterResult.data as { date: string; title: string }),
  };

  delete result["orig"];

  return result;
}

function getPathContents(id: string[]): string {
  id = id.filter((v) => v !== "." && v !== "..");
  if (id.length > 0) {
    const childPath = path.join(markdownDirectory, ...id) + ".md";
    if (fs.existsSync(childPath)) {
      if (fs.statSync(childPath).isFile()) {
        return fs.readFileSync(childPath, "utf8");
      }
    }
  }

  const indexPath = path.join(markdownDirectory, ...id, "index.md");
  if (fs.existsSync(indexPath)) {
    if (fs.statSync(indexPath).isFile()) {
      return fs.readFileSync(indexPath, "utf8");
    }
  }

  throw new Error(`404: ${indexPath}`);
}

export function makePropsAllMarkdownData(): { allMarkdownData: MarkdownDataTree[] } {
  return {
    allMarkdownData: getSortedMarkdownData(),
  };
}
