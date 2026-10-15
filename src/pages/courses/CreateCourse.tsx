import { useNavigate} from 'react-router-dom';
import React, { useState } from 'react';



import { useCourseContext } from '../../contexts/CourseContext';
import { useAppContext } from '../../contexts/AppContext';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { createCourse, loading } = useCourseContext();
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

    try {
      await createCourse(formData);
      showToast('Course created successfully!', 'success');
      navigate(`/courses/${formData.title.toLowerCase().replace(/\s+/g, '-')}`);
    } catch (error) {
      showToast('Failed to create course', 'error');
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create a new educational course to share with the community
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-300 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.title
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter course title" />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.category
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="e.g., Music Production, Design, etc." />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.price
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Difficulty Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.description
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Describe what students will learn in this course"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
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
                className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Module {moduleIndex + 1} Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors[`module_${moduleIndex}_title`]
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="e.g., Introduction"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModule(moduleIndex)}
                    className="mt-6 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="ml-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Lessons
                    </h3>
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="text-xs font-medium text-purple-600 hover:text-purple-700"
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                            className={`w-full px-2 py-1 text-sm border rounded ${
                              errors[
                                `module_${moduleIndex}_lesson_${lessonIndex}_title`
                              ]
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            placeholder="Lesson title"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Lesson content or description"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="https://example.com/video"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
