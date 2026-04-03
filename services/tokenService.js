import jwt from "jsonwebtoken";

export default class TokenService {
  static async generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }); //Use only access token just for prototyping
  }

  static async verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("Token verification failed:", err);
      throw new Error("Invalid token");
    }
  }
}
