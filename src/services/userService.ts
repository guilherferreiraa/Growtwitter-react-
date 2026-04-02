import { prisma } from "../database/prisma.database";
import type { UserDTO } from "../dtos/user.dto";

export class UserService {
  async create(data: UserDTO) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingUser) {
      throw new Error("Já existe uma conta com esses dados.");
    }
    return await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        avatarUrl: data.avatarUrl,
      },
    });
  }
  async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== pass) {
      throw new Error("E-mail ou senha inválidos.");
    }

    return await prisma.user.update({
      where: { id: user.id },
      data: { isLogged: true },
    });
  }

async findProfile(profileId: string) {
  return await prisma.user.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatarUrl: true,
      tweets: {
        orderBy: { createdAt: 'desc' },
        include: {
          likes: true,
          _count: { select: { replies: true } }
        }
      },
      followers: {
        select: {
          follower: { 
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      },
      following: {
        select: {
          following: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  });
}

async findAll() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatarUrl: true,
      isLogged: true,
      followers: {
        select: {
          follower: {
            select: {
              id: true,
              username: true
            }
          }
        }
      },
      _count: {
        select: {
          followers: true,
          following: true
        }
      }
    }
  });
}
  async logout(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new Error("Usuário não encontrado.");
    return await prisma.user.update({
      where: { id },
      data: { isLogged: false },
    });
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return await prisma.user.delete({
      where: { id },
    });
  }
}
