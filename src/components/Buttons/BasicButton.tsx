type Props = {
  children: React.ReactNode
  onClick: () => void
  importance?: 'primary' | 'secondary' | 'tertiary'
}

export const BasicButton = ({
  children,
  onClick,
  importance = 'primary',
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
      className={`px-4 py-2.5 rounded-lg transition-colors ${importanceClass[importance]}`}
    >
      {children}
    </button>
  )
}
