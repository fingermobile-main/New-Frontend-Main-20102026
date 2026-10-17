import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { jobsService, JobVacancy } from '../services/jobsService';
import { BriefcaseIcon, LocationMarkerIcon, CheckCircleIcon, PlusIcon, SearchIcon } from '../icons';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  // Application modal state
  const [applyingJob, setApplyingJob] = useState<JobVacancy | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Post Job modal state
  const [isPosting, setIsPosting] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Remote',
    type: 'Full-time',
    category: 'Engineering',
    salaryRange: '$80,000 - $110,000',
    description: '',
    requirements: ''
  });

  const categories = ['All', 'Engineering', 'Design', 'DevOps'];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (search) filters.search = search;
      if (selectedCategory !== 'All') filters.category = selectedCategory;
      if (selectedType !== 'All') filters.type = selectedType;

      const { jobs: list } = await jobsService.getJobs(filters);
      setJobs(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      await jobsService.applyForJob(applyingJob.id, {
        resumeUrl: resumeUrl || 'https://storage.fingermobileprotocol.com/resumes/default_cv.pdf',
        coverLetter
      });
      setFeedbackMsg({ type: 'success', text: 'Application submitted successfully to ' + applyingJob.company + '!' });
      setTimeout(() => {
        setApplyingJob(null);
        setFeedbackMsg(null);
        setResumeUrl('');
        setCoverLetter('');
        fetchJobs();
      }, 1500);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.message || 'Failed to submit application. You may have already applied.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobsService.createJob({
        ...newJob,
        requirements: newJob.requirements.split(',').map(r => r.trim()).filter(Boolean)
      });
      setIsPosting(false);
      setNewJob({
        title: '',
        company: '',
        location: 'Remote',
        type: 'Full-time',
        category: 'Engineering',
        salaryRange: '$80,000 - $110,000',
        description: '',
        requirements: ''
      });
      fetchJobs();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to post job:', err);
    }
  };

  return (
    <MainLayout pageTitle="Jobs & Careers">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-white/20 text-white mb-3 inline-block">
                FingerMobile Careers & Opportunities
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Discover Verified Tech & NYSC Career Roles
              </h1>
              <p className="text-blue-100 mt-2 max-w-2xl text-base">
                Find remote engineering positions, design opportunities, and exclusive NYSC graduate trainee placements.
              </p>
            </div>
            <button
              onClick={() => setIsPosting(true)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-sm self-start md:self-auto"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Post a Vacancy
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search jobs by role, company, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-500 self-center mr-2">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Type tabs */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-500 self-center mr-2">Type:</span>
              {jobTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-slate-300">
            Loading opportunities from PostgreSQL database...
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                      {job.type}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-400 font-bold font-black">
                      {job.category || 'Engineering'}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-950 border border-green-400 font-bold font-mono">
                      {job.salary_range || job.salaryRange || 'Competitive'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1 gap-4">
                    <span className="font-semibold text-gray-800">{job.company}</span>
                    <span className="flex items-center text-gray-500">
                      <LocationMarkerIcon className="w-4 h-4 mr-1 text-slate-500" />
                      {job.location}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">{job.description}</p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.requirements.map((req, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center gap-3">
                  {job.hasApplied ? (
                    <span className="inline-flex items-center text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                      <CheckCircleIcon className="w-4 h-4 mr-1.5 text-green-600" />
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm w-full md:w-auto"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-300">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-slate-700" />
            <h3 className="mt-2 text-lg font-bold text-gray-900">No job vacancies match your criteria</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Application Modal */}
        {applyingJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
                  <p className="text-sm text-gray-600">{applyingJob.title} at {applyingJob.company}</p>
                </div>
                <button onClick={() => setApplyingJob(null)} className="text-slate-700 hover:text-gray-600 text-xl font-bold">
                  &times;
                </button>
              </div>

              {feedbackMsg ? (
                <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${feedbackMsg.type === 'success' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-red-100 text-red-950 border border-red-400 font-bold'}`}>
                  {feedbackMsg.text}
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV Document URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://storage.fingermobileprotocol.com/resumes/my_resume.pdf"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter / Note</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Explain why you are an ideal fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setApplyingJob(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Post Job Modal */}
        {isPosting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Post New Job Vacancy</h2>
                <button onClick={() => setIsPosting(false)} className="text-slate-700 hover:text-gray-600 text-xl font-bold">
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      required
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      placeholder="e.g. Lagos, Nigeria / Remote"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={newJob.salaryRange}
                      onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      placeholder="$80k - $110k"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    placeholder="Key responsibilities and role summary..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
                  <input
                    type="text"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsPosting(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                  >
                    Publish Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JobsPage;
