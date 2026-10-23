# NEM & Symbol Commons

NEM / Symbol の開発者向け技術ドキュメントサイトです。
Docusaurus と TypeScript で構築し、GitHub Pages で公開しています。

公開先: [https://nem-symbol-commons.github.io/](https://nem-symbol-commons.github.io/)

## 開発環境のセットアップ

Git と [mise](https://mise.jdx.dev/getting-started) をインストールし、mise のシェル設定を済ませてください。
Node.js と pnpm は [mise.toml](mise.toml) で管理しています。
現在の設定は Node.js `24.18.1`、pnpm `latest` です。
pnpm のバージョンは固定されていないため、インストール時期によって変わる場合があります。

```bash
git clone https://github.com/nem-symbol-commons/nem-symbol-commons.github.io.git
cd nem-symbol-commons.github.io
mise trust
mise install
pnpm install --frozen-lockfile
```

依存関係の管理には pnpm を使います。
依存関係を変更する場合は `pnpm add` などを使い、`package.json` と `pnpm-lock.yaml` を一緒に更新してください。

## ローカル開発

```bash
pnpm start
```

開発サーバーが起動します。記事やコードの変更はブラウザーに反映されます。

主な編集先は次のとおりです。

- `docs/`: 技術分野別の Markdown / MDX ドキュメント。サイドバーはディレクトリ構造から自動生成します。
- `src/pages/`: トップページなどの独立したページ。
- `src/components/`、`src/css/`: 共通コンポーネントとスタイル。
- `static/`: 画像など、そのまま配信するファイル。
- `docusaurus.config.ts`: サイト情報、ナビゲーション、公開先などの設定。

記事のカテゴリ、執筆方針、PR の送り方は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
サイトの基本言語は日本語（`ja`）です。ブログ機能は現在無効にしています。

## VS Code

リポジトリのルートを VS Code で開き、拡張機能の「推奨」から、このワークスペースの推奨拡張機能をインストールしてください。
[.vscode/extensions.json](.vscode/extensions.json) で EditorConfig と MDX の拡張機能を推奨しています。
[.vscode/settings.json](.vscode/settings.json) と [.editorconfig](.editorconfig) で、UTF-8・LF・スペース 2 個のインデントを共有します。

Markdown / MDX は、表の列揃えによる過剰な空白を避けるため、保存・貼り付け・入力時の自動整形を無効にしています。
表は各セルの前後にスペースを 1 個置く程度で記述でき、列幅を揃える必要はありません。
長い行はエディターの表示上で折り返し、Markdown の改行用の行末スペースは保持します。
手動の「ドキュメントのフォーマット」や、拡張機能独自の表整形コマンドは別途動作するため、表のレイアウトを保ちたい場合は実行しないでください。

## ビルドと確認

公開用の静的ファイルを生成します。変更後はビルドが成功することを確認してください。

```bash
pnpm build
```

出力先は `build/` です。生成結果は次のコマンドでローカル確認できます。

```bash
pnpm serve
```

TypeScript の型チェックは次のコマンドで実行できます。

```bash
pnpm typecheck
```

## CI と公開

GitHub Actions でビルド確認と公開を行います。

- [ci.yml](.github/workflows/ci.yml): PR の作成・更新時に、依存関係をインストールして `pnpm build` を実行します。
- [deploy.yml](.github/workflows/deploy.yml): `main` への push 時にビルドし、`build/` を GitHub Pages に公開します。Actions 画面の `Deploy Docusaurus` から手動実行することもできます。

GitHub のリポジトリ設定で、**Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。
記事の変更を PR で確認し、`main` にマージすると自動公開されます。

## 旧サイトからの移行

旧 nemnesia の記事の移行元・移行先と修正内容は [MIGRATION.md](MIGRATION.md) を参照してください。
各記事に記載した移行時の検証範囲と、旧原稿の対象時期を確認して利用してください。
