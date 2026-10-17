import React, { useState } from 'react';
import CategorySelector from '../components/CategorySelector';
import { FORUM_CATEGORIES } from '../data/categories';
import CensorshipSelector, { CensorshipOptions } from '../components/CensorshipSelector';
import CensoredPostWrapper from '../components/CensoredPostWrapper';

const mockPosts = [
  {
    id: 1,
    author: 'Alice Cooper',
    handle: '@alice_web3',
    time: '2h ago',
    content: 'Just deployed my first smart contract on FingerMobile! The developer experience is incredibly smooth. Highly recommend checking out the new documentation.',
    likes: 124,
    comments: 18,
    reposts: 5,
    censorship: {
      tags: [],
      visualEffect: 'NONE',
      interactionRule: 'NONE'
    }
  },
  {
    id: 2,
    author: 'Bob Smith',
    handle: '@bob_builder',
    time: '4h ago',
    content: 'Who is excited for the upcoming FingerMobile protocol upgrade? The new zero-knowledge proofs integration is going to be a game changer for privacy.',
    likes: 342,
    comments: 56,
    reposts: 21,
    censorship: {
      tags: ['Spoiler'],
      visualEffect: 'BLUR',
      interactionRule: 'CLICK_TO_REVEAL'
    }
  },
  {
    id: 3,
    author: 'Charlie Day',
    handle: '@charlie_d',
    time: '5h ago',
    content: 'This post is restricted to members 18 and over. Contains graphic themes that some may find disturbing.',
    likes: 89,
    comments: 12,
    reposts: 2,
    censorship: {
      tags: ['18+', 'NSFW', 'Violence'],
      visualEffect: 'INTERSTITIAL',
      interactionRule: '15_SEC_TIMER'
    }
  },
  {
    id: 4,
    author: 'Dana Scully',
    handle: '@dana_x',
    time: '6h ago',
    content: 'The truth is out there, but this message will self-destruct once you read it.',
    likes: 156,
    comments: 0,
    reposts: 0,
    censorship: {
      tags: [],
      visualEffect: 'CENSOR_BAR',
      interactionRule: 'VIEW_ONCE'
    }
  }
];

export default function CenterFeed() {
  // Find "General Discussion" or fallback to first category
  const defaultCategory = FORUM_CATEGORIES.find(c => c.name === 'General Discussion')?.id || FORUM_CATEGORIES[0].id;
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategory);

  const [censorshipOptions, setCensorshipOptions] = useState<CensorshipOptions>({
    tags: [],
    visualEffect: 'NONE',
    interactionRule: 'NONE'
  });

  return (
    <div className="w-full pb-20">
      {/* Create Post Input */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center flex-wrap">
          <CategorySelector
            selectedCategoryId={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />
          <CensorshipSelector
            options={censorshipOptions}
            onChange={setCensorshipOptions}
          />
        </div>
        <div className="flex space-x-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent border-none text-lg resize-none outline-none placeholder:text-slate-400 mt-2 text-slate-900 font-bold border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="What's happening in the community?"
              rows={2}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200">
          <div className="flex space-x-2 text-indigo-500">
            <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
            <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-5 rounded-full transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Feed Divider */}
      <div className="h-2 bg-gray-50" />

      {/* Posts */}
      <div className="divide-y divide-gray-100">
        {mockPosts.map((post) => (
          <article key={post.id} className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-2">
                  <h3 className="font-bold text-gray-900 truncate">{post.author}</h3>
                  <span className="text-slate-700 text-sm truncate">{post.handle}</span>
                  <span className="text-slate-700 text-sm">·</span>
                  <span className="text-slate-700 text-sm">{post.time}</span>
                </div>

                <CensoredPostWrapper options={post.censorship as CensorshipOptions}>
                  <p className="mt-1 text-gray-800 text-[15px] leading-relaxed">
                    {post.content}
                  </p>
                </CensoredPostWrapper>
                <div className="flex items-center justify-between mt-3 max-w-md text-slate-700">
                  <button className="flex items-center space-x-2 group hover:text-indigo-600 transition-colors">
                    <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 group hover:text-green-600 transition-colors">
                    <div className="p-1.5 rounded-full group-hover:bg-green-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                    <span className="text-sm">{post.reposts}</span>
                  </button>
                  <button className="flex items-center space-x-2 group hover:text-pink-600 transition-colors">
                    <div className="p-1.5 rounded-full group-hover:bg-pink-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </div>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 group hover:text-indigo-600 transition-colors">
                    <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
