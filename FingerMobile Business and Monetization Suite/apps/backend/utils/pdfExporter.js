/*
 * FingerMobile Protocol™ - PDF Export Utility
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const PDFDocument = require('pdfkit');

const pdfExporter = (data, options = {}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
    
    doc.on('error', (err) => {
      reject(err);
    });
    
    // Add title
    doc.fontSize(20).text('Analytics Report', { align: 'center' });
    doc.moveDown();
    
    // Add metadata
    doc.fontSize(12).text(`Generated on: ${new Date().toISOString()}`, { align: 'right' });
    doc.moveDown();
    
    // Add data to PDF
    if (data && data.length > 0) {
      data.forEach((row, index) => {
        doc.fontSize(10);
        doc.text(`${index + 1}. ${JSON.stringify(row, null, 2)}`);
        doc.moveDown();
      });
    } else {
      doc.text('No data available for export.');
    }
    
    doc.end();
  });
};

module.exports = pdfExporter;