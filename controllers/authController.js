import AuthService from "../services/authService.js";
import TokenService from "../services/tokenService.js";
import AppError from "../utilities/AppError.js";

export default class AuthController {
  static async register(req, res, next) {
    const { name, email, password } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError(400, "Request body is required"));
    }

    if (!name || !email || !password) {
      return next(new AppError(400, "Name, email, and password are required"));
    }

    const { user, token } = await AuthService.register({ name, email, password });
    res.status(201).json({ status: "success", user, token });
  }

  static async login(req, res, next) {
    const { email, password } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError(400, "Request body is required"));
    }

    if (!email || !password) {
      return next(new AppError(400, "Email and password are required"));
    }

    const result = await AuthService.login(email, password);
    if (!result) {
      return next(new AppError(401, "Invalid email or password"));
    }

    const { user, token } = result;
    res.status(200).json({ status: "success", user, token });
  }

  static async logout(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError(401, "Authorization token is required"));
    }

    await AuthService.logout(token);
    res.status(200).json({ status: "success", message: "Logged out successfully" });
  }

  //   static async protected(req, res, next) {
  //     const token = req.headers.authorization?.split(" ")[1];
  //     if (!token) {
  //       return next(new AppError(401, "Authorization token is required"));
  //     }

  //     const { exp, payload } = await TokenService.verifyAccessToken(token);
  //     // if (!exp) {
  //     //   return next(new AppError(401, "Invalid or expired token"));
  //     // }

  //     const user = await AuthService.getUserById(payload.userId);
  //     if (!user) {
  //       return next(new AppError(401, "User not found"));
  //     }

  //     req.user = user;
  //   }
}
