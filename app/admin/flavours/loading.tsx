import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

export default function FlavoursLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
      </div>
      <LoadingSkeleton variant="table" />
    </div>
  );
}
