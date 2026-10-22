'use client';

/**
 * High-quality PDF Exporter for Financial Calculators using jsPDF and html2canvas
 */
export async function exportCalculatorToPdf({
  elementId = 'calculator-report-view',
  title = 'Financial Calculator Report',
  fileName = 'Finasset_Calculator_Report.pdf',
}) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id "${elementId}" not found for PDF export.`);
      return false;
    }

    // Dynamic import to prevent SSR issues
    const { default: html2canvas } = await import('html2canvas');
    const { jsPDF } = await import('jspdf');

    // Create canvas snapshot with high DPI scale
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#f8fafc',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const contentHeight = (imgHeight * contentWidth) / imgWidth;

    // Optional top header in PDF
    pdf.setFillColor(15, 43, 68); // #0f2b44
    pdf.rect(0, 0, pdfWidth, 14, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text('FINASSET WEALTH MANAGEMENT  •  FINANCIAL PLANNING REPORT', margin, 9);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(200, 215, 230);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    pdf.text(`Date: ${dateStr}`, pdfWidth - margin - 25, 9);

    // If fits on one page
    if (contentHeight <= pdfHeight - 24) {
      pdf.addImage(imgData, 'PNG', margin, 18, contentWidth, contentHeight);
    } else {
      // Multi-page handling if content is long
      let heightLeft = contentHeight;
      let position = 18;

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - 24);

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + 14;
        pdf.addPage();
        // Top header on subsequent pages
        pdf.setFillColor(15, 43, 68);
        pdf.rect(0, 0, pdfWidth, 10, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text('FINASSET WEALTH MANAGEMENT', margin, 7);

        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Fallback: trigger standard browser print dialog
    if (typeof window !== 'undefined') {
      window.print();
    }
    return false;
  }
}
