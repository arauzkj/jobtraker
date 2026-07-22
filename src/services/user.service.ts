import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  static async getAllUsers() {
    try {
      const users = await UserRepository.findAll();
      if (!users || users.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      return {
        success: true,
        data: users,
      };

    } catch (error) {
      throw new Error("Ocurrió un error al procesar la lista de usuarios");
    }
  }
}
