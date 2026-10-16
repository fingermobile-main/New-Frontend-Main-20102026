import React, { useState } from 'react';
import {
  ChatBubbleIcon,
  PlusIcon,
  SparklesIcon,
  BookmarkIcon,
  ChevronRightIcon
} from '../../icons';
import {
  DesignDiscussionItem,
  COMMUNITY_DESIGN_DISCUSSIONS,
  TributPinItem
} from '../../data/tributData';

interface TributDiscussionsTabProps {
  allPins: TributPinItem[];
  onSelectPin: (pin: TributPinItem) => void;
  onMemberClick: (author: TributPinItem['author'], e: React.MouseEvent) => void;
}

export const TributDiscussionsTab: React.FC<TributDiscussionsTabProps> = ({
  allPins,
  onSelectPin,
  onMemberClick
}) => {
  const [discussions, setDiscussions] = useState<DesignDiscussionItem[]>(COMMUNITY_DESIGN_DISCUSSIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New discussion form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Fashion & Styling');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('design-critique, lookbook-review');

  const categories = [
    { id: 'all', label: 'All Discussions' },
    { id: 'Textile & Dyeing', label: 'Textile & Dyeing' },
    { id: 'Grooming & Lighting', label: 'Grooming & Lighting' },
    { id: 'Architecture & Living', label: 'Architecture & Living' },
    { id: 'Prompt Engineering', label: 'AI Prompt Engineering' }
  ];

  const filteredDiscussions = discussions.filter(
    (d) => selectedCategory === 'all' || d.category === selectedCategory
  );

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: DesignDiscussionItem = {
      id: `disc-${Date.now()}`,
      title: newTitle.trim(),
      authorName: 'Ibrahim Danjuma (You)',
      authorHandle: '@ibrahim_d',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: 'Just now',
      category: newCategory,
      content: newContent.trim(),
      commentsCount: 0,
      upvotesCount: 1,
      tags: newTags.split(',').map((t) => t.trim()),
      resolved: false
    };

    setDiscussions([created, ...discussions]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleUpvote = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, upvotesCount: d.upvotesCount + 1 } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
            Community Design Lounge & Critique Rooms
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Communicate & Discuss Designs
          </h2>
          <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
            Collaborate with creators, review lighting setups, share AI prompt recipes, critique Adire geometric patterns, and co-plan sovereign project boards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Start Design Discussion
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filteredDiscussions.map((d) => {
          const linkedPin = d.pinId ? allPins.find((p) => p.id === d.pinId) : null;

          return (
            <div
              key={d.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) =>
                      onMemberClick(
                        {
                          id: 'usr-disc',
                          name: d.authorName,
                          handle: d.authorHandle,
                          avatar: d.authorAvatar,
                          domainReputation: 'Master Creator',
                          consistencyStreak: 'Active Creator'
                        },
                        e
                      )
                    }
                    className="flex items-center gap-2 group/author hover:text-purple-700 transition"
                  >
                    <img
                      src={d.authorAvatar}
                      alt={d.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-900 group-hover/author:text-purple-700">
                        {d.authorName}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{d.authorHandle}</span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 font-bold border border-purple-200 text-[10px]">
                    {d.category}
                  </span>
                  <span className="text-slate-500 text-[11px]">{d.createdAt}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {d.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {d.content}
                </p>
              </div>

              {/* Linked Pin Thumbnail if attached */}
              {linkedPin && (
                <div
                  onClick={() => onSelectPin(linkedPin)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 cursor-pointer transition"
                >
                  <img
                    src={linkedPin.mediaUrl}
                    alt={linkedPin.title}
                    className="w-12 h-16 object-cover rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase text-purple-700 block">
                      Attached Design Pin
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {linkedPin.title}
                    </h5>
                    <span className="text-[11px] text-slate-600">
                      Board: {linkedPin.boardName}
                    </span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex gap-1.5 flex-wrap">
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 font-bold text-slate-700">
                  <button
                    onClick={() => handleUpvote(d.id)}
                    className="flex items-center gap-1 hover:text-purple-700 py-1 px-2 rounded-lg hover:bg-slate-100 transition"
                  >
                    <span>▲</span>
                    <span>{d.upvotesCount} Upvotes</span>
                  </button>

                  <button className="flex items-center gap-1 hover:text-purple-700 py-1 px-2 rounded-lg hover:bg-slate-100 transition">
                    <ChatBubbleIcon className="w-3.5 h-3.5" />
                    <span>{d.commentsCount} Critiques</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                  Design Forum
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Start Design Discussion or Ask for Critique
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-900 font-bold mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best lighting angle for Adire indigo portraits"
                  className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-bold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
                >
                  <option value="Fashion & Styling">Fashion & Styling</option>
                  <option value="Textile & Dyeing">Textile & Dyeing</option>
                  <option value="Grooming & Lighting">Grooming & Lighting</option>
                  <option value="Architecture & Living">Architecture & Living</option>
                  <option value="AI Prompt Engineering">AI Prompt Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-900 font-bold mb-1">
                  Design Question / Critique Request *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detail your question, material challenges, prompt techniques, or aesthetic goals..."
                  className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-bold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Post Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TributDiscussionsTab;
