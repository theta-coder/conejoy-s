import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
      <LoadingSkeleton variant="stats" />
      <LoadingSkeleton variant="table" />
    </div>
  );
}
