import User from './models/User.js';
import Session from './models/Session.js';

// Database operations
class Database {
  // User operations
  async createUser(fullName, email, password) {
    const user = new User({
      fullName,
      email,
      password
    });
    await user.save();
    return user;
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async updateUserLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date()
    });
  }

  // Session operations
  async createSession(userId, token, expiresAt) {
    const session = new Session({
      userId,
      token,
      expiresAt
    });
    await session.save();
    return session;
  }

  async deleteSession(token) {
    await Session.deleteOne({ token });
  }

  async findSessionByToken(token) {
    return await Session.findOne({ token });
  }

  // Clean up expired sessions
  async cleanExpiredSessions() {
    const now = new Date();
    await Session.deleteMany({ expiresAt: { $lt: now } });
  }
}

const db = new Database();

export default db;
