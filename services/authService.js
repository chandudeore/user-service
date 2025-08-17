const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const AuthService = {
  async registerUser({ username, email, password }) {
    try {
      // Check if user already exists
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        throw new Error('Email already in use');
      }

      const existingUserByUsername = await User.findByUsername(username);
      if (existingUserByUsername) {
        throw new Error('Username already taken');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const userId = await User.create({
        username,
        email,
        password: hashedPassword
      });

      return userId;
    } catch (error) {
      console.error('Error in registerUser:', error);
      throw error; // Re-throw the error for the controller to handle
    }
  },
  async loginUser({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET, // Make sure this is set in .env
      { expiresIn: '1h' }
    );

    // 4. Return user data (without password) and token
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at
    };

    return { user: userData, token };
  },

  async getUserProfile(userId) {
    return await User.findById(userId);
  },
};

module.exports = AuthService;
