import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MDXA from "@theme-original/MDXComponents/A";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/MDXComponents/A";
import styles from "./styles.module.css";

export default function MarkdownLink({ children, ...props }: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const href = props.href;
  let isExternal = false;

  if (href && /^(https?:)?\/\//i.test(href)) {
    try {
      isExternal = new URL(href, siteConfig.url).origin !== new URL(siteConfig.url).origin;
    } catch {
      // Leave invalid URLs to the original link component and link validation.
    }
  }

  const opensNewTab = !props.target || props.target === "_blank";

  return (
    <MDXA {...props}>
      {children}
      {isExternal && (
        <>
          <span className={styles.marker} aria-hidden="true">
            <IconExternalLink />
          </span>
          <span className={styles.screenReaderOnly}>
            {opensNewTab ? "（外部サイト・新しいタブで開きます）" : "（外部サイト）"}
          </span>
        </>
      )}
    </MDXA>
  );
}
