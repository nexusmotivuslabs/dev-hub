export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="text-center text-gray-600 text-xs sm:text-sm">
          <p>Developer Hub - Life World OS</p>
          <p className="mt-1 sm:mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </footer>
  )
}




