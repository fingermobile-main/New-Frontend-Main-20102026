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
      const [rolesResponse, departmentsResponse, franchiseResponse] =
        await Promise.all([
          api.get<Role[]>("/rbac/roles"),
          api.get<Department[]>("/rbac/departments"),
          api.get<FranchiseLocation[]>("/rbac/franchise-locations")
        ]);

      const roles = rolesResponse.data || [];
      const departments = departmentsResponse.data || [];
      const franchiseLocations = franchiseResponse.data || [];

      setData({
        roles,
        departments,
        franchiseLocations
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch RBAC data");
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