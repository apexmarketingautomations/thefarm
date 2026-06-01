export default function DashboardLoading() {
  return (
    <main className="p-6 max-w-7xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-9 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-64" />
        ))}
      </div>
    </main>
  )
}
