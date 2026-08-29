import React from 'react';
import { Table, Text } from '@mantine/core';

interface DataTableProps<T = Record<string, any>> {
  columns: Column[];
  rows: T[];
  className?: string;
}

type Column = {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
};

const DataTable = <T extends Record<string, any>>({ 
  columns, 
  rows, 
  className 
}: DataTableProps<T>) => {
  return (
    <Table highlightOnHover className={className}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>
              <Text size="sm" fw={500}>
                {column.header}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={`${rowIndex}-${column.key}`}>
                {column.render 
                  ? column.render(row[column.key], row) 
                  : String(row[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DataTable;