import React, { ReactNode } from 'react';

// Define generic type for table data
interface Column<T> {
  header: string;
  accessor: string;
  cell?: (item: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  selectedId?: string | null;
  idField?: string;
}

// Use generic type parameter for better type safety
function AdminTable<T = Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  selectedId = null,
  idField = 'id'
}: AdminTableProps<T>) {
  // Create a type-safe way to access dynamic properties
  const getItemValue = (item: T, key: string): unknown => {
    return (item as Record<string, unknown>)[key];
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-background ">
           
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr 
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`
                  ${onRowClick ? 'cursor-pointer' : ''} 
                  hover:bg-surface/30 transition-colors duration-150
                  ${selectedId === String(getItemValue(item, idField)) ? 'bg-primary/5' : ''}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.cell ? column.cell(item) : String(getItemValue(item, column.accessor) || '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable; 