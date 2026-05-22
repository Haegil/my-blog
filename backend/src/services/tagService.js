const tagRepository = require('../repositories/tagRepository');

class TagService {
  async getAllTags() {
    return await tagRepository.findAllWithCount();
  }
}

module.exports = new TagService();
