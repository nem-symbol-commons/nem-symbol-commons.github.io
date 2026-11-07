import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, isAbsolute, join, relative, sep } from "node:path";
import { createElement as h } from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { ParseFrontMatter } from "@docusaurus/types";

const imageDirectory = "img/ogp/generated";
const siteTitle = "NEM & Symbol Commons";
const tagline = "NEM / Symbol の開発と運用を、日本語で。";
const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });

// 全角文字を基準に幅を見積もり、英数字の長い識別子も折り返す。
function wrapTitle(title: string, fontSize: number): string[] {
  const limit = 1000 / fontSize;
  const lines: string[] = [];
  let line = "";
  let width = 0;
  for (const { segment } of segmenter.segment(title)) {
    const size = /^[MWmw@%&]$/.test(segment) ? 1
      : /^[A-Z]$/.test(segment) ? 0.8
        : /^[\x20-\x7e]$/.test(segment) ? 0.65 : 1;
    if (width + size > limit && line) {
      lines.push(line.trim());
      line = "";
      width = 0;
    }
    line += segment;
    width += size;
  }
  if (line) lines.push(line.trim());
  return lines;
}

export function layoutTitle(title: string): { lines: string[]; fontSize: number } {
  const text = title.replace(/\s+/gu, " ").trim();
  for (const fontSize of [76, 68, 60, 52, 44]) {
    const lines = wrapTitle(text, fontSize);
    if (lines.length <= 3) return { lines, fontSize };
  }
  const lines = wrapTitle(text, 44).slice(0, 3);
  lines[2] = [...segmenter.segment(lines[2])].slice(0, -1)
    .map(({ segment }) => segment).join("") + "…";
  return { lines, fontSize: 44 };
}

export async function createOgp(siteDir: string): Promise<{
  defaultImage: string;
  parseFrontMatter: ParseFrontMatter;
}> {
  const outputDirectory = join(siteDir, "static", imageDirectory);
  const [font, logo, template] = await Promise.all([
    readFile(join(siteDir, "assets/fonts/NotoSansJP-Regular.otf")),
    readFile(join(siteDir, "static/img/Symbol_NEM_Combo_Icon.png")),
    readFile(join(siteDir, "plugins/ogp.ts")),
  ]);
  const templateHash = createHash("sha256").update(template).update(font).update(logo).digest("hex");
  await mkdir(outputDirectory, { recursive: true });
  const pending = new Map<string, Promise<string>>();

  function generate(source: string, title: string, subtitle: string): Promise<string> {
    const hash = createHash("sha256").update(JSON.stringify([templateHash, source, title, subtitle]))
      .digest("hex").slice(0, 24);
    const filename = `${source === "default" ? "default" : "article"}-${hash}.png`;
    const cached = pending.get(filename);
    if (cached) return cached;
    const result = (async () => {
      const outputPath = join(outputDirectory, filename);
      try {
        await access(outputPath);
      } catch {
        const { lines, fontSize } = layoutTitle(title);
        const svg = await satori(h("div", {
          style: {
            width: 1200, height: 630, display: "flex", flexDirection: "column",
            padding: "48px 72px", backgroundColor: "#ffffff", color: "#1c2636",
            borderTop: "12px solid #2856a3", fontFamily: "Noto Sans JP",
          },
        },
        h("div", { style: { display: "flex", width: 1056, height: 64, flexShrink: 0, alignItems: "center", gap: 20, color: "#2856a3", fontSize: 27 } },
          h("img", { src: `data:image/png;base64,${logo.toString("base64")}`, width: 64, height: 64 }),
          siteTitle),
        h("div", { style: { display: "flex", width: 1056, flexDirection: "column", justifyContent: "center", height: 348, flexShrink: 0 } },
          ...lines.map((line, index) => h("div", { key: index, style: { display: "flex", width: 1056, height: fontSize * 1.3, fontSize, lineHeight: 1.3, flexShrink: 0, whiteSpace: "pre" } }, line))),
        h("div", { style: { display: "flex", width: 1056, height: 56, flexShrink: 0, borderTop: "2px solid #dce6f5", paddingTop: 20, color: "#52657e", fontSize: 24 } }, subtitle)), {
          width: 1200, height: 630,
          fonts: [{ name: "Noto Sans JP", data: font, weight: 400, style: "normal" }],
        });
        const png = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
        // 同時に動く開発サーバー・ビルドにも完成した画像だけを見せる。
        const temporary = `${outputPath}.${randomUUID()}.tmp`;
        await writeFile(temporary, png);
        await rename(temporary, outputPath);
      }
      return `/${imageDirectory}/${filename}`;
    })().catch((cause: unknown) => {
      pending.delete(filename);
      throw new Error(`OGP画像の生成に失敗しました: ${source}`, { cause });
    });
    pending.set(filename, result);
    return result;
  }

  return {
    defaultImage: await generate("default", siteTitle, tagline),
    async parseFrontMatter(params) {
      const result = await params.defaultParseFrontMatter(params);
      const source = relative(join(siteDir, "docs"), params.filePath);
      if (source.startsWith(`..${sep}`) || source === ".." || isAbsolute(source) ||
          !/\.mdx?$/i.test(source) || result.frontMatter.image !== undefined) return result;
      const title = typeof result.frontMatter.title === "string" && result.frontMatter.title.trim()
        ? result.frontMatter.title : basename(source).replace(/\.mdx?$/i, "");
      result.frontMatter.image = await generate(source.split(sep).join("/"), title, "nem-symbol-commons.github.io");
      return result;
    },
  };
}
