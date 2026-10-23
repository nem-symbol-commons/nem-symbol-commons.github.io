import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import styles from "./index.module.css";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout description="NEM / Symbol の日本語技術ドキュメント。基礎知識、API・SDK、ノード運用の入口を技術分野別に案内します。">
      <header className={styles.heroBanner}>
        <div className="container">
          <p className={styles.eyebrow}>開発者のための共有知識</p>
          <Heading as="h1" className={styles.title}>
            {siteConfig.title}
          </Heading>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <p className={styles.description}>
            仕組みを知る。アプリケーションをつくる。ノードを運用する。
            <br />
            目的に合った技術分野から、必要な情報を探してください。
          </p>
          <Link className="button button--primary button--lg" to="/docs/getting-started">
            はじめに読む
          </Link>
        </div>
      </header>
      <main>
        <HomepageFeatures />
        <section className={styles.contribute} aria-labelledby="contribute-title">
          <div className="container">
            <Heading as="h2" id="contribute-title">知識を持ち寄る</Heading>
            <p>
              記事の追加、説明の改善、誤字の修正から参加できます。
              執筆方針と変更の送り方は貢献ガイドをご覧ください。
            </p>
            <Link to="https://github.com/nem-symbol-commons/nem-symbol-commons.github.io/blob/main/CONTRIBUTING.md">
              貢献ガイドを読む →
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
