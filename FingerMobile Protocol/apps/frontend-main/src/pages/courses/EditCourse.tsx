import { useNavigate, useParams} from 'react-router-dom';
import React, { useEffect, useState } from 'react';


import { useCourseContext } from '../../contexts/CourseContext';
import { useAppContext } from '../../contexts/AppContext';

const EditCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, updateCourse, loading } = useCourseContext();
  const { ficBalance, showToast } = useAppContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: 'beginner',
    thumbnail: '',
    modules: [
      {
        title: '',
        lessons: [
          {
            title: '',
            content: '',
            videoUrl: '',
            duration: 0
          }
        ]
      }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      let course = courses.find((c) => String(c.id) === String(courseId));
      if (!course) {
        try {
          const { elearningService } = await import('../../services/elearningService');
          const fetched = await elearningService.getCourseById(courseId);
          if (fetched) course = fetched as any;
        } catch (e) {
          console.error('Failed to load course for editing:', e);
        }
      }
      if (course) {
        setFormData({
          title: course.title || '',
          description: course.description || '',
          price: course.price ?? 0,
          category: course.category || '',
          level: (course.level || 'beginner').toLowerCase(),
          thumbnail: (course as any).thumbnail || (course as any).thumbnail_url || '',
          modules: (course as any).modules || [
            {
              title: 'Module 1',
              lessons: [
                {
                  title: 'Lesson 1',
                  content: '',
                  videoUrl: '',
                  duration: 20
                }
              ]
            }
          ]
        });
        setInitialLoad(false);
      }
    };
    loadCourse();
  }, [courseId, courses]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value
    }));
  };

  const handleModuleChange = (
    moduleIndex: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      modules[moduleIndex] = {
        ...modules[moduleIndex],
        [field]: value
      };

      return {
        ...prev,
        modules
      };
    });
  };

  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      const lessons = [...modules[moduleIndex].lessons];
      lessons[lessonIndex] = {
        ...lessons[lessonIndex],
        [field]: field === 'duration' ? Number(value) : value
      };

      modules[moduleIndex] = {
        ...modules[moduleIndex],
        lessons
      };

      return {
        ...prev,
        modules
      };
    });
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: '',
          lessons: [
            {
              title: '',
              content: '',
              videoUrl: '',
              duration: 0
            }
          ]
        }
      ]
    }));
  };

  const addLesson = (moduleIndex: number) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      modules[moduleIndex] = {
        ...modules[moduleIndex],
        lessons: [
          ...modules[moduleIndex].lessons,
          {
            title: '',
            content: '',
            videoUrl: '',
            duration: 0
          }
        ]
      };

      return {
        ...prev,
        modules
      };
    });
  };

  const removeModule = (moduleIndex: number) => {
    if (formData.modules.length <= 1) {
      showToast('Course must have at least one module', 'error');
      return;
    }

    setFormData((prev) => {
      const modules = [...prev.modules];
      modules.splice(moduleIndex, 1);
      return {
        ...prev,
        modules
      };
    });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      const lessons = [...modules[moduleIndex].lessons];
      lessons.splice(lessonIndex, 1);
      modules[moduleIndex] = {
        ...modules[moduleIndex],
        lessons
      };

      return {
        ...prev,
        modules
      };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    formData.modules.forEach((module, moduleIndex) => {
      if (!module.title.trim()) {
        newErrors[`module_${moduleIndex}_title`] =
          `Module ${moduleIndex + 1} title is required`;
      }

      module.lessons.forEach((lesson, lessonIndex) => {
        if (!lesson.title.trim()) {
          newErrors[`module_${moduleIndex}_lesson_${lessonIndex}_title`] =
            `Lesson ${lessonIndex + 1} title in module ${moduleIndex + 1} is required`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    if (!courseId) return;

    try {
      await updateCourse(courseId, formData);
      showToast('Course updated successfully!', 'success');
      navigate(`/courses/${courseId}`);
    } catch (error) {
      showToast('Failed to update course', 'error');
      console.error('Error updating course:', error);
    }
  };

  if (initialLoad && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Edit Course
        </h1>
        <p className="text-slate-700 dark:text-slate-300 font-semibold mt-2">
          Update your educational course content
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-300 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                  errors.title
                    ? 'border-red-500'
                    : 'border-slate-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm`}
                placeholder="Enter course title" />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 font-bold">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                  errors.category
                    ? 'border-red-500'
                    : 'border-slate-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm`}
                placeholder="e.g., Music Production, Design, etc." />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 font-bold">{errors.category}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Price (FIC)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono${
                  errors.price
                    ? 'border-red-500'
                    : 'border-slate-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500 font-bold">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="level"
                className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1"
              >
                Difficulty Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                errors.description
                  ? 'border-red-500'
                  : 'border-slate-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm`}
              placeholder="Describe what students will learn in this course"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 font-bold">{errors.description}</p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Course Modules
              </h2>
              <button
                type="button"
                onClick={addModule}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Add Module
              </button>
            </div>

            {formData.modules.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className="mb-6 p-4 border border-slate-300 dark:border-gray-700 rounded-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Module {moduleIndex + 1} Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                        errors[`module_${moduleIndex}_title`]
                          ? 'border-red-500'
                          : 'border-slate-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm`}
                      placeholder="e.g., Introduction"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModule(moduleIndex)}
                    className="mt-6 text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>

                <div className="ml-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                      Lessons
                    </h3>
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700"
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="p-3 bg-slate-50 dark:bg-gray-900/50 rounded-lg relative border border-slate-200 dark:border-gray-800"
                    >
                      <button
                        type="button"
                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        className="absolute top-2 right-2 text-slate-600 hover:text-red-600 font-bold"
                      >
                        ×
                      </button>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                            Lesson {lessonIndex + 1} Title
                          </label>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              'title',
                              e.target.value,
                            )
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                              errors[
                                `module_${moduleIndex}_lesson_${lessonIndex}_title`
                              ]
                                ? 'border-red-500'
                                : 'border-slate-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm`}
                            placeholder="Lesson title"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                            Content
                          </label>
                          <textarea
                            value={lesson.content}
                            onChange={(e) =>
                              handleLessonChange(
                                moduleIndex,
                                lessonIndex,
                                'content',
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                            placeholder="Lesson content or description"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                              Video URL
                            </label>
                            <input
                              type="text"
                              value={lesson.videoUrl}
                              onChange={(e) => handleLessonChange(
                                moduleIndex,
                                lessonIndex,
                                'videoUrl',
                                e.target.value,
                              )
                              }
                              className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                              placeholder="https://example.com/video"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                              Duration (minutes)
                            </label>
                            <input
                              type="number"
                              value={lesson.duration}
                              onChange={(e) =>
                                handleLessonChange(
                                  moduleIndex,
                                  lessonIndex,
                                  'duration',
                                  e.target.value,
                                )
                              }
                              min="0"
                              className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <button
          type="button"
          onClick={() => navigate('/courses')}
          aria-label="Courses Hub"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
        >
          <span className="text-base">📚</span>
          <span>Courses</span>
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          aria-label="Reload Form"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
        >
          <span className="text-base">🔄</span>
          <span>Sync</span>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default EditCourse;
