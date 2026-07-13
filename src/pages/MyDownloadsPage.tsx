import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import PageHeader from '../components/PageHeader';
import { MyDownloadsIcon, PlayIcon, TrashIcon } from '../icons';
import type { DownloadedItem, MusicTrack, VideoContent } from '../types';

const MyDownloadsPage: React.FC = () => {
    const { myDownloads, handleRemoveDownload, handlePlayMedia } = useAppContext();

    const DownloadedItemCard: React.FC<{ item: DownloadedItem }> = ({ item }) => {
        const isMusic = item.type === 'audio';
        const content = item.content as unknown as MusicTrack | VideoContent;
        const imageUrl = isMusic ? (content as MusicTrack).albumArtUrl : (content as VideoContent).bannerUrl;
        
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={imageUrl} alt={content.title} className="w-full max-w-full h-auto rounded-md object-cover"  />
                    <div>
                        <p className="font-bold">{content.title}</p>
                        <p className="text-sm text-gray-500">{isMusic ? (content as MusicTrack).artist : (content as VideoContent).genre}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleRemoveDownload?.(item.id)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handlePlayMedia?.(content.id)} className="p-2 text-gray-500 hover:bg-blue-50 hover:text-brand-blue rounded-full">
                        <PlayIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-8">
            <PageHeader
                title="My Downloads"
                description="All your saved content for offline viewing and listening."
            />
            <div className="max-w-3xl mx-auto mt-6">
                {(myDownloads || []).length > 0 ? (
                    <div className="space-y-4">
                        {(myDownloads || []).map((item: DownloadedItem) => (
                            <DownloadedItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border">
                        <MyDownloadsIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="font-semibold text-gray-600">No Downloads Yet</p>
                        <p className="text-sm text-gray-500 mt-1">Click the download icon on music or videos to save them for offline access.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDownloadsPage;
