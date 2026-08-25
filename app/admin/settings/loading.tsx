import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
      <LoadingSkeleton variant="form" />
    </div>
  );
}
