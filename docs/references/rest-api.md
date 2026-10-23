---
title: REST APIの基本
sidebar_position: 4
description: NEM / Symbol の HTTP 接続、主要 API、JSON、整数値、エラー、送信後の確認を学びます。
---

REST API は、HTTP を使ってノードの情報を取得したり、署名済みトランザクションを送ったりする入口です。
NEM（NIS1）と Symbol ではパス、メソッド、JSON の構造が異なります。
この記事のコマンドは Linux / macOS / WSL のシェルと `curl` を対象とし、読み取り例には公開 Testnet を使います。

## URL とメソッド

URL は `スキーム://ホスト:ポート/パス?クエリ` で構成されます。
Explorer の URL と REST の URL を混同せず、[ネットワーク情報一覧](networks.md)で対象チェーンを確認してください。

- `GET`: ブロック高やアカウントなどの取得。
- `PUT` / `POST`: 仕様で定義された送信や問い合わせ。メソッド名だけで副作用の有無を判断しないでください。
- `Content-Type: application/json`: JSON の本文を送るときに指定。

Symbol の `7900` は P2P 用で、HTTP の API を呼ぶポートではありません。
以下の主要パスは [Symbol OpenAPI v1.0.4](https://symbol.github.io/symbol-openapi/v1.0.4/) と [NIS API](https://nemproject.github.io/) を参照しています。

## 主要 API の対応

| 目的 | NEM（NIS1） | Symbol |
| --- | --- | --- |
| ノード情報 | `GET /node/info` | `GET /node/info` |
| 起動・同期状態 | `GET /status` | `GET /node/health` |
| ブロック高 | `GET /chain/height` | `GET /chain/info` |
| ネットワーク設定 | NIS の設定・ノード情報を参照 | `GET /network/properties` |
| アカウント | `GET /account/get?address=...` | `GET /accounts/{address}` |
| モザイク残高 | `GET /account/mosaic/owned?address=...` | アカウント応答内の `account.mosaics` |
| 署名済み送信 | `POST /transaction/announce` | `PUT /transactions` |
| 取り込み結果 | `GET /transaction/get?hash=...` | `GET /transactions/confirmed/{hash}` |
| 未承認データ | `GET /account/unconfirmedTransactions?address=...` | `GET /transactions/unconfirmed/{hash}` |
| 状態・失敗理由 | 送信結果とアカウントの履歴などを確認 | `GET /transactionStatus/{hash}` |

NIS API 資料は古い版もあるため、利用する NIS の応答と照合します。Symbol の OpenAPI の版番号は、ノード本体や SDK の版番号とは別です。

## まずブロック高を取得する

```bash
SYMBOL_NODE='https://401-sai-dual.symboltest.net:3001'
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/chain/info"
```

Symbol の応答では `height` などの 64 ビット整数が十進文字列として返ります。
次は構造だけを示す例であり、実際の現在高ではありません。

```json
{
  "height": "12345",
  "scoreHigh": "0",
  "scoreLow": "100",
  "latestFinalizedBlock": {
    "finalizationEpoch": 1,
    "finalizationPoint": 1,
    "height": "12300",
    "hash": "0000000000000000000000000000000000000000000000000000000000000000"
  }
}
```

`height` は観測している先端高、`latestFinalizedBlock.height` はそのノードが観測しているファイナライズ高です。
トランザクションのブロック高と比較しても、第三者の応答を取得した段階であり、証明の独立検証とは別です。

NEM のパスと応答は次のように異なります。

```bash
NEM_NODE='http://libertalia.nemtest.net:7890'
curl --fail-with-body --max-time 15 "$NEM_NODE/chain/height"
```

```json
{ "height": 12345 }
```

この数値も構造例です。NEM の値まで無条件に Symbol と同じ文字列形式だと仮定しないでください。

## アドレスを指定する

アドレスは自分で作成した Testnet 用のものに置き換えます。例中の説明文字列は有効なアドレスではありません。

```bash
SYMBOL_ADDRESS='自分の39文字のSymbol Testnetアドレス'
curl --fail-with-body --max-time 15 \
  "$SYMBOL_NODE/accounts/$SYMBOL_ADDRESS"
```

```bash
NEM_ADDRESS='自分の40文字のNEM Testnetアドレス'
curl --fail-with-body --max-time 15 --get \
  --data-urlencode "address=$NEM_ADDRESS" "$NEM_NODE/account/get"
```

Symbol の残高は `account.mosaics` にあるモザイク ID と `amount`、NEM の XEM 残高は `account.balance` を確認します。
ハイフンの有無、チェックサム、チェーン、ネットワークを確認し、未使用のアドレスが見つからない場合と、形式が不正な場合を分けて扱います。

## JavaScript で読む

対象は Node.js `24.18.1` の組み込み `fetch` です。ライブラリのインストールは不要です。
`fetch` は HTTP 404 / 500 でも通常は例外を投げないため、ステータスを確認します。

```js
const node = 'https://401-sai-dual.symboltest.net:3001';
const response = await fetch(`${node}/chain/info`, {
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${await response.text()}`);
}
const info = await response.json();
console.log('height:', BigInt(info.height).toString());
```

JavaScript の `Number` はすべての 64 ビット整数を正確に表現できません。
Symbol の高さ・金額は文字列から `BigInt` に変換し、モザイク ID は 16 進文字列として扱います。
例えば `BigInt('0x72C0212E67A08BCE')` は ID の変換であり、十進の金額文字列とは異なります。
`BigInt` を JSON に戻すときは、必要な値を `toString()` してからシリアライズします。

## 送信と承認を分ける

トランザクションは手元で署名し、Symbol には `{ "payload": "..." }`、NEM には `{ "data": "...", "signature": "..." }` を送ります。
秘密鍵を受け取る NIS の `/transaction/prepare-announce` を公開ノード向けの例として使わないでください。
具体的なコードは [Symbol](../symbol/quickstart.md) と [NEM](../nem/quickstart.md) のクイックスタートを参照してください。

Symbol の受付応答や NEM の `SUCCESS` は、ブロック取り込み完了の通知ではありません。
ハッシュで追跡し、Symbol は confirmed のデータと `meta.height`、NEM は取得できたデータの `meta.height` を確認します。
Symbol の `transactionStatus` が `unconfirmed` / `confirmed` / `failed` のどの状態かも確認してください。

## よくあるエラー

| 現象 | 最初に確認すること |
| --- | --- |
| 接続できない・タイムアウト | ホスト、ポート、HTTP / HTTPS、ノードの稼働、プロキシ |
| HTTP 400 | パス、アドレス長、16 進値、JSON の形式 |
| HTTP 404 | パスと対象チェーン、データ未登録、別ネットワーク、ノードの保持・検索範囲 |
| HTTP 429 | 取得頻度を下げ、運営者の利用制限を確認 |
| HTTP 5xx | ノードや依存サービスの状態、別ノードの応答 |
| 送信受付後に失敗 | 残高、手数料、期限、署名、ネットワーク、状態 API |
| ブラウザーからだけ失敗 | CORS、HTTPS ページから HTTP への mixed content |

404 だけで「未承認」と判断しないでください。ハッシュの誤りや、接続先の違いでも発生します。
GET の再試行には間隔と回数の上限を設けます。送信のタイムアウトでは、結果が不明なだけの場合があるため、まずハッシュで確認し、別のトランザクションを自動で再作成しないでください。

## 参照資料

- [Symbol REST OpenAPI](https://symbol.github.io/symbol-openapi/v1.0.4/)
- [Symbol REST の実装](https://github.com/symbol/symbol/tree/main/client/rest)
- [NEM NIS API](https://nemproject.github.io/)
