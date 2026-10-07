import { jsPDF } from 'jspdf';
import { Complaint } from '../types';

export function generateComplaintPDF(complaint: Complaint) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background banner
  doc.setFillColor(15, 23, 42); // dark slate #0f172a
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Emerald accent line
  doc.setFillColor(16, 185, 129); // emerald #10b981
  doc.rect(0, 40, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FIXIT AI — ACTIONABLE GRIEVANCE DOSSIER', 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text('Intelligent Civic & Campus Problem Resolution Network', 15, 28);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 34);

  // Tracking ID Badge on right
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 75, 12, 60, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('OFFICIAL TRACKING ID', pageWidth - 70, 18);
  doc.setFontSize(12);
  doc.setTextColor(52, 211, 153);
  doc.text(complaint.id, pageWidth - 70, 26);

  let y = 52;

  // Metadata Grid
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, pageWidth - 30, 32, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, pageWidth - 30, 32, 'S');

  // Category
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('CATEGORY:', 20, y + 8);
  doc.setTextColor(15, 23, 42);
  doc.text(complaint.category.toUpperCase(), 50, y + 8);

  // Priority
  doc.setTextColor(100, 116, 139);
  doc.text('PRIORITY:', 115, y + 8);
  const priorityColor =
    complaint.priority === 'CRITICAL' ? [225, 29, 72] :
    complaint.priority === 'HIGH' ? [234, 88, 12] :
    complaint.priority === 'MEDIUM' ? [217, 119, 6] : [16, 185, 129];
  doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
  doc.text(complaint.priority, 140, y + 8);

  // Department
  doc.setTextColor(100, 116, 139);
  doc.text('DEPARTMENT:', 20, y + 18);
  doc.setTextColor(15, 23, 42);
  doc.text(complaint.department, 50, y + 18);

  // Status
  doc.setTextColor(100, 116, 139);
  doc.text('INITIAL STATUS:', 115, y + 18);
  doc.setTextColor(16, 185, 129);
  doc.text(complaint.status, 145, y + 18);

  // Location
  doc.setTextColor(100, 116, 139);
  doc.text('LOCATION:', 20, y + 26);
  doc.setTextColor(15, 23, 42);
  const locText = doc.splitTextToSize(complaint.location.fullAddress, 130);
  doc.text(locText, 50, y + 26);

  y += 42;

  // Subject Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(complaint.subject, 15, y);
  y += 8;

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(complaint.description, pageWidth - 30);
  doc.text(descLines, 15, y);
  y += descLines.length * 5 + 8;

  // Suggested Immediate Action
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('SUGGESTED IMMEDIATE ACTION:', 20, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(complaint.suggestedAction, 20, y + 12);
  y += 24;

  // 5-Step Action Plan Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('AI-GENERATED ACTION PLAN & RESOLUTION ROADMAP', 15, y);
  y += 7;

  complaint.actionPlan.forEach((step) => {
    doc.setFillColor(step.status === 'completed' ? 236 : 248, step.status === 'completed' ? 253 : 250, step.status === 'completed' ? 245 : 252);
    doc.roundedRect(15, y, pageWidth - 30, 14, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, pageWidth - 30, 14, 1.5, 1.5, 'S');

    // Step Number Badge
    doc.setFillColor(16, 185, 129);
    doc.circle(22, y + 7, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(step.step.toString(), 21, y + 9);

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.text(step.title, 30, y + 6);

    // Description
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const stepDesc = doc.splitTextToSize(step.description, pageWidth - 65);
    doc.text(stepDesc, 30, y + 11);

    y += 17;
  });

  // Footer / Verification Seal
  const footerY = 275;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, footerY, pageWidth - 15, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('FIXIT AI — Intelligent Problem to Action Ecosystem | College Symposium Edition', 15, footerY + 6);
  doc.text(`Official Document Ref: ${complaint.id}`, pageWidth - 70, footerY + 6);

  // Save the PDF
  doc.save(`${complaint.id}-FIXIT-Complaint.pdf`);
}
