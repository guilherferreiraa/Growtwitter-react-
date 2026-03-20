import { prisma } from "../database/prisma.database";
import { ResponseDto } from "../dto/ResponseDto";

export class TweetService {
  async create(content: string, userId: string): Promise<ResponseDto> {
    try {
      // O seu código "antigo" (que funciona!)
      const tweet = await prisma.tweet.create({
        data: { content, userId, type: "T" }
      });

      // O retorno padrão do projeto novo
      return {
        ok: true,
        message: "Tweet postado com sucesso!",
        data: tweet
      };
    } catch (error) {
      return {
        ok: false,
        message: "Erro ao criar tweet no banco."
      };
    }
  }
}