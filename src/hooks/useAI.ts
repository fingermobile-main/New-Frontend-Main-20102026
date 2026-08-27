import React from 'react';
import { useCamus } from './useCamus';

interface AIContentResult {
  id: string;
  title: string;
  content: string;
  type: string;
}

export const useAI = () => {
  const { generateAIContent, markAIContentAsUsed, loading, error } = useCamus();

  const generateCourseOutline = React.useCallback(
    async (
  topic: string,
  audience: string, 
  modulesCount = 5) => {
      try {
        const prompt = `Create a comprehensive course outline for "${topic}" targeting ${audience}. The course should include ${modulesCount} modules with appropriate lessons in each. Focus on practical applications and real-world examples.`;

        const content = await generateAIContent("course", prompt);

        return content;
      } catch (err) {
        console.error("Error generating course outline:", err);
        throw err;
      }
    },
    [generateAIContent],
  );

  const generateModuleContent = React.useCallback(
    async (
  courseId: string,
  moduleTitle: string,
  moduledescription?: string,
    ) => {
      try {
        const prompt = `Create detailed content for module "${moduleTitle}" with description "${moduledescription}". Include key learning objectives, main topics, practical exercises, and real-world examples.`;

        const content = await generateAIContent("module", prompt);
        return content;
      } catch (err) {
        console.error("Error generating module content:", err);
        throw err;
      }
    },
    [generateAIContent],
  );

  const generateLessonPlan = React.useCallback(
    async (
  moduleId: string,
  lessonTitle: string,
  lessonObjectives: string[],
    ) => {
      try {
        const objectives = lessonObjectives.join(", ");
        const prompt = `Create a detailed lesson plan for "${lessonTitle}" with objectives: ${objectives}. Include an introduction, main content sections, practical activities, assessment methods, and summary.`;

        const content = await generateAIContent("lesson", prompt);
        return content;
      } catch (err) {
        console.error("Error generating lesson plan:", err);
        throw err;
      }
    },
    [generateAIContent],
  );

  const generateAssessment = React.useCallback(
    async (
  lessonId: string,
  assessmentType: string,
  topics: string[]) => {
      try {
        const topicsList = topics.join(", ");
        const prompt = `Create a ${assessmentType} assessment for a lesson covering topics: ${topicsList}. Include clear instructions, questions or tasks, and a grading rubric.`;

        const content = await generateAIContent("assessment", prompt);
        return content;
      } catch (err) {
        console.error("Error generating assessment:", err);
        throw err;
      }
    },
    [generateAIContent],
  );

  const generateProject = React.useCallback(
    async (
  courseId: string,
  projectTitle: string,
  skills: string[]) => {
      try {
        const skillsList = skills.join(", ");
        const prompt = `Create a capstone project titled "${projectTitle}" that allows students to demonstrate their skills in: ${skillsList}. Include project description, requirements, deliverables, timeline, and evaluation criteria.`;

        const content = await generateAIContent("project", prompt);
        return content;
      } catch (err) {
        console.error("Error generating project:", err);
        throw err;
      }
    },
    [generateAIContent],
  );

  const generateResource = React.useCallback(
    async (
  moduleId: string,
  resourceType: string,
  topics: string[]) => {
      try {
        const topicsList = topics.join(", ");
        const prompt = `Create a ${resourceType} resource for topics: ${topicsList}. Include relevant information, examples, diagrams if applicable, and references for further reading.`;

        const content = await generateAIContent("resource", prompt);
        return content;
      } catch (err) {
        console.error("Error generating resource:", err);
        throw err;
      }
    },
    [generateAIContent],
  );

  return {
    loading,
    error,
    generateCourseOutline,
    generateModuleContent,
    generateLessonPlan,
    generateAssessment,
    generateProject,
    generateResource,
    markAIContentAsUsed
  };
};