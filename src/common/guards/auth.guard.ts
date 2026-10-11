// src/common/guards/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();
    const res = http.getResponse<Response>();

    if (!req.session?.user) {
      if (typeof req.flash === 'function') {
        req.flash('errors', 'Você precisa fazer login.');
      }
      res.redirect('/auth/login'); // ou res.render('home');
      return false; // Bloqueia a execução do controller
    }

    return true; // Permite o acesso à rota
  }
}