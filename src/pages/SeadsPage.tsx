import React, { useEffect, useState, useCallback, useMemo } from 'react';

import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { SeadsInitiative } from '../types/seads'; // Use the type from the types file

import {
  MembersIcon,
  CalendarIcon,
  MapPinIcon,
  UserCircleIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '../icons';
import PageHeader from '../components/PageHeader';
import EnhancedFilterBar, { FilterOptions } from '../components/shared/EnhancedFilterBar';

interface FilterState {
  category?: string;
  status?: string;
  dateRange?: [string, string];
  location?: string;
  searchQuery?: string;
  sortBy?: string;
}

const SeadsPage: React.FC = () => {
  const { seadsInitiatives, loading, error } = useAppContext();
  const [filters, setFilters] = useState<FilterState>({});
  const [filteredInitiatives, setFilteredInitiatives] = useState<SeadsInitiative[]>([]);

  // Initialize filtered initiatives when data is loaded
  useEffect(() => {
    if (seadsInitiatives?.length > 0) {
      applyFilters(filters, seadsInitiatives as unknown as SeadsInitiative[]);
    }
  }, [seadsInitiatives]);

  const applyFilters = useCallback((newFilters: FilterState, data: SeadsInitiative[] = seadsInitiatives as unknown as SeadsInitiative[]) => {
    let result = [...data];

    if (newFilters.category && newFilters.category !== "all") {
      result = result.filter(init => 
        init.category?.toLowerCase().includes(newFilters.category!.toLowerCase())
      );
    }

    if (newFilters.status) {
      result = result.filter(init => (init as any).status === newFilters.status);
    }

    if (newFilters.dateRange) {
      const [startDate, endDate] = newFilters.dateRange;
      result = result.filter(init => {
        const initStartDate = init.startDate ? new Date(init.startDate) : new Date(0);
        const initEndDate = init.endDate ? new Date(init.endDate) : new Date(8640000000000000); // Max date
        const filterStartDate = startDate ? new Date(startDate) : new Date(0);
        const filterEndDate = endDate ? new Date(endDate) : new Date(8640000000000000);
        
        return initStartDate <= filterEndDate && initEndDate >= filterStartDate;
      });
    }

    if (newFilters.location) {
      result = result.filter(init => 
        init.location?.toLowerCase().includes(newFilters.location!.toLowerCase())
      );
    }

    if (newFilters.searchQuery) {
      const query = newFilters.searchQuery.toLowerCase();
      result = result.filter(init => 
        init.title.toLowerCase().includes(query) || 
        init.description?.toLowerCase().includes(query) ||
        init.category?.toLowerCase().includes(query)
      );
    }

    // Sorting logic
    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case 'newest':
          result.sort(
            (a, b) => {
              const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
              const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
              return dateB - dateA;
            }
          );
          break;
        case 'oldest':
          result.sort(
            (a, b) => {
              const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
              const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
              return dateA - dateB;
            }
          );
          break;
        case 'progress':
          result.sort((a, b) => (b.progress || 0) - (a.progress || 0));
          break;
        case 'popularity':
          result.sort((a, b) => ((b as any).members?.length || 0) - ((a as any).members?.length || 0));
          break;
        default:
          break;
      }
    }

    setFilteredInitiatives(result);
  }, [seadsInitiatives]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  // Calculate statistics
  const totalMembers = useMemo(() => {
    return filteredInitiatives.reduce(
      (sum: number, init: any) => sum + (init.members?.length || 0), 0
    );
  }, [filteredInitiatives]);

  const totalInitiatives = filteredInitiatives.length;
  const avgProgress = useMemo(() => {
    return totalInitiatives > 0
      ? filteredInitiatives.reduce(
          (sum: number, init: SeadsInitiative) => sum + (init.progress || 0),
          0
        ) / totalInitiatives
      : 0;
  }, [filteredInitiatives]);

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <GlobeAltIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                SEADS Initiatives
              </h1>
              <p className="text-gray-600">
                Explore and participate in Sustainable Economic and Development Solutions initiatives
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-2xl font-bold">{totalInitiatives}</h3>
                <p className="text-green-100">Total Initiatives</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2">
                  <MembersIcon className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">
                    {totalMembers.toLocaleString()}
                  </h3>
                </div>
                <p className="text-blue-100">Total Members</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">{avgProgress.toFixed(1)}%</h3>
                </div>
                <p className="text-purple-100">Average Progress</p>
              </div>
            </div>

            <EnhancedFilterBar
              filterOptions={{
                categories: filters.category ? [filters.category] : [], // Changed to use categories array
                sortByOptions: [
                  { value: 'name', label: 'Name' },
                  { value: 'members', label: 'Members' },
                  { value: 'date', label: 'Date' },
                ],
                searchPlaceholder: "Search initiatives..."
              }}
              onFiltersChange={handleFilterChange}
              initialFilters={{
                category: filters.category,
                sortBy: filters.sortBy,
              }}
            />

            {/* Initiatives Grid */}
            {filteredInitiatives.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100 mt-6">
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No initiatives found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredInitiatives.map((initiative: SeadsInitiative) => (
                  <div
                    key={initiative.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
                  >
                    <img
                      src={initiative.imageUrl}
                      alt={initiative.title}
                      className="w-full h-48 object-cover"
                     />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {initiative.title}
                        </h3>
                        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {initiative.category || 'General'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {initiative.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {initiative.location || 'Online'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {new Date(initiative.startDate).toLocaleDateString()} -{" "}
                          {(initiative.endDate ? new Date(initiative.endDate).toLocaleDateString() : 'N/A')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MembersIcon className="w-4 h-4 mr-2" />
                          {((initiative as any).members?.length || 0).toLocaleString()} members
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{initiative.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full"
                            style={{ width: `${initiative.progress || 0}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {initiative.target?.toLocaleString() || '0'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <img
                            src={initiative.organizer?.avatarUrl}
                            alt={initiative.organizer?.name}
                            className="w-8 h-8 rounded-full mr-2"
                           />
                          <span className="text-sm font-medium">
                            {initiative.organizer?.name || 'Anonymous'}
                          </span>
                        </div>
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                          Join Initiative
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FIC Balance</h3>
              <span className="text-2xl font-bold text-gray-900">
                {useAppContext().ficBalance.toFixed(2)} FIC
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Initiative Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <GlobeAltIcon className="h-5 w-5 text-green-600 mr-3" />
                  Join Initiative
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
                  View Progress
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <MembersIcon className="h-5 w-5 text-green-600 mr-3" />
                  Connect Members
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Sustainability Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Participate in environmental initiatives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Support community development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Contribute to economic growth</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SeadsPage;