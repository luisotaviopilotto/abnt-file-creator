import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const exportToPdf = async () => {
  const { toJpeg } = await import("html-to-image");

  const pages = document.querySelectorAll<HTMLElement>(".a4-page-container");
  if (pages.length === 0) {
    alert("Nenhuma página encontrada para exportar.");
    return;
  }

  // Temporarily remove the zoom transform so pages are captured at true size
  const scaledWrapper = pages[0].closest<HTMLElement>("[style*='scale']");
  const originalTransform = scaledWrapper?.style.transform ?? null;
  if (scaledWrapper) {
    scaledWrapper.style.transform = "none";
    scaledWrapper.style.transformOrigin = "unset";
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    const originalBoxShadow = page.style.boxShadow;
    const originalMarginBottom = page.style.marginBottom;
    page.style.boxShadow = "none";
    page.style.marginBottom = "0";

    const dataUrl = await toJpeg(page, {
      quality: 1.0,
      pixelRatio: 3,
      backgroundColor: "#ffffff",
      skipAutoScale: true,
    });

    page.style.boxShadow = originalBoxShadow;
    page.style.marginBottom = originalMarginBottom;

    if (i > 0) pdf.addPage("a4", "portrait");
    pdf.addImage(dataUrl, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  }

  // Restore zoom
  if (scaledWrapper && originalTransform !== null) {
    scaledWrapper.style.transform = originalTransform;
    scaledWrapper.style.transformOrigin = "top";
  }

  // Upload to Vercel Blob and open the public URL — avoids all browser download restrictions
  const pdfBlob = pdf.output("blob");
  const res = await fetch("/api/pdf-upload", {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: pdfBlob,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Falha ao fazer upload do PDF.");
  }

  const { url, type } = await res.json();

  if (type === "dataurl") {
    // Fallback: direct download via data URI (no Blob token configured)
    const a = document.createElement("a");
    a.href = url;
    a.download = "Trabalho_ABNT.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // Open Vercel Blob public URL in new tab
    window.open(url, "_blank");
  }
};
