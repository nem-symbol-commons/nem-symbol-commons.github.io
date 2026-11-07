import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createOgp, layoutTitle } from "../plugins/ogp.ts";

const repository = fileURLToPath(new URL("../", import.meta.url));
let siteDir;
let ogp;

before(async () => {
  siteDir = await mkdtemp(join(tmpdir(), "commons-ogp-"));
  for (const path of ["assets/fonts", "static/img", "plugins", "docs"]) {
    await mkdir(join(siteDir, path), { recursive: true });
  }
  for (const path of ["assets/fonts/NotoSansJP-Regular.otf", "static/img/Symbol_NEM_Combo_Icon.png"]) {
    await symlink(join(repository, path), join(siteDir, path));
  }
  await copyFile(join(repository, "plugins/ogp.ts"), join(siteDir, "plugins/ogp.ts"));
  ogp = await createOgp(siteDir);
});

after(async () => { if (siteDir) await rm(siteDir, { recursive: true, force: true }); });

async function parse(source, frontMatter) {
  return ogp.parseFrontMatter({
    filePath: join(siteDir, source), fileContent: "本文",
    defaultParseFrontMatter: async () => ({ frontMatter: { ...frontMatter }, content: "本文" }),
  });
}

test("共通画像は1200×630のPNGで、再起動しても同じURLとファイルを使う", async () => {
  const path = join(siteDir, "static", ogp.defaultImage);
  const png = await readFile(path);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const previous = await stat(path);
  assert.equal((await createOgp(siteDir)).defaultImage, ogp.defaultImage);
  assert.equal((await stat(path)).mtimeMs, previous.mtimeMs);
});

test("記事の追加・タイトル変更・同名記事を区別し、元のFront Matterと本文を保つ", async () => {
  const original = { title: "Symbolノード構築：Ubuntu 24.04", description: "概要" };
  const a = await parse("docs/symbol/setup.mdx", original);
  const b = await parse("docs/nem/setup.md", original);
  const changed = await parse("docs/symbol/setup.mdx", { ...original, title: "更新した記事" });
  assert.notEqual(a.frontMatter.image, b.frontMatter.image);
  assert.notEqual(a.frontMatter.image, changed.frontMatter.image);
  assert.equal(a.frontMatter.image, (await parse("docs/symbol/setup.mdx", original)).frontMatter.image);
  assert.equal(original.image, undefined);
  assert.equal(a.content, "本文");
  assert.equal(a.frontMatter.description, "概要");
  await stat(join(siteDir, "static", a.frontMatter.image));
  assert.ok((await parse("docs/without-title.md", {})).frontMatter.image);
});

test("手動指定の画像とdocs以外のMarkdownを変更しない", async () => {
  for (const image of ["/img/custom.png", "https://example.com/image.png", "./custom.png"]) {
    assert.equal((await parse("docs/manual.md", { image })).frontMatter.image, image);
  }
  assert.equal((await parse("README.md", { title: "説明" })).frontMatter.image, undefined);
});

test("長い日本語と英数字のタイトルを縮小し、極端に長い場合のみ省略する", () => {
  const short = layoutTitle("Symbol SDK入門");
  assert.equal(short.fontSize, 76);
  const title = "SymbolノードをUbuntu 24.04で構築し、HTTPSと証明書を設定する手順とバックアップの取得、定期的な保守作業まで解説します";
  const long = layoutTitle(title);
  assert.ok(long.fontSize < 76);
  assert.ok(long.lines.length <= 3);
  assert.equal(long.lines.join(""), title);
  const identifier = layoutTitle("W".repeat(60));
  assert.ok(identifier.fontSize < 76);
  assert.equal(identifier.lines.join(""), "W".repeat(60));
  const extreme = layoutTitle("日本語タイトルとVeryLongIdentifier".repeat(50));
  assert.equal(extreme.fontSize, 44);
  assert.equal(extreme.lines.length, 3);
  assert.ok(extreme.lines[2].endsWith("…"));
});
