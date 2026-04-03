import pool from "../config/pg.js";
import AuthRepository from "../repositories/authRepository.js";
import PasswordUtils from "../utilities/passwordUtils.js";
import SessionService from "./sessionService.js";
import TokenService from "./tokenService.js";

export default class AuthService {
  static async register(userData) {
    const client = await pool.connect();

    const hashedPassword = await PasswordUtils.hashPassword(userData.password);

    const token = await TokenService.generateAccessToken({ userId: userData.id });
    try {
      await client.query("BEGIN");
      const user = await AuthRepository.createUser(
        { ...userData, password: hashedPassword },
        client,
      );
      await SessionService.createSession({ userId: user.id, token }, client);

      await client.query("COMMIT");
      return { user, token };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async login(email, password) {
    const user = await AuthRepository.getUserByEmail(email);
    if (!user) {
      return null; // User not found
    }

    const isPasswordValid = await PasswordUtils.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return null; // Invalid password
    }

    const token = await TokenService.generateAccessToken({ userId: user.id });
    await SessionService.createSession({ userId: user.id, token });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async logout(token) {
    await SessionService.deleteSession(token);
  }

  static async getUserById(userId) {
    const user = await AuthRepository.getUserById(userId);
    if (!user) {
      return null; // User not found
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
