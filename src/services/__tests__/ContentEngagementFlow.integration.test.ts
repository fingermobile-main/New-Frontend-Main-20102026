import axios from 'axios';
import PostService from '../PostService';
import commentService from '../CommentService';
import { ApiService } from '../api';

describe('Content engagement services', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  it('creates a post and returns the service response envelope', async () => {
    const post = jest.spyOn(ApiService, 'post').mockResolvedValue({ data: { id: 'post-1', content: 'Hello' } } as any);

    const result = await PostService.createPost({ content: 'Hello' });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe('post-1');
    expect(post).toHaveBeenCalledWith('/posts', { content: 'Hello' });
  });

  it('likes and unlikes posts using the current endpoints', async () => {
    const post = jest.spyOn(ApiService, 'post').mockResolvedValue({ data: {} } as any);
    const remove = jest.spyOn(ApiService, 'delete').mockResolvedValue({ data: {} } as any);

    expect((await PostService.likePost('post-2')).success).toBe(true);
    expect((await PostService.unlikePost('post-2')).success).toBe(true);
    expect(post).toHaveBeenCalledWith('/posts/post-2/like');
    expect(remove).toHaveBeenCalledWith('/posts/post-2/like');
  });

  it('shares a post through the current endpoint', async () => {
    const post = jest.spyOn(ApiService, 'post').mockResolvedValue({ data: { id: 'post-3' } } as any);

    const result = await PostService.sharePost('post-3', 'Worth a read');

    expect(result.success).toBe(true);
    expect(post).toHaveBeenCalledWith('/posts/post-3/share', { message: 'Worth a read' });
  });

  it('creates a comment using the comment service endpoint and shape', async () => {
    const api = axios.create();
    const post = jest.spyOn(api, 'post').mockResolvedValue({ data: { id: 'comment-1', postId: 'post-4', content: 'Nice!' } });

    const result = await commentService.createComment({ postId: 'post-4', content: 'Nice!' });

    expect(result.id).toBe('comment-1');
    expect(post).toHaveBeenCalledWith('/', { postId: 'post-4', content: 'Nice!' });
  });
});
