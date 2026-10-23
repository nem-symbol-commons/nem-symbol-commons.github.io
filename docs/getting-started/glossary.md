---
title: NEM・Symbolの基本用語
sidebar_position: 2
description: アカウント、鍵、モザイク、ネームスペース、ハーベスト、承認とファイナライズの基礎。
---

NEM（NIS1）と Symbol の開発・運用で使う用語をまとめています。
同じ名前でも仕様が異なるため、両チェーンの違いは [NEMとSymbolの違い](../common/nem-and-symbol.md)を参照してください。

## アカウントと鍵

**アカウント**は、アドレスに関連付けられた残高や状態を管理する単位です。
鍵とアドレスを生成しただけでは、API でアカウント情報を取得できない場合があります。

**秘密鍵**は、トランザクションの署名に使う秘密の値です。他人に渡したり公開したりしてはいけません。

**公開鍵**は、署名の検証に使う値です。

**アドレス**は、公開鍵とネットワークの情報から作られる、送信先などを指定する識別子です。
アドレスから秘密鍵を復元することはできません。

**署名**は、秘密鍵を使って作成するデータです。対応する公開鍵で、署名者と署名後にデータが変更されていないことを確認します。

**ハッシュ**は、データから計算する一定長の値です。トランザクションの識別などに使います。
署名とは異なり、秘密鍵は使いません。

参照：[Symbol Account](https://docs.symbol.dev/concepts/account.html)、[SDK の署名実装](https://github.com/symbol/symbol/tree/main/sdk/javascript/src/facade)。

## XEM・XYM・モザイク

**XEM** は NEM、**XYM** は Symbol のネイティブ通貨です。Mainnet と Testnet の通貨は別の資産です。

**モザイク**は、チェーン上で発行・管理する資産です。独自トークンやポイントなどに使います。
NEM ではネームスペースとモザイク名の組、Symbol では数値 ID で識別します。

**可分性**（divisibility）は、小数点以下の桁数です。
XEM / XYM の可分性は 6 で、`1 XEM` / `1 XYM` は最小単位の `1,000,000` に相当します。
API では数量を最小単位の整数で扱います。他のモザイクでは、可分性に応じて換算します。

参照：[NEM Mosaics](https://docs.nemtest.net/en/textbook/mosaics/)、[Symbol Mosaic](https://docs.symbol.dev/concepts/mosaic.html)。

## ネームスペース

**ネームスペース**は、チェーン上に登録する名前です。
NEM ではモザイクの名前付けに使います。Symbol ではアドレスやモザイク ID に関連付け、名前で参照できます。

**エイリアス**は、Symbol のネームスペースとアドレスまたはモザイク ID との関連付けです。
参照先は変更でき、ネームスペースには有効期間があります。

参照：[NEM Namespaces](https://docs.nemtest.net/en/textbook/namespaces/)、[Symbol Namespace](https://docs.symbol.dev/concepts/namespace.html)。

## トランザクション・ブロック・ハーベスト

**トランザクション**は、送信や設定変更などの操作を記述したデータです。
作成・署名後、ノードに送信し、ブロックに取り込まれることでチェーンに記録されます。

**アナウンス**は、署名済みのトランザクションをノードに送信する操作です。

**ブロック**は、トランザクションなどをまとめたチェーンの構成要素です。

**ブロック高**（height）は、チェーン内でのブロックの位置を表す数値です。

**ハーベスト**は、ブロックを生成する処理です。

**重要度**（importance）は、アカウントがブロックを生成する確率に関わる指標です。計算方法はチェーンごとに異なります。

**委任ハーベスト**は、別のノードにブロック生成を任せてハーベストに参加する仕組みです。
送金用の秘密鍵をノード管理者に渡す必要はありません。

参照：[Symbol Harvesting](https://docs.symbol.dev/concepts/harvesting.html)、[NEM Consensus](https://docs.nemtest.net/en/textbook/consensus/)。

## 受付・未承認・承認・ファイナライズ

| 状態 | 意味 |
| --- | --- |
| 受付 | 送信先がリクエストを受け取った段階。ブロックへの取り込みは保証されない |
| 未承認（unconfirmed） | トランザクションがまだブロックに取り込まれていない状態 |
| 承認（confirmed） | トランザクションがブロックに取り込まれた状態 |
| ファイナライズ | Symbol の投票によってブロックが確定すること |

Symbol では、承認とファイナライズを別に確認します。
REST API の `/chain/info` が返す `latestFinalizedBlock.height` は、そのノードが認識するファイナライズ済みのブロック高です。
応答の取得と、ファイナライズ証明の独立検証は別の操作です。
NEM（NIS1）の承認確認には NIS1 の API を使います。

参照：[Symbol REST OpenAPI](https://symbol.github.io/symbol-openapi/v1.0.4/)、[NEM NIS API](https://nemproject.github.io/)。

## ノード・REST API・SDK・Explorer

**ノード**は、チェーンの同期・検証や、他のノードとの通信を行うソフトウェアです。

**REST API**は、HTTP でチェーンの情報を取得したり、トランザクションを送信したりするためのインターフェースです。
Symbol の P2P 通信用ポートとは接続先が異なります。

**SDK**は、アドレス、トランザクション、署名などをプログラムから扱うためのライブラリです。

**Explorer**は、ブロックやトランザクションをブラウザーで確認するサービスです。

**Faucet**は、開発に使う Testnet の通貨を配布するサービスです。

接続先は[ネットワーク情報一覧](../references/networks.md)、API の使用例は [REST APIの基本](../references/rest-api.md)を参照してください。
