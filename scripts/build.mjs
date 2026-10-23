// 開発サーバーの生成ファイルを本番用の内容で上書きしない。
process.env.DOCUSAURUS_GENERATED_FILES_DIR_NAME ??= ".docusaurus/build";
process.argv.splice(2, 0, "build");

await import("@docusaurus/core/bin/docusaurus.mjs");
