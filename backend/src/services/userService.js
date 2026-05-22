const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

class UserService {
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    return { id: user.id, username: user.username };
  }

  async seedAdminIfEmpty() {
    try {
      const count = await userRepository.count();
      if (count === 0) {
        const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
        const defaultPassword = process.env.ADMIN_PASSWORD || 'admin1234';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
        
        const newId = await userRepository.create(defaultUsername, hashedPassword);
        console.log(`[SEED] Default admin user created! ID: ${newId}, Username: ${defaultUsername}`);
      } else {
        console.log('[SEED] Admin user table is not empty. Seeding skipped.');
      }
    } catch (err) {
      console.error('Error seeding admin user:', err);
    }
  }
}

module.exports = new UserService();
