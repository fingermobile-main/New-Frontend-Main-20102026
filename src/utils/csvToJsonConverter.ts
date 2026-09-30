import React, {} from 'react';
import { parse } from 'papaparse';
import * as fs from 'fs';

// This utility is meant to be run in a Node.js environment to convert CSV files to JSON
// In a browser environment, file reading works differently

export interface CsvToJsonOptions {
  inputPath: string;
  outputPath: string;
  transformFunction?: (
    data: Record<string, unknown>[],
  ) => Record<string, unknown>[];
}

export const csvToJson = (
  options: CsvToJsonOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { inputPath, outputPath, transformFunction } = options;

    // Read the CSV file
    fs.readFile(inputPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // Parse CSV data
      const parsed = parse(data, {
        header: true,
        skipEmptyLines: true
      });

      // Apply transformation if provided
      let jsonData = parsed.data as Record<string, unknown>[];
      if (transformFunction) {
        jsonData = transformFunction(jsonData);
      }

      // Write JSON data to output file
      fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          reject(writeErr);
          return;
        }

        resolve();
      });
    });
  });
};

// Browser version for client-side usage
export const csvToJsonBrowser = (
  csvText: string,
  transformFunction?: (
    data: Record<string, unknown>[],
  ) => Record<string, unknown>[],
): Record<string, unknown>[] => {
  const parsed = parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  let jsonData = parsed.data as Record<string, unknown>[];
  if (transformFunction) {
    jsonData = transformFunction(jsonData);
  }

  return jsonData;
};
