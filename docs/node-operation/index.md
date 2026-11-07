---
title: ノード運用
slug: /node-operation
sidebar_position: 1
description: ノードの構築・保守・障害対応を扱います。
---

ノードの構築・更新・監視・保守・障害対応を扱うカテゴリです。
NEM(NIS1)と Symbol の手順は、対象チェーンやネットワーク、利用ソフトウェアを分けて整備していきます。

## 手順を選ぶ前に

対象ネットワーク、ノードの役割、ソフトウェアのバージョンを確認してください。
既存ノードの変更では、設定とデータのバックアップ、復旧方法、サービスへの影響も確認します。

- [Symbol のノード構築ガイド](https://docs.symboltest.net/en/userbook/shoestring/quickstart/): Symbol の構築手順を探すための参照先。
- [リファレンス](../references/index.md): 実装と関連資料を探す。
- [トラブルシューティング](../troubleshooting/index.md): 症状から調査方法を探す。

参照資料の要件やコマンドは、利用するバージョンの情報と照合してください。

## Symbol の新規構築

まず[ノード構成の選び方](symbol/node-types.mdx)で、Peer+Light API・Peer+Full APIと Voting の役割を確認してください。

[おすすめの構成](symbol/node-types.mdx#recommended-configuration)では、Ubuntu 26.04 LTS の委任受入用 Peer+Light API を紹介しています。対象環境と作業の流れを確認し、[サーバーの準備](symbol/server-preparation.mdx)から始まる7ページの構築手順へ進んでください。Peer+Full API・Voting の具体的な手順は、選び方のページから公式資料へ案内しています。

## Symbol の併設と保守

- [Mainnet と Testnet の併設](symbol/network-coexistence.mdx): 同一ホストで運用するためのポート・Docker ネットワークと、通常用・復旧用 override の設定。
- [ノードの保守](symbol/maintenance.mdx): Mainnet/Testnet 共通の日常確認、停止・再開、バックアップ、証明書更新と障害時の対応。

## NEM(NIS1) の構築と運用

Ubuntu 26.04 LTS（amd64）・NIS1 v0.6.102 を対象に、直接導入と Docker による運用を案内します。

- [セットアップ](nem/setup.mdx): 配布版の導入とサービス化。
- [ビルド](nem/build.mdx): ソースコードからのビルド。
- [Docker で動かす](nem/docker.mdx): Ubuntu 26.04 LTS でのイメージ作成と Compose による運用。
- [スーパーノード登録](nem/supernode.mdx): Servant の導入と毎月の登録。

## その他の構築・運用記事

旧 nemnesia の構築メモを移行しています。対象バージョンや未検証箇所は各記事を確認してください。

- NodeWatch: [セットアップ](nodewatch/setup.mdx)、[OpenAPI クライアント生成](../references/nodewatch-openapi.mdx)。
- [Symbol ノード証明書](../security/symbol-node-certificates.mdx)。
