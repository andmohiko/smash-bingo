export const BottomFooter = (): React.ReactNode => {
  return (
    <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-500">
      <p className="block">©︎ 2025 スマンゴ - スマブラビンゴツール</p>
      <p className="block">
        Powered by{' '}
        <a href="https://smarepo.me" target="_blank" rel="noopener noreferrer">
          スマレポ
        </a>
      </p>
    </div>
  )
}
