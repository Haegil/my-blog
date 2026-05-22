const db = require('../config/db');
const postRepository = require('../repositories/postRepository');
const tagRepository = require('../repositories/tagRepository');

class PostService {
  async getPostById(id) {
    const post = await postRepository.findById(id);
    if (!post) {
      return null;
    }
    const tags = await tagRepository.findByPostId(id);
    return { ...post, tags };
  }

  async getAllPosts(searchQuery, tagName, page = null, limit = null) {
    const posts = await postRepository.findAll(searchQuery, tagName, page, limit);
    if (posts.length === 0) {
      return page !== null ? { posts: [], totalCount: 0 } : [];
    }

    // Populate tags for each post in parallel
    const postsWithTags = await Promise.all(
      posts.map(async (post) => {
        const tags = await tagRepository.findByPostId(post.id);
        return { ...post, tags };
      })
    );

    if (page !== null) {
      const totalCount = await postRepository.countAll(searchQuery, tagName);
      return { posts: postsWithTags, totalCount };
    }

    return postsWithTags;
  }

  async createPost(title, content, tagNames = []) {
    return await db.executeTransaction(async (connection) => {
      const postId = await postRepository.create(title, content, connection);

      if (tagNames && tagNames.length > 0) {
        for (const rawName of tagNames) {
          const name = rawName.trim().toLowerCase();
          if (!name) continue;

          let tag = await tagRepository.findByName(name);
          let tagId;
          if (!tag) {
            tagId = await tagRepository.create(name, connection);
          } else {
            tagId = tag.id;
          }

          await postRepository.addTag(postId, tagId, connection);
        }
      }

      return postId;
    });
  }

  async updatePost(id, title, content, tagNames = []) {
    return await db.executeTransaction(async (connection) => {
      const post = await postRepository.findById(id);
      if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
      }

      await postRepository.update(id, title, content, connection);
      await postRepository.clearTags(id, connection);

      if (tagNames && tagNames.length > 0) {
        for (const rawName of tagNames) {
          const name = rawName.trim().toLowerCase();
          if (!name) continue;

          let tag = await tagRepository.findByName(name);
          let tagId;
          if (!tag) {
            tagId = await tagRepository.create(name, connection);
          } else {
            tagId = tag.id;
          }

          await postRepository.addTag(id, tagId, connection);
        }
      }

      // Clean up tags that are no longer referenced by any posts
      await tagRepository.deleteOrphanTags(connection);

      return id;
    });
  }

  async deletePost(id) {
    return await db.executeTransaction(async (connection) => {
      const post = await postRepository.findById(id);
      if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
      }

      await postRepository.delete(id, connection);
      await tagRepository.deleteOrphanTags(connection);

      return id;
    });
  }
}

module.exports = new PostService();
