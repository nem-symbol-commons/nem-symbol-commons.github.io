import type { ReactNode } from "react";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import DocItemContent from "@theme-original/DocItem/Content";
import type { Props } from "@theme/DocItem/Content";
import styles from "./styles.module.css";

type ArticleDates = {
  publishedAt: string | null;
  updatedAt: string | null;
};

export default function Content({ children, ...props }: Props): ReactNode {
  const { metadata } = useDoc();
  const { i18n } = useDocusaurusContext();
  const articles = usePluginData("commons-article-dates") as Record<string, ArticleDates>;
  const dates = articles[metadata.source];
  const formatter = new Intl.DateTimeFormat(i18n.currentLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Tokyo",
    timeZoneName: "short",
  });

  function renderDate(value: string | null): ReactNode {
    return value ? (
      <time dateTime={value}>{formatter.format(new Date(value))}</time>
    ) : (
      <Translate id="commons.articleDates.uncommitted">未コミット</Translate>
    );
  }

  return (
    <DocItemContent {...props}>
      {dates && (
        <dl className={styles.dates}>
          <div className={styles.date}>
            <dt><Translate id="commons.articleDates.published">投稿日</Translate></dt>
            <dd>{renderDate(dates.publishedAt)}</dd>
          </div>
          <div className={styles.date}>
            <dt><Translate id="commons.articleDates.updated">最終更新</Translate></dt>
            <dd>{renderDate(dates.updatedAt)}</dd>
          </div>
        </dl>
      )}
      {children}
    </DocItemContent>
  );
}
