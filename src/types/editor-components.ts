export interface TextComponentProps {title: string;
  content: string;
}

export interface ImageComponentProps {src: string;
  alt: string;
}

export interface VideoComponentProps {src: string;
}

export interface PollComponentProps {question: string;
  options: string[];
}

export interface EmbedComponentProps {src: string;
  width?: string;
  height?: string;
  title?: string;
}

export interface WorkflowComponentProps {workflowName: string;
  steps: { action: string;
  target: string; value?: string }[];
}

export type ComponentProps =
  | TextComponentProps
  | ImageComponentProps
  | VideoComponentProps
  | PollComponentProps
  | EmbedComponentProps
  | WorkflowComponentProps;
