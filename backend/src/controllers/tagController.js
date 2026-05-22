const tagService = require('../services/tagService');

class TagController {
  async getAllTags(req, res) {
    try {
      const tags = await tagService.getAllTags();
      return res.status(200).json(tags);
    } catch (err) {
      console.error('Get all tags error:', err);
      return res.status(500).json({ message: '태그 목록을 불러오는 도중 서버 오류가 발생했습니다.' });
    }
  }
}

module.exports = new TagController();
