import React, { useState } from 'react';
import { CloudArrowUpIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface MusicUploadFormProps {
  onUpload?: (file: File, metadata: unknown) => void;
}

const MusicUploadForm: React.FC<MusicUploadFormProps> = ({ onUpload }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [genre, setGenre] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('artist', artist.trim());
      formData.append('genre', genre);

      const token = typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('accessToken') || ''
        : '';

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      const result = await res.json();
      onUpload?.(file, {
        title: title.trim(),
        artist: artist.trim(),
        genre,
        url: result.data?.url,
        id: result.data?.id
      });
      setFile(null);
      setTitle('');
      setArtist('');
      setGenre('');
    } catch (err) {
      console.error('Audio upload error:', err);
      onUpload?.(file, { title: title.trim(), artist: artist.trim(), genre });
      setFile(null);
      setTitle('');
      setArtist('');
      setGenre('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MusicalNoteIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Upload Music</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            id="music-upload"
          />
          <label htmlFor="music-upload" className="cursor-pointer">
            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm text-gray-600">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-700 mt-1">MP3, WAV, FLAC up to 50MB</p>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Track Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Enter track title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Enter artist name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white"
          >
            <option value="">Select genre</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hip-hop">Hip Hop</option>
            <option value="electronic">Electronic</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!file || !title || isUploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="w-5 h-5" />
              Upload Track
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default MusicUploadForm;
