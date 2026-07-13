import React from 'react';
import { useAI } from '../hooks/useAI';
import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from "../contexts/AppContext";
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { logError } from '../utils/errorLogger';

// --- Subcomponent: AI Instruction Suggestions ---
interface AISuggestionProps {
  suggestions: Array<{ label: string; description: string; instruction: string }>;
  onSelect: (instruction: string) => void;
}

const AISuggestions: React.FC<AISuggestionProps> = React.memo(({ suggestions, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">AI Editing Suggestions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index}
            onClick={() => onSelect(suggestion.instruction)}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <h4 className="font-medium text-gray-900">{suggestion.label}</h4>
            <p className="text-sm text-gray-500 mt-1">{suggestion.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
});

AISuggestions.displayName = "AISuggestions";

// --- Subcomponent: Action Buttons ---
interface ActionButtonsProps {
  onEdit: () => void;
  onUseOriginal: () => void;
  onSave: () => void;
  isEditing: boolean;
  instruction: string;
  editedContent: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = React.memo(({ onEdit, onUseOriginal, onSave, isEditing, instruction, editedContent }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={onEdit}
        disabled={isEditing || !instruction.trim()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isEditing ? 'Editing...' : 'Apply AI Edit'}
      </button>
      
      <button
        onClick={onUseOriginal}
        disabled={!editedContent}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Revert to Original
      </button>
      
      <button
        onClick={onSave}
        disabled={!editedContent}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

// --- Main Container Page Component ---
const EditPostPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { loading: aiLoading, error } = useAI();
  const { balance } = useWeb3();
  const [originalContent, setOriginalContent] = React.useState<string>('This is the original post content that would be edited with AI assistance. It could be anything from a short status update to a longer blog post.');
  const [editedContent, setEditedContent] = React.useState<string>('');
  const [instruction, setInstruction] = React.useState<string>('');
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const handleEdit = React.useCallback(async () => {
    if (!instruction.trim()) return;
    
    setIsEditing(true);
    try {
      // Placeholder implementation - in a real app, this would call an AI editing API
      const result = `${originalContent}\n\n[AI Edited based on instruction: ${instruction}]`;
      setEditedContent(result);
      showToast('AI edit applied successfully!', 'success');
    } catch (err) {
      logError(err, { context: 'EditPostPage - Edit content' });
      showToast('Failed to apply AI edit', 'error');
    } finally {
      setIsEditing(false);
    }
  }, [instruction, originalContent, showToast]);

  const handleSave = React.useCallback(() => {
    // In a real app, this would save the edited content
    showToast('Post saved successfully!', 'success');
  }, [showToast]);

  const handleUseOriginal = React.useCallback(() => {
    setEditedContent(originalContent);
  }, [originalContent]);

  const handleSelectSuggestion = React.useCallback((suggestion: string) => {
    setInstruction(suggestion);
  }, []);

  const aiSuggestions = [
    { label: "Professional Tone", description: "Adjust the tone to be more formal and business-appropriate", instruction: "Make the tone more professional" },
    { label: "More Engaging", description: "Add excitement and make the content more captivating", instruction: "Make it more engaging and exciting" },
    { label: "Grammar Check", description: "Correct any grammatical or spelling mistakes", instruction: "Fix grammar and spelling errors" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="AI Post Editor" />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Enhance Your Post with AI</h2>
          <p className="text-gray-600 mb-6">
            Use AI to improve your post content. Provide instructions on how you want the content to be modified.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="originalContent" className="block text-sm font-medium text-gray-700 mb-2">
                Original Content
              </label>
              <textarea
                id="originalContent"
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48"
              />
            </div>
            
            <div>
              <label htmlFor="editedContent" className="block text-sm font-medium text-gray-700 mb-2">
                AI-Edited Content
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto">
                {editedContent || 'Your edited content will appear here...'}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="aiInstruction" className="block text-sm font-medium text-gray-700 mb-2">
              How should the AI modify your content?
            </label>
            <input
              id="aiInstruction"
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., 'Make it more formal', 'Add more details about the experience', 'Shorten to 100 words'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isEditing}
            />
          </div>
          
          <ActionButtons
            onEdit={handleEdit}
            onUseOriginal={handleUseOriginal}
            onSave={handleSave}
            isEditing={isEditing}
            instruction={instruction}
            editedContent={editedContent}
          />
          
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            AI editing costs 3 FIC. Your balance: {balance.toLocaleString()} FIC
          </div>
        </div>
        
        {aiLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}
        
        <AISuggestions
          suggestions={aiSuggestions}
          onSelect={handleSelectSuggestion}
        />
      </div>
    </div>
  );
};

export default EditPostPage;