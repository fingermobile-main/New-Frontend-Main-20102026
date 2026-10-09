# Dashboard Extension Guide

## Overview

This guide provides comprehensive instructions for extending the dashboard system in the FingerMobile Protocol Communication platform. It covers the technical architecture, best practices, and step-by-step procedures for adding new features while maintaining system integrity and performance.

## System Architecture

### Backend Architecture
```
apps/
└── backend/
    ├── controllers/           # Business logic handlers
    │   ├── UserController.ts
    │   ├── ContentController.ts
    │   └── ...
    ├── routes/               # API route definitions
    │   ├── userManagement.ts
    │   └── ...
    ├── middleware/           # Authentication and validation
    │   └── adminAuth.ts
    ├── services/             # Business logic utilities
    │   └── UserActivityService.ts
    ├── models/               # Database models
    │   └── UserModel.ts
    ├── config/               # Configuration files
    │   └── database.ts
    └── migrations/           # Database migration scripts
        └── ...
```

### Frontend Architecture
```
apps/
└── frontend-main/
    ├── src/
    │   ├── pages/            # Dashboard pages
    │   │   ├── UserManagementPage.tsx
    │   │   └── ...
    │   ├── components/       # Reusable UI components
    │   │   └── ...
    │   ├── hooks/            # Custom React hooks
    │   │   └── ...
    │   ├── utils/            # Utility functions
    │   │   └── ...
    │   ├── styles/           # Global styles
    │   │   └── ...
    │   └── types/            # TypeScript type definitions
    │       └── ...
    └── public/
```

## Extension Principles

### 1. Modular Design
- Each feature should be self-contained
- Maintain loose coupling between modules
- Use dependency injection where appropriate
- Follow single responsibility principle

### 2. Consistent User Experience
- Maintain consistent UI patterns across dashboards
- Use shared components for common functionality
- Follow established design system guidelines
- Ensure responsive design for all screen sizes

### 3. Security by Default
- Implement authentication for all admin routes
- Use authorization middleware consistently
- Validate and sanitize all inputs
- Log all administrative actions

### 4. Performance Optimization
- Implement pagination for large datasets
- Use efficient database queries
- Cache frequently accessed data
- Optimize bundle sizes

## Step-by-Step Extension Process

### Step 1: Planning and Design

#### 1.1 Define Requirements
- Identify the specific functionality needed
- Determine data models and relationships
- Plan user interface components
- Define API endpoints and responses

#### 1.2 Architecture Design
- Design database schema (if needed)
- Plan API endpoint structure
- Design user interface wireframes
- Identify reusable components

### Step 2: Backend Implementation

#### 2.1 Create Controller
Create a new controller in `/apps/backend/controllers/`:

