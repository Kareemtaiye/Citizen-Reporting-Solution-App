import bcrypt from "bcrypt";

export default class PasswordUtils {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
