import type { NextPage } from 'next'

import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { BingoCardContainer } from '~/features/bingo/components/BingoCardContainer'

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <BingoCardContainer />
    </DefaultLayout>
  )
}

export default Home
