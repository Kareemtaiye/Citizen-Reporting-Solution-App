/**
 * authenticate.js
 * Verifies the Bearer token from the Authorization header.
 * Attaches the full user object to req.user if valid.
 * Uses the same SessionService and TokenService already in your auth stack.
 */

import AppError from "../utilities/AppError.js";
import TokenService from "../services/tokenService.js";
import SessionService from "../services/sessionService.js";
import AuthRepository from "../repositories/authRepository.js";

export async function authenticate(req, res, next) {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError(401, "Authorization token is required"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError(401, "Authorization token is required"));
    }

    // 2. Verify the JWT is valid and not expired
    let decoded;
    try {
      decoded = await TokenService.verifyAccessToken(token);
    } catch {
      return next(new AppError(401, "Invalid or expired token"));
    }

    // 3. Check the session exists in the DB and has not been revoked
    const session = await SessionService.getSession(token);
    if (!session) {
      return next(new AppError(401, "Session not found. Please log in again"));
    }
    if (session.revoked_at) {
      return next(new AppError(401, "Session has been revoked. Please log in again"));
    }
    if (new Date(session.expires_at) < new Date()) {
      return next(new AppError(401, "Session has expired. Please log in again"));
    }

    // 4. Fetch the user from the DB to get fresh role/data
    const user = await AuthRepository.getUserById(decoded.userId);
    if (!user) {
      return next(new AppError(401, "User no longer exists"));
    }

    // 5. Attach user to request — controllers access req.user
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
