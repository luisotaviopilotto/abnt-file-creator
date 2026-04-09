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

  // Temporarily remove zoom transform so pages are captured at true size
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

  const pdfBlob = pdf.output("blob");

  // If Vercel Blob is available, upload directly from client (bypasses 4.5MB function limit)
  // Otherwise fall back to data URI download
  try {
    const { upload, del } = await import("@vercel/blob/client");

    const filename = `pdf/${Date.now()}_Trabalho_ABNT.pdf`;
    const { url } = await upload(filename, pdfBlob, {
      access: "public",
      handleUploadUrl: "/api/pdf-upload",
      contentType: "application/pdf",
    });

    // Open in new tab — native PDF viewer with download button
    window.open(url, "_blank");

    // Delete after 5 minutes
    setTimeout(async () => {
      try { await del(url); } catch { /* ignore */ }
    }, 5 * 60 * 1000);

  } catch {
    // Fallback: data URI download (works without Blob token)
    const a = document.createElement("a");
    a.href = pdf.output("datauristring");
    a.download = "Trabalho_ABNT.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
