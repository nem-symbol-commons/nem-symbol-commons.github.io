---
title: Symbol開発クイックスタート
sidebar_position: 2
description: Testnet ノードから情報を取得し、SDK 3.3.3 で転送トランザクションを作成・署名・送信します。
---

Symbol Testnet に接続し、アカウントの作成から最初の転送までを試します。
**対象: Linux / macOS / WSL、Node.js `24.18.1`、pnpm、`symbol-sdk@3.3.3`、Symbol Testnet（sai）**。
Mainnet 用の鍵は使いません。コードは既定で送信せず、`--announce` を付けた場合だけ 1 テスト XYM を送信します。

## 1. 作業ディレクトリを作る

サイトのリポジトリとは別の場所で実行します。Node.js と pnpm を使える状態にしてください。

```bash
mkdir symbol-quickstart
cd symbol-quickstart
pnpm init
pnpm add --save-exact symbol-sdk@3.3.3
printf '\n.testnet-private-key\n' >> .gitignore
```

ここで使用するのは SDK 3 系の Facade API です。`RepositoryFactoryHttp` を使う旧 SDK のコードを混在させないでください。
インストールしたバージョンは `pnpm list symbol-sdk` で確認できます。

## 2. Testnet 専用アカウントを作る

次を `create-account.mjs` として保存します。

```js
import { writeFileSync } from 'node:fs';
import { PrivateKey } from 'symbol-sdk';
import { SymbolFacade } from 'symbol-sdk/symbol';

const facade = new SymbolFacade('testnet');
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

秘密鍵を画面に表示せず、`.testnet-private-key` に保存します。既存ファイルがあれば上書きせず終了します。
ファイルは暗号化されていません。Testnet の実験専用とし、Git・共有ストレージ・記事に含めないでください。
Unix のファイルモードを指定しています。別の環境では、その環境のアクセス権も確認してください。

表示されたアドレスで [XYM Faucet](https://testnet.symbol.tools/) からテスト用 XYM を受け取ります。
この例は 1 XYM と手数料を使うため、それを上回る残高を用意します。Faucet にはアドレスを指定し、秘密鍵は入力しません。

## 3. ノードとアカウントの情報を取得する

```bash
SYMBOL_NODE='https://401-sai-dual.symboltest.net:3001'
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/node/info"
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/chain/info"
```

`networkIdentifier` が 152、Generation Hash Seed が [Testnet の値](../references/networks.md#testnetsai)であることを確認します。
この接続先が使えない場合は [Testnet ノード一覧](https://symbolnodes.org/nodes_testnet/)から選び直してください。

先ほどのアドレスを指定すると、残高を取得できます。

```bash
SYMBOL_ADDRESS='生成した39文字のTestnetアドレス'
curl --fail-with-body --max-time 15 \
  "$SYMBOL_NODE/accounts/$SYMBOL_ADDRESS"
```

`account.mosaics` で `72C0212E67A08BCE` の `amount` を確認します。値は最小単位で、`1000000` が 1 XYM です。
受け取り前の未使用アドレスでは 404 になる場合があります。Faucet からの転送が取り込まれた後に再確認してください。

## 4. 転送を作成して手元で署名する

次を `transfer.mjs` として保存します。既定の受信者は自分自身です。
`RECIPIENT` を設定すると、同じ Testnet の別アドレスへ送れます。

```js
import { readFileSync } from 'node:fs';
import { PrivateKey } from 'symbol-sdk';
import { SymbolFacade, models } from 'symbol-sdk/symbol';

const node = (process.env.SYMBOL_NODE ??
  'https://401-sai-dual.symboltest.net:3001').replace(/\/$/, '');
