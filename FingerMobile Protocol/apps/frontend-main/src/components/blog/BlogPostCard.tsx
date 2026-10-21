import React, {} from 'react';
import { BlogPost } from '../../services/blogService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  compact?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onLike,
  onShare,
  onSave,
  compact = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${compact ? 'max-w-sm' : ''}`}>
      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {post.is_featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
          )}
          {post.is_pinned && (
            <Badge className="absolute top-2 left-2 bg-blue-500">Pinned</Badge>
          )}
        </div>
      )}

      <CardHeader className="pb-2">
        {/* Category & Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
          {post.tags?.slice(0, 2).map((tag: string, index: number) => (
            <Badge key={index} variant="outline">{tag}</Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-bold ${compact ? 'text-lg' : 'text-xl'} line-clamp-2`}>
          {post.title}
        </h3>

        {/* Author & Date */}
        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium mt-2">
          <span>{post.author?.name || post.authorName || 'Anonymous'}</span>
          <span>•</span>
          <span>{formatDate(post.published_at || post.publishedAt || post.created_at || post.createdAt)}</span>
          {post.reading_time_minutes && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time_minutes} min read
              </span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {/* Excerpt */}
        <p className="text-slate-700 font-medium line-clamp-3">
          {compact ? truncateText(post.excerpt || post.content, 150) : (post.excerpt || truncateText(post.content, 300))}
        </p>

        {/* Gallery Preview */}
        {!compact && post.gallery_images && post.gallery_images.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {post.gallery_images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
            {post.gallery_images.length > 3 && (
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-sm text-slate-700">
                +{post.gallery_images.length - 3}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        {/* Engagement Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-800 font-semibold">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {(post.views_count || post.views || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {(post.likes_count || post.likes || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {(post.comments_count || post.comments || 0).toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onLike?.(post.id)}
            className="hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onShare?.(post.id)}
            className="hover:text-blue-500"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSave?.(post.id)}
            className="hover:text-yellow-500"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
