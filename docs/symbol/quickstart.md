---
title: Testnetへの接続
sidebar_position: 2
description: curl で Symbol Testnet ノードの稼働状態、ネットワーク設定、ブロック高を確認します。
---

`curl` で Symbol Testnet の REST API に接続します。SDK やアカウントを用意せずに、ノードから情報を取得できます。
Linux / macOS / WSL のシェルで実行してください。

## 接続先を選ぶ

[Testnet ノード一覧](https://symbolnodes.org/nodes_testnet/)から REST API を公開しているノードを選びます。
HTTPS の URL とポート番号を指定してください。

```bash
# 後続のコマンドやプログラムにも同じ接続先を渡す。
export SYMBOL_NODE='https://401-sai-dual.symboltest.net:3001'
```

## 稼働状態を確認する

```bash
# HTTPエラーと応答待ちの上限を指定し、ノードの稼働状態を取得する。
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/node/health"
```

`status.apiNode` と `status.db` が `up` なら、API ノードとデータベースが稼働しています。
接続できない場合は URL・ポートを確認し、別のノードでも試してください。

## Testnet の設定を確認する

```bash
# ネットワーク識別子と generation hash seed を確認する。
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/node/info"
```

`networkIdentifier` が152で、`networkGenerationHashSeed` が [Symbol Testnet(sai) の値](../references/networks.md#testnetsai)と一致することを確認します。
Mainnet と Testnet はアドレスや署名に使うネットワーク設定が異なるため、開発時は接続先をそろえます。

## ブロック高を取得する

```bash
# 現在のブロック高と、最後にファイナライズされたブロックを取得する。
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/chain/info"
```

`height` は現在のブロック高、`latestFinalizedBlock.height` は最後にファイナライズされた高さです。
64ビット整数は JSON で文字列として返されます。値の扱い方は [REST APIの基本](../references/rest-api.md)を参照してください。

SDK を使って開発する場合は、[環境構築](sdk/environment.mdx)から進みます。
鍵とアドレスは[アカウント](sdk/accounts.mdx)、構築・署名・送信は[トランザクション](sdk/transactions.mdx)で扱います。

## 参照資料

- [Symbol REST OpenAPI](https://symbol.github.io/symbol-openapi/v1.0.4/)
- [Symbol Testnet 設定](https://github.com/symbol/networks/blob/sai/resources/config-network.properties)
