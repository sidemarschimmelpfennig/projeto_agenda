// src/common/filters/csrf.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CsrfFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Captura o erro clássico do pacote csurf quando o token é inválido ou ausente
    if (exception.code === 'EBADCSRFTOKEN') {
      return response.status(HttpStatus.FORBIDDEN).render('403', {
        title: 'Acesso Negado',
        message: 'Token CSRF inválido ou expirado. Por favor, recarregue a página.',
      });
    }

    // Se for outra exceção HTTP conhecida do NestJS (ex: NotFoundException 404)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json(exception.getResponse());
    }

    // Erros genéricos de servidor (500)
    console.error(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro interno do servidor');
  }
}