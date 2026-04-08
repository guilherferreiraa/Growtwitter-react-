import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface authRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: authRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  const secret = "CHAVE_MESTRA_GROWTWITTER";

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    (req as any).userId = decoded.id;

    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Token inválido." });
  }
};