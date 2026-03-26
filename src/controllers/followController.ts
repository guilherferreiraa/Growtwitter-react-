
import type { Request, Response } from "express";
import { FollowService } from "../services/followService";

const followService = new FollowService();

export class FollowController {
  async follow(req: Request, res: Response) {
    try {
      const followingId = req.params.id as string;
      const followerId = (req as any).userId;

      if (followerId === followingId) {
        return res.status(400).json({ ok: false, message: "Não pode seguir a si mesmo!" });
      }

      await followService.follow(followerId, followingId);

      return res.status(201).json({ ok: true, message: "Seguindo com sucesso!" });
    } catch  {
      return res.status(400).json({ ok: false, message: "Erro ao seguir usuário." });
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      const followingId = req.params.id as string;
      const followerId = (req as any).userId;

      await followService.unfollow(followerId, followingId);

      return res.status(200).json({ ok: true, message: "Deixou de seguir." });
    } catch {
      return res.status(400).json({ ok: false, message: "Erro ao deixar de seguir." });
    }
  }
}