```typescript
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/UserModel';

// Define interface for your entity
interface YourEntity {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Create mock data model for development
class MockYourEntityModel {
  private static entities: YourEntity[] = [
    { 
      id: 1, 
      name: 'Example Entity', 
      description: 'An example entity', 
      status: 'active', 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }
  ];

  static findAll(options: any = {}): { rows: YourEntity[], count: number } {
    let filtered = this.entities;
    
    if (options.where) {
      if (options.where.status) {
        filtered = filtered.filter(item => item.status === options.where.status);
      }
    }
    
    if (options.order) {
      filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    
    if (options.offset !== undefined && options.limit !== undefined) {
      filtered = filtered.slice(options.offset, options.offset + options.limit);
    }
    
    return { rows: filtered, count: this.entities.length };
  }

  static findByPk(id: number): YourEntity | undefined {
    return this.entities.find(item => item.id === id);
  }

  static create(data: Partial<YourEntity>): YourEntity {
    const newEntity: YourEntity = {
      id: this.entities.length + 1,
      name: data.name || '',
      description: data.description || '',
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  static update(data: Partial<YourEntity>, options: { where: any }): number {
    const id = options.where.id;
    const index = this.entities.findIndex(item => item.id === id);
    if (index !== -1) {
      this.entities[index] = { ...this.entities[index], ...data, updatedAt: new Date() };
      return 1;
    }
    return 0;
  }
}

class YourNewController {
  /**
   * GET /api/admin/your-feature/entities
   * Retrieve entities with filtering and pagination
   */
  async getEntities(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const status = req.query.status as string;

      const whereClause: any = {};
      if (status) {
        whereClause.status = status;
      }

      const { count, rows } = MockYourEntityModel.findAll({
        where: whereClause,
        limit,
        offset,
        order: [['updatedAt', 'DESC']]
      });

      res.json({
        success: true,
        message: 'Entities retrieved successfully',
        data: {
          entities: rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalEntities: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error retrieving entities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve entities',
        error: (error as Error).message
      });
    }
  }

  /**
   * GET /api/admin/your-feature/entities/:id
   * Retrieve a specific entity by ID
   */
  async getEntityById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const entity = MockYourEntityModel.findByPk(parseInt(id));
      if (!entity) {
        res.status(404).json({
          success: false,
          message: 'Entity not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Entity retrieved successfully',
        data: entity
      });
    } catch (error) {
      console.error('Error retrieving entity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve entity',
        error: (error as Error).message
      });
    }
  }

  /**
   * POST /api/admin/your-feature/entities
   * Create a new entity
   */
  async createEntity(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({
          success: false,
          message: 'Name is required'
        });
        return;
      }

      const newEntity = MockYourEntityModel.create({
        name,
        description
      });

      res.status(201).json({
        success: true,
        message: 'Entity created successfully',
        data: newEntity
      });
    } catch (error) {
      console.error('Error creating entity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create entity',
        error: (error as Error).message
      });
    }
  }

  /**
   * PUT /api/admin/your-feature/entities/:id
   * Update an entity by ID
   */
  async updateEntity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;

      const entity = MockYourEntityModel.findByPk(parseInt(id));
      if (!entity) {
        res.status(404).json({
          success: false,
          message: 'Entity not found'
        });
        return;
      }

      const updateData: Partial<YourEntity> = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (status) updateData.status = status;

      MockYourEntityModel.update(updateData, { where: { id: parseInt(id) } });

      res.json({
        success: true,
        message: 'Entity updated successfully',
        data: { ...entity, ...updateData }
      });
    } catch (error) {
      console.error('Error updating entity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update entity',
        error: (error as Error).message
      });
    }
  }

  /**
   * DELETE /api/admin/your-feature/entities/:id
   * Delete an entity by ID
   */
  async deleteEntity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // In a real implementation, this would mark the entity as deleted
      // or remove it from the database
      
      res.json({
        success: true,
        message: 'Entity deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting entity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete entity',
        error: (error as Error).message
      });
    }
  }
}

export default new YourNewController();
```

#### 2.2 Create Routes
Create a new route file in `/apps/backend/routes/`:

```typescript
import express, { Request, Response } from 'express';
import YourNewController from '../controllers/YourNewController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Entity routes
router.get('/entities', YourNewController.getEntities);
router.get('/entities/:id', YourNewController.getEntityById);
router.post('/entities', YourNewController.createEntity);
router.put('/entities/:id', YourNewController.updateEntity);
router.delete('/entities/:id', YourNewController.deleteEntity);

// Additional routes as needed
router.get('/entities/:id/stats', (req: Request, res: Response) => {
  // Implement statistics endpoint
  res.json({ message: 'Statistics endpoint' });
});

export default router;
```

#### 2.3 Update Main App
Add the new routes to your main app file (`/apps/backend/app.js`):

```javascript
// Import your new routes
const yourNewRoutes = require('./routes/yourNewFeature');

// Add the routes to the app
app.use('/api/admin/your-new-feature', yourNewRoutes);
```

### Step 3: Frontend Implementation

#### 3.1 Create Page Component
Create a new page component in `/apps/frontend-main/src/pages/`:

```tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useHistory } from 'react-router-dom';

interface YourEntity {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const YourNewPage: React.FC = () => {
  const [entities, setEntities] = useState<YourEntity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<YourEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const history = useHistory();

  // Simulate loading data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockEntities: YourEntity[] = [
          {
            id: 1,
            name: 'Example Entity',
            description: 'An example entity for demonstration',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Another Entity',
            description: 'Another example entity',
            status: 'inactive',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z'
          }
        ];
        setEntities(mockEntities);
        setFilteredEntities(mockEntities);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  // Filter data based on search term and status
  useEffect(() => {
    let result = entities;

    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }

    setFilteredEntities(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filterStatus, entities]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleCreateEntity = async (formData: any) => {
    try {
      // In a real implementation, this would call the API
      console.log('Creating entity:', formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Your New Feature Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Entity
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search entities..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {filteredEntities.length} entities
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No entities found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((entity) => (
                      <tr key={entity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {entity.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(entity.status)}`}>
                            {entity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entity.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => history.push(`/dashboard/your-new-feature/${entity.id}/details`)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900"
                              onClick={() => history.push(`/dashboard/your-new-feature/${entity.id}/edit`)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button className="text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left text-red-600"
                                  onClick={() => console.log('Delete entity:', entity.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredEntities.length)}</span> of{' '}
                  <span className="font-medium">{filteredEntities.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Entity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Entity</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); /* handleCreateEntity */ }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entity-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="entity-name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entity-description">
                    Description
                  </label>
                  <textarea
                    id="entity-description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entity-status">
                    Status
                  </label>
                  <select
                    id="entity-status"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Create Entity
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import the required icons that are missing
import { XCircle } from 'lucide-react';

export default YourNewPage;
```

#### 3.2 Update App Routes
Add the new route to `/apps/frontend-main/src/App.tsx`:

```tsx
// Import your new page
import YourNewPage from './pages/YourNewPage';

// Add the route
<Route path="/dashboard/your-new-feature" element={<YourNewPage />} />
```

### Step 4: Database Integration (If Needed)

#### 4.1 Create Migration
Create a migration file in `/apps/backend/migrations/`:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('your_entities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    // Add indexes for performance
    await queryInterface.addIndex('your_entities', ['status']);
    await queryInterface.addIndex('your_entities', ['createdAt']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('your_entities');
  }
};
```

#### 4.2 Create Model
Create a model file in `/apps/backend/models/`:

```typescript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const YourEntity = sequelize.define('YourEntity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'your_entities',
  timestamps: true
});

export default YourEntity;
```

### Step 5: Testing and Validation

#### 5.1 Unit Tests
Create unit tests for your controller:

```typescript
// apps/backend/tests/YourNewController.test.ts
import { Request, Response } from 'express';
import YourNewController from '../controllers/YourNewController';

describe('YourNewController', () => {
  describe('getEntities', () => {
    it('should return entities with pagination', async () => {
      const req = {
        query: { page: '1', limit: '10' }
      } as Request;
      
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;
      
      await YourNewController.getEntities(req, res);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Entities retrieved successfully'
        })
      );
    });
  });
});
```

#### 5.2 Integration Tests
Create integration tests for your API endpoints:

```typescript
// apps/backend/tests/api/yourNewFeature.test.ts
import request from 'supertest';
import app from '../../app'; // Your main app file

describe('Your New Feature API', () => {
  describe('GET /api/admin/your-new-feature/entities', () => {
    it('should return entities', async () => {
      const response = await request(app)
        .get('/api/admin/your-new-feature/entities')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.entities)).toBe(true);
    });
  });
});
```

## Best Practices for Extensions

### 1. Code Quality Standards
- Follow TypeScript best practices
- Use consistent naming conventions
- Write comprehensive JSDoc comments
- Implement proper error handling

### 2. Performance Considerations
- Implement efficient database queries
- Use caching for frequently accessed data
- Optimize API response payloads
- Implement pagination for large datasets

### 3. Security Measures
- Validate all user inputs
- Sanitize data before storing
- Implement proper authentication
- Log all administrative actions

### 4. User Experience
- Provide loading states for async operations
- Show meaningful error messages
- Implement intuitive navigation
- Ensure responsive design

## Maintenance Guidelines

### 1. Regular Updates
- Monitor performance metrics
- Update dependencies regularly
- Refactor legacy code
- Add new features incrementally

### 2. Documentation
- Maintain API documentation
- Update user guides
- Document code changes
- Create release notes

### 3. Monitoring
- Set up error tracking
- Monitor API performance
- Track user engagement
- Watch for security vulnerabilities

## Troubleshooting Common Issues

### 1. Performance Issues
- Check for N+1 queries
- Verify database indexing
- Monitor memory usage
- Analyze slow API endpoints

### 2. Security Issues
- Validate all inputs
- Check authentication flow
- Review authorization rules
- Monitor for suspicious activity

### 3. User Experience Issues
- Collect user feedback
- Analyze usage patterns
- Test on different devices
- Fix accessibility issues

## Conclusion

Following this guide will help you extend the dashboard system effectively while maintaining code quality, performance, and security standards. Remember to test thoroughly, document your changes, and consider the long-term maintainability of your extensions.