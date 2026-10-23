---
title: ネットワーク情報一覧
sidebar_position: 3
description: NEM / Symbol の Mainnet・Testnet 識別子、通貨、時刻基準、接続例、主要ポート。
---

**確認日: 2026-10-23**。公開ネットワークの識別情報と、アプリケーションが利用する接続先の確認方法をまとめます。
Testnet の再構築時には、Generation Hash Seed、時刻基準、通貨モザイク ID などが変わることがあります。
ネットワーク ID だけで接続先を確定せず、設定ファイルとノードの応答を照合してください。

## チェーンとネットワーク

| チェーン | ネットワーク | 識別子の 1 バイト値 | NIS の networkId 表現 | 通常アドレス | 通貨 |
| --- | --- | --- | --- | --- | --- |
| NEM（NIS1） | Mainnet | `0x68` / 104 | 104 | `N` で始まる 40 文字 | XEM |
| NEM（NIS1） | Testnet | `0x98` / 152 | -104 | `T` で始まる 40 文字 | テスト用 XEM |
| Symbol | Mainnet | `0x68` / 104 | 対象外 | `N` で始まる 39 文字 | XYM |
| Symbol | Testnet（sai） | `0x98` / 152 | 対象外 | `T` で始まる 39 文字 | テスト用 XYM |

`0x98` を符号付き 8 ビット整数で表すと `-104` になります。NIS の `metaData.networkId` と SDK のバイト値の表現差に注意してください。
NEM と Symbol の間で識別子が一致しても、チェーン・アドレス・署名は互換ではありません。

参照: SDK 3.3.3 の [NEM Network](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/nem/Network.js)、[Symbol Network](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/symbol/Network.js)、[旧 NEM SDK のネットワーク表現](https://github.com/QuantumMechanics/NEM-sdk)。

## Symbol の署名・時刻・通貨の設定

長い値は表に詰めず、ネットワークごとに記載します。
以下は [Mainnet 設定](https://github.com/symbol/networks/blob/mainnet/resources/config-network.properties)と [sai 設定](https://github.com/symbol/networks/blob/sai/resources/config-network.properties)で確認した値です。

### Mainnet

```text
Generation Hash Seed:
57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6
Epoch Adjustment（Unix 秒）: 1615853185
通貨モザイク ID: 6BED913FA20223F8
```

### Testnet（sai）

```text
Generation Hash Seed:
49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4
Epoch Adjustment（Unix 秒）: 1667250467
通貨モザイク ID: 72C0212E67A08BCE
```

SDK 3.3.3 の組み込み `mainnet` / `testnet` とも照合しています。
`deadline` は Unix 時刻を直接入れる欄ではありません。Symbol のネットワーク時刻は、Epoch Adjustment を基準とするミリ秒単位です。
Generation Hash Seed は署名・トランザクションハッシュの計算に使うネットワーク固有値です。

## NEM の時刻と通貨

NEM の SDK の基準時刻は `2015-03-29T00:06:25Z` で、トランザクションの `timeStamp` / `deadline` はそこからの秒数です。
`GET /time-sync/network-time` の `receiveTimeStamp` はミリ秒なので、トランザクション用には 1000 で割ります。
SDK の記述子では `timestamp`、NIS の JSON 資料では `timeStamp` と、名前も異なります。

XEM の表示値は 6 桁の小数を持ちます。`1 XEM = 1,000,000` 最小単位です。
Symbol の XYM にも 6 桁の可分性がありますが、XEM と XYM は別の資産です。

参照: [NEM Network の実装](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/nem/Network.js)、[NIS API](https://nemproject.github.io/)。

## 接続先の例と探索先

| 対象 | REST 接続例または探索先 | 確認方法 |
| --- | --- | --- |
| Symbol Mainnet | [公開ノード一覧](https://symbolnodes.org/nodes/)から REST 対応ノードを選択 | `/node/info` と `/network/properties` |
| Symbol Testnet | `https://401-sai-dual.symboltest.net:3001` | `/node/info` の識別子 152 と Generation Hash Seed |
| NEM Mainnet | [公開ノード一覧](https://nemnodes.org/)から選択 | `/node/info` の `metaData.networkId` が 104 |
| NEM Testnet | `http://libertalia.nemtest.net:7890` | `/node/info` の `metaData.networkId` が -104 |

上記 Testnet 2 ノードでは、確認日に `GET /node/info` の JSON を取得できました。
Symbol では `/network/properties`、NEM では `/status` と `/time-sync/network-time` も取得しています。
これは常時稼働の保証ではありません。失敗した場合は [リンク集](developer-links.md)の一覧や運営元の資料で接続先を更新してください。

NEM の接続例は HTTP です。通信内容の秘匿・改ざん防止は提供しないため、ローカル署名を使い、秘密鍵を送らないでください。
実運用では自分で管理するノードや、信頼できる HTTPS 接続を検討します。

## 接続確認の例

Linux / macOS / WSL のシェル、`curl` を対象にしています。

```bash
SYMBOL_NODE='https://401-sai-dual.symboltest.net:3001'
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/node/info"
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/network/properties"
```

`networkIdentifier` と `networkGenerationHashSeed` を上記の値と比較します。P2P 用の `port` が返っても、その番号を REST URL のポートとして使わないでください。

```bash
NEM_NODE='http://libertalia.nemtest.net:7890'
curl --fail-with-body --max-time 15 "$NEM_NODE/node/info"
curl --fail-with-body --max-time 15 "$NEM_NODE/status"
```

確認時の NEM ノードバージョンは `0.6.102` でした。
`/status` の `code: 6` は起動・同期済みの状態として扱われます。ブロック高や複数ノードの応答も合わせて確認してください。

## 主要ポート

| チェーン | ポート | 主な用途 |
| --- | --- | --- |
| NEM（NIS1） | TCP 7890 | NIS の HTTP API とノード通信 |
| NEM（NIS1） | TCP 7778 | WebSocket サービス。提供される場合 |
| Symbol | TCP 7900 | P2P 通信。REST ではない |
| Symbol | TCP 7902 | Catapult の API サービス。REST Gateway の背後で使い、HTTP REST とは別 |
| Symbol | TCP 3000 | REST / WebSocket の HTTP / WS 接続の代表例 |
| Symbol | TCP 3001 | HTTPS / WSS 接続の代表例。TLS の提供はノード構成による |

公開ポートは運営者やリバースプロキシ構成によって変わります。443 で HTTPS を提供する構成もあります。
この表は接続先を選ぶための目安であり、すべてのポートを外部公開するためのファイアウォール設定ではありません。

参照: [Symbol ノード設定](https://docs.symbol.dev/guides/network/configuring-node-properties.html)、[REST Gateway](https://docs.symbol.dev/api.html)、[NIS1 ノード構築ガイド](https://docs.nemtest.net/en/userbook/node/install/)。
