import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const exportToPdf = async () => {
  const { toJpeg } = await import("html-to-image");

  // Pick the visible preview container.
  // MobileEditor renders both #preview-desktop and #preview-mobile in the DOM —
  // we need the one that is actually visible (not hidden by display:none or opacity:0).
  const getVisibleContainer = (): Element => {
    const candidates = ["preview-desktop", "preview-mobile"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    for (const el of candidates) {
      // offsetWidth/offsetHeight are 0 when hidden via display:none or inside a hidden ancestor
      // Also skip opacity:0 (inactive mobile tab)
      const style = window.getComputedStyle(el);
      if (el.offsetWidth > 0 && el.offsetHeight > 0 && style.opacity !== "0") return el;
    }
    return document;
  };

  const previewContainer = getVisibleContainer();
  const pages = previewContainer.querySelectorAll<HTMLElement>(".a4-page-container");
  if (pages.length === 0) {
    alert("Nenhuma página encontrada para exportar.");
    return;
  }

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

  if (scaledWrapper && originalTransform !== null) {
    scaledWrapper.style.transform = originalTransform;
    scaledWrapper.style.transformOrigin = "top";
  }

  // Direct client-side download — no server involved, no permission issues
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Trabalho_ABNT.pdf";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
