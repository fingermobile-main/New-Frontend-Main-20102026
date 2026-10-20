import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

const CourseContentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const { elearningService } = await import('../services/elearningService');
        const course = await elearningService.getCourseById(courseId || '1');
        if (course) {
          setContent({
            title: course.title,
            modules: [
              { id: 'm1', title: '1. Production Database Modeling & Integrity', active: true },
              { id: 'm2', title: '2. High-Throughput Microservice APIs', active: false },
              { id: 'm3', title: '3. Real-Time WebSockets & Protocol Buffers', active: false },
              { id: 'm4', title: '4. Final Performance & Certification Exam', active: false }
            ],
            currentModule: {
              title: '1. Production Database Modeling & Integrity',
              description: course.description || 'Welcome to this module. Master database schema design, transactions, and indexing.',
              videoUrl: course.preview_video_url || 'placeholder'
            }
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load course content from DB:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseContent();
    }
  }, [courseId]);

  return (
    <MainLayout pageTitle="Course Content">
      <div className="course-content-page p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <button onClick={() => navigate(-1)} className="text-blue-500 mb-4 hover:underline">&larr; Back to Course Detail</button>
          <h1 className="text-3xl font-bold">{content?.title || `Course ${courseId}`}</h1>
          <p className="text-gray-600 mt-2">Welcome to the course learning environment.</p>
        </header>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-lg shadow border border-slate-300">
            Loading course content...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow border border-slate-300 h-fit">
              <h2 className="font-semibold text-lg mb-4">Modules</h2>
              <ul className="space-y-2">
                {content?.modules?.map((mod: any) => (
                  <li key={mod.id} className={`p-2 rounded cursor-pointer font-medium ${mod.active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>
                    {mod.title}
                  </li>
                ))}
              </ul>
            </aside>

            <main className="md:col-span-3 bg-white p-6 rounded-lg shadow border border-slate-300">
              <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center text-white shadow-inner">
                {content?.currentModule?.videoUrl === 'placeholder' ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Video Player Placeholder</span>
                  </div>
                ) : (
                  <span>Video Content</span>
                )}
              </div>

              <h2 className="text-2xl font-semibold mb-4">{content?.currentModule?.title}</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{content?.currentModule?.description}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-300 flex justify-between">
                <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50" disabled>Previous</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm transition-colors">Next Module</button>
              </div>
            </main>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CourseContentPage;
