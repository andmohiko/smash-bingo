import Head from 'next/head'

export const PageHead = (): React.ReactElement => (
  <Head>
    <title>スマンゴ - スマブラビンゴツール</title>
    <meta
      name="description"
      content="スマブラのビンゴカードを作成するサイトです。"
    />
    <link rel="icon" href="/favicon.ico" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="canonical" href="https://bingo.smarepo.me/" />

    {/* OGP */}
    <meta property="og:url" content="https://bingo.smarepo.me/" />
    <meta property="og:title" content="スマンゴ - スマブラビンゴツール" />
    <meta
      property="og:description"
      content="スマブラのビンゴカードを作成するサイトです。"
    />
    <meta property="og:image" content="/ogp.png" />
    <meta property="og:site_name" content="スマンゴ - スマブラビンゴツール" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ja_JP" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@smarepo" />
    <meta name="twitter:creator" content="@smarepo" />
    <meta name="twitter:title" content="スマンゴ - スマブラビンゴツール" />
    <meta
      name="twitter:description"
      content="スマブラのビンゴカードを作成するサイトです。"
    />
    <meta name="twitter:image" content="/ogp.png" />
    <meta name="twitter:image:width" content="1200" />
    <meta name="twitter:image:height" content="630" />
  </Head>
)
