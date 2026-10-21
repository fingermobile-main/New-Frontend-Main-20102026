import React from 'react';
import RoleBasedDashboard from './RoleBasedDashboard';

interface MemberDashboardProps {
  userId?: string;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ userId }) => {
  return <RoleBasedDashboard userId={userId} initialRole="member" />;
};

export default MemberDashboard;
