import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { SeadsInitiative } from '../types/context';
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
  query: string;
  category: string;
  sortBy: string;
}

const SeadsPage: React.FC = () => {
  const { seadsInitiatives = [], ficBalance } = useAppContext();
  const [filteredInitiatives, setFilteredInitiatives] = React.useState<SeadsInitiative[]>([]);
  const [filters, setFilters] = React.useState<FilterState>({
    query: "",
    category: "all",
    sortBy: "newest"
  });

  // Initialize filtered initiatives when data is loaded
  React.useEffect(() => {
    if (seadsInitiatives.length > 0) {
      applyFilters(filters, seadsInitiatives);
    }
  }, [seadsInitiatives]);

  const applyFilters = React.useCallback((newFilters: FilterState, data: SeadsInitiative[] = seadsInitiatives) => {
    let result = [...data];

    // Apply search query filter
    if (newFilters.query) {
      const searchQuery = newFilters.query.toLowerCase();
      result = result.filter(
        (init) =>
          init.title.toLowerCase().includes(searchQuery) ||
          init.description.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    if (newFilters.category !== "all") {
      result = result.filter(
        (init) => init.category.toLowerCase() === newFilters.category.toLowerCase()
      );
    }

    // Apply sorting
    switch (newFilters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        break;
      case "progress":
        result.sort((a, b) => b.progress - a.progress);
        break;
      case "popularity":
        result.sort((a, b) => b.members - a.members);
        break;
      default:
        break;
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
  const totalMembers = React.useMemo(() => {
    return filteredInitiatives.reduce(
      (sum: number, init: SeadsInitiative) => sum + init.members,
      0
    );
  }, [filteredInitiatives]);

  const totalInitiatives = filteredInitiatives.length;
  const avgProgress = React.useMemo(() => {
    return totalInitiatives > 0
      ? filteredInitiatives.reduce(
          (sum: number, init: SeadsInitiative) => sum + init.progress,
          0
        ) / totalInitiatives
      : 0;
  }, [filteredInitiatives, totalInitiatives]);

  // Loading state
  if (!seadsInitiatives) {
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
                categories: [
                  "all",
                  "Environment",
                  "Education",
                  "Healthcare",
                  "Community",
                  "Economic"
                ],
                sortByOptions: [
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "progress", label: "Progress" },
                  { value: "popularity", label: "Popularity" }
                ],
                searchPlaceholder: "Search initiatives..."
              }}
              onFiltersChange={handleFilterChange}
              initialFilters={{
                query: filters.query,
                category: filters.category,
                sortBy: filters.sortBy
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
                          {initiative.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {initiative.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {initiative.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {new Date(initiative.startDate || Date.now()).toLocaleDateString()} -{" "}
                          {new Date(initiative.endDate || Date.now()).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MembersIcon className="w-4 h-4 mr-2" />
                          {initiative.members.toLocaleString()} members
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{initiative.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full"
                            style={{ width: `${initiative.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {initiative.target.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <img
                            src={initiative.organizer.avatarUrl}
                            alt={initiative.organizer.name}
                            className="w-8 h-8 rounded-full mr-2"
                           />
                          <span className="text-sm font-medium">
                            {initiative.organizer.name}
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700">
                  Add Funds
                </button>
              </div>
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