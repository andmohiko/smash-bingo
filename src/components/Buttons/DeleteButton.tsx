type Props = {
  children: React.ReactNode
  onClick: () => void
  importance?: 'primary' | 'secondary' | 'tertiary'
  isDisabled?: boolean
  leftIcon?: React.ReactNode
}

export const DeleteButton = ({
  children,
  onClick,
  importance = 'primary',
  isDisabled = false,
  leftIcon,
}: Props) => {
  // primary is solid blue, secondary is outlined blue, tertiary is ghost blue,
  const importanceClass = {
    primary: 'bg-red-500 hover:bg-red-600 text-white',
    secondary:
      'bg-transparent border border-red-500 hover:bg-red-50 text-red-500',
    tertiary: 'bg-transparent hover:bg-red-50 text-red-500',
  }
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg transition-colors ${
        importanceClass[importance]
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-2">
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
      </div>
    </button>
  )
}

type DeleteIconButtonProps = {
  onClick: () => void
  importance?: 'primary' | 'secondary' | 'tertiary'
  isDisabled?: boolean
}

export const DeleteIconButton = ({
  onClick,
  importance = 'primary',
  isDisabled = false,
}: DeleteIconButtonProps) => {
  const importanceClass = {
    primary: 'bg-red-500 hover:bg-red-600 text-white',
    secondary:
      'bg-transparent border border-red-500 hover:bg-red-50 text-red-500',
    tertiary: 'bg-transparent hover:bg-red-50 text-red-500',
  }
  return (
    <button
      onClick={onClick}
      className={`px-2 py-2 rounded-lg transition-colors ${
        importanceClass[importance]
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}
