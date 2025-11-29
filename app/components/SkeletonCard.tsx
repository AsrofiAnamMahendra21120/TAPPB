export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden h-full animate-pulse">
      {/* Gambar Dummy */}
      <div className="h-32 bg-gray-200"></div>
      {/* Text Dummy */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}