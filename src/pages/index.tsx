import type { NextPage } from 'next'

import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { BingoCard } from '~/features/bingo/components/BingoCard'

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <BingoCard />
    </DefaultLayout>
  )
}

export default Home
