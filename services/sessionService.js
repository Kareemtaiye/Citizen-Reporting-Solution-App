import SessionRepository from "../repositories/sessionRepository.js";

export default class SessionService {
  static async createSession({ userId, token }, client) {
    return await SessionRepository.createSession({ userId, token }, client);
  }

  static async getSession(sessionId) {
    // Logic to retrieve session details
  }

  static async deleteSession(sessionId) {
    // Logic to delete a session
  }
}
