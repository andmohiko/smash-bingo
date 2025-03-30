import { ReactElement, ReactNode, useState } from 'react'

import { FlexBox } from '~/components/Base/FlexBox'
import { LoadingOverlay } from '~/components/Base/Loading'
import { PageHead } from '~/components/Head'

type Props = {
  children?: ReactNode
}

export const DefaultLayout = ({ children }: Props): ReactElement => {
  // recoilなどに移してローディングをグローバルで管理する
  const [loading] = useState<boolean>(false)

  return (
    <>
      <PageHead />

      <FlexBox
        style={{
          position: 'relative',
        }}
      >
        {loading && <LoadingOverlay />}
        <FlexBox px={32} py={16}>
          {children}
        </FlexBox>
      </FlexBox>
    </>
  )
}
