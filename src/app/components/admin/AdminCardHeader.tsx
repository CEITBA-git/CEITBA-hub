import React, { ReactNode } from 'react';

interface AdminCardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const AdminCardHeader: React.FC<AdminCardHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="px-6 py-5 flex justify-between items-center">
      <div>
        <h3 className="text-lg leading-6 font-medium text-textDefault">{title}</h3>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-gray">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default AdminCardHeader; 