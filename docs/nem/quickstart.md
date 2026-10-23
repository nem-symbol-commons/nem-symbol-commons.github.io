---
title: NEM開発クイックスタート
sidebar_position: 2
description: NIS1 Testnet の API から情報を取得し、SDK 3.3.3 で XEM 転送をローカル署名して送信します。
---

NEM（NIS1）Testnet でアカウント情報の取得と XEM の転送を試します。
**対象: Linux / macOS / WSL、Node.js `24.18.1`、pnpm、`symbol-sdk@3.3.3` の NEM API、NIS `0.6.102` の公開 Testnet 応答**。
`symbol-sdk` という名前ですが、ここでは `symbol-sdk/nem` の `NemFacade` を使います。
Symbol の `PUT /transactions` ではなく、NIS の `POST /transaction/announce` に送ります。

既定では送信しません。`--announce` を付けた場合だけ 1 テスト XEM を送ります。
Mainnet の秘密鍵は使わず、専用の Testnet アカウントを作ってください。

## 1. 作業ディレクトリと SDK

サイトのリポジトリとは別の場所で実行します。

```bash
mkdir nem-quickstart
cd nem-quickstart
pnpm init
pnpm add --save-exact symbol-sdk@3.3.3
printf '\n.testnet-private-key\n' >> .gitignore
```

この例は旧 `nem-sdk` を使いません。古い記事の `nem.model.transactions.prepare` と、新しい Facade API を混在させないでください。

## 2. Testnet 専用アカウントを作る

次を `create-account.mjs` として保存します。

```js
import { writeFileSync } from 'node:fs';
import { PrivateKey } from 'symbol-sdk';
import { NemFacade } from 'symbol-sdk/nem';

const facade = new NemFacade('testnet');
const privateKey = PrivateKey.random();
writeFileSync('.testnet-private-key', privateKey.toString(), {
  flag: 'wx',
  mode: 0o600,
});
const account = facade.createAccount(privateKey);
console.log('address:', account.address.toString());
console.log('public key:', account.publicKey.toString());
```

```bash
node create-account.mjs
```

秘密鍵は画面には表示せず、`.testnet-private-key` に保存します。既存ファイルは上書きしません。
ファイルは暗号化されていないため、Testnet 専用として管理し、Git や共有ストレージに含めないでください。
Unix 以外の環境では、その環境のアクセス権も確認します。

