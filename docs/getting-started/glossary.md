---
title: NEM・Symbolの基本用語
sidebar_position: 2
description: アカウント、鍵、モザイク、ネームスペース、ハーベスト、承認とファイナライズの基礎。
---

開発記事を読むための最小限の用語集です。両チェーンで同じ単語が使われても、実際のデータ形式や手順は異なります。
比較は [NEMとSymbolの違い](../common/nem-and-symbol.md)、数値や接続先は [ネットワーク情報一覧](../references/networks.md) を参照してください。

## アカウントと鍵

**アカウント**は、アドレスに関連付けられた残高や状態を扱う単位です。
鍵を手元で生成する操作と、ブロックチェーン上でアカウントの情報が観測できることは別です。
新しいアドレスは、有効でも REST のアカウント取得で見つからないことがあります。

**秘密鍵**は署名に使う秘密の値です。**公開鍵**は署名の検証に使う値で、**アドレス**は公開鍵とネットワークの情報から導出する識別子です。
アドレスから秘密鍵を復元することはできません。送信先に公開するのは通常アドレスであり、秘密鍵ではありません。

**署名**は、その鍵によって対象データが承認されたことを検証するためのデータです。
**ハッシュ**はデータを一定長の値で表現するもので、秘密鍵による承認を示す署名とは役割が異なります。

参照: [Symbol Account](https://docs.symbol.dev/concepts/account.html)、[SDK の署名実装](https://github.com/symbol/symbol/tree/main/sdk/javascript/src/facade)。

## XEM・XYM・モザイク

**XEM** は NEM、**XYM** は Symbol のネイティブ通貨です。Testnet の同名通貨と Mainnet の通貨も別の資産です。

**モザイク**は、チェーン上で数量を管理する資産です。独自トークンやポイントなどの表現に使えます。
名前や用途に加え、ID、供給量、可分性などを確認します。NEM はネームスペースとモザイク名の組、Symbol は数値 ID で識別します。

**可分性（divisibility）**は、小数点以下を何桁まで表現できるかを表します。
XEM / XYM の可分性は 6 で、`1 XEM` / `1 XYM` はそれぞれ最小単位の `1,000,000` に相当します。
API や署名処理では最小単位の整数を使い、表示用の小数値と混同しないでください。他のモザイクも 6 桁とは限りません。

参照: [NEM Mosaics](https://docs.nemtest.net/en/textbook/mosaics/)、[Symbol Mosaic](https://docs.symbol.dev/concepts/mosaic.html)。

## ネームスペース

**ネームスペース**は、チェーン上で登録する人間が読みやすい名前です。
NEM のモザイクの名前付けと、Symbol のアドレス・モザイクへのエイリアスでは用途と形式が異なります。
Symbol のエイリアスは名前から実際の識別子を参照する仕組みで、ドメイン名のように名前だけを資産そのものと考えないことが大切です。
登録期間や更新、参照先の変更も確認してください。

参照: [NEM Namespaces](https://docs.nemtest.net/en/textbook/namespaces/)、[Symbol Namespace](https://docs.symbol.dev/concepts/namespace.html)。

## トランザクション・ブロック・ハーベスト

**トランザクション**は、送信や設定変更などの操作を記述するデータです。作成しただけではネットワークには反映されません。
署名してノードへ送信することを **アナウンス** と呼びます。

**ブロック**は、トランザクションなどをまとめたチェーンの構成要素です。**ブロック高（height）**はチェーン内での位置を表します。

**ハーベスト**はブロックを生成する処理です。**重要度（importance）**は、そのチェーンのルールに従って計算される指標で、ブロック生成への参加に関係します。
**委任ハーベスト**は、ノードを通じてハーベストに参加する仕組みです。送金用の秘密鍵をノード管理者に渡すという意味ではありません。

参照: [Symbol Harvesting](https://docs.symbol.dev/concepts/harvesting.html)、[NEM Consensus](https://docs.nemtest.net/en/textbook/consensus/)。

## 受付・未承認・承認・ファイナライズ

| 状態 | 意味 |
| --- | --- |
| 受付 | 送信先がリクエストを受け取った段階。ブロックへの取り込みを保証しない |
| 未承認（unconfirmed） | まだブロックに取り込まれていない状態 |
| 承認（confirmed） | ノードが、トランザクションのブロックへの取り込みを観測した状態 |
| ファイナライズ | Symbol の投票によるブロック確定。承認とは別に確認する |

Symbol では REST の `chain/info` にある `latestFinalizedBlock.height` と取り込み先のブロック高を確認できます。
ただし、第三者 REST の応答を読む操作自体は、ファイナライズ証明の独立検証ではありません。
NEM の確認方法を Symbol の用語や API で代用しないでください。

参照: [Symbol REST OpenAPI](https://symbol.github.io/symbol-openapi/v1.0.4/)、[NEM NIS API](https://nemproject.github.io/)。

## ノード・REST API・SDK・Explorer

**ノード**はチェーンの同期や検証、通信を行うソフトウェアです。
**REST API**はアプリケーションが HTTP で情報取得・送信する入口です。Symbol の P2P 用ポートへ REST リクエストを送ることはできません。

**SDK**は、アドレス、トランザクション、署名などをプログラムから扱うためのライブラリです。
**Explorer**はブロックや取引をブラウザーで見るためのサービスであり、SDK やノードそのものではありません。
**Faucet**は Testnet の通貨を開発用に配布するサービスです。

API とレスポンスの具体例は [REST APIの基本](../references/rest-api.md) を参照してください。
