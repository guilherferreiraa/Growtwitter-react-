/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from "express";
import { prisma } from "../database/prisma.database";
import jwt from "jsonwebtoken";

export class UserController {
  async listAll(_req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          isLogged: true,
        },
      });
      return res.status(200).json({
        ok: true,
        data: users,
      });
    } catch (_error) {
      return res.status(500).json({ ok: false, message: "Erro ao listar usuários." });
    }
  }
  async signup(req: Request, res: Response) {
    try {
      const { name, username, email, password, avatarUrl } = req.body;
      if (!name || !username || !email || !password) {
        return res.status(400).json({ ok: false, message: "Campos obrigatórios ausentes." });
      }
      const user = await prisma.user.create({
        data: { name, username, email, password, avatarUrl },
      });
      return res.status(201).json({ ok: true, message: "Usuário criado!", data: user });
    } catch (_error: any) {
      return res.status(400).json({ ok: false, message: "Erro ao criar usuário." });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user || user.password !== password) {
        return res.status(401).json({ ok: false, message: "E-mail ou senha inválidos." });
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { isLogged: true }
      });
      const token = jwt.sign(
        { id: user.id, username: user.username },
        "CHAVE_MESTRA_GROWTWITTER",
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        ok: true,
        message: "Login realizado!",
        data: { id: user.id, name: user.name, token }
      });
    } catch (_error: any) {
      return res.status(400).json({ ok: false, message: "Erro ao fazer login." });
    }
  }
  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { isLogged: false }
        });
      }
      return res.status(200).json({ ok: true, message: "Logout realizado com sucesso!" });
    } catch (_error) {
      return res.status(400).json({ ok: false, message: "Erro ao processar logout." });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: String(id) } });
      return res.status(200).json({ ok: true, message: "Usuário deletado." });
    } catch (_error) {
      return res.status(400).json({ ok: false, message: "Erro ao deletar." });
    }
  }
}