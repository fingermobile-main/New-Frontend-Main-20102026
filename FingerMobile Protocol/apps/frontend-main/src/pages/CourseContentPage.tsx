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

  const handleSelectModule = (mod: any) => {
    if (!content) return;
    setContent({
      ...content,
      modules: content.modules.map((m: any) => ({ ...m, active: m.id === mod.id })),
      currentModule: {
        title: mod.title,
        description: `Now studying ${mod.title}. Complete lessons and practical exercises below to earn your verified certificate credit.`,
        videoUrl: content.currentModule?.videoUrl || 'placeholder'
      }
    });
  };

  const handlePreviousModule = () => {
    if (!content?.modules) return;
    const currentIndex = content.modules.findIndex((m: any) => m.active);
    if (currentIndex > 0) {
      handleSelectModule(content.modules[currentIndex - 1]);
    }
  };

  const handleNextModule = () => {
    if (!content?.modules) return;
    const currentIndex = content.modules.findIndex((m: any) => m.active);
    if (currentIndex < content.modules.length - 1) {
      handleSelectModule(content.modules[currentIndex + 1]);
    }
  };

  return (
    <MainLayout pageTitle="Course Content">
      <div className="course-content-page p-4 sm:p-6 lg:p-8 w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto pb-28 md:pb-12 overflow-x-hidden text-slate-900">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-blue-600 font-bold mb-4 hover:underline"
          >
            &larr; Back to Course Detail
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{content?.title || `Course ${courseId}`}</h1>
          <p className="text-slate-700 font-medium mt-2">Welcome to the course learning environment.</p>
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
                  <li key={mod.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectModule(mod)}
                      className={`w-full text-left p-2 rounded font-medium transition-colors ${mod.active ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      {mod.title}
                    </button>
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
                <button
                  type="button"
                  onClick={handlePreviousModule}
                  disabled={!content?.modules || content.modules.findIndex((m: any) => m.active) <= 0}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextModule}
                  disabled={!content?.modules || content.modules.findIndex((m: any) => m.active) >= content.modules.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Module
                </button>
              </div>
            </main>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
          <button
            type="button"
            onClick={handlePreviousModule}
            disabled={!content?.modules || content.modules.findIndex((m: any) => m.active) <= 0}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 disabled:opacity-40 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">◀️</span>
            <span>Prev</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.querySelector('aside');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">📚</span>
            <span>Modules</span>
          </button>
          <button
            type="button"
            onClick={handleNextModule}
            disabled={!content?.modules || content.modules.findIndex((m: any) => m.active) >= content.modules.length - 1}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-blue-700 hover:text-blue-900 disabled:opacity-40 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">▶️</span>
            <span>Next</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseContentPage;
