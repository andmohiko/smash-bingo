import Head from 'next/head'

export const PageHead = (): React.ReactElement => (
  <Head>
    <title>SmashBingo - スマブラビンゴツール</title>
    <meta
      name="description"
      content="スマブラのビンゴカードを作成するサイトです。"
    />
    <link rel="icon" href="/favicon.ico" />
  </Head>
)
