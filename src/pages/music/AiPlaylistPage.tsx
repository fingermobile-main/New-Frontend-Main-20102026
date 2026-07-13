import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import PageHeader from '../../components/PageHeader';
import { MagicWandIcon } from '../../icons';

const AiPlaylistPage = () => {
    const { handleGenerateAiPlaylist, isLoading } = useAppContext();
    const [prompt, setPrompt] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            handleGenerateAiPlaylist?.();
        }
    };


    const examplePrompts = [
        "Amapiano for a party",
        "lofi beats for studying",
        "upbeat 90s rock for a road trip",
        "songs that feel like a main character moment"
    ];

    return (
        <div className="p-6 lg:p-8">
            <PageHeader
                title="Create a Playlist with AI"
                description="Describe the vibe, and let Gemini curate the perfect playlist for you."
            />
            <div className="max-w-2xl mx-auto mt-6">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        rows={4}
                        className="w-full p-4 border rounded-lg text-lg"
                        placeholder="e.g., A playlist for a rainy day..."
                    />
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Or try an example:</p>
                        <div className="flex flex-wrap gap-2">
                            {examplePrompts.map(p => (
                                <button key={p} type="button" onClick={() => setPrompt(p)} className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200">
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading || !prompt.trim()} className="w-full mt-6 py-3 font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                        <MagicWandIcon className="w-5 h-5" />
                        {isLoading ? 'Creating Playlist...' : 'Create with Gemini'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiPlaylistPage;
