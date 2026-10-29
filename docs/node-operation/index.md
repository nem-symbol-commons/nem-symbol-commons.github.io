---
title: ノード運用
slug: /node-operation
sidebar_position: 1
description: ノードの構築・保守・障害対応を扱います。
---

ノードの構築・更新・監視・保守・障害対応を扱うカテゴリです。
NEM（NIS1）と Symbol の手順は、対象チェーンやネットワーク、利用ソフトウェアを分けて整備していきます。

## 手順を選ぶ前に

対象ネットワーク、ノードの役割、ソフトウェアのバージョンを確認してください。
既存ノードの変更では、設定とデータのバックアップ、復旧方法、サービスへの影響も確認します。

- [Symbol のノード構築ガイド](https://docs.symboltest.net/en/userbook/shoestring/quickstart/): Symbol の構築手順を探すための参照先。
- [リファレンス](../references/index.md): 実装と関連資料を探す。
- [トラブルシューティング](../troubleshooting/index.md): 症状から調査方法を探す。

参照資料の要件やコマンドは、利用するバージョンの情報と照合してください。

## 構築・運用の移行記事

旧 nemnesia の構築メモを移行しています。対象バージョンや未検証箇所は各記事を確認してください。

- NEM（NIS1）: [セットアップ](nem/setup.mdx)、[ビルド](nem/build.mdx)、[スーパーノード登録の旧手順](nem/supernode.mdx)。
- Symbol: [Shoestring の導入メモ（未完）](symbol/shoestring.mdx)、[Explorer のインストール](symbol/explorer.mdx)。
- NodeWatch: [セットアップ](nodewatch/setup.mdx)、[OpenAPI クライアント生成](../references/nodewatch-openapi.mdx)。
- [Symbol ノード証明書](../security/symbol-node-certificates.mdx)。
