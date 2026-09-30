import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import MainLayout from '../components/layout/MainLayout';
import { StarIcon, TagIcon } from '../icons';
import { ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon } from '../icons/heroicons';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import legalComplianceService from '../services/legalComplianceService';

const FeedbackPage: React.FC = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    category: 'general',
    rating: '5',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      addToast('Please provide your feedback details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await legalComplianceService.submitFeedback({
        category: formData.category,
        rating: parseInt(formData.rating, 10) || 5,
        comment: formData.comment,
        pageUrl: window.location.pathname
      });

      if (res.success) {
        addToast('Thank you! Your feedback has been recorded in our protocol improvement registry.', 'success');
        setFormData({ category: 'general', rating: '5', comment: '' });
      } else {
        addToast(res.message || 'Could not record feedback.', 'error');
      }
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating: rating.toString() });
  };

  return (
    <MainLayout pageTitle="Send Feedback">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

        {/* Animated Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 -z-10 overflow-hidden opacity-30 pointer-events-none flex justify-center items-center">
          <div className="absolute w-[800px] h-[800px] rounded-full border border-indigo-500/10"></div>
          <div className="absolute w-[600px] h-[600px] rounded-full border border-purple-500/10"></div>
        </div>

        {/* Header Section */}
        <div className="mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-900/20 text-white rotate-3 hover:rotate-0 transition-transform">
            <ChatBubbleBottomCenterTextIcon className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Send us Feedback</h1>
          <p className="mt-4 text-xl font-medium text-slate-500 max-w-2xl mx-auto">
            We value your input. Let us know how we can improve the platform and your experience.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

          <div className="px-6 py-10 sm:p-12 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category Selection */}
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-indigo-500" />
                    Feedback Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="block w-full pl-5 pr-10 py-4 text-lg font-medium text-slate-900 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 bg-white transition-all cursor-pointer shadow-sm appearance-none"
                    >
                      <option value="general">General Suggestion</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="support">Customer Support</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Rating Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-amber-500" />
                    Overall Rating
                  </label>
                  <div className="bg-white border-2 border-slate-200/60 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                          {star <= (hoveredRating || parseInt(formData.rating)) ? (
                            <StarIconSolid className="w-8 h-8 text-amber-400 drop-shadow-sm" />
                          ) : (
                            <StarIcon className="w-8 h-8 text-slate-300" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="font-bold text-slate-400 text-sm hidden sm:block">
                      {formData.rating === '5' ? 'Excellent' : formData.rating === '4' ? 'Good' : formData.rating === '3' ? 'Average' : formData.rating === '2' ? 'Poor' : 'Terrible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments Area */}
              <div>
                <label htmlFor="comment" className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-purple-500" />
                  Your Comments
                </label>
                <textarea
                  id="comment"
                  rows={6}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="block w-full p-5 text-lg font-medium text-slate-900 border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 bg-white transition-all shadow-sm resize-y"
                  placeholder="Please provide as much detail as possible to help us understand your feedback..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.comment.trim()}
                  className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-2xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Feedback
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FeedbackPage;
