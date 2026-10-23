---
title: 開発者向けリンク集
sidebar_position: 2
description: NEM / Symbol の技術資料、実装、SDK、REST API、Explorer、ノード一覧への入口。
---

目的に合わせて資料を探すためのリンク集です。**リンク確認日: 2026-10-23**。
仕様・実装の一次資料と、コミュニティ運営のツールを分けています。外部サービスの稼働や対応バージョンは変わるため、利用時にも確認してください。

## まず選ぶ資料

| 目的 | NEM（NIS1） | Symbol |
| --- | --- | --- |
| API のパスと JSON を調べる | [NIS API 資料](https://nemproject.github.io/) | [REST OpenAPI v1.0.4](https://symbol.github.io/symbol-openapi/v1.0.4/) |
| 開発手順・用語を調べる | [NEM Docs](https://docs.nemtest.net/en/) | [Symbol Docs](https://docs.symboltest.net/en/) |
| 実装と変更履歴を調べる | [NemProject/nem](https://github.com/NemProject/nem) | [symbol/symbol](https://github.com/symbol/symbol) |
| JavaScript で署名する | [共通 SDK の NEM 実装](https://github.com/symbol/symbol/tree/main/sdk/javascript/src/nem) | [共通 SDK の Symbol 実装](https://github.com/symbol/symbol/tree/main/sdk/javascript/src/symbol) |

NEM Docs は WIP として公開されています。旧 [NIS API 資料](https://nemproject.github.io/)は Version 1.22・2018 年の資料であり、現在のノード構築要件や手数料の唯一の根拠にはしないでください。
Symbol の [従来のドキュメント](https://docs.symbol.dev/)にも SDK や Bootstrap の古い世代の説明が含まれます。
サンプルのパッケージ名だけで判断せず、バージョンと import の形式を確認してください。

## SDK と API の実装

- [JavaScript SDK](https://github.com/symbol/symbol/tree/main/sdk/javascript): `symbol-sdk`。NEM と Symbol の両方に対応し、`symbol-sdk/nem` と `symbol-sdk/symbol` を使い分けます。
- [Python SDK](https://github.com/symbol/symbol/tree/main/sdk/python): 両チェーンのモデルや署名処理を確認するための実装。
- [symbol-sdk 3.3.3](https://www.npmjs.com/package/symbol-sdk/v/3.3.3): このサイトのクイックスタートで検証した JavaScript SDK の公開版。npm のページにアクセスできない場合は [公開メタデータ](https://registry.npmjs.org/symbol-sdk/3.3.3)で版と配布情報を確認できます。
- [REST 実装](https://github.com/symbol/symbol/tree/main/client/rest): Symbol REST のルート、検証、設定を調べる入口。
- [Symbol OpenAPI ソース](https://github.com/symbol/symbol-openapi): REST のスキーマと変更履歴。
- [NEM SDK の旧実装](https://github.com/QuantumMechanics/NEM-sdk): `nem-sdk` を使う既存記事を読む場合の参照先。このサイトのクイックスタートでは使用しません。

SDK は主にデータ構築・署名・シリアライズを担います。このサイトの JavaScript 例では、ノードへの HTTP 通信を Node.js の `fetch` で別に実装します。

## ネットワーク設定とノード運用

- [Symbol Mainnet 設定](https://github.com/symbol/networks/blob/mainnet/resources/config-network.properties): Generation Hash Seed、時刻基準、通貨モザイク ID など。
- [Symbol Testnet（sai）設定](https://github.com/symbol/networks/blob/sai/resources/config-network.properties): Mainnet の値を流用せず、Testnet 用の値を確認します。
- [Shoestring](https://github.com/symbol/product/tree/dev/tools/shoestring): Symbol ノード構築ツールの実装。
- [Shoestring の構築ガイド](https://docs.symboltest.net/en/userbook/shoestring/quickstart/): `mainnet` / `sai` のパッケージ選択と構築手順。
- [NIS1 ノード構築ガイド](https://docs.nemtest.net/en/userbook/node/install/): NEM の構築と保守。

ノードの公開 API に接続する例と、自分でノードを構築する手順は別です。接続先の選び方と主要ポートは [ネットワーク情報一覧](networks.md) にまとめています。

## Explorer・ノード一覧・Faucet

以下は外部運営のツールです。Explorer はアドレスやトランザクションを表示するサービスであり、REST API の接続先とは限りません。
Faucet は Testnet 用の通貨を受け取るためのサービスです。秘密鍵を入力する必要はありません。

| ツール | 対象 | 用途 |
| --- | --- | --- |
| [Symbol Explorer](https://symbol.fyi/) | Symbol Mainnet | ブロック・アカウント・トランザクションの表示 |
| [Symbol Testnet Explorer](https://testnet.symbol.fyi/) | Symbol Testnet | 開発時の送信結果の確認 |
| [NEM Explorer](https://nem.fyi/) | NEM Mainnet | ブロック・アカウント・トランザクションの表示 |
| [NEM Testnet Explorer](https://testnet.nem.fyi/) | NEM Testnet | XEM 送信やブロックの確認、ノード探索 |
| [Symbol ノード一覧](https://symbolnodes.org/nodes/) | Symbol Mainnet | 接続候補の探索 |
| [Symbol Testnet ノード一覧](https://symbolnodes.org/nodes_testnet/) | Symbol Testnet | Testnet の REST 対応ノードの探索 |
| [NEM ノード一覧](https://nemnodes.org/) | NEM Mainnet | NIS 接続候補の探索 |
| [XYM Faucet](https://testnet.symbol.tools/) | Symbol Testnet | テスト用 XYM の入手 |
| [XEM Faucet](https://testnet.nem.tools/) | NEM Testnet | テスト用 XEM の入手 |

Explorer のページ表示と、全機能・検索結果の正常性は別です。ここではページへのアクセスまでを確認し、Faucet のログインや払い出しは実行していません。

## このサイトの実践記事

- [Symbol開発クイックスタート](../symbol/quickstart.md)
- [NEM開発クイックスタート](../nem/quickstart.md)
- [REST APIの基本](rest-api.md)

リンクの追加・修正を提案するときは、対象チェーン、対応バージョン、運営主体、資料の用途を添えてください。
