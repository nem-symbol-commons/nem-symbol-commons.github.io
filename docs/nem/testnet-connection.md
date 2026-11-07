---
title: Testnetへの接続
sidebar_position: 2
description: curlでNEM Testnetの稼働・同期状態、ネットワークとブロック高を確認します。
---

`curl` で NEM(NIS1) Testnet のAPIへ接続します。SDKやアカウントを用意せずに実行できます。
以下は Linux / macOS / WSL のシェルを想定しています。

## 接続先を設定する

NISのREST URLとポート番号を指定します。

```bash
# 後続のコマンドやNode.jsにも同じ接続先を引き継ぐ。
export NEM_NODE='http://libertalia.nemtest.net:7890'
```

この接続先はHTTPです。秘密鍵などの秘密情報は送らず、署名はローカルで行います。

## 稼働・同期状態を確認する

```bash
# 応答可能か、起動して同期済みかを確認する。
curl --fail-with-body --max-time 15 "$NEM_NODE/heartbeat"
curl --fail-with-body --max-time 15 "$NEM_NODE/status"
```

`/heartbeat` は稼働確認、`/status` は詳しい状態確認です。同期済みNISの `/status` は `code: 6` を返します。
接続できない場合はURL・ポート・ノードの公開状態を確認してください。

## Testnetであることを確認する

```bash
# metaData.networkIdを確認し、Mainnetと取り違えない。
curl --fail-with-body --max-time 15 "$NEM_NODE/node/info"
```

NEM Testnetの `metaData.networkId` は符号付き表現で `-104`、1バイトの識別子では `0x98`（152）です。
この識別子がSymbol Testnetと同じでも、アドレス・トランザクション・署名の形式は異なります。

## 高さとネットワーク時刻を取得する

```bash
# ブロック高と、NISが観測するミリ秒単位のネットワーク時刻を取得する。
curl --fail-with-body --max-time 15 "$NEM_NODE/chain/height"
curl --fail-with-body --max-time 15 "$NEM_NODE/time-sync/network-time"
```

`receiveTimeStamp` はミリ秒ですが、NEMのトランザクションの時刻は秒単位です。
JSON中の大きな数値の扱いは [REST APIの基本](../references/rest-api.md)を参照してください。

SDKを使って開発する場合は[環境構築](sdk/environment.mdx)から進みます。
鍵とアドレスは[アカウント](sdk/accounts.mdx)、構築・署名・送信は[トランザクション](sdk/transactions.mdx)で扱います。

## 参照資料

- [NIS API](https://nemproject.github.io/)
- [NIS v0.6.102](https://github.com/NemProject/nem/tree/v0.6.102)
