import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { LoadContext, Plugin } from "@docusaurus/types";

export type ArticleDates = {
  publishedAt: string | null;
  updatedAt: string | null;
};

type Content = Record<string, ArticleDates>;

export function readArticleDates(siteDir: string): Content {
  function git(args: string[]): string {
    return execFileSync("git", args, { cwd: siteDir, encoding: "utf8" }).trim();
  }

  if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
    throw new Error("記事の日時には Git の全履歴が必要です。checkout の fetch-depth を 0 にしてください。");
  }

  function readDirectory(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return readDirectory(path);
      return entry.isFile() && /\.mdx?$/i.test(entry.name) ? [path] : [];
    });
  }

  return Object.fromEntries(readDirectory(join(siteDir, "docs")).map((filePath) => {
    const path = relative(siteDir, filePath);
    const commits = git(["log", "--follow", "--format=%cI", "--", path])
      .split("\n").filter(Boolean);
    return [
      `@site/${path.split(sep).join("/")}`,
      { publishedAt: commits.at(-1) ?? null, updatedAt: commits[0] ?? null },
    ];
  }));
}

export default function articleDatesPlugin({ siteDir }: LoadContext): Plugin<Content> {
  return {
    name: "commons-article-dates",
    getPathsToWatch: () => [join(siteDir, "docs/**/*.{md,mdx}")],
    loadContent: () => readArticleDates(siteDir),
    contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