生成される NEM Testnet アドレスは `T` で始まる 40 文字です。
Symbol Testnet の 39 文字のアドレスを指定してはいけません。
[XEM Faucet](https://testnet.nem.tools/)でこのアドレスへテスト用 XEM を受け取ります。1 XEM と手数料を上回る残高を用意してください。

## 3. NIS の状態と残高を取得する

```bash
NEM_NODE='http://libertalia.nemtest.net:7890'
curl --fail-with-body --max-time 15 "$NEM_NODE/node/info"
curl --fail-with-body --max-time 15 "$NEM_NODE/status"
curl --fail-with-body --max-time 15 "$NEM_NODE/chain/height"
```

`metaData.networkId` が `-104`、`/status` の `code` が 6 であることを確認します。
Testnet の 1 バイト識別子は `0x98`（152）で、NIS が符号付き整数 `-104` として返す表現に対応します。

```bash
NEM_ADDRESS='生成した40文字のTestnetアドレス'
curl --fail-with-body --max-time 15 --get \
  --data-urlencode "address=$NEM_ADDRESS" "$NEM_NODE/account/get"
```

`account.balance` が XEM の最小単位の残高です。`1000000` は 1 XEM に相当します。
新しいアドレスや未受領の場合と、ノードが同期中の場合を区別してください。

この接続例は HTTP であり、TLS による通信保護はありません。
**秘密鍵を含む `/transaction/prepare-announce` は使いません。** 署名は手元で行い、ノードへは署名済みデータだけを送ります。

## 4. XEM 転送を作成・署名する

次を `transfer.mjs` として保存します。既定の受信者は自分自身です。

```js
import { readFileSync } from 'node:fs';
import { PrivateKey } from 'symbol-sdk';
import { NemFacade, NetworkTimestamp, calculateTransactionFee, models }
  from 'symbol-sdk/nem';

const node = (process.env.NEM_NODE ??
  'http://libertalia.nemtest.net:7890').replace(/\/$/, '');
const facade = new NemFacade('testnet');
const account = facade.createAccount(new PrivateKey(
  readFileSync('.testnet-private-key', 'utf8').trim(),
));
const recipient = process.env.RECIPIENT ?? account.address.toString();
if (!facade.network.isValidAddressString(recipient)) {
  throw new Error('受信者が有効なNEM Testnetアドレスではありません');
}
async function get(path) {
  const response = await fetch(`${node}${path}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GET ${path}: HTTP ${response.status}`);
  return response.json();
}
const info = await get('/node/info');
if (info.metaData.networkId !== -104 && info.metaData.networkId !== 152) {
  throw new Error('接続先がNEM Testnetではありません');
}
const status = await get('/status');
if (status.code !== 6) throw new Error('NISが起動・同期済みの状態ではありません');
const networkTime = await get('/time-sync/network-time');
if (!Number.isSafeInteger(networkTime.receiveTimeStamp) ||
    networkTime.receiveTimeStamp < 0) {
  throw new Error('ネットワーク時刻が不正です');
}
const timestamp = new NetworkTimestamp(
  Math.floor(networkTime.receiveTimeStamp / 1000),
);
const transaction = facade.transactionFactory.create({
  type: 'transfer_transaction_v2',
  signerPublicKey: account.publicKey,
  timestamp: timestamp.timestamp,
  deadline: timestamp.addHours(2).timestamp,
  recipientAddress: recipient,
  amount: 1_000_000n,
});
transaction.fee = new models.Amount(calculateTransactionFee(transaction));
if (transaction.fee.value > 100_000n) {
  throw new Error('手数料が0.1 XEMを超えたため停止しました');
}
const signature = account.signTransaction(transaction);
if (!facade.verifyTransaction(transaction, signature)) {
  throw new Error('ローカル署名検証に失敗しました');
}
const body = facade.transactionFactory.static.attachSignature(transaction, signature);
const hash = facade.hashTransaction(transaction).toString();
console.log({ node, recipient, amount: '1 test XEM',
  feeAtomic: transaction.fee.value.toString(), hash });
if (process.argv.includes('--announce')) {
  const state = await get(`/account/get?address=${account.address}`);
  if (!Number.isSafeInteger(state.account.balance)) {
    throw new Error('この例では残高を正確に扱えないため停止しました');
  }
  if (BigInt(state.account.balance) < 1_000_000n + transaction.fee.value) {
    throw new Error('1 XEMと手数料を賄う残高がありません');
  }
  const response = await fetch(`${node}/transaction/announce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`announce: HTTP ${response.status}`);
  const result = await response.json();
  if (result.code !== 1) throw new Error(`NIS: ${result.message}`);
  console.log('受付応答:', result.message);
} else {
  console.log('署名確認のみ。ネットワークへの送信はしていません。');
}
```

```bash
node transfer.mjs
```

NIS から時刻を取得し、ミリ秒から秒へ変換します。
転送はモザイク指定なしの Transfer V2 で、`amount` は XEM の最小単位です。
SDK 3.3.3 の手数料計算を使い、このメッセージなしの 1 XEM 転送では `50000` 最小単位（0.05 XEM）になります。
任意モザイクの転送には別の金額解釈とモザイク情報が必要なので、この例のまま流用しないでください。

この例は新規作成した通常アカウント用です。マルチシグアカウントの署名や送信手順は対象にしていません。
出力された受信者、金額、手数料、ハッシュを確認します。

## 5. 明示的に送信して取り込みを確認する

Faucet からの受け取りを確認したら実行します。自分自身への転送でも手数料は発生します。

```bash
node transfer.mjs --announce
```

別アドレスを受信者にする場合は、同じ NEM Testnet のアドレスを指定します。

```bash
RECIPIENT='受信者の40文字のTestnetアドレス' node transfer.mjs --announce
```

`SUCCESS` はアナウンスの受付結果です。ブロックに取り込まれたかは、ハッシュで別途確認します。

```bash
TX_HASH='出力された64桁のハッシュ'
curl --fail-with-body --max-time 15 --get \
  --data-urlencode "hash=$TX_HASH" "$NEM_NODE/transaction/get"
```

`meta.height` に取り込み先のブロック高があることを確認します。
NIS には探索機能の設定によってハッシュ検索を利用できない場合があるため、ノードの設定を確認し、[NEM Testnet Explorer](https://testnet.nem.fyi/) や送信者の履歴でも確認してください。
取得失敗だけで送信がなかったと断定して、別の転送を自動作成しないでください。

## 検証範囲と次のステップ

SDK 3.3.3 でのアカウント生成、Transfer V2 の構築、手数料計算、署名・署名検証、`data` / `signature` の JSON 生成をローカルで確認しています。
公開 NIS Testnet ではノード情報、状態、ネットワーク時刻の取得を確認しました。
Faucet の払い出し、公開 Testnet への送信と取り込みの一連の操作は未実行です。Mainnet 送信も検証していません。

接続や JSON の注意点は [REST APIの基本](../references/rest-api.md)、API と実装の参照先は [リンク集](../references/developer-links.md)を利用してください。

## 参照資料

- [SDK 3.3.3 の NemFacade](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/facade/NemFacade.js)
- [SDK 3.3.3 の送信 JSON 生成](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/nem/TransactionFactory.js)
- [SDK 3.3.3 の手数料計算](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/nem/FeeCalculator.js)
- [NIS API](https://nemproject.github.io/)
- [NEM の手動トランザクション構築ガイド](https://docs.nemtest.net/en/devbook/transactions/manual-transaction-creation/)
