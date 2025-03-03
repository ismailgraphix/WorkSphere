import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jsPDF from 'jspdf';

export async function GET(
  request: NextRequest,
  { params }: { params: { leaveId: string } }
) {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: params.leaveId },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            position: true,
          }
        },
        department: {
          select: {
            name: true,
          }
        },
        approvedBy: {
          select: {
            name: true,
            position: true,
          }
        },
      }
    });

    if (!leave) {
      return NextResponse.json({ error: 'Leave not found' }, { status: 404 });
    }

    // Add console.log to debug
    console.log('Employee ID:', leave.employee.employeeId);
    console.log('Leave Status:', leave.status);

    const doc = new jsPDF();
    let y = 20;

    // Common header for all templates
    doc.setFontSize(18);
    doc.text('BAZE UNIVERSITY', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(16);
    doc.text('ABUJA', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(14);
    doc.text('OFFICE OF THE REGISTRAR', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 20;

    if (leave.status === 'PENDING') {
      // Leave Application Template
      const refNumber = `BU/PER/${leave.employee.employeeId}/LA/${new Date().getFullYear()}`;
      doc.setFontSize(12);
      doc.text(refNumber, 20, y);
      y += 10;

      doc.text('LEAVE APPLICATION', doc.internal.pageSize.width / 2, y, { align: 'center' });
      y += 20;

      doc.text(`Employee Name: ${leave.employee.firstName} ${leave.employee.lastName}`, 20, y);
      y += 10;
      doc.text(`Employee ID: ${leave.employee.employeeId}`, 20, y);
      y += 10;
      doc.text(`Department: ${leave.department.name}`, 20, y);
      y += 10;
      doc.text(`Position: ${leave.employee.position}`, 20, y);
      y += 20;

      doc.text('Leave Details:', 20, y);
      y += 10;
      doc.text(`Start Date: ${new Date(leave.startDate).toLocaleDateString('en-GB')}`, 30, y);
      y += 10;
      doc.text(`End Date: ${new Date(leave.endDate).toLocaleDateString('en-GB')}`, 30, y);
      y += 10;
      doc.text(`Reason: ${leave.reason}`, 30, y);
      y += 20;

      doc.text('Status: PENDING APPROVAL', 20, y);

    } else {
      // Leave Notification Template (for APPROVED or REJECTED)
      const refNumber = `BU/PER/${leave.employee.employeeId}/VL.1/${new Date().getFullYear()}`;
      doc.setFontSize(12);
      doc.text(refNumber, 20, y);
      y += 10;

      doc.text(new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }), 20, y);
      y += 20;

      // Employee details
      doc.text(`${leave.employee.firstName} ${leave.employee.lastName}`, 20, y);
      y += 7;
      doc.text(leave.employee.employeeId, 20, y);
      y += 7;
      doc.text(leave.department.name, 20, y);
      y += 7;
      doc.text('Baze University,', 20, y);
      y += 7;
      doc.text('Abuja.', 20, y);
      y += 15;

      doc.text(`Dear ${leave.employee.firstName},`, 20, y);
      y += 20;

      if (leave.status === 'APPROVED') {
        doc.text('NOTIFICATION OF LEAVE APPROVAL', doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 20;

        doc.text(`Please be informed that your leave request has been approved for the period from ${new Date(leave.startDate).toLocaleDateString('en-GB')} to ${new Date(leave.endDate).toLocaleDateString('en-GB')}.`, 20, y, {
          maxWidth: doc.internal.pageSize.width - 40
        });
        y += 20;

        const resumptionDate = new Date(leave.endDate);
        resumptionDate.setDate(resumptionDate.getDate() + 1);
        doc.text(`You are expected to resume duty on ${resumptionDate.toLocaleDateString('en-GB')}.`, 20, y, {
          maxWidth: doc.internal.pageSize.width - 40
        });
        y += 30;

        if (leave.approvedBy) {
          doc.text('Approved by:', 20, y);
          y += 10;
          doc.text(leave.approvedBy.name, 20, y);
          y += 7;
          doc.text(leave.approvedBy.position, 20, y);
          y += 7;
          doc.text('For: Director/Deputy Registrar, Human Resources', 20, y);
        }
      } else if (leave.status === 'REJECTED') {
        doc.text('NOTIFICATION OF LEAVE REJECTION', doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 20;

        doc.text('We regret to inform you that your leave request has been rejected.', 20, y, {
          maxWidth: doc.internal.pageSize.width - 40
        });
        y += 20;

        if (leave.rejectionReason) {
          doc.text('Reason for rejection:', 20, y);
          y += 10;
          doc.text(leave.rejectionReason, 30, y, {
            maxWidth: doc.internal.pageSize.width - 60
          });
        }
      }
    }

    // Add watermark
    doc.setFontSize(60);
    doc.setTextColor(200, 200, 200);
    doc.text(leave.employee.employeeId, doc.internal.pageSize.width/2, doc.internal.pageSize.height/2, { 
      align: 'center',
      angle: -45 
    });
    doc.setTextColor(0, 0, 0);

    // Convert and return PDF with proper filename
    const filename = `leave_${leave.status.toLowerCase()}_${leave.employee.employeeId}`;
    console.log('Generated filename:', filename);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}.pdf`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
  }
} 