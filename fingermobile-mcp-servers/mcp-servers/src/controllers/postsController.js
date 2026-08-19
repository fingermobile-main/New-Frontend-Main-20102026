/* global require, exports */
const Post = require("../../src/models/Post");
const {
  containsBlockedWords,
  sanitizeText
} = require("../utils/wordModeration");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { member_id, content_type, text_content, media_url } = req.body;

    // Check for blocked words in text_content
    if (text_content && containsBlockedWords(text_content)) {
      return res.status(400).json({message: "Post contains blocked words." });
    }

    // Sanitize text_content before saving
    const sanitized_text_content = sanitizeText(text_content);

    // Create new post
    const post = new Post({
      member_id,
      content_type,
text_content: sanitized_text_content,
      media_url
    });

    // Save post to database (simulated)
    await post.save();

    res.status(201).json({message: "Post created successfully",
  post: {,
  id: post.id,
  member_id: post.member_id,
  content_type: post.content_type,
  text_content: post.text_content,
  media_url: post.media_url,
  created_at: post.created_at
      }
    });
  } catch (error) {
    // eslint-disable-line no-unused-vars
    res.status(500).json({message: "Server error creating post" });
  }
};

// Get member feed
exports.getFeed = async (req, res) => {
  try {
    // Get all posts (in a real implementation, this would be personalized)
    const posts = await Post.findAll();

    res.json({message: "Feed retrieved successfully",
  posts: posts.map((post) => ({,
  id: post.id,
  member_id: post.member_id,
  content_type: post.content_type,
  text_content: post.text_content,
  media_url: post.media_url,
  created_at: post.created_at
      }))
    });
  } catch (error) {
    // eslint-disable-line no-unused-vars
    res.status(500).json({message: "Server error retrieving feed" });
  }
};

// Get a specific post
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({message: "Post not found" });
    }

    res.json({message: "Post retrieved successfully",
  post: {,
  id: post.id,
  member_id: post.member_id,
  content_type: post.content_type,
  text_content: post.text_content,
  media_url: post.media_url,
  created_at: post.created_at
      }
    });
  } catch (error) {
    // eslint-disable-line no-unused-vars
    res.status(500).json({message: "Server error retrieving post" });
  }
};

// Get posts by member ID
exports.getmemberPosts = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Find posts by member ID
    const posts = await Post.findBymemberId(memberId);

    res.json({message: "member posts retrieved successfully",
  posts: posts.map((post) => ({,
  id: post.id,
  member_id: post.member_id,
  content_type: post.content_type,
  text_content: post.text_content,
  media_url: post.media_url,
  created_at: post.created_at
      }))
    });
  } catch (error) {
    // eslint-disable-line no-unused-vars
    res.status(500).json({message: "Server error retrieving member posts" });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text_content, media_url } = req.body;

    // Find post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({message: "Post not found" });
    }

    // Update post properties
    if (text_content !== undefined) {
      if (containsBlockedWords(text_content)) {
        return res
          .status(400)
          .json({message: "Updated content contains blocked words." });
      }
      post.text_content = sanitizeText(text_content);
    }
    if (media_url !== undefined) post.media_url = media_url;
    post.updated_at = new Date();

    // Save updated post (simulated)
    await post.save();

    res.json({message: "Post updated successfully",
  post: {,
  id: post.id,
  member_id: post.member_id,
  content_type: post.content_type,
  text_content: post.text_content,
  media_url: post.media_url,
  created_at: post.created_at,
  updated_at: post.updated_at
      }
    });
  } catch (error) {
    // eslint-disable-line no-unused-vars
    res.status(500).json({message: "Server error updating post" });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({message: "Post not found" });
    }

    // Delete post from database (simulated)

    res.json({message: "Post deleted successfully"
    });
  } catch (error) {
    // eslint-disable-line no-unused-vars
    res.status(500).json({message: "Server error deleting post" });
  }
};
