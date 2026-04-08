import { Sidebar } from "@/components/abnt/Sidebar";
import { PreviewPane } from "@/components/abnt/PreviewPane";
import { SharedDocumentLoader } from "@/components/abnt/SharedDocumentLoader";

export default async function SharedDocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="flex h-screen w-full">
      <SharedDocumentLoader docId={id} />
      <div className="w-[400px] flex-shrink-0 bg-neutral-950 border-r border-neutral-800 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 bg-neutral-800 overflow-y-auto relative">
        <PreviewPane docId={id} />
      </div>
    </main>
  );
}
