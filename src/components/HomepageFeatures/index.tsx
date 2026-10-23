import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const topics = [
  {
    "title": "はじめに",
    "to": "/docs/getting-started",
    "description": "基本用語と情報源を確認し、NEM / Symbol の学び方を見つけます。"
  },
  {
    "title": "Symbol",
    "to": "/docs/symbol",
    "description": "Symbol 固有の仕様とアプリケーション開発を扱います。"
  },
  {
    "title": "NEM（NIS1）",
    "to": "/docs/nem",
    "description": "NEM（NIS1）固有の仕様とアプリケーション開発を扱います。"
  },
  {
    "title": "共通技術・比較",
    "to": "/docs/common",
    "description": "共通する技術や暗号技術を学び、NEM と Symbol の違いを整理します。"
  },
  {
    "title": "ノード運用",
    "to": "/docs/node-operation",
    "description": "ノードの構築・保守・障害対応を扱います。"
  },
  {
    "title": "プロトコル",
    "to": "/docs/protocol",
    "description": "P2P 通信、バイナリ形式、ファイナライズを扱います。"
  },
  {
    "title": "セキュリティ",
    "to": "/docs/security",
    "description": "鍵管理とアプリケーション・ノードの安全性を扱います。"
  },
  {
    "title": "トラブルシューティング",
    "to": "/docs/troubleshooting",
    "description": "問題や症状を起点に、原因の切り分けと対処方法を探します。"
  },
  {
    "title": "リファレンス",
    "to": "/docs/references",
    "description": "API・SDK の仕様と実装、外部資料へのリンクをまとめます。"
  }
];

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.topics} aria-labelledby="topics-title">
      <div className="container">
        <Heading as="h2" id="topics-title">技術分野から探す</Heading>
        <p className={styles.intro}>
          基本用語やクイックスタートから学び、分野ごとの記事と参照資料へ進めます。
        </p>
        <div className={styles.grid}>
          {topics.map(({ title, to, description }) => (
            <Link className={styles.card} key={to} to={to}>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
              <span className={styles.cardAction}>{title} の入口へ →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
