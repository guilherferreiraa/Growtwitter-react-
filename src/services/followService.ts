import { prisma } from "../database/prisma.database";

export class FollowService {
  async follow(followerId: string, followingId: string) {
    const alreadyFollows = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (alreadyFollows) {
      throw new Error("Você já segue este usuário.");
    }

    return await prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollow(followerId: string, followingId: string) {
    return await prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
  }
}