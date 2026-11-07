---
title: NEM(NIS1)
slug: /nem
sidebar_position: 1
description: NEM(NIS1)の仕様と、TypeScript・Pythonによるアプリケーション開発。
---

NEM(NIS1)のアカウント、トランザクション、モザイク、マルチシグなどを学びます。
ノードの構築・運用は[ノード運用](../node-operation/nem/setup.mdx)、Symbolとの仕様差は[共通技術・比較](../common/nem-and-symbol.md)を参照してください。

## 最初に試す

[Testnetへの接続](testnet-connection.md)で、SDKを使わずにNISの稼働・同期状態とブロック高を確認します。

## SDK入門

TypeScript（Node.js）とPythonで、SDK `symbol-sdk@3.3.3`／`symbol-sdk-python==3.3.3` のNEM APIを使います。

1. [環境構築](sdk/environment.mdx)
2. [アカウント](sdk/accounts.mdx)
3. [トランザクション](sdk/transactions.mdx)
4. [メッセージ](sdk/messages.mdx)
5. [モザイク](sdk/mosaic.mdx)
6. [ネームスペース](sdk/namespace.mdx)
7. [マルチシグ](sdk/multisig.mdx)
8. [委任ハーベスティング](sdk/harvesting.mdx)
9. [監視](sdk/observer.mdx)
10. [オフライン署名](sdk/offline-signature.mdx)
11. [検証](sdk/verify.mdx)

[学習用アカウントの準備](sdk/learning-accounts.mdx)で、各章で使うアカウントを作成します。
イベント通知の接続・購読は [監視のWebSocket通知](sdk/observer.mdx#93-websocket通知)で確認できます。

## 参照資料

- [NIS API](https://nemproject.github.io/)
- [NEMのソースコード](https://github.com/NemProject/nem)
- [リファレンス](../references/index.md)
