import { Link } from 'react-router-dom';
import React, { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  posted: string;
  type: string;
}

const JobsOpportunities: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [savedJobs, setSavedJobs] = useState<Record<number, boolean>>({});
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});

  const jobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      location: 'Remote',
      posted: '2 days ago',
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Global Solutions Ltd.',
      location: 'New York, NY',
      posted: '1 week ago',
      type: 'Full-time'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Creative Minds Co.',
      location: 'San Francisco, CA',
      posted: '3 days ago',
      type: 'Contract'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Austin, TX',
      posted: '5 days ago',
      type: 'Full-time'
    }
  ];

  const filterTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  const filteredJobs = jobs.filter((job) => {
    if (selectedType === 'All') return true;
    if (selectedType === 'Remote') return job.location.toLowerCase().includes('remote');
    return job.type === selectedType;
  });

  const toggleSaveJob = (id: number) => {
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = (id: number) => {
    setAppliedJobs((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-white rounded-xl shadow-fm-card p-5 border border-slate-300">
      <h3 className="font-bold text-slate-900 text-lg mb-4">Job Opportunities</h3>

      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterTypes.map((type) => {
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {type === 'All' ? 'All Jobs' : type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <p className="text-sm text-slate-700 py-4 text-center">No jobs matching selected filter.</p>
        ) : (
          filteredJobs.map((job) => {
            const isSaved = !!savedJobs[job.id];
            const isApplied = !!appliedJobs[job.id];

            return (
              <div key={job.id} className="border border-slate-300 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                  <span className="text-xs bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                    {job.type}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 mt-1">
                  {job.company} • {job.location}
                </p>
                <p className="text-[11px] font-medium text-slate-700 mt-1">{job.posted}</p>
                <div className="mt-3 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleApply(job.id)}
                    disabled={isApplied}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isApplied ? '✓ Applied' : 'Apply Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(job.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      isSaved
                        ? 'bg-amber-100 text-amber-950 border-amber-400'
                        : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {isSaved ? '★ Saved' : 'Save Job'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200">
        <Link to="/jobs" className="block text-center text-blue-600 hover:text-blue-800 text-sm font-bold">
          View All Job Opportunities →
        </Link>
      </div>
    </div>
  );
};

export default JobsOpportunities;
