export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full border-4 border-[#0f2b44]/20 border-t-[#f87b1f] animate-spin mb-4" />
      <span className="text-xs font-bold uppercase tracking-wider text-[#0f2b44]">
        Loading Finasset Wealth...
      </span>
    </div>
  );
}