const facade = new SymbolFacade('testnet');
const account = facade.createAccount(new PrivateKey(
  readFileSync('.testnet-private-key', 'utf8').trim(),
));
const recipient = process.env.RECIPIENT ?? account.address.toString();
if (!facade.network.isValidAddressString(recipient)) {
  throw new Error('受信者が有効なSymbol Testnetアドレスではありません');
}
async function get(path) {
  const response = await fetch(`${node}${path}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GET ${path}: HTTP ${response.status}`);
  return response.json();
}
const info = await get('/node/info');
const properties = await get('/network/properties');
const expectedSeed = facade.network.generationHashSeed.toString();
const epochSeconds = facade.network.datetimeConverter.epoch.getTime() / 1000;
if (info.networkIdentifier !== 152 ||
    info.networkGenerationHashSeed !== expectedSeed ||
    properties.network.generationHashSeed !== expectedSeed ||
    properties.network.epochAdjustment !== `${epochSeconds}s`) {
  throw new Error('SDKと接続先のTestnet設定が一致しません');
}
const currencyId = BigInt(properties.chain.currencyMosaicId.replaceAll("'", ''));
if (currencyId !== 0x72C0212E67A08BCEn) {
  throw new Error('想定するTestnetの通貨モザイクではありません');
}
const fees = await get('/network/fees/transaction');
const multiplier = Math.max(100, fees.minFeeMultiplier);
if (!Number.isSafeInteger(multiplier)) throw new Error('手数料情報が不正です');
const transaction = facade.transactionFactory.create({
  type: 'transfer_transaction_v1',
  signerPublicKey: account.publicKey,
  deadline: facade.now().addHours(2).timestamp,
  recipientAddress: recipient,
  mosaics: [{ mosaicId: currencyId, amount: 1_000_000n }],
});
transaction.fee = new models.Amount(BigInt(transaction.size) * BigInt(multiplier));
if (transaction.fee.value > 50_000n) {
  throw new Error('手数料上限が0.05 XYMを超えたため停止しました');
}
const signature = account.signTransaction(transaction);
if (!facade.verifyTransaction(transaction, signature)) {
  throw new Error('ローカル署名検証に失敗しました');
}
const body = facade.transactionFactory.static.attachSignature(transaction, signature);
const hash = facade.hashTransaction(transaction).toString();
console.log({ node, recipient, amount: '1 test XYM',
  maxFeeAtomic: transaction.fee.value.toString(), hash });
if (process.argv.includes('--announce')) {
  const state = await get(`/accounts/${account.address}`);
  const balance = state.account.mosaics.find(
    mosaic => BigInt(`0x${mosaic.id}`) === currencyId,
  );
  if (!balance || BigInt(balance.amount) < 1_000_000n + transaction.fee.value) {
    throw new Error('1 XYMと手数料上限を賄う残高がありません');
  }
  const response = await fetch(`${node}/transactions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`announce: HTTP ${response.status}`);
  console.log('受付応答:', await response.json());
} else {
  console.log('署名確認のみ。ネットワークへの送信はしていません。');
}
```

```bash
node transfer.mjs
```

ノード情報・ネットワーク設定・手数料情報を取得し、SDK でトランザクションを構築します。
秘密鍵は HTTP 本文に含めず、送信本文は署名を組み込んだ `payload` だけです。
出力されたハッシュ、受信者、金額、手数料上限を確認してください。期限は実行時から 2 時間で、OS の時刻が正しいことが前提です。

手数料上限はサイズと倍率から計算します。実際の手数料は取り込み先ブロックの倍率などに依存し、この上限以内になります。
このサンプルでは、想定外に大きい上限を自動承認せず停止します。

## 5. 明示的に送信する

Faucet からの受け取りを確認してから実行します。自分自身への転送でも手数料は発生します。

```bash
node transfer.mjs --announce
```

別アドレスへの転送を試す場合は、受信者を確認して指定します。

```bash
RECIPIENT='受信者の39文字のTestnetアドレス' node transfer.mjs --announce
```

`PUT /transactions` の受付は取り込み完了を意味しません。出力されたハッシュを使って次を確認してください。

```bash
TX_HASH='出力された64桁のハッシュ'
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/transactionStatus/$TX_HASH"
curl --fail-with-body --max-time 15 "$SYMBOL_NODE/transactions/confirmed/$TX_HASH"
```

`group: confirmed` や confirmed の応答内の `meta.height` を確認します。
まだ見つからなければ時間を置いて再確認し、`failed` の場合は `code` を調べます。404 だけで未承認と断定しないでください。
ファイナライズを確認する場合は、そのブロック高と `/chain/info` の `latestFinalizedBlock.height` も照合します。

## 検証範囲と次のステップ

SDK 3.3.3 でのアカウント生成、転送の構築、署名・署名検証、送信 JSON 生成をローカルで確認しています。
公開 Testnet では情報取得 API を確認しました。実資産を使う Mainnet 送信、Faucet の払い出し、Testnet への送信と承認の一連の操作は未実行です。
本記事だけで送信後の成功を保証するものではありません。

API の値の読み方やエラーは [REST APIの基本](../references/rest-api.md)、参照資料は [リンク集](../references/developer-links.md)を利用してください。

## 参照資料

- [SDK 3.3.3 の SymbolFacade](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/facade/SymbolFacade.js)
- [SDK 3.3.3 の送信 JSON 生成](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/symbol/TransactionFactory.js)
- [Symbol Testnet 設定](https://github.com/symbol/networks/blob/sai/resources/config-network.properties)
- [Symbol REST OpenAPI](https://symbol.github.io/symbol-openapi/v1.0.4/)
