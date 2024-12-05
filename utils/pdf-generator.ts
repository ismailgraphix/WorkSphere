import { jsPDF } from "jspdf";

interface Employee {
  firstName: string;
  lastName: string;
  position: string;
  employeeId: string;
  department: {
    name: string;
  };
  address: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export const generateIDCardPDF = async (employee: Employee) => {
  // Create PDF with credit card dimensions (standard CR80 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 53.98] // Standard CR80 card size
  });

  // Function to draw orange corner
  const drawOrangeCorner = (x: number, y: number, size: number, isTopLeft: boolean) => {
    doc.setFillColor(251, 146, 60); // Tailwind orange-400
    if (isTopLeft) {
      doc.triangle(x, y, x + size, y, x, y + size, 'F');
    } else {
      doc.triangle(x, y, x - size, y, x, y - size, 'F');
    }
  };

  // Front side
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Orange corners
  drawOrangeCorner(0, 0, 25, true);
  drawOrangeCorner(85.6, 53.98, 25, false);

  // Company logo
  try {
    doc.addImage('/assets/employee.png', 'PNG', 5, 5, 20, 8);
  } catch (error) {
    console.error('Error adding company logo:', error);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('COMPANY', 7, 10);
  }

  // Profile Image placeholder (gray circle with initials)
  doc.setFillColor(229, 231, 235); // gray-200
  doc.circle(42.8, 25, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99); // gray-600
  doc.text(
    `${employee.firstName[0]}${employee.lastName[0]}`,
    42.8,
    27,
    { align: 'center' }
  );

  // Employee details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${employee.lastName},`, 42.8, 42, { align: 'center' });
  doc.text(employee.firstName, 42.8, 46, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.position, 42.8, 50, { align: 'center' });
  doc.text(employee.department.name, 42.8, 53, { align: 'center' });
  doc.text(`ID: ${employee.employeeId}`, 42.8, 56, { align: 'center' });

  // Get QR code from the DOM and add it to PDF
  const qrCodeElement = document.querySelector('#front-card canvas') as HTMLCanvasElement;
  if (qrCodeElement) {
    const qrCodeDataUrl = qrCodeElement.toDataURL('image/png');
    doc.addImage(qrCodeDataUrl, 'PNG', 32.8, 58, 20, 20);
  }

  // Back side
  doc.addPage([85.6, 53.98]);
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // Orange corners on back
  drawOrangeCorner(0, 0, 25, true);
  drawOrangeCorner(85.6, 53.98, 25, false);

  // Back content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  
  let yPos = 10;
  const lineHeight = 4;

  // Contact Information
  doc.setFont('helvetica', 'bold');
  doc.text('Address:', 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.address, 5, yPos + 3, { maxWidth: 75 });

  yPos += lineHeight * 3;
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.email, 5, yPos + 3);

  yPos += lineHeight * 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.phoneNumber, 5, yPos + 3);

  yPos += lineHeight * 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Start Date:', 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(employee.dateOfJoining).toLocaleDateString(), 5, yPos + 3);

  // Emergency Contact
  yPos += lineHeight * 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Emergency Contact:', 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${employee.emergencyContactName}`, 5, yPos + 3);
  doc.text(`Phone: ${employee.emergencyContactPhone}`, 5, yPos + 6);
  doc.text(`Relationship: ${employee.emergencyContactRelationship}`, 5, yPos + 9);

  // Terms and Conditions
  yPos += lineHeight * 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Terms and Conditions', 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  const terms = 'This identification card (ID) certifies that the bearer is an employee of the company. ID should not be used for official identification outside the company.';
  doc.text(terms, 5, yPos + 3, { maxWidth: 75 });

  // Signature lines
  yPos += lineHeight * 4;
  doc.line(5, yPos, 35, yPos);
  doc.line(45, yPos, 75, yPos);
  doc.setFontSize(6);
  doc.text("Employee's Signature", 15, yPos + 3);
  doc.text("Company CEO", 55, yPos + 3);

  // Save the PDF
  doc.save(`${employee.firstName}_${employee.lastName}_ID_Card.pdf`);
};