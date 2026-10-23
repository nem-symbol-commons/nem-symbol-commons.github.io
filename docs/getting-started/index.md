---
title: NEM & Symbol Commonsについて
sidebar_label: このサイトについて
slug: /getting-started
sidebar_position: 1
description: NEM & Symbol Commons の目的、対象読者、記事の読み方と学習ルートを紹介します。
---

NEM & Symbol Commons は、NEM（NIS1）と Symbol の開発・運用に必要な知識を、日本語で共有するドキュメントサイトです。
公式仕様や実装への入口と、実際に試せる手順をつなぐことを目指します。

## 対象読者

- NEM / Symbol を使ったアプリケーションを作りたい方。
- API や SDK を使って、アカウントやトランザクションを調べたい方。
- ノードの構築・保守や、プロトコルの実装を理解したい方。
- 学んだことや調査結果を、再利用できる記事として共有したい方。

プログラム例は、言語・ツール・バージョン・ネットワークなどの前提を記事ごとに記載します。
初めて送信を試すときは、Mainnet の資産を使わず、Testnet 用に作成した専用アカウントを使ってください。

## 最初に読む記事

1. [開発者向けリンク集](../references/developer-links.md)で一次資料と実装を見つける。
2. [NEMとSymbolの違い](../common/nem-and-symbol.md)で、対象チェーンを区別する。
3. [基本用語](glossary.md)で、アカウント・モザイク・ハーベストなどを確認する。
4. [ネットワーク情報一覧](../references/networks.md)で、接続先と識別子を確認する。
5. [Symbol](../symbol/quickstart.md)または [NEM](../nem/quickstart.md) のクイックスタートを試す。
6. [REST APIの基本](../references/rest-api.md)で、レスポンスやエラーの読み方を確認する。

## 技術分野から探す

- [Symbol](../symbol/index.md): Symbol 固有の仕様と開発。
- [NEM（NIS1）](../nem/index.md): NIS1 固有の仕様と開発。
- [共通技術・比較](../common/index.md): 両チェーンの比較や暗号技術。
- [ノード運用](../node-operation/index.md): 構築・更新・保守・障害対応。
- [プロトコル](../protocol/index.md): P2P 通信、バイナリ形式、ファイナライズ。
- [セキュリティ](../security/index.md): 鍵管理と安全な運用。
- [トラブルシューティング](../troubleshooting/index.md): 症状別の原因調査。
- [リファレンス](../references/index.md): API・SDK・外部資料。

カテゴリの入口だけを用意している分野もあります。具体的な解説は順次追加します。

## 記事を利用するとき

NEM（NIS1）と Symbol は別のチェーンです。同じ名称の機能でも、API、データ形式、署名方式が一致するとは限りません。
記事の対象チェーンとバージョンを確認し、Testnet の再構築や API の更新があった場合は参照資料と照合してください。

ノードから取得した情報は、そのノードが返した観測結果です。REST の応答だけで、チェーンの状態を暗号学的に独立検証したことにはなりません。
記事では、実装で確認した事項、通信で確認した事項、未実行の手順を区別して記載します。

## 記事の改善に参加する

誤字、リンク切れ、古いコード例などは、[Issue](https://github.com/nem-symbol-commons/nem-symbol-commons.github.io/issues) で報告できます。
修正や記事の追加は [コントリビューションガイド](https://github.com/nem-symbol-commons/nem-symbol-commons.github.io/blob/main/CONTRIBUTING.md) を参照してください。
報告には対象ページ、利用したバージョン、再現条件を添え、秘密鍵や認証情報は含めないでください。
