import { PreviewPane } from "@/components/abnt/PreviewPane";
import { SharedDocumentLoader } from "@/components/abnt/SharedDocumentLoader";
import { DocumentProvider } from "@/context/DocumentContext";
import { MobileEditor } from "@/components/abnt/MobileEditor";

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <DocumentProvider>
      <SharedDocumentLoader docId={id} />
      <MobileEditor docId={id}>
        <PreviewPane docId={id} />
      </MobileEditor>
    </DocumentProvider>
  );
}
