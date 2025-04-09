/**
 * アイコンとテキストが縦に並ぶボタン
 */
type Props = {
  children: React.ReactNode
  onClick: () => void
  importance?: 'primary' | 'secondary' | 'tertiary'
  isDisabled?: boolean
  leftIcon?: React.ReactNode
}

export const VerticalButton = ({
  children,
  onClick,
  importance = 'primary',
  isDisabled = false,
  leftIcon,
}: Props) => {
  // primary is solid blue, secondary is outlined blue, tertiary is ghost blue,
  const importanceClass = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary:
      'bg-transparent border border-blue-500 hover:bg-blue-50 text-blue-500',
    tertiary: 'bg-transparent hover:bg-blue-50 text-blue-500',
  }
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg transition-colors ${
        importanceClass[importance]
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-2 [writing-mode:vertical-rl] tracking-widest">
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
      </div>
    </button>
  )
}
