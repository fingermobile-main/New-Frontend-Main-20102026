// AI Constants for CAMUS LMS and E-Learning Platform

export interface AIFeature {
  id: string;
  name: string;
  description?: string;
  icon: string;
  capabilities: string[];
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  outputFormat: string;
}

export interface AIContentTemplate {
  id: string;
  name: string;
  type: 'course' | 'lesson' | 'quiz' | 'assignment' | 'description' | 'title';
  template: string;
  variables: string[];
}

export const AI_FEATURES: AIFeature[] = [
  {id: 'course-builder',
    name: 'AI Course Builder',
    description: 'Generate complete course outlines with modules and lessons',
    icon: '📚',
    capabilities: [
      'Course outline generation',
      'Title creation',
      'Description writing',
      'Module structuring',
      'Lesson planning'
    ]
  },
  {id: 'content-assistant',
    name: 'AI Content Assistant',
    description: 'Create lesson content, quizzes, and assignments',
    icon: '✍️',
    capabilities: [
      'Lesson content generation',
      'Quiz question creation',
      'Assignment development',
      'Content enhancement',
      'Formatting assistance'
    ]
  },
  {id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Create visually appealing course images',
    icon: '🖼️',
    capabilities: [
      'Featured image creation',
      'Lesson illustration generation',
      'Custom visual assets',
      'Branding consistency'
    ]
  },
  {id: 'personalization',
    name: 'AI Personalization',
    description: 'Adapt content to individual learning needs',
    icon: '🎯',
    capabilities: [
      'Adaptive learning paths',
      'Content difficulty adjustment',
      'Learning style optimization',
      'Progress tracking'
    ]
  }
];

export const AI_PROMPT_TEMPLATES: AIPromptTemplate[] = [
  {id: 'course-outline',
    name: 'Course Outline Generator',
    template:
      'Create a comprehensive course outline for "{topic}" targeting {audience}. The course should cover {keyConcepts} and include {modulesCount} modules with appropriate lessons in each. Focus on practical applications and real-world examples.',
    variables: ['topic', 'audience', 'keyConcepts', 'modulesCount'],
    outputFormat: 'structured'
  },
  {id: 'lesson-content',
    name: 'Lesson Content Generator',
    template:
      'Create detailed lesson content for "{lessonTitle}" in a course about "{courseTopic}". The content should be suitable for {audience} and include key concepts, examples, and practical applications. Format the content with clear headings and bullet points where appropriate.',
    variables: ['lessonTitle', 'courseTopic', 'audience'],
    outputFormat: 'formatted'
  },
  {id: 'quiz-questions',
    name: 'Quiz Question Generator',
    template:
      'Generate {questionCount} multiple-choice quiz questions for a lesson on "{lessonTopic}". Each question should have 4 options with one correct answer. Include explanations for each answer. Make the questions challenging but fair for {audience}.',
    variables: ['questionCount', 'lessonTopic', 'audience'],
    outputFormat: 'quiz'
  },
  {id: 'assignment',
    name: 'Assignment Generator',
    template:
      'Create a practical assignment for students learning "{topic}". The assignment should be suitable for {audience} and take approximately {timeEstimate} to complete. Include clear instructions, deliverables, and grading criteria. Focus on real-world application of the concepts.',
    variables: ['topic', 'audience', 'timeEstimate'],
    outputFormat: 'assignment'
  }
];

export const AI_CONTENT_TEMPLATES: AIContentTemplate[] = [
  {id: 'basic-course',
    name: 'Basic Course Structure',
    type: 'course',
    template: `# {courseTitle}

## Course Description
{courseDescription}

## Learning Objectives
By the end of this course, students will be able,
to:
- {objective1}
- {objective2}
- {objective3}

## Modules
{modules}

## Assessment Methods
{assessmentMethods}

## Prerequisites
{prerequisites}

## Course Duration
{duration}`,
    variables: [
      'courseTitle',
      'courseDescription',
      'objective1',
      'objective2',
      'objective3',
      'modules',
      'assessmentMethods',
      'prerequisites',
      'duration'
    ]
  },
  {id: 'lesson-template',
    name: 'Standard Lesson Template',
    type: 'lesson',
    template: `# {lessonTitle}

## Introduction
{introduction}

## Key Concepts
{keyConcepts}

## Practical Applications
{applications}

## Examples
{examples}

## Summary
{summary}

## Self-Assessment
{selfAssessment}`,
    variables: [
      'lessonTitle',
      'introduction',
      'keyConcepts',
      'applications',
      'examples',
      'summary',
      'selfAssessment'
    ]
  },
  {id: 'multiple-choice-quiz',
    name: 'Multiple Choice Quiz Template',
    type: 'quiz',
    template: `#,
  Quiz: {quizTitle}

{questions}

## Answer Key
{answerKey}`,
    variables: ['quizTitle', 'questions', 'answerKey']
  }
];

export const AI_PROCESSING_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export const AI_CONTENT_TYPES = [
  {id: 'course-outline',
    name: 'Course Outline',
    icon: '📚' },
  {id: 'lesson-content',
    name: 'Lesson Content',
    icon: '📖' },
  {id: 'quiz-questions',
    name: 'Quiz Questions',
    icon: '❓' },
  {id: 'assignments',
    name: 'Assignments',
    icon: '📝' },
  {id: 'course-description',
    name: 'Course Description',
    icon: '📝' },
  {id: 'course-title',
    name: 'Course Title',
    icon: '🏷️' }
];

export const AI_TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Academic',
  'Conversational',
  'Technical',
  'Simple'
];

export const AI_LENGTH_OPTIONS = [
  'Brief',
  'Medium',
  'Detailed',
  'Comprehensive'
];

// AI Capability Areas
export const AI_CAPABILITIES = {
  CONTENT_GENERATION: 'content-generation',
  PERSONALIZATION: 'personalization',
  ASSESSMENT: 'assessment',
  ANALYTICS: 'analytics',
  ACCESSIBILITY: 'accessibility'
};

// AI Integration Points
export const AI_INTEGRATION_POINTS = {
  COURSE_BUILDER: 'course-builder',
  LESSON_EDITOR: 'lesson-editor',
  QUIZ_CREATOR: 'quiz-creator',
  ASSIGNMENT_BUILDER: 'assignment-builder',
  DASHBOARD: 'dashboard'
};
