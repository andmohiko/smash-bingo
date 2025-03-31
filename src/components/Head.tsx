import Head from 'next/head'

export const PageHead = (): React.ReactElement => (
  <Head>
    <title>スマブラビンゴ</title>
    <meta
      name="description"
      content="スマブラのビンゴカードを作成するサイトです。"
    />
    <link rel="icon" href="/favicon.ico" />
  </Head>
)
