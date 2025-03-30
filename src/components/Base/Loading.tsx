import Image from 'next/image'

import { FlexBox } from '~/components/Base/FlexBox'

export const LoadingAnimation = (): React.ReactElement => (
  <Image src="/images/svgs/tail-spin.svg" height="80" width="80" alt="" />
)

export const LoadingOverlay = (): React.ReactElement => (
  <FlexBox
    height="100vh"
    width="100vw"
    style={{
      backdropFilter: 'blur(3px)',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
    }}
  >
    <LoadingAnimation />
  </FlexBox>
)
