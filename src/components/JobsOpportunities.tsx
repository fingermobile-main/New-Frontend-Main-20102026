import { Link } from 'react-router-dom';
import React, {} from 'react';


interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  posted: string;
  type: string;
}

const JobsOpportunities: React.FC = () => {
  // Sample job data - in a real app this would come from an API
  const jobs: Job[] = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "Remote",
      posted: "2 days ago",
      type: "Full-time"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Global Solutions Ltd.",
      location: "New York, NY",
      posted: "1 week ago",
      type: "Full-time"
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "Creative Minds Co.",
      location: "San Francisco, CA",
      posted: "3 days ago",
      type: "Contract"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "Austin, TX",
      posted: "5 days ago",
      type: "Full-time"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-fm-card p-4">
      <h3 className="font-bold text-fm-gray-900 mb-4">Job Opportunities</h3>
      
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button className="px-3 py-1.5 bg-fm-orange text-white rounded-full text-sm whitespace-nowrap">
            All Jobs
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200">
            Full-time
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200">
            Part-time
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200">
            Contract
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200">
            Remote
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <h4 className="font-semibold text-fm-gray-900">{job.title}</h4>
              <span className="text-xs bg-fm-orange bg-opacity-10 text-fm-orange px-2 py-1 rounded">
                {job.type}
              </span>
            </div>
            <p className="text-sm text-fm-gray-700">{job.company} • {job.location}</p>
            <p className="text-xs text-fm-gray-500 mt-1">{job.posted}</p>
            <div className="mt-2 flex space-x-2">
              <button className="text-xs bg-fm-orange text-white px-3 py-1 rounded hover:bg-opacity-90 transition-colors">
                Apply Now
              </button>
              <button className="text-xs border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition-colors">
                Save Job
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Link to="/jobs" className="block text-center text-fm-orange hover:underline text-sm font-medium">
          View All Job Opportunities
        </Link>
      </div>
    </div>
  );
};

export default JobsOpportunities;