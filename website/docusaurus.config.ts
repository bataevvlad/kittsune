import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Kittsune',
  tagline: 'React Native UI Components powered by Eva Design System',
  favicon: 'img/favicon.ico',

  url: 'https://bataevvlad.github.io',
  baseUrl: '/kittsune/',

  organizationName: 'bataevvlad',
  projectName: 'kittsune',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/bataevvlad/kittsune/tree/master/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Kittsune',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/components/overview',
          label: 'Components',
          position: 'left',
        },
        {
          href: '/kittsune/storybook/',
          label: 'Storybook',
          position: 'left',
        },
        {
          href: 'https://github.com/bataevvlad/kittsune',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: '/docs/getting-started/what-is-kittsune'},
            {label: 'Guides', to: '/docs/guides/getting-started'},
            {label: 'Design System', to: '/docs/design-system/intro'},
          ],
        },
        {
          title: 'Components',
          items: [
            {label: 'Overview', to: '/docs/components/overview'},
            {label: 'Button', to: '/docs/components/button'},
            {label: 'Input', to: '/docs/components/input'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/bataevvlad/kittsune'},
            {label: 'Storybook', href: '/kittsune/storybook/'},
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Kittsune Contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'tsx', 'typescript'],
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
