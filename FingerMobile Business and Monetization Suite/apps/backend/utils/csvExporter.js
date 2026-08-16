/*
 * FingerMobile Protocol™ - CSV Export Utility
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const csv = require('csv-stringify/sync');

const csvExporter = (data) => {
  // Convert data to CSV format
  if (!data || data.length === 0) {
    return '';
  }
  
  // Extract headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV string
  const csvData = csv(data, { 
    header: true,
    columns: headers 
  });
  
  return csvData;
};

module.exports = csvExporter;