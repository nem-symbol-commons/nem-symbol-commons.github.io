---
title: Symbol
slug: /symbol
sidebar_position: 1
description: Symbol 固有の仕様とアプリケーション開発を扱います。
---

Symbol のアカウント、トランザクション、モザイク、ネームスペースなどの仕様と開発手順を調べられます。

## 調べるための入口

- [Symbol Documentation](https://docs.symbol.dev/): 技術解説や開発ガイドを探す。
- [Symbol のソースコード](https://github.com/symbol/symbol): 実装や変更履歴を確認する。
- [リファレンス](../references/index.md): API・SDK の資料を探す。

ノードの構築・保守は [ノード運用](../node-operation/index.md)、通信やデータ形式は [プロトコル](../protocol/index.md) で扱います。

## 最初に試す

[Testnetへの接続](quickstart.md)で、`curl` を使ってノードの稼働状態とブロック高を確認します。

## SDK入門

TypeScript（Node.js）と Python で、環境構築から署名・送信、各種機能、検証まで学びます。
対象は `symbol-sdk@3.3.3` と `symbol-sdk-python==3.3.3` です。

1. [環境構築](sdk/environment.mdx)
2. [アカウント](sdk/accounts.mdx)
3. [トランザクション](sdk/transactions.mdx)
4. [モザイク](sdk/mosaic.mdx)
5. [ネームスペース](sdk/namespace.mdx)
6. [メタデータ](sdk/metadata.mdx)
7. [ロック](sdk/lock.mdx)
8. [マルチシグ](sdk/multisig.mdx)
9. [監視](sdk/observer.mdx)
10. [制限](sdk/restriction.mdx)
11. [オフライン署名](sdk/offline-signature.mdx)
12. [検証](sdk/verify.mdx)

[学習用アカウントの準備](sdk/learning-accounts.mdx)で、各章で使うアカウントを作成します。
