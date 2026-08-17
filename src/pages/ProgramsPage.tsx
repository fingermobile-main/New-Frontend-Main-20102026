import React, { useState } from 'react';
import { Program } from '../types';

const ProgramsPage: React.FC = () => {
  const [programs] = useState<Program[]>([
    {
      id: "prog-1",
      title: "Digital Marketing Course",
      description: "Learn digital marketing from industry experts",
      thumbnailUrl: "/images/digital-marketing-course.jpg",
      category: "education",
      isLive: false,
      viewCount: 1200,
      duration: "8 weeks"
    },
    {
      id: "prog-2",
      title: "Web Development Bootcamp",
      description: "Master modern web development technologies",
      thumbnailUrl: "/images/web-dev-bootcamp.jpg",
      category: "technology",
      isLive: true,
      viewCount: 2500,
      duration: "12 weeks"
    },
    {
      id: "prog-3",
      title: "UI/UX Design Fundamentals",
      description: "Design beautiful and functional user interfaces",
      thumbnailUrl: "/images/ui-ux-design.jpg",
      category: "design",
      isLive: false,
      viewCount: 950,
      duration: "6 weeks"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter programs based on category and search term
  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (program.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(programs.map(prog => prog.category))];

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Programs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore our educational programs and courses
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {(category || '').charAt(0).toUpperCase() + (category || '').slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => (
            <div 
              key={program.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                {program.thumbnailUrl ? (
                  <img 
                    src={program.thumbnailUrl} 
                    alt={program.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                   />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
                {program.isLive && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{program.title}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded">
                    {program.category}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{program.description}</p>
                
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{program.viewCount} views</span>
                  <span>{program.duration}</span>
                </div>
                
                <button className="mt-4 w-full py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No programs found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;