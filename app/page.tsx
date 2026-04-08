import { Sidebar } from "@/components/abnt/Sidebar";
import { PreviewPane } from "@/components/abnt/PreviewPane";

export default function Home() {
  return (
    <main className="flex h-screen w-full">
      {/* Sidebar: 400px width, fixed */}
      <div className="w-[400px] flex-shrink-0 bg-neutral-950 border-r border-neutral-800 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Preview Area: Flexible, fills remaining space */}
      <div className="flex-1 bg-neutral-800 overflow-y-auto relative">
        <PreviewPane />
      </div>
    </main>
  );
}
