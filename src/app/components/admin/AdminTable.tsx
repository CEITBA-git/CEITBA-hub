import React, { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  cell?: (item: any) => ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
  selectedId?: string | null;
  idField?: string;
}

const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  data,
  onRowClick,
  selectedId = null,
  idField = 'id'
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-surface">
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
        <tbody className="bg-background divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr 
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`
                  ${onRowClick ? 'cursor-pointer' : ''} 
                  hover:bg-surface/30 transition-colors duration-150
                  ${selectedId === item[idField] ? 'bg-primary/5' : ''}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.cell ? column.cell(item) : item[column.accessor]}
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
};

export default AdminTable; 