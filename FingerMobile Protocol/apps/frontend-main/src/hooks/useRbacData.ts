import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Role {id: string; name: string;
  description?: string;
  department: string;
  permissions: string[];
}

interface Department {id: string; name: string;
  members: number;
  features: number;
}

interface FranchiseLocation {id: string; name: string;
  children?: FranchiseLocation[];
}

interface RbacData {roles: Role[];
  departments: Department[];
  franchiseLocations: FranchiseLocation[];
}

interface UseRbacDataResult {data: RbacData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const useRbacData = (): UseRbacDataResult => {
  const [data, setData] = React.useState<RbacData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Roles are implemented in the backend under /admin/rbac/roles
      const rolesResponse = await api.get<any>('/admin/rbac/roles').catch(() => ({ data: { roles: [] } }));

      // Permissions are implemented under /admin/rbac/permissions
      const permissionsResponse = await api.get<any>('/admin/rbac/permissions').catch(() => ({ data: { permissions: [] } }));

      // The following might not be implemented in the backend yet, fallback to empty arrays
      const departmentsResponse = await api.get<any>('/admin/rbac/departments').catch(() => ({ data: [] }));
      const franchiseResponse = await api.get<any>('/admin/rbac/franchise-locations').catch(() => ({ data: [] }));

      // Handle both { roles: [...] } and direct array responses
      const rolesData = rolesResponse.data?.roles || rolesResponse.data || [];
      const roles = Array.isArray(rolesData) ? rolesData : [];

      const departments = Array.isArray(departmentsResponse.data) ? departmentsResponse.data : [];
      const franchiseLocations = Array.isArray(franchiseResponse.data) ? franchiseResponse.data : [];

      setData({
        roles,
        departments,
        franchiseLocations
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch RBAC data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = React.useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refreshData };
};

export default useRbacData;
