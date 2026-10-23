import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const repositoryUrl =
  "https://github.com/nem-symbol-commons/nem-symbol-commons.github.io";

const config: Config = {
  title: "NEM & Symbol Commons",
  tagline: "NEM / Symbol の開発と運用を、日本語で。",
  favicon: "img/Symbol_NEM_Combo_Icon.png",
  future: { v4: true },
  url: "https://nem-symbol-commons.github.io",
  baseUrl: "/",
  organizationName: "nem-symbol-commons",
  projectName: "nem-symbol-commons.github.io",
  trailingSlash: false,
  onBrokenLinks: "throw",
  i18n: {
    defaultLocale: "ja",
    locales: ["ja"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: `${repositoryUrl}/edit/main/`,
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: "NEM & Symbol Commons",
      logo: {
        alt: "NEM と Symbol のコンビネーションアイコン",
        src: "img/Symbol_NEM_Combo_Icon.png",
        width: 32,
        height: 32,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "ドキュメント",
        },
        {
          href: `${repositoryUrl}/blob/main/CONTRIBUTING.md`,
          label: "貢献ガイド",
          position: "right",
        },
        { href: repositoryUrl, label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "技術分野",
          items: [
            { label: "NEM", to: "/docs/nem" },
            { label: "Symbol", to: "/docs/symbol" },
            { label: "API・SDK", to: "/docs/references" },
            { label: "ノード運用", to: "/docs/node-operation" },
          ],
        },
        {
          title: "Commons に参加する",
          items: [
            {
              label: "貢献ガイド",
              href: `${repositoryUrl}/blob/main/CONTRIBUTING.md`,
            },
            { label: "Issue", href: `${repositoryUrl}/issues` },
            { label: "GitHub", href: repositoryUrl },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NEM & Symbol Commons contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
