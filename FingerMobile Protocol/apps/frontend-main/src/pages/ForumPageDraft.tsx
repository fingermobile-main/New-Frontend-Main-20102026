import ForumPage from './ForumPage';

// The new source of truth for the forum page is ForumPage.
// ForumPageDraft is aliased directly to ForumPage for backwards compatibility.
export { ForumPage };
export const ForumPageDraft = ForumPage;
export default ForumPage;
