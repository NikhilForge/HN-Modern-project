export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
