import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, Sparkles, Home } from 'lucide-react';
import AdvancedMediaEditor from '../components/media/AdvancedMediaEditor';
import MainLayout from '../components/layout/MainLayout';

const AdvancedMediaEditorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout pageTitle="Advanced Media Editor">
      <div className="w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900 bg-slate-950 min-h-screen">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <AdvancedMediaEditor />
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.click();
              }}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-400 font-bold"
              aria-label="Upload Media"
            >
              <Image className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Media</span>
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 font-medium"
              aria-label="Editor Controls"
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Canvas</span>
            </button>
            <button
              onClick={() => navigate('/stercs/editor')}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 font-medium"
              aria-label="Master Stercs"
            >
              <Sparkles className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Stercs</span>
            </button>
            <button
              onClick={() => navigate('/forum')}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 font-medium"
              aria-label="Back to Forum"
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Forum</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedMediaEditorPage;
