import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

export default function MenuLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <LoadingSkeleton variant="table" />
    </div>
  );
}
