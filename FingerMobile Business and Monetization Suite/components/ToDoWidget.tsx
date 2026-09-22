import React, { useState } from 'react';

export interface ToDoItem {
  id: string;
  title: string;
  completed: boolean;
}

interface ToDoWidgetProps {
  initialTodos?: ToDoItem[];
}

export function ToDoWidget({ initialTodos = [] }: ToDoWidgetProps) {
  const [todos, setTodos] = useState<ToDoItem[]>(initialTodos.length > 0 ? initialTodos : [
    { id: '1', title: 'Complete KYC Verification', completed: false },
    { id: '2', title: 'Submit Business Registration', completed: false },
    { id: '3', title: 'Review Monetization Policy', completed: true },
  ]);

  const [newTask, setNewTask] = useState('');

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setTodos([
      ...todos,
      { id: Date.now().toString(), title: newTask, completed: false }
    ]);
    setNewTask('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Tasks</h3>
      
      <div className="space-y-3 mb-4">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              id={`todo-${todo.id}`}
            />
            <label 
              htmlFor={`todo-${todo.id}`}
              className={`ml-3 block text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}
            >
              {todo.title}
            </label>
          </div>
        ))}
      </div>

      <form onSubmit={addTodo} className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
}
