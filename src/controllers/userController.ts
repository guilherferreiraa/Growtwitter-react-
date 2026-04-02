
import type { Request, Response } from "express";
import { UserService } from "../services/userService";
import jwt from "jsonwebtoken";
const userService = new UserService();

export class UserController {
  
  async listAll(_req: Request, res: Response) {
    try {
      const users = await userService.findAll();

      return res.status(200).json({
        ok: true,
        data: users,
      });
    } catch {
      return res.status(500).json({ ok: false, message: "Erro ao listar usuários." });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { name, username, email, password, avatarUrl } = req.body;
      
      if (!name || !username || !email || !password) {
        return res.status(400).json({ ok: false, message: "Campos obrigatórios ausentes." });
      }
      const user = await userService.create({ name, username, email, password, avatarUrl });
      
      return res.status(201).json({ ok: true, message: "Usuário criado!", data: user });
    } catch {
      return res.status(400).json({ ok: false, message:  "Erro ao criar usuário." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await userService.login(email, password);

      const token = jwt.sign(
        { id: user.id, username: user.username },
        "CHAVE_MESTRA_GROWTWITTER",
        { expiresIn: "24h" },
      );

      return res.status(200).json({
        ok: true,
        message: "Login realizado!",
        data: { id: user.id, name: user.name, token },
      });
    } catch {
      return res.status(401).json({ ok: false, message:"E-mail ou senha inválidos." });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ ok: false, message: "Não autorizado." });
      }

      await userService.logout(userId);
      return res.status(200).json({ ok: true, message: "Deslogado!" });
    } catch  {
      return res.status(400).json({ ok: false, message: "Erro ao deslogar." });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.delete( id as string );

      return res.status(200).json({
        ok: true,
        message: "Usuário deletado com sucesso.",
      });
    } catch  {
      return res.status(400).json({ ok: false, message: "Erro ao deletar usuário." });
    }
  }
}