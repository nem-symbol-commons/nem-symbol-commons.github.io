---
title: NEMとSymbolの違い
sidebar_position: 2
description: NEM（NIS1）と Symbol（Catapult）のチェーン、アドレス、API、SDK、機能の違いを整理します。
---

NEM（NIS1）と Symbol は、共通する用語を持つ別々のブロックチェーンです。
NIS1 は NEM のノード実装、Catapult は Symbol のコア実装を指す文脈で使われます。
Symbol を NIS1 の API 互換サーバーとして扱うことはできません。

この記事は、公開ネットワークで開発を始めるときに必要な違いに絞っています。数値の確認先は [ネットワーク情報一覧](../references/networks.md) を参照してください。

## 開発で最初に確認する違い

| 項目 | NEM（NIS1） | Symbol |
| --- | --- | --- |
| ネイティブ通貨 | XEM | XYM |
| Mainnet の識別子 | `0x68` | `0x68` |
| Testnet の識別子 | `0x98`。旧 SDK・NIS の応答では `-104` の表現もある | `0x98`（152） |
| 通常アドレスの Base32 表現 | 40 文字 | 39 文字 |
| 公開鍵からアドレスを作るハッシュ | Keccak-256 と RIPEMD-160 | SHA3-256 と RIPEMD-160 |
| アカウント取得 | `GET /account/get?address=...` | `GET /accounts/{address}` |
| チェーン高の取得 | `GET /chain/height` | `GET /chain/info` |
| 署名済み送信 | `POST /transaction/announce` | `PUT /transactions` |
| 送信 JSON | `data` と `signature` | `payload` |
| SDK 3.3.3 の入口 | `NemFacade`、`symbol-sdk/nem` | `SymbolFacade`、`symbol-sdk/symbol` |
| ネットワーク時刻の単位 | 秒 | ミリ秒 |

**同じネットワーク識別子でも、同じチェーンではありません。** アドレス長、生成処理、API、トランザクション形式も確認します。
アドレスの先頭文字だけで「有効なアドレス」「正しい送信先」と判断せず、対応する SDK でチェックサムとネットワークを検査してください。

アドレス生成・時刻の差異は、SDK の [NEM Network](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/nem/Network.js) と [Symbol Network](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/symbol/Network.js) で確認できます。

## モザイクとネームスペース

両チェーンとも、モザイクで資産を表現し、ネームスペースで名前を管理します。ただし識別の仕組みは異なります。

NEM のモザイクは、`namespaceId` とモザイク名の組で識別します。資料では `nem:xem` のように表示されます。
Symbol のモザイクは 64 ビットの ID で識別し、人間が読みやすい名前はネームスペースをエイリアスとして関連付けます。
モザイク名やエイリアスだけを見て、チェーンや資産が同じだと判断しないでください。

参照: [NEM Mosaics](https://docs.nemtest.net/en/textbook/mosaics/)、[Symbol Mosaic](https://docs.symbol.dev/concepts/mosaic.html)、[Symbol Namespace](https://docs.symbol.dev/concepts/namespace.html)。

## トランザクションと拡張機能

NEM にも送信、マルチシグ、モザイク、ネームスペースの機能があります。
Symbol には、複数の内包トランザクションをまとめて処理するアグリゲートトランザクションがあり、必要な署名と条件を満たした場合にまとめて実行します。
NEM のマルチシグ用トランザクションと Symbol のアグリゲートは同じ形式ではありません。

Symbol ではメタデータやアカウント・モザイク制限なども独立した機能として用意されています。
アプリケーションの移植では機能名の置き換えにとどめず、トランザクションの型、必要な署名、手数料、権限を再設計します。

参照: [NIS API のトランザクション一覧](https://nemproject.github.io/)、[Aggregate Transaction](https://docs.symbol.dev/concepts/aggregate-transaction.html)、[Symbol のトランザクションモデル](https://github.com/symbol/symbol/blob/7c5bd51293c1202701d10daf2afcb6c060e45c30/sdk/javascript/src/symbol/models.js)。

## ハーベストとファイナライズ

ハーベストはブロックを生成する処理です。NEM と Symbol では、参加条件や重要度の計算、関連する鍵の扱いが異なります。
また、Symbol では投票によるファイナライズとハーベストを区別します。ブロックへの取り込みだけで「ファイナライズ済み」とは言えません。

NEM に Symbol と同じ投票鍵やファイナライズ API があると仮定してはいけません。
利用するチェーンの確認基準を決め、単に HTTP 送信が成功したことと、ブロックに取り込まれたことを分けて扱ってください。

参照: [NEM Consensus](https://docs.nemtest.net/en/textbook/consensus/)、[Symbol Harvesting](https://docs.symbol.dev/concepts/harvesting.html)、[Symbol のファイナライズ実装](https://github.com/symbol/symbol/tree/main/client/catapult/extensions/finalization)。

## コード例を選ぶとき

`symbol-sdk` というパッケージ名だけでは世代を特定できません。古い 1.x / 2.x の例には `RepositoryFactoryHttp` などを使うものがあります。
このサイトのクイックスタートは `symbol-sdk@3.3.3` を固定し、Facade でローカル署名、`fetch` で HTTP 通信を行います。
SDK 内で両チェーンに対応していても、チェーンを指定する import と Facade は使い分けます。

- [Symbol開発クイックスタート](../symbol/quickstart.md)
- [NEM開発クイックスタート](../nem/quickstart.md)
