# nemnesia からの記事移行

移行元: [nemnesia/docusaurus-nemnesia-com](https://github.com/nemnesia/docusaurus-nemnesia-com)

対象コミット: `12613f6f012b7a8b224b89cc3baa617e1413a79b`（2025-12-13）。移行元は非公開リポジトリのため、参照には閲覧権限が必要です。

本文の原稿を 17 本移行し、Commons の既存記事とカテゴリに接続しました。旧サイトのトップページ・空の導入ページ・サイト設定・サンプル画像は移行対象外です。

## 移行先一覧

| 移行元のファイル | 移行先 |
| --- | --- |
| `docs-sym/symbol-sdk-symbol/01_はじめに.mdx` | [docs/symbol/sdk/introduction.mdx](docs/symbol/sdk/introduction.mdx) |
| `docs-sym/symbol-sdk-symbol/02_環境構築.mdx` | [docs/symbol/sdk/environment.mdx](docs/symbol/sdk/environment.mdx) |
| `docs-sym/symbol-sdk-symbol/03_アカウント.mdx` | [docs/symbol/sdk/accounts.mdx](docs/symbol/sdk/accounts.mdx) |
| `docs-sym/symbol-sdk-symbol/04_学習用アカウントの準備.mdx` | [docs/symbol/sdk/learning-accounts.mdx](docs/symbol/sdk/learning-accounts.mdx) |
| `docs-sym/symbol-sdk-symbol/05_トランザクション.mdx` | [docs/symbol/sdk/transactions.mdx](docs/symbol/sdk/transactions.mdx) |
| `docs-nem/memo/nem-webscoket.mdx` | [docs/nem/websocket.mdx](docs/nem/websocket.mdx) |
| `docs-nem/nem-node-setup/NEM_NIS1_ノードのセットアップ.mdx` | [docs/node-operation/nem/setup.mdx](docs/node-operation/nem/setup.mdx) |
| `docs-nem/nem-node-setup/NEM_NIS1_ノードのビルド.mdx` | [docs/node-operation/nem/build.mdx](docs/node-operation/nem/build.mdx) |
| `docs-nem/nem-node-setup/NEMスーパーノードプログラム.mdx` | [docs/node-operation/nem/supernode.mdx](docs/node-operation/nem/supernode.mdx) |
| `docs-sym/memo/nodewatch-setup.mdx` | [docs/node-operation/nodewatch/setup.mdx](docs/node-operation/nodewatch/setup.mdx) |
| `docs-sym/memo/nodewatch-openapi.mdx` | [docs/references/nodewatch-openapi.mdx](docs/references/nodewatch-openapi.mdx) |
| `docs-sym/memo/pyenv-install.mdx` | [docs/node-operation/tools/pyenv.mdx](docs/node-operation/tools/pyenv.mdx) |
| `docs-sym/memo/python-uv.mdx` | [docs/node-operation/tools/uv.mdx](docs/node-operation/tools/uv.mdx) |
| `docs-sym/memo/zram.mdx` | [docs/node-operation/tools/zram.mdx](docs/node-operation/tools/zram.mdx) |
| `docs-sym/memo/shoestring-setup.mdx` | [docs/node-operation/symbol/shoestring.mdx](docs/node-operation/symbol/shoestring.mdx) |
| `docs-sym/memo/symbol-explorer-setup.mdx` | [docs/node-operation/symbol/explorer.mdx](docs/node-operation/symbol/explorer.mdx) |
| `docs-sym/memo/symbol-certs.mdx` | [docs/security/symbol-node-certificates.mdx](docs/security/symbol-node-certificates.mdx) |

## 移行時の編集

- 記事を技術分野ごとに配置し、タイトル・slug・カテゴリ順序・内部リンクを Commons 用に変更。旧 SDK 入門は独立した連載として保持し、既存クイックスタートへの入口も追加。
- TypeScript / JavaScript の SDK を 3.3.3 に固定。秘密鍵・ニーモニックのログ出力と原稿の部分的な秘密値を削除し、学習用の定数クラスは手元のファイルから読み込む構成に変更。
- NEM WebSocket は NIS v0.6.102 の実装に照合し、SockJS の `/messages` と `@stomp/stompjs` を使う形へ修正。トランザクション購読例にはアドレスの監視登録を追加。
- NodeWatch は設定ファイルを絶対パスで参照し、timer / service の名称を統一。不足していた日次 timer を追加。証明書共有によるフォーク耐性についての未確認の断定を削除。
- uv の環境確認コマンド、Explorer の service 名、SDK 入門の期限・ハッシュ表示と一部の説明を修正。未完成のアナウンス節は現行クイックスタートへのリンクに置き換え。
- Shoestring は導入途中のメモとして明示し、未整備の構築工程を完了済みとして扱わない。スーパーノード登録は旧手順と明記し、現行の参加条件・登録先を未確認のまま断定しない。

## 検証範囲

Docusaurus のビルド・型チェックを実施し、移行した MDX とカテゴリを確認しています。
SDK 3.3.3 で、TypeScript のアカウント生成・導出の例、同じニーモニックからの 4 アカウントの再現、転送の構築・署名検証を実行しました。
WebSocket のライブラリ import と未接続クライアント生成、OpenSSL の新規証明書発行と `openssl verify` を一時ディレクトリで実行しました。構築用コマンドは本番サーバーでは実行せず、未検証の手順は各記事に記載します。

移行は原稿を現行構成で参照できる状態にする作業です。NIS1・NodeWatch・Explorer・Shoestring のフルセットアップや、Python / Dart の各コード例をすべて現行環境で検証したことは意味しません。

## 続けて整備する内容

- SDK 入門の言語ごとの依存バージョンと実行手順。
- NodeWatch の fork / ブランチと現行 upstream の差分。
- Shoestring の構築・起動・同期確認。
- NIS1 の構築例とスーパーノードの現行条件。
- 旧ページの URL を旧ドメインから転送する場合は、旧ホスト側で別途リダイレクトを設定する。
