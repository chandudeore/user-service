const AuthService = require("../services/authService");

const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = await AuthService.registerUser({
        username,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.loginUser({ email, password });

      res.json({
        success: true,
        token,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await AuthService.getUserProfile(req.user.id);
      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = authController;
