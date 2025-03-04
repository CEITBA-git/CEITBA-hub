import React, { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold text-textDefault">{title}</h1>
        {description && (
          <p className="mt-1 text-gray">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default AdminPageHeader; 