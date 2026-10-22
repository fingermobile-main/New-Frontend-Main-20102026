import React, {} from 'react';

// Mock implementations for Ant Design components
const Button: React.FC<{
  children: React.ReactNode;
  type?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}> = ({ children, ...props }) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className={`ant-btn ${props.type ? `ant-btn-${props.type}` : ''} ${props.className || ''}`}
    >
      {children}
    </button>
  );
};

const Input: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ ...props }) => {
  return (
    <input
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      className={`ant-input ${props.className || ''}`}
    />
  );
};

const Select: React.FC<{
  children: React.ReactNode;
  value?: unknown;
  onChange?: (value: any) => void;
  className?: string;
}> & {
  Option: React.FC<{ value: unknown; children: React.ReactNode }>;
} = ({ children, ...props }) => {
  return (
    <select
      {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      className={`ant-select ${props.className || ''}`}
    >
      {children}
    </select>
  );
};

Select.Option = ({
  children,
  ...props
}: {
  value: unknown;
  children: React.ReactNode;
}) => {
  return (
    <option {...(props as React.OptionHTMLAttributes<HTMLOptionElement>)}>
      {children}
    </option>
  );
};

const Modal: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  children: React.ReactNode;
  title?: string;
}> & {
  confirm: (options: {
    title: string;
    content: string;
    onOk: () => void;
  }) => void;
} = ({ children, ...props }) => {
  if (!props.visible) return null;

  return (
    <div className="ant-modal-mask">
      <div className="ant-modal-wrap">
        <div className="ant-modal">
          {props.title && <div className="ant-modal-header">{props.title}</div>}
          <div className="ant-modal-body">{children}</div>
          <div className="ant-modal-footer">
            <Button onClick={props.onCancel}>Cancel</Button>
            <Button type="primary" onClick={props.onOk}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.confirm = ({
  title,
  content,
  onOk
}: {
  title: string;
  content: string;
  onOk: () => void;
}) => {
  // Simple mock implementation
  if (window.confirm(`${title}\n\n${content}`)) {
    onOk();
  }
};

const message = {
  success: (content: string) => console.info(`SUCCESS: ${content}`),
  error: (content: string) => console.info(`ERROR: ${content}`),
  warning: (content: string) => console.info(`WARNING: ${content}`),
  info: (content: string) => console.info(`INFO: ${content}`)
};

const notification = {
  success: (config: { message: string; description?: string }) =>
    console.info(
      `NOTIFICATION SUCCESS: ${config.message} - ${config.description}`,
    ),
  error: (config: { message: string; description?: string }) =>
    console.info(
      `NOTIFICATION ERROR: ${config.message} - ${config.description}`,
    )
};

export { Button, Input, Select, Modal, message, notification };
