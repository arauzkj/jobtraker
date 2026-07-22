import { UserDto } from "@/dto/user.dto";
import prisma from "@/lib/prisma";

export class UserRepository {
  static async findAll() {
    try {
      const users: UserDto[] = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw new Error("No se pudieron obtener los usuarios");
    }
  }
}
