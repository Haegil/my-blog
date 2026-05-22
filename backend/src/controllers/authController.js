const { z } = require('zod');
const userService = require('../services/userService');

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

class AuthController {
  async login(req, res) {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: '입력값을 확인해주세요.', 
          errors: parseResult.error.flatten() 
        });
      }

      const { username, password } = parseResult.data;
      const user = await userService.login(username, password);

      if (!user) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }

      req.session.user = user;
      return res.status(200).json({ message: '로그인에 성공했습니다.', user });
    } catch (err) {
      console.error('Login controller error:', err);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout session destroy error:', err);
        return res.status(500).json({ message: '로그아웃 도중 오류가 발생했습니다.' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: '로그아웃 되었습니다.' });
    });
  }

  async checkAuth(req, res) {
    if (req.session && req.session.user) {
      return res.status(200).json({ authenticated: true, user: req.session.user });
    }
    return res.status(200).json({ authenticated: false, user: null });
  }
}

module.exports = new AuthController();
