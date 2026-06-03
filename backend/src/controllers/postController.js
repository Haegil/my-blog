const { z } = require('zod');
const postService = require('../services/postService');

const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(255, '제목은 255자 이하로 작성해주세요.'),
  content: z.string().min(1, '본문 내용을 입력해주세요.'),
  tags: z.array(z.string()).optional().default([]),
});

class PostController {
  async getAllPosts(req, res) {
    try {
      let { q, tag, page, limit, from, to } = req.query;

      // Handle '#' signature for tag search
      if (q && q.trim().startsWith('#')) {
        tag = q.trim().substring(1);
        q = undefined;
      }

      let parsedPage = null;
      let parsedLimit = null;
      if (page) {
        parsedPage = parseInt(page, 10);
        if (isNaN(parsedPage) || parsedPage < 1) parsedPage = 1;
      }
      if (limit) {
        parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 5;
      } else if (page) {
        parsedLimit = 5; // default limit to 5 if page is specified but limit isn't
      }

      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      const dateRange = {
        from: from && datePattern.test(from) ? from : null,
        to: to && datePattern.test(to) ? to : null,
      };

      const result = await postService.getAllPosts(q, tag, parsedPage, parsedLimit, dateRange);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Get all posts error:', err);
      return res.status(500).json({ message: '게시글 목록을 불러오는 도중 서버 오류가 발생했습니다.' });
    }
  }

  async getPostById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '올바르지 않은 게시글 ID입니다.' });
      }

      const post = await postService.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: '존재하지 않는 게시글입니다.' });
      }

      return res.status(200).json(post);
    } catch (err) {
      console.error('Get post by id error:', err);
      return res.status(500).json({ message: '게시글을 조회하는 도중 서버 오류가 발생했습니다.' });
    }
  }

  async createPost(req, res) {
    try {
      const parseResult = postSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: '입력값을 확인해주세요.', 
          errors: parseResult.error.flatten() 
        });
      }

      const { title, content, tags } = parseResult.data;
      const postId = await postService.createPost(title, content, tags);
      return res.status(201).json({ message: '게시글이 저장되었습니다.', id: postId });
    } catch (err) {
      console.error('Create post error:', err);
      return res.status(500).json({ message: '게시글을 작성하는 도중 서버 오류가 발생했습니다.' });
    }
  }

  async updatePost(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '올바르지 않은 게시글 ID입니다.' });
      }

      const parseResult = postSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: '입력값을 확인해주세요.', 
          errors: parseResult.error.flatten() 
        });
      }

      const { title, content, tags } = parseResult.data;
      await postService.updatePost(id, title, content, tags);
      return res.status(200).json({ message: '게시글이 수정되었습니다.', id });
    } catch (err) {
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      console.error('Update post error:', err);
      return res.status(500).json({ message: '게시글을 수정하는 도중 서버 오류가 발생했습니다.' });
    }
  }

  async deletePost(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '올바르지 않은 게시글 ID입니다.' });
      }

      await postService.deletePost(id);
      return res.status(200).json({ message: '게시글이 삭제되었습니다.', id });
    } catch (err) {
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      console.error('Delete post error:', err);
      return res.status(500).json({ message: '게시글을 삭제하는 도중 서버 오류가 발생했습니다.' });
    }
  }
}

module.exports = new PostController();
