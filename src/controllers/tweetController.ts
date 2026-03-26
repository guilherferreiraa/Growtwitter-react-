import type { Request, Response } from "express";
import { TweetService } from "../services/tweetService";

const tweetService = new TweetService();

export class TweetController {
  async handle(req: Request, res: Response) {
    try {
      const { content, parentTweetId } = req.body;
      const userId = (req as any).userId;

      if (!content) return res.status(400).json({ error: "Conteúdo obrigatório." });

      const tweet = await tweetService.create(content, userId, parentTweetId);
      return res.status(201).json(tweet);
    } catch {
      return res.status(400).json({ error: "Erro ao criar tweet." });
    }
  }

  async feed(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const tweets = await tweetService.findFollowerFeed(userId); 
      return res.status(200).json(tweets);
    } catch {
      return res.status(400).json({ error: "Erro ao carregar feed." });
    }
  }

  async index(_req: Request, res: Response) {
    try {
      const tweets = await tweetService.findAll();
      return res.status(200).json(tweets);
    } catch {
      return res.status(400).json({ error: "Erro ao carregar tweets." });
    }
  }

  async like(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = (req as any).userId;
      const result = await tweetService.like(id, userId);
      return res.status(200).json(result);
    } catch {
      return res.status(400).json({ error: "Erro ao curtir tweet." });
    }
  }

  async unlike(req: Request, res: Response) {
    try {
      const { id } = req.params; 
      const userId = (req as any).userId;
      const result = await tweetService.unlike(id as string, userId);
      return res.status(200).json(result);
    } catch {
      return res.status(400).json({ error: "Erro ao remover curtida do tweet." });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = (req as any).userId;
      await tweetService.delete(id, userId); 
      
      return res.status(200).json({ message: "Tweet removido com sucesso!" });
    } catch {
      return res.status(400).json({ error: "Erro ao excluir tweet." });
    }
  }

  async reply(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const id = String(req.params.id);
      const userId = (req as any).userId;

      if (!content) return res.status(400).json({ error: "Conteúdo obrigatório." });

      const reply = await tweetService.create(content, userId, id); 
      return res.status(201).json(reply);
    } catch {
      return res.status(400).json({ error: "Erro ao responder tweet." });
    }
  }

  async getFeed(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ ok: false, message: "Não autorizado." });
      }

      const feed = await tweetService.findFeed(userId);

      return res.status(200).json({
        ok: true,
        data: feed
      });
    } catch {
      return res.status(500).json({ ok: false, message: "Erro ao carregar feed." });
    }
  }
